[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$TaskId,
    [Parameter(Mandatory = $true)][string]$Prompt,
    [string[]]$Options = @('approve', 'hold', 'reject'),
    [string]$Context,
    [string]$ProjectName,
    [string]$DecisionId,
    [string]$DefaultAction = 'hold',
    [string]$DeliveryMode = $env:HARNESS_REMOTE_APPROVAL_MODE,
    [string]$LocalPromptedAt,
    [int]$LocalResponseGraceMinutes = 10,
    [string]$NtfyServer = $env:HARNESS_NTFY_SERVER,
    [string]$NtfyTopic = $env:HARNESS_NTFY_TOPIC,
    [string]$TelegramBotToken = $env:HARNESS_TELEGRAM_BOT_TOKEN,
    [string]$TelegramChatId = $env:HARNESS_TELEGRAM_CHAT_ID,
    [string]$StateDir = '.agents/runtime/approvals',
    [int]$TimeoutMinutes = 240,
    [int]$PollSeconds = 15,
    [int]$RequestTimeoutSeconds = 30,
    [int]$NetworkRetryCount = 2,
    [int]$NetworkRetryDelaySeconds = 3,
    [switch]$WaitForDecision,
    [switch]$SkipNtfy,
    [switch]$SkipTelegram
)

$ErrorActionPreference = 'Stop'

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

function Get-UtcTimestamp {
    return [DateTimeOffset]::UtcNow.ToString('o')
}

function Read-Utf8Json {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return $null
    }

    $json = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    if ([string]::IsNullOrWhiteSpace($json)) {
        return $null
    }

    return $json | ConvertFrom-Json -Depth 8
}

function Write-Utf8Json {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)]$Value
    )

    $json = $Value | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText($Path, $json + [Environment]::NewLine, $utf8NoBom)
}

function Get-DateTimeOffsetOrNull {
    param(
        [string]$Value,
        [Parameter(Mandatory = $true)][string]$FieldName
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $null
    }

    try {
        return [DateTimeOffset]::Parse(
            $Value,
            [System.Globalization.CultureInfo]::InvariantCulture,
            [System.Globalization.DateTimeStyles]::RoundtripKind
        )
    } catch {
        throw "$FieldName must be an ISO 8601 timestamp. Received: $Value"
    }
}

function Merge-StateExtraFields {
    param(
        [Parameter(Mandatory = $true)]$BaseState,
        $ExistingState
    )

    if ($null -eq $ExistingState) {
        return $BaseState
    }

    foreach ($property in $ExistingState.PSObject.Properties) {
        if (-not $BaseState.Contains($property.Name)) {
            $BaseState[$property.Name] = $property.Value
        }
    }

    return $BaseState
}

function Invoke-HarnessRestMethod {
    param(
        [Parameter(Mandatory = $true)][string]$Uri,
        [Parameter(Mandatory = $true)][string]$Method,
        [hashtable]$Headers,
        [object]$Body,
        [string]$ContentType
    )

    for ($attempt = 0; $attempt -le $NetworkRetryCount; $attempt++) {
        try {
            $invokeParams = @{
                Uri        = $Uri
                Method     = $Method
                TimeoutSec = $RequestTimeoutSeconds
            }

            if ($PSBoundParameters.ContainsKey('Headers')) {
                $invokeParams['Headers'] = $Headers
            }
            if ($PSBoundParameters.ContainsKey('Body')) {
                $invokeParams['Body'] = $Body
            }
            if (-not [string]::IsNullOrWhiteSpace($ContentType)) {
                $invokeParams['ContentType'] = $ContentType
            }

            return Invoke-RestMethod @invokeParams
        } catch {
            if ($attempt -ge $NetworkRetryCount) {
                throw
            }

            Start-Sleep -Seconds $NetworkRetryDelaySeconds
        }
    }
}

function Get-StateRoot {
    param([Parameter(Mandatory = $true)][string]$PathValue)

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return $PathValue
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $PathValue))
}

