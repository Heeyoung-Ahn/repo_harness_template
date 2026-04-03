[CmdletBinding()]
param(
    [switch]$Clean
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Push-Location $projectRoot
try {
    $pyInstallerArgs = @(
        '-m',
        'PyInstaller',
        '--noconfirm',
        '--onefile',
        '--windowed',
        '--name',
        'harness-admin'
    )

    if ($Clean) {
        $pyInstallerArgs += '--clean'
    }

    $pyInstallerArgs += @(
        '--paths',
        $projectRoot,
        'harness_admin\__main__.py'
    )

    & python @pyInstallerArgs
} finally {
    Pop-Location
}
