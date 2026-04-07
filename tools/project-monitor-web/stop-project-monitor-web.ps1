$ErrorActionPreference = "Stop"

$runtimeDir = Join-Path $PSScriptRoot "runtime"
$pidFile = Join-Path $runtimeDir "project-monitor-web.pid"

if (-not (Test-Path $pidFile)) {
  Write-Output "No stored PMW process was found."
  exit 0
}

$pidValue = [int](Get-Content -Path $pidFile -Raw)
$process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue

if ($process) {
  Stop-Process -Id $pidValue
  Write-Output "Stopped Project Monitor Web process $pidValue."
} else {
  Write-Output "Stored PMW process $pidValue was not running."
}

Remove-Item -LiteralPath $pidFile -Force
