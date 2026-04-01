[CmdletBinding()]
param(
    [ValidateSet('add', 'remove', 'list')][string]$Action = 'list',
    [string]$RepoRoot,
    [string]$RuntimeHome,
    [string]$RegistryPath
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'approval_common.ps1')

$registry = Get-HarnessRepoRegistry -RuntimeHome $RuntimeHome -RegistryPath $RegistryPath

if ($Action -eq 'list') {
    @($registry.repos) | Sort-Object root
    return
}

$resolvedRepoRoot = Resolve-HarnessRepoRoot -RepoRoot $RepoRoot
$timestamp = Get-HarnessTimestamp
$repos = New-Object System.Collections.Generic.List[object]
$existing = $null

foreach ($entry in @($registry.repos)) {
    if ([System.StringComparer]::OrdinalIgnoreCase.Equals([string]$entry.root, $resolvedRepoRoot)) {
        $existing = $entry
        continue
    }

    $repos.Add([pscustomobject]@{
        root       = [string]$entry.root
        active     = [bool]$entry.active
        added_at   = [string]$entry.added_at
        updated_at = [string]$entry.updated_at
    })
}

if ($Action -eq 'add') {
    $repos.Add([pscustomobject]@{
        root       = $resolvedRepoRoot
        active     = $true
        added_at   = if ($existing) { [string]$existing.added_at } else { $timestamp }
        updated_at = $timestamp
    })
} elseif ($Action -eq 'remove' -and $existing) {
    $repos.Add([pscustomobject]@{
        root       = $resolvedRepoRoot
        active     = $false
        added_at   = [string]$existing.added_at
        updated_at = $timestamp
    })
}

$registry.repos = @($repos | Sort-Object root)
Save-HarnessRepoRegistry -Registry $registry -RuntimeHome $RuntimeHome -RegistryPath $RegistryPath | Out-Null
@($registry.repos) | Sort-Object root
