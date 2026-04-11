$ErrorActionPreference = "Stop"

$runtimeDir = Join-Path $PSScriptRoot "runtime"
$pidFile = Join-Path $runtimeDir "project-monitor-web.pid"
$url = "http://127.0.0.1:4173"
$bindHost = "127.0.0.1"
$port = 4173

function Get-PmwProcessFromPidFile {
  param([string]$PidFilePath)

  if (-not (Test-Path $PidFilePath)) {
    return $null
  }

  $pidText = (Get-Content -Path $PidFilePath -Raw).Trim()
  if (-not $pidText) {
    return $null
  }

  $pidValue = 0
  if (-not [int]::TryParse($pidText, [ref]$pidValue)) {
    return $null
  }

  return Get-Process -Id $pidValue -ErrorAction SilentlyContinue
}

function Get-PmwListener {
  $connections = Get-NetTCPConnection `
    -LocalAddress $bindHost `
    -LocalPort $port `
    -State Listen `
    -ErrorAction SilentlyContinue

  foreach ($connection in $connections) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $($connection.OwningProcess)" -ErrorAction SilentlyContinue
    if (-not $processInfo) {
      continue
    }

    if ($processInfo.Name -eq "node.exe" -and $processInfo.CommandLine -like "*server.js*") {
      return Get-Process -Id $processInfo.ProcessId -ErrorAction SilentlyContinue
    }
  }

  return $null
}

$process = Get-PmwProcessFromPidFile -PidFilePath $pidFile
if (-not $process) {
  $process = Get-PmwListener
}

if (-not $process) {
  if (Test-Path $pidFile) {
    Remove-Item -LiteralPath $pidFile -Force
  }
  Write-Output "No running PMW process was found."
  exit 0
}

try {
  Invoke-RestMethod -Uri "$url/api/server/stop" -Method Post -TimeoutSec 2 | Out-Null
} catch {
}

for ($attempt = 0; $attempt -lt 10; $attempt++) {
  Start-Sleep -Milliseconds 200
  $liveProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
  if (-not $liveProcess) {
    break
  }
}

$liveProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
if ($liveProcess) {
  Stop-Process -Id $process.Id -Force
}

if (Test-Path $pidFile) {
  Remove-Item -LiteralPath $pidFile -Force
}

Write-Output "Stopped Project Monitor Web process $($process.Id)."