function ConvertTo-OptionObject {
    param([Parameter(Mandatory = $true)][string[]]$OptionValues)

    $result = New-Object System.Collections.Generic.List[object]

    foreach ($raw in $OptionValues) {
        $label = $raw.Trim()
        if ([string]::IsNullOrWhiteSpace($label)) {
            continue
        }

        $value = $label.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
        $value = $value.Trim('-')
        if ([string]::IsNullOrWhiteSpace($value)) {
            throw "Option '$raw' cannot be converted to a callback-safe value."
        }

        $result.Add([pscustomobject]@{
            label = $label
            value = $value
        })
    }

    if ($result.Count -eq 0) {
        throw 'At least one non-empty option is required.'
    }

    $duplicates = $result | Group-Object value | Where-Object Count -gt 1
    if ($duplicates) {
        $duplicateValues = ($duplicates | ForEach-Object Name) -join ', '
        throw "Duplicate option values are not allowed: $duplicateValues"
    }

    return $result
}

function Split-IntoRows {
    param(
        [Parameter(Mandatory = $true)]$Items,
        [int]$Width = 2
    )

    $rows = New-Object System.Collections.Generic.List[object]
    for ($index = 0; $index -lt $Items.Count; $index += $Width) {
        $chunk = @()
        for ($offset = 0; $offset -lt $Width -and ($index + $offset) -lt $Items.Count; $offset++) {
            $chunk += $Items[$index + $offset]
        }
        $rows.Add($chunk)
    }

    return $rows
}

function Invoke-TelegramApi {
    param(
        [Parameter(Mandatory = $true)][string]$BotToken,
        [Parameter(Mandatory = $true)][string]$Method,
        [string]$HttpMethod = 'Post',
        [object]$Body,
        [switch]$AsJson
    )

    $uri = "https://api.telegram.org/bot$BotToken/$Method"
    $invokeParams = @{
        Uri    = $uri
        Method = $HttpMethod
    }

    if ($PSBoundParameters.ContainsKey('Body')) {
        if ($AsJson) {
            $invokeParams['ContentType'] = 'application/json'
            $invokeParams['Body'] = $Body | ConvertTo-Json -Depth 8 -Compress
        } else {
            $invokeParams['Body'] = $Body
        }
    }

    $response = Invoke-HarnessRestMethod @invokeParams
    if (-not $response.ok) {
        throw "Telegram API call failed: $Method"
    }

    return $response
}

function Send-NtfyNotification {
    param(
        [Parameter(Mandatory = $true)][string]$Server,
        [Parameter(Mandatory = $true)][string]$Topic,
        [Parameter(Mandatory = $true)][string]$Project,
        [Parameter(Mandatory = $true)][string]$Task,
        [Parameter(Mandatory = $true)][string]$Decision,
        [Parameter(Mandatory = $true)][string]$BodyText
    )

    $uri = '{0}/{1}' -f $Server.TrimEnd('/'), $Topic
    $headers = @{
        Title    = "[$Project] $Task user confirmation needed"
        Priority = 'urgent'
        Tags     = 'warning,eyes'
    }

    Invoke-HarnessRestMethod -Uri $uri -Method Post -Headers $headers -Body $BodyText | Out-Null
}

function Send-TelegramDecision {
    param(
        [Parameter(Mandatory = $true)][string]$BotToken,
        [Parameter(Mandatory = $true)][string]$ChatId,
        [Parameter(Mandatory = $true)][string]$Project,
        [Parameter(Mandatory = $true)][string]$Task,
        [Parameter(Mandatory = $true)][string]$Decision,
        [Parameter(Mandatory = $true)][string]$PromptText,
        [string]$ContextText,
        [Parameter(Mandatory = $true)]$OptionObjects,
        [Parameter(Mandatory = $true)][string]$DefaultValue
    )

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("[$Project] $Task")
    $lines.Add('User confirmation needed')
    $lines.Add('')
    $lines.Add($PromptText)
    if (-not [string]::IsNullOrWhiteSpace($ContextText)) {
        $lines.Add('')
        $lines.Add("Context: $ContextText")
    }
    $lines.Add('')
    $lines.Add("Decision ID: $Decision")
    $lines.Add('Options: ' + (($OptionObjects | ForEach-Object label) -join ' / '))
    $lines.Add('Fallback commands: ' + (($OptionObjects | ForEach-Object { "/$($_.value) $Decision" }) -join ' | '))
    $lines.Add("Default if unanswered: $DefaultValue")

    $buttons = New-Object System.Collections.Generic.List[object]
    foreach ($option in $OptionObjects) {
        $callbackData = "gate:${Decision}:$($option.value)"
        if ($callbackData.Length -gt 64) {
            throw "Callback payload is too long for option '$($option.label)'."
        }

        $buttons.Add(@{
            text          = $option.label
            callback_data = $callbackData
        })
    }

    $payload = @{
        chat_id      = $ChatId
        text         = $lines -join "`n"
        reply_markup = @{
            inline_keyboard = (Split-IntoRows -Items $buttons -Width 2)
        }
    }

    return Invoke-TelegramApi -BotToken $BotToken -Method 'sendMessage' -Body $payload -AsJson
}

