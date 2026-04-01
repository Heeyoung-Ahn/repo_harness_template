[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][ValidateSet('present', 'away')][string]$Mode,
    [int]$DurationMinutes,
    [string]$RuntimeHome
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'approval_common.ps1')

$path = Get-HarnessPresencePath -RuntimeHome $RuntimeHome
$now = [DateTimeOffset]::UtcNow

$state = [ordered]@{
    version      = 1
    mode         = $Mode
    updated_at   = $now.ToString('o')
    machine_name = $env:COMPUTERNAME
    user_name    = $env:USERNAME
}

if ($Mode -eq 'away' -and $DurationMinutes -gt 0) {
    $state.expires_at = $now.AddMinutes($DurationMinutes).ToString('o')
} else {
    $state.expires_at = $null
}

Write-HarnessJson -Path $path -Value $state
[pscustomobject]$state
