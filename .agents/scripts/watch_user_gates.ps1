[CmdletBinding()]
param(
    [string]$RuntimeHome,
    [string]$RegistryPath,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'approval_common.ps1')

function Invoke-HarnessRestMethod {
    param(
        [Parameter(Mandatory = $true)][string]$Uri,
        [Parameter(Mandatory = $true)][string]$Method,
        [hashtable]$Headers,
        [object]$Body,
        [string]$ContentType
    )

    $invokeParams = @{
        Uri        = $Uri
        Method     = $Method
        TimeoutSec = 15
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
        return $null
    }

    $metadata = [ordered]@{
        decision_id = $DecisionId
        pid         = $PID
        created_at  = Get-HarnessTimestamp
    }
    $bytes = (Get-HarnessUtf8NoBom).GetBytes((($metadata | ConvertTo-Json -Depth 4) + [Environment]::NewLine))
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

function Set-TelegramOffset {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][long]$Offset
    )

    [System.IO.File]::WriteAllText($Path, $Offset.ToString(), (Get-HarnessUtf8NoBom))
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

function Resolve-StateTimeout {
    param([Parameter(Mandatory = $true)][string]$Path)

    $state = Read-HarnessJson -Path $Path
    if ($null -eq $state) {
        return
    }

    $state.status = 'timeout'
    $state.timed_out_at = Get-HarnessTimestamp
    $state.updated_at = Get-HarnessTimestamp
    Write-HarnessJson -Path $Path -Value $state
}

function Replay-RemoteChoiceGate {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)]$State,
        [switch]$ForceImmediate
    )

    $invokeScript = Join-Path $RepoRoot '.agents/scripts/invoke_user_gate.ps1'
    if (-not (Test-Path -LiteralPath $invokeScript)) {
        return $false
    }

    $labels = @($State.options | ForEach-Object { [string]$_.label })
    if ($labels.Count -eq 0) {
        $labels = @('approve', 'hold', 'reject')
    }

    $invokeParams = @{
        TaskId                    = [string]$State.task_id
        Prompt                    = [string]$State.prompt
        Options                   = $labels
        ProjectName               = [string]$State.project_name
        DecisionId                = [string]$State.decision_id
        DefaultAction             = [string]$State.default_action
        DeliveryMode              = if ($ForceImmediate) { 'always' } else { 'local-first' }
        LocalResponseGraceMinutes = [int]$State.local_response_grace_minutes
    }

    if (-not [string]::IsNullOrWhiteSpace([string]$State.context)) {
        $invokeParams['Context'] = [string]$State.context
    }

    if ($DryRun) {
        return $true
    }

    & $invokeScript @invokeParams | Out-Null
    return $true
}

function Try-MatchTelegramDecision {
    param(
        [Parameter(Mandatory = $true)]$Update,
        [Parameter(Mandatory = $true)][hashtable]$PendingByDecision,
        [Parameter(Mandatory = $true)][string]$ExpectedChatId
    )

    if ($Update.PSObject.Properties.Name -contains 'callback_query') {
        $callback = $Update.callback_query
        $chatId = [string]$callback.message.chat.id
        if ($chatId -eq [string]$ExpectedChatId -and $callback.data -match '^gate:(?<decision>[A-Za-z0-9]+):(?<choice>[a-z0-9-]+)$') {
            $decisionId = $Matches['decision']
            if ($PendingByDecision.ContainsKey($decisionId)) {
                $state = Read-HarnessJson -Path $PendingByDecision[$decisionId]
                if ($state) {
                    $allowed = @($state.options | ForEach-Object { [string]$_.value })
                    if ($allowed -contains $Matches['choice']) {
                        return [pscustomobject]@{
                            decision_id    = $decisionId
                            selected_value = $Matches['choice']
                            callback_id    = $callback.id
                            update_id      = [long]$Update.update_id
                            user           = $callback.from.username
                            user_id        = [string]$callback.from.id
                            source         = 'callback_query'
                        }
                    }
                }
            }
        }
    }

    if ($Update.PSObject.Properties.Name -contains 'message') {
        $message = $Update.message
        $chatId = [string]$message.chat.id
        if ($chatId -eq [string]$ExpectedChatId -and ([string]$message.text) -match '^/(?<command>[a-z0-9-]+)(?:\s+(?<decision>[A-Za-z0-9]+))?\s*$') {
            $decisionId = $Matches['decision']
            if ($PendingByDecision.ContainsKey($decisionId)) {
                $state = Read-HarnessJson -Path $PendingByDecision[$decisionId]
                if ($state) {
                    $allowed = @($state.options | ForEach-Object { [string]$_.value })
                    if ($allowed -contains $Matches['command']) {
                        return [pscustomobject]@{
                            decision_id    = $decisionId
                            selected_value = $Matches['command']
                            callback_id    = $null
                            update_id      = [long]$Update.update_id
                            user           = $message.from.username
                            user_id        = [string]$message.from.id
                            source         = 'message_command'
                        }
                    }
                }
            }
        }
    }

    return $null
}

$registry = Get-HarnessRepoRegistry -RuntimeHome $RuntimeHome -RegistryPath $RegistryPath
$presence = Get-HarnessPresenceState -RuntimeHome $RuntimeHome
$now = [DateTimeOffset]::UtcNow
$summary = [ordered]@{
    scanned_repos          = 0
    scanned_states         = 0
    escalated              = 0
    resolved               = 0
    timed_out              = 0
    pending_for_resolution = 0
    errors                 = @()
}
$pendingByDecision = @{}