function Set-TelegramOffset {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][long]$Offset
    )

    [System.IO.File]::WriteAllText($Path, $Offset.ToString(), $utf8NoBom)
}

function Get-TelegramOffset {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return 0L
    }

    $value = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8).Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
        return 0L
    }

    return [long]$value
}

function Get-TelegramWaitLockPath {
    param(
        [Parameter(Mandatory = $true)][string]$BotToken,
        [Parameter(Mandatory = $true)][string]$ChatId
    )

    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    try {
        $sourceBytes = [System.Text.Encoding]::UTF8.GetBytes("$BotToken`n$ChatId")
        $hashBytes = $sha256.ComputeHash($sourceBytes)
        $hash = ([System.BitConverter]::ToString($hashBytes)).Replace('-', '').ToLowerInvariant().Substring(0, 16)
    } finally {
        $sha256.Dispose()
    }

    return Join-Path ([System.IO.Path]::GetTempPath()) "harness-telegram-wait-$hash.lock"
}

function Acquire-TelegramWaitLock {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$DecisionId
    )

    try {
        $stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
    } catch [System.IO.IOException] {
        throw "Another Telegram wait loop is already active for this bot/session. Reuse a single polling consumer or clear the stale lock at '$Path'."
    }

    $metadata = [ordered]@{
        decision_id = $DecisionId
        pid         = $PID
        created_at  = Get-UtcTimestamp
    }
    $bytes = $utf8NoBom.GetBytes((($metadata | ConvertTo-Json -Depth 4) + [Environment]::NewLine))
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
    return $stream
}

function Release-TelegramWaitLock {
    param(
        $Stream,
        [string]$Path
    )

    if ($null -ne $Stream) {
        $Stream.Dispose()
    }

    if (-not [string]::IsNullOrWhiteSpace($Path) -and (Test-Path -LiteralPath $Path)) {
        Remove-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
    }
}

function Try-ParseTelegramDecision {
    param(
        [Parameter(Mandatory = $true)]$Update,
        [Parameter(Mandatory = $true)][string]$Decision,
        [Parameter(Mandatory = $true)][string]$ExpectedChatId,
        [Parameter(Mandatory = $true)]$AllowedOptionValues
    )

    if ($Update.PSObject.Properties.Name -contains 'callback_query') {
        $callback = $Update.callback_query
        $chatId = [string]$callback.message.chat.id
        if ($chatId -ne [string]$ExpectedChatId) {
            return $null
        }

        if ($callback.data -match "^gate:$([regex]::Escape($Decision)):(?<choice>[a-z0-9-]+)$") {
            $choice = $Matches['choice']
            if ($AllowedOptionValues -contains $choice) {
                return [pscustomobject]@{
                    source         = 'callback_query'
                    selected_value = $choice
                    update_id      = [long]$Update.update_id
                    callback_id    = $callback.id
                    user           = $callback.from.username
                    user_id        = [string]$callback.from.id
                }
            }
        }
    }

    if ($Update.PSObject.Properties.Name -contains 'message') {
        $message = $Update.message
        $chatId = [string]$message.chat.id
        if ($chatId -ne [string]$ExpectedChatId) {
            return $null
        }

        $text = [string]$message.text
        if ($text -match '^/(?<command>[a-z0-9-]+)(?:\s+(?<decision>[A-Za-z0-9]+))?\s*$') {
            $command = $Matches['command']
            $decisionArg = $Matches['decision']
            if (($AllowedOptionValues -contains $command) -and ($decisionArg -eq $Decision)) {
                return [pscustomobject]@{
                    source         = 'message_command'
                    selected_value = $command
                    update_id      = [long]$Update.update_id
                    callback_id    = $null
                    user           = $message.from.username
                    user_id        = [string]$message.from.id
                }
            }
        }
    }

    return $null
}

