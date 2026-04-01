[CmdletBinding()]
param(
    [string]$TaskName = 'HarnessRemoteApprovalWatcher',
    [string]$WatchScriptPath,
    [string]$PowerShellPath = 'C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe',
    [string]$RuntimeHome,
    [switch]$VisibleWindow,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'approval_common.ps1')

if ([string]::IsNullOrWhiteSpace($WatchScriptPath)) {
    $WatchScriptPath = Join-Path $PSScriptRoot 'watch_user_gates.ps1'
}

$WatchScriptPath = [System.IO.Path]::GetFullPath($WatchScriptPath)
if (-not (Test-Path -LiteralPath $WatchScriptPath)) {
    throw "watch_user_gates.ps1 was not found at '$WatchScriptPath'."
}

$windowStyle = if ($VisibleWindow) { 'Normal' } else { 'Hidden' }

$argumentParts = @(
    '-NoProfile',
    '-NonInteractive',
    '-NoLogo',
    '-WindowStyle',
    $windowStyle,
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    ('"{0}"' -f $WatchScriptPath)
)

if (-not [string]::IsNullOrWhiteSpace($RuntimeHome)) {
    $argumentParts += @('-RuntimeHome', ('"{0}"' -f $RuntimeHome))
}

$argumentString = $argumentParts -join ' '
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -StartWhenAvailable
$action = New-ScheduledTaskAction -Execute $PowerShellPath -Argument $argumentString

$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    if (-not $Force) {
        throw "Scheduled task '$TaskName' already exists. Use -Force to replace it."
    }

    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description 'Watch harness approval states and keep unattended decisions moving.' | Out-Null

[pscustomobject]@{
    task_name    = $TaskName
    watch_script = $WatchScriptPath
    powershell   = $PowerShellPath
    arguments    = $argumentString
}
