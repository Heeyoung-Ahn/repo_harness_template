$ErrorActionPreference = "Stop"

$runtimeDir = Join-Path $PSScriptRoot "runtime"
$pidFile = Join-Path $runtimeDir "project-monitor-web.pid"
$stdoutLog = Join-Path $runtimeDir "project-monitor-web.stdout.log"
$stderrLog = Join-Path $runtimeDir "project-monitor-web.stderr.log"
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

    $commandLine = $processInfo.CommandLine
    if ($processInfo.Name -eq "node.exe" -and $commandLine -like "*server.js*") {
      return [pscustomobject]@{
        ProcessId = $processInfo.ProcessId
        Name = $processInfo.Name
        CommandLine = $commandLine
      }
    }
  }

  return $null
}

function Test-PmwReady {
  try {
    $response = Invoke-WebRequest -Uri "$url/api/projects" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null

$listener = Get-PmwListener
if ($listener) {
  Set-Content -Path $pidFile -Value $listener.ProcessId -Encoding utf8
  Start-Process $url | Out-Null
  Write-Output "Project Monitor Web is already running at $url (PID $($listener.ProcessId))."
  exit 0
}

$existingProcess = Get-PmwProcessFromPidFile -PidFilePath $pidFile
if ($existingProcess) {
  $isRecovered = $false

  for ($attempt = 0; $attempt -lt 10; $attempt++) {
    if (Test-PmwReady) {
      Set-Content -Path $pidFile -Value $existingProcess.Id -Encoding utf8
      Start-Process $url | Out-Null
      Write-Output "Project Monitor Web is already running at $url (PID $($existingProcess.Id))."
      exit 0
    }

    Start-Sleep -Milliseconds 200
    $existingProcess = Get-Process -Id $existingProcess.Id -ErrorAction SilentlyContinue
    if (-not $existingProcess) {
      $isRecovered = $true
      break
    }
  }

  if (-not $isRecovered -and $existingProcess) {
    Stop-Process -Id $existingProcess.Id -Force -ErrorAction SilentlyContinue
  }
}

if (Test-Path $pidFile) {
  Remove-Item -LiteralPath $pidFile -Force
}

$foreignPortUser = Get-NetTCPConnection `
  -LocalAddress $bindHost `
  -LocalPort $port `
  -State Listen `
  -ErrorAction SilentlyContinue |
  Select-Object -First 1

if ($foreignPortUser) {
  $foreignProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($foreignPortUser.OwningProcess)" -ErrorAction SilentlyContinue
  $processLabel = if ($foreignProcess) {
    "$($foreignProcess.Name) PID $($foreignProcess.ProcessId)"
  } else {
    "PID $($foreignPortUser.OwningProcess)"
  }
  throw "Port $port is already in use by $processLabel."
}

Remove-Item -LiteralPath $stdoutLog, $stderrLog -Force -ErrorAction SilentlyContinue

$nodeCommand = Get-Command node -ErrorAction Stop
$process = Start-Process `
  -FilePath $nodeCommand.Source `
  -ArgumentList @("server.js") `
  -WorkingDirectory $PSScriptRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

$isReady = $false
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 300
  $liveProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
  if (-not $liveProcess) {
    break
  }

  if (Test-PmwReady) {
    $isReady = $true
    break
  }
}

if (-not $isReady) {
  $liveProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
  if ($liveProcess) {
    Stop-Process -Id $process.Id -Force
  }

  $stderrPreview = if (Test-Path $stderrLog) {
    (Get-Content -Path $stderrLog -Raw).Trim()
  } else {
    ""
  }
  $detail = if ($stderrPreview) { " $stderrPreview" } else { "" }
  throw "Project Monitor Web failed to become ready.$detail"
}

Set-Content -Path $pidFile -Value $process.Id -Encoding utf8
Start-Process $url | Out-Null

Write-Output "Project Monitor Web started at $url (PID $($process.Id))."