if (-not $PSBoundParameters.ContainsKey('LocalResponseGraceMinutes') -and -not [string]::IsNullOrWhiteSpace($env:HARNESS_LOCAL_RESPONSE_GRACE_MINUTES)) {
    try {
        $LocalResponseGraceMinutes = [int]$env:HARNESS_LOCAL_RESPONSE_GRACE_MINUTES
    } catch {
        throw 'HARNESS_LOCAL_RESPONSE_GRACE_MINUTES must be an integer.'
    }
}

if ([string]::IsNullOrWhiteSpace($ProjectName)) {
    $ProjectName = Split-Path -Leaf (Get-Location)
}
if ([string]::IsNullOrWhiteSpace($DecisionId)) {
    $DecisionId = [guid]::NewGuid().ToString('N').Substring(0, 10)
}
if ([string]::IsNullOrWhiteSpace($NtfyServer)) {
    $NtfyServer = 'https://ntfy.sh'
}
if ([string]::IsNullOrWhiteSpace($DeliveryMode)) {
    $DeliveryMode = 'local-first'
}

$DeliveryMode = $DeliveryMode.Trim().ToLowerInvariant()
if (@('local-first', 'always', 'never') -notcontains $DeliveryMode) {
    throw "DeliveryMode must be one of: local-first, always, never. Received: $DeliveryMode"
}
if ($LocalResponseGraceMinutes -lt 0) {
    throw 'LocalResponseGraceMinutes must be greater than or equal to 0.'
}
if ($TimeoutMinutes -le 0) {
    throw 'TimeoutMinutes must be greater than 0.'
}
if ($PollSeconds -le 0) {
    throw 'PollSeconds must be greater than 0.'
}

$optionObjects = ConvertTo-OptionObject -OptionValues $Options
$allowedOptionValues = @($optionObjects | ForEach-Object value)
if ($allowedOptionValues -notcontains $DefaultAction) {
    throw "DefaultAction '$DefaultAction' must be one of: $($allowedOptionValues -join ', ')"
}

$stateRoot = Get-StateRoot -PathValue $StateDir
[System.IO.Directory]::CreateDirectory($stateRoot) | Out-Null
$statePath = Join-Path $stateRoot "$DecisionId.json"
$offsetPath = Join-Path $stateRoot '_telegram_offset.txt'
$existingState = Read-Utf8Json -Path $statePath

$createdAtText = if ($existingState -and $existingState.created_at) { [string]$existingState.created_at } else { Get-UtcTimestamp }
$createdAtValue = Get-DateTimeOffsetOrNull -Value $createdAtText -FieldName 'created_at'
$expiresAtText = if ($existingState -and $existingState.expires_at) {
    [string]$existingState.expires_at
} else {
    $createdAtValue.AddMinutes($TimeoutMinutes).ToString('o')
}
$timeoutMinutesValue = if ($existingState -and $existingState.timeout_minutes) {
    [int]$existingState.timeout_minutes
} else {
    $TimeoutMinutes
}

$localPromptedAtValue = Get-DateTimeOffsetOrNull -Value $LocalPromptedAt -FieldName 'LocalPromptedAt'
if (-not $localPromptedAtValue -and $existingState -and $existingState.local_prompted_at) {
    $localPromptedAtValue = Get-DateTimeOffsetOrNull -Value ([string]$existingState.local_prompted_at) -FieldName 'local_prompted_at'
}

$hasNtfy = (-not $SkipNtfy) -and (-not [string]::IsNullOrWhiteSpace($NtfyTopic))
$hasTelegram = (-not $SkipTelegram) -and (-not [string]::IsNullOrWhiteSpace($TelegramBotToken)) -and (-not [string]::IsNullOrWhiteSpace($TelegramChatId))

$bodyLines = New-Object System.Collections.Generic.List[string]
$bodyLines.Add("[$ProjectName] $TaskId")
$bodyLines.Add($Prompt)
if (-not [string]::IsNullOrWhiteSpace($Context)) {
    $bodyLines.Add("Context: $Context")
}
$bodyLines.Add("Decision ID: $DecisionId")
$bodyLines.Add('Options: ' + (($optionObjects | ForEach-Object label) -join ', '))
$bodyLines.Add("Default: $DefaultAction")

