$ErrorActionPreference = "Stop"

$runtimeDir = Join-Path $PSScriptRoot "runtime"
$pidFile = Join-Path $runtimeDir "project-monitor-web.pid"
$url = "http://127.0.0.1:4173"

New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null

if (Test-Path $pidFile) {
  $existingPid = [int](Get-Content -Path $pidFile -Raw)
  $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
  if ($existingProcess) {
    Start-Process $url | Out-Null
    Write-Output "Project Monitor Web is already running at $url (PID $existingPid)."
    exit 0
  }

  Remove-Item -LiteralPath $pidFile -Force
}

$nodeCommand = Get-Command node -ErrorAction Stop
$process = Start-Process `
  -FilePath $nodeCommand.Source `
  -ArgumentList @("server.js") `
  -WorkingDirectory $PSScriptRoot `
  -WindowStyle Hidden `
  -PassThru

Set-Content -Path $pidFile -Value $process.Id -Encoding utf8
Start-Sleep -Seconds 2
Start-Process $url | Out-Null

Write-Output "Project Monitor Web started at $url (PID $($process.Id))."