foreach ($repo in @($registry.repos | Where-Object { [bool]$_.active })) {
    $repoRoot = [string]$repo.root
    if ([string]::IsNullOrWhiteSpace($repoRoot) -or -not (Test-Path -LiteralPath $repoRoot)) {
        continue
    }

    $summary.scanned_repos++
    $stateRoot = Get-HarnessApprovalStateRoot -RepoRoot $repoRoot
    if (-not (Test-Path -LiteralPath $stateRoot)) {
        continue
    }

    foreach ($file in Get-ChildItem -LiteralPath $stateRoot -Filter '*.json' -File) {
        $summary.scanned_states++
        $state = Read-HarnessJson -Path $file.FullName
        if ($null -eq $state) {
            continue
        }

        $status = [string]$state.status
        if ($status -in @('resolved', 'timeout', 'send_failed', 'local_only', 'blocked_local')) {
            continue
        }

        $expiresAt = Get-DateTimeOffsetOrNull -Value ([string]$state.expires_at) -FieldName 'expires_at'
        if ($expiresAt -and $now -ge $expiresAt -and $status -in @('local_wait', 'pending')) {
            if (-not $DryRun) {
                Resolve-StateTimeout -Path $file.FullName
            }
            $summary.timed_out++
            continue
        }

        if ($status -eq 'local_wait') {
            $notifyAt = Get-DateTimeOffsetOrNull -Value ([string]$state.notify_after_at) -FieldName 'notify_after_at'
            $forceImmediate = $presence.mode -eq 'away' -and [string]$state.decision_class -eq 'remote-choice'
            $shouldReplay = $forceImmediate -or ($notifyAt -and $now -ge $notifyAt)

            if ($shouldReplay) {
                try {
                    if (Replay-RemoteChoiceGate -RepoRoot $repoRoot -State $state -ForceImmediate:$forceImmediate) {
                        $summary.escalated++
                    }
                } catch {
                    $summary.errors += "Replay failed for $($file.FullName): $($_.Exception.Message)"
                }

                $state = Read-HarnessJson -Path $file.FullName
                if ($null -eq $state) {
                    continue
                }

                $status = [string]$state.status
            }
        }

        if ($status -eq 'pending' -and [string]$state.decision_class -eq 'remote-choice') {
            $decisionId = [string]$state.decision_id
            if (-not [string]::IsNullOrWhiteSpace($decisionId) -and -not $pendingByDecision.ContainsKey($decisionId)) {
                $pendingByDecision[$decisionId] = $file.FullName
            } elseif ($pendingByDecision.ContainsKey($decisionId)) {
                $summary.errors += "Duplicate pending decision id '$decisionId' detected."
            }
        }
    }
}

$summary.pending_for_resolution = $pendingByDecision.Count

$telegramBotToken = $env:HARNESS_TELEGRAM_BOT_TOKEN
$telegramChatId = $env:HARNESS_TELEGRAM_CHAT_ID
if ($pendingByDecision.Count -gt 0 -and -not [string]::IsNullOrWhiteSpace($telegramBotToken) -and -not [string]::IsNullOrWhiteSpace($telegramChatId)) {
    $offsetPath = Get-HarnessTelegramOffsetPath -RuntimeHome $RuntimeHome
    $offset = Get-TelegramOffset -Path $offsetPath
    $waitLockPath = Get-TelegramWaitLockPath -BotToken $telegramBotToken -ChatId $telegramChatId
    $waitLockStream = Acquire-TelegramWaitLock -Path $waitLockPath -DecisionId 'watcher'

    try {
        if ($null -ne $waitLockStream) {
            $uri = "https://api.telegram.org/bot$telegramBotToken/getUpdates?timeout=1"
            if ($offset -gt 0) {
                $uri += "&offset=$offset"
            }

            $updates = Invoke-HarnessRestMethod -Uri $uri -Method Get
            if (-not $updates.ok) {
                throw 'Telegram getUpdates failed.'
            }

            foreach ($update in $updates.result) {
                $offset = [long]$update.update_id + 1
                $match = Try-MatchTelegramDecision -Update $update -PendingByDecision $pendingByDecision -ExpectedChatId $telegramChatId
                if ($null -eq $match) {
                    continue
                }

                $statePath = $pendingByDecision[$match.decision_id]
                $state = Read-HarnessJson -Path $statePath
                if ($null -eq $state -or [string]$state.status -ne 'pending') {
                    continue
                }

                $selectedOption = @($state.options | Where-Object { [string]$_.value -eq $match.selected_value }) | Select-Object -First 1

                if (-not $DryRun) {
                    if ($match.callback_id) {
                        Invoke-TelegramApi -BotToken $telegramBotToken -Method 'answerCallbackQuery' -Body @{
                            callback_query_id = $match.callback_id
                            text              = "Recorded: $($match.selected_value)"
                        } | Out-Null
                    }

                    $state.status = 'resolved'
                    $state.selected_value = $match.selected_value
                    $state.selected_label = if ($selectedOption) { [string]$selectedOption.label } else { $match.selected_value }
                    $state.resolved_at = Get-HarnessTimestamp
                    $state.decision_source = $match.source
                    $state.decision_user = $match.user
                    $state.decision_user_id = $match.user_id
                    $state.telegram_update_id = $match.update_id
                    $state.updated_at = Get-HarnessTimestamp
                    Write-HarnessJson -Path $statePath -Value $state
                }

                $summary.resolved++
            }

            if (-not $DryRun) {
                Set-TelegramOffset -Path $offsetPath -Offset $offset
            }
        }
    } catch {
        $summary.errors += "Telegram polling failed: $($_.Exception.Message)"
    } finally {
        Release-TelegramWaitLock -Stream $waitLockStream -Path $waitLockPath
    }
}

[pscustomobject]$summary