$state = [ordered]@{
    version                       = 2
    project_name                  = $ProjectName
    task_id                       = $TaskId
    decision_id                   = $DecisionId
    prompt                        = $Prompt
    context                       = $Context
    options                       = @($optionObjects)
    default_action                = $DefaultAction
    delivery_mode                 = $DeliveryMode
    local_response_grace_minutes  = $LocalResponseGraceMinutes
    status                        = 'initializing'
    channels                      = @()
    delivery_reason               = $null
    delivery                      = [ordered]@{
        ntfy = [ordered]@{
            configured = $hasNtfy
            status     = if ($hasNtfy) { 'pending' } else { 'skipped' }
            attempts   = 0
        }
        telegram = [ordered]@{
            configured = $hasTelegram
            status     = if ($hasTelegram) { 'pending' } else { 'skipped' }
            attempts   = 0
        }
    }
    state_path                    = $statePath
    created_at                    = $createdAtText
    expires_at                    = $expiresAtText
    timeout_minutes               = $timeoutMinutesValue
}
$state = Merge-StateExtraFields -BaseState $state -ExistingState $existingState

if ($localPromptedAtValue) {
    $state.local_prompted_at = $localPromptedAtValue.ToString('o')
}

if ($DeliveryMode -eq 'never') {
    if (-not $localPromptedAtValue) {
        $localPromptedAtValue = [DateTimeOffset]::UtcNow
        $state.local_prompted_at = $localPromptedAtValue.ToString('o')
    }

    $state.status = 'local_only'
    $state.delivery_reason = 'delivery_mode_never'
    Write-Utf8Json -Path $statePath -Value $state
    [pscustomobject]$state
    return
}

if ($DeliveryMode -eq 'local-first') {
    if (-not $localPromptedAtValue) {
        $localPromptedAtValue = [DateTimeOffset]::UtcNow
        $state.local_prompted_at = $localPromptedAtValue.ToString('o')
    }

    $notifyAfterValue = $localPromptedAtValue.AddMinutes($LocalResponseGraceMinutes)
    $state.notify_after_at = $notifyAfterValue.ToString('o')

    if ([DateTimeOffset]::UtcNow -lt $notifyAfterValue) {
        $state.status = 'local_wait'
        $state.delivery_reason = 'waiting_for_local_response'
        Write-Utf8Json -Path $statePath -Value $state
        [pscustomobject]$state
        return
    }

    $state.delivery_reason = 'local_response_grace_elapsed'
} else {
    $state.delivery_reason = 'delivery_mode_always'
}

if (-not $hasNtfy -and -not $hasTelegram) {
    $state.status = 'send_failed'
    $state.last_error = 'No notification channel is configured. Set ntfy and/or Telegram credentials, or remove skip flags.'
    Write-Utf8Json -Path $statePath -Value $state
    throw $state.last_error
}

Write-Utf8Json -Path $statePath -Value $state

$sendErrors = New-Object System.Collections.Generic.List[string]

if ($hasNtfy) {
    $state.channels += 'ntfy'
    $state.delivery.ntfy.attempts = 1
    try {
        Send-NtfyNotification -Server $NtfyServer -Topic $NtfyTopic -Project $ProjectName -Task $TaskId -Decision $DecisionId -BodyText ($bodyLines -join "`n")
        $state.delivery.ntfy.status = 'sent'
        $state.delivery.ntfy.sent_at = Get-UtcTimestamp
    } catch {
        $state.delivery.ntfy.status = 'failed'
        $state.delivery.ntfy.failed_at = Get-UtcTimestamp
        $state.delivery.ntfy.last_error = $_.Exception.Message
        $sendErrors.Add("ntfy: $($_.Exception.Message)")
    }

    Write-Utf8Json -Path $statePath -Value $state
}

