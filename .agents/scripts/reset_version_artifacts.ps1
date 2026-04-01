[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$RepoRoot = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
)

$ErrorActionPreference = 'Stop'

$repoRootPath = (Resolve-Path -LiteralPath $RepoRoot).Path
$templateRoot = Join-Path $repoRootPath '.agents\templates\artifacts'
$artifactsRoot = Join-Path $repoRootPath '.agents\artifacts'

$resetFiles = @(
    'CURRENT_STATE.md',
    'HANDOFF_ARCHIVE.md',
    'TASK_LIST.md',
    'IMPLEMENTATION_PLAN.md',
    'WALKTHROUGH.md',
    'REVIEW_REPORT.md',
    'DEPLOYMENT_PLAN.md'
)

if (-not (Test-Path -LiteralPath $templateRoot)) {
    throw "Missing template root: $templateRoot"
}

if (-not (Test-Path -LiteralPath $artifactsRoot)) {
    New-Item -ItemType Directory -Path $artifactsRoot -Force | Out-Null
}

$missingSources = @()
foreach ($file in $resetFiles) {
    $sourcePath = Join-Path $templateRoot $file
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        $missingSources += $sourcePath
    }
}

if ($missingSources.Count -gt 0) {
    throw ('Missing reset template file(s): {0}' -f ($missingSources -join ', '))
}

foreach ($file in $resetFiles) {
    $sourcePath = Join-Path $templateRoot $file
    $destinationPath = Join-Path $artifactsRoot $file

    if ($PSCmdlet.ShouldProcess($destinationPath, "Reset artifact from $sourcePath")) {
        [System.IO.File]::WriteAllBytes(
            $destinationPath,
            [System.IO.File]::ReadAllBytes($sourcePath)
        )
        Write-Output ("RESET: {0}" -f $file)
    }
}

Write-Output ("DONE: Reset {0} artifact file(s) from {1}" -f $resetFiles.Count, $templateRoot)
