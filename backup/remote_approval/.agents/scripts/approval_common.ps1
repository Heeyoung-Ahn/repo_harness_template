$script:HarnessUtf8NoBom = [System.Text.UTF8Encoding]::new($false)

function Get-HarnessUtf8NoBom {
    return $script:HarnessUtf8NoBom
}

function Get-HarnessTimestamp {
    return [DateTimeOffset]::UtcNow.ToString('o')
}

function Get-HarnessRuntimeHome {
    param([string]$RuntimeHome)

    if ([string]::IsNullOrWhiteSpace($RuntimeHome)) {
        $RuntimeHome = $env:HARNESS_RUNTIME_HOME
    }

    if ([string]::IsNullOrWhiteSpace($RuntimeHome)) {
        $userHome = [Environment]::GetFolderPath('UserProfile')
        if ([string]::IsNullOrWhiteSpace($userHome)) {
            throw 'Cannot resolve the user profile directory for harness runtime storage.'
        }

        $RuntimeHome = Join-Path $userHome '.harness-runtime'
    }

    if ([System.IO.Path]::IsPathRooted($RuntimeHome)) {
        return [System.IO.Path]::GetFullPath($RuntimeHome)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $RuntimeHome))
}

function Ensure-HarnessDirectory {
    param([Parameter(Mandatory = $true)][string]$Path)

    [System.IO.Directory]::CreateDirectory($Path) | Out-Null
    return $Path
}

function Read-HarnessJson {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return $null
    }

    $json = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    if ([string]::IsNullOrWhiteSpace($json)) {
        return $null
    }

    return $json | ConvertFrom-Json
}

function Write-HarnessJson {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)]$Value
    )

    Ensure-HarnessDirectory -Path ([System.IO.Path]::GetDirectoryName($Path)) | Out-Null
    $json = $Value | ConvertTo-Json -Depth 12
    [System.IO.File]::WriteAllText($Path, $json + [Environment]::NewLine, (Get-HarnessUtf8NoBom))
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

function Resolve-HarnessRepoRoot {
    param([string]$RepoRoot)

    if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
        $RepoRoot = (Get-Location).Path
    }

    if ([System.IO.Path]::IsPathRooted($RepoRoot)) {
        return [System.IO.Path]::GetFullPath($RepoRoot)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $RepoRoot))
}

function Get-HarnessPresencePath {
    param([string]$RuntimeHome)

    return Join-Path (Get-HarnessRuntimeHome -RuntimeHome $RuntimeHome) 'presence.json'
}

function Get-HarnessRepoRegistryPath {
    param([string]$RuntimeHome)

    return Join-Path (Get-HarnessRuntimeHome -RuntimeHome $RuntimeHome) 'repo_registry.json'
}

function Get-HarnessTelegramOffsetPath {
    param([string]$RuntimeHome)

    return Join-Path (Get-HarnessRuntimeHome -RuntimeHome $RuntimeHome) 'telegram_offset.txt'
}

function Get-HarnessApprovalStateRoot {
    param([string]$RepoRoot)

    return Join-Path (Resolve-HarnessRepoRoot -RepoRoot $RepoRoot) '.agents/runtime/approvals'
}

function Get-HarnessApprovalStatePath {
    param(
        [string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$DecisionId
    )

    return Join-Path (Get-HarnessApprovalStateRoot -RepoRoot $RepoRoot) "$DecisionId.json"
}

function New-HarnessDecisionId {
    return [guid]::NewGuid().ToString('N').Substring(0, 10)
}

function Convert-HarnessOptions {
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

function Get-HarnessPresenceState {
    param([string]$RuntimeHome)

    $path = Get-HarnessPresencePath -RuntimeHome $RuntimeHome
    $state = Read-HarnessJson -Path $path
    $now = [DateTimeOffset]::UtcNow

    if ($null -eq $state) {
        return [pscustomobject]@{
            mode       = 'present'
            source     = 'default'
            expired    = $false
            expires_at = $null
            updated_at = $null
            path       = $path
        }
    }

    $mode = [string]$state.mode
    $expiresAt = Get-DateTimeOffsetOrNull -Value ([string]$state.expires_at) -FieldName 'expires_at'
    if ($mode -notin @('present', 'away')) {
        return [pscustomobject]@{
            mode       = 'present'
            source     = 'invalid'
            expired    = $false
            expires_at = if ($expiresAt) { $expiresAt.ToString('o') } else { $null }
            updated_at = [string]$state.updated_at
            path       = $path
        }
    }

    if ($expiresAt -and $expiresAt -lt $now) {
        return [pscustomobject]@{
            mode       = 'present'
            source     = 'expired'
            expired    = $true
            expires_at = $expiresAt.ToString('o')
            updated_at = [string]$state.updated_at
            path       = $path
        }
    }

    return [pscustomobject]@{
        mode       = $mode
        source     = 'file'
        expired    = $false
        expires_at = if ($expiresAt) { $expiresAt.ToString('o') } else { $null }
        updated_at = [string]$state.updated_at
        path       = $path
    }
}

function Get-HarnessRepoRegistry {
    param(
        [string]$RuntimeHome,
        [string]$RegistryPath
    )

    if ([string]::IsNullOrWhiteSpace($RegistryPath)) {
        $RegistryPath = Get-HarnessRepoRegistryPath -RuntimeHome $RuntimeHome
    }

    $registry = Read-HarnessJson -Path $RegistryPath
    if ($null -eq $registry) {
        return [pscustomobject]@{
            version    = 1
            updated_at = $null
            repos      = @()
            path       = $RegistryPath
        }
    }

    if (-not ($registry.PSObject.Properties.Name -contains 'repos')) {
        $registry | Add-Member -NotePropertyName repos -NotePropertyValue @()
    }

    if (-not ($registry.PSObject.Properties.Name -contains 'path')) {
        $registry | Add-Member -NotePropertyName path -NotePropertyValue $RegistryPath
    } else {
        $registry.path = $RegistryPath
    }

    return $registry
}

function Save-HarnessRepoRegistry {
    param(
        [Parameter(Mandatory = $true)]$Registry,
        [string]$RuntimeHome,
        [string]$RegistryPath
    )

    if ([string]::IsNullOrWhiteSpace($RegistryPath)) {
        $RegistryPath = if ($Registry.PSObject.Properties.Name -contains 'path' -and -not [string]::IsNullOrWhiteSpace([string]$Registry.path)) {
            [string]$Registry.path
        } else {
            Get-HarnessRepoRegistryPath -RuntimeHome $RuntimeHome
        }
    }

    $Registry.version = 1
    $Registry.updated_at = Get-HarnessTimestamp
    if ($Registry.PSObject.Properties.Name -contains 'path') {
        $Registry.path = $RegistryPath
    }

    Write-HarnessJson -Path $RegistryPath -Value $Registry
    return $Registry
}