if ($hasTelegram) {
    $state.channels += 'telegram'
    $state.delivery.telegram.attempts = 1
    try {
        $telegramResponse = Send-TelegramDecision -BotToken $TelegramBotToken -ChatId $TelegramChatId -Project $ProjectName -Task $TaskId -Decision $DecisionId -PromptText $Prompt -ContextText $Context -OptionObjects $optionObjects -DefaultValue $DefaultAction
        $state.delivery.telegram.status = 'sent'
        $state.delivery.telegram.sent_at = Get-UtcTimestamp
        $state.telegram_message_id = $telegramResponse.result.message_id
        $state.telegram_chat_id = [string]$TelegramChatId
    } catch {
        $state.delivery.telegram.status = 'failed'
        $state.delivery.telegram.failed_at = Get-UtcTimestamp
        $state.delivery.telegram.last_error = $_.Exception.Message
        $sendErrors.Add("telegram: $($_.Exception.Message)")
    }

    Write-Utf8Json -Path $statePath -Value $state
}

$successfulChannels = @()
if ($state.delivery.ntfy.status -eq 'sent') {
    $successfulChannels += 'ntfy'
}
if ($state.delivery.telegram.status -eq 'sent') {
    $successfulChannels += 'telegram'
}

if ($successfulChannels.Count -eq 0) {
    $state.status = 'send_failed'
    $state.last_error = $sendErrors -join '; '
    Write-Utf8Json -Path $statePath -Value $state
    throw $state.last_error
}

if ($sendErrors.Count -gt 0) {
    $state.delivery_warnings = @($sendErrors)
}

$state.status = 'pending'
Write-Utf8Json -Path $statePath -Value $state

if (-not $WaitForDecision) {
    [pscustomobject]$state
    return
}

if ($state.delivery.telegram.status -ne 'sent') {
    $state.status = 'send_failed'
    $state.last_error = 'WaitForDecision requires a successful Telegram delivery.'
    Write-Utf8Json -Path $statePath -Value $state
    throw $state.last_error
}

$deadline = (Get-Date).AddMinutes($timeoutMinutesValue)
$offset = Get-TelegramOffset -Path $offsetPath
$waitLockPath = Get-TelegramWaitLockPath -BotToken $TelegramBotToken -ChatId $TelegramChatId
$waitLockStream = $null

try {
    $waitLockStream = Acquire-TelegramWaitLock -Path $waitLockPath -DecisionId $DecisionId
    $state.wait_lock_path = $waitLockPath
    $state.wait_started_at = Get-UtcTimestamp
    Write-Utf8Json -Path $statePath -Value $state

    while ((Get-Date) -lt $deadline) {
        $uri = "https://api.telegram.org/bot$TelegramBotToken/getUpdates?timeout=30"
        if ($offset -gt 0) {
            $uri += "&offset=$offset"
        }

        $updates = Invoke-HarnessRestMethod -Uri $uri -Method Get
        if (-not $updates.ok) {
            throw 'Telegram getUpdates failed.'
        }

        foreach ($update in $updates.result) {
            $offset = [long]$update.update_id + 1
            $match = Try-ParseTelegramDecision -Update $update -Decision $DecisionId -ExpectedChatId $TelegramChatId -AllowedOptionValues $allowedOptionValues
            if (-not $match) {
                continue
            }

            if ($match.callback_id) {
                Invoke-TelegramApi -BotToken $TelegramBotToken -Method 'answerCallbackQuery' -Body @{
                    callback_query_id = $match.callback_id
                    text              = "Recorded: $($match.selected_value)"
                } | Out-Null
            }

            $selectedOption = $optionObjects | Where-Object value -eq $match.selected_value | Select-Object -First 1
            $state.status = 'resolved'
            $state.selected_value = $match.selected_value
            $state.selected_label = $selectedOption.label
            $state.resolved_at = Get-UtcTimestamp
            $state.decision_source = $match.source
            $state.decision_user = $match.user
            $state.decision_user_id = $match.user_id
            $state.telegram_update_id = $match.update_id

            Write-Utf8Json -Path $statePath -Value $state
            Set-TelegramOffset -Path $offsetPath -Offset $offset
            [pscustomobject]$state
            return
        }

        Set-TelegramOffset -Path $offsetPath -Offset $offset
        Start-Sleep -Seconds $PollSeconds
    }

    $state.status = 'timeout'
    $state.timed_out_at = Get-UtcTimestamp
    Write-Utf8Json -Path $statePath -Value $state
    [pscustomobject]$state
} finally {
    Release-TelegramWaitLock -Stream $waitLockStream -Path $waitLockPath
}
