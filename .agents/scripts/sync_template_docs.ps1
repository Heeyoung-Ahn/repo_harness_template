[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string[]]$TargetRepo,
    [string[]]$Preset,
    [switch]$ListPreset,
    [string]$PresetFile,
    [switch]$AllowSelf,
    [switch]$IncludeLiveArtifacts
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path -LiteralPath (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))).Path
$templateRoot = Join-Path $repoRoot 'templates_starter'
$versionResetRoot = Join-Path $repoRoot 'templates\version_reset'
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

if (-not (Test-Path -LiteralPath $templateRoot)) {
    throw "Missing starter template root: $templateRoot"
}
if (-not (Test-Path -LiteralPath $versionResetRoot)) {
    throw "Missing version reset template root: $versionResetRoot"
}

if ([string]::IsNullOrWhiteSpace($PresetFile)) {
    $PresetFile = Join-Path $repoRoot '.agents\runtime\downstream_target_presets.psd1'
}

function Get-PresetConfig {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Missing preset file: $Path"
    }

    $config = Import-PowerShellDataFile -LiteralPath $Path
    if ($null -eq $config -or $null -eq $config.Presets) {
        throw "Invalid preset file. Expected a top-level Presets hashtable: $Path"
    }

    return $config
}

function Get-PresetTargets {
    param(
        [hashtable]$PresetMap,
        [string[]]$PresetNames
    )

    $targets = New-Object System.Collections.Generic.List[string]
    foreach ($presetName in $PresetNames) {
        if (-not $PresetMap.ContainsKey($presetName)) {
            $available = ($PresetMap.Keys | Sort-Object) -join ', '
            throw "Unknown preset '$presetName'. Available presets: $available"
        }

        $entry = $PresetMap[$presetName]
        if ($entry -is [hashtable]) {
            $entryTargets = @($entry.Targets)
        } else {
            $entryTargets = @($entry)
        }

        if ($entryTargets.Count -eq 0) {
            throw "Preset '$presetName' does not define any targets."
        }

        foreach ($entryTarget in $entryTargets) {
            if (-not [string]::IsNullOrWhiteSpace($entryTarget)) {
                $targets.Add($entryTarget)
            }
        }
    }

    return $targets
}

function Sync-SourceTree {
    param(
        [Parameter(Mandatory = $true)][string]$SourceRoot,
        [Parameter(Mandatory = $true)][string]$DestinationRoot,
        [switch]$PreserveLiveArtifacts,
        [string[]]$SkipRelativePrefix
    )

    $files = Get-ChildItem -LiteralPath $SourceRoot -Recurse -File
    foreach ($file in $files) {
        $relative = $file.FullName.Substring($SourceRoot.Length).TrimStart('\')
        $normalizedRelative = $relative -replace '/', '\'
        $destinationPath = Join-Path $DestinationRoot $relative
        $parentDir = Split-Path -Parent $destinationPath

        $skipByPrefix = $false
        foreach ($prefix in @($SkipRelativePrefix)) {
            if (-not [string]::IsNullOrWhiteSpace($prefix) -and $normalizedRelative.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                Write-Output ("SKIP: {0} (managed by separate source tree)" -f $destinationPath)
                $skipByPrefix = $true
                break
            }
        }
        if ($skipByPrefix) {
            continue
        }

        if ($PreserveLiveArtifacts -and $normalizedRelative.StartsWith('.agents\artifacts\', [System.StringComparison]::OrdinalIgnoreCase)) {
            Write-Output ("SKIP: {0} (preserve target live artifacts)" -f $destinationPath)
            continue
        }

        if (-not (Test-Path -LiteralPath $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }

        if ($PSCmdlet.ShouldProcess($destinationPath, "Copy template source from $($file.FullName)")) {
            [System.IO.File]::WriteAllText(
                $destinationPath,
                [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8),
                $utf8NoBom
            )
            Write-Output ("SYNC: {0}" -f $destinationPath)
        }
    }
}

$presetConfig = $null
if ($ListPreset -or $Preset.Count -gt 0) {
    $presetConfig = Get-PresetConfig -Path $PresetFile
}

if ($ListPreset) {
    foreach ($name in ($presetConfig.Presets.Keys | Sort-Object)) {
        $entry = $presetConfig.Presets[$name]
        if ($entry -is [hashtable]) {
            $description = [string]$entry.Description
            $targets = @($entry.Targets)
        } else {
            $description = ''
            $targets = @($entry)
        }

        $line = "PRESET: {0} - {1} target(s)" -f $name, $targets.Count
        if (-not [string]::IsNullOrWhiteSpace($description)) {
            $line = "{0} - {1}" -f $line, $description
        }
        Write-Output $line
    }

    if ($TargetRepo.Count -eq 0 -and $Preset.Count -eq 0) {
        return
    }
}

$targetsToResolve = New-Object System.Collections.Generic.List[string]
foreach ($target in @($TargetRepo)) {
    if (-not [string]::IsNullOrWhiteSpace($target)) {
        $targetsToResolve.Add($target)
    }
}
if ($Preset.Count -gt 0) {
    foreach ($presetTarget in (Get-PresetTargets -PresetMap $presetConfig.Presets -PresetNames $Preset)) {
        $targetsToResolve.Add($presetTarget)
    }
}

if ($targetsToResolve.Count -eq 0) {
    throw 'Specify at least one -TargetRepo or -Preset, or use -ListPreset.'
}

$dedupedTargets = New-Object System.Collections.Generic.List[string]
$seenTargets = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
foreach ($target in $targetsToResolve) {
    $targetRoot = (Resolve-Path -LiteralPath $target).Path
    if ($seenTargets.Add($targetRoot)) {
        $dedupedTargets.Add($targetRoot)
    }
}

foreach ($targetRoot in $dedupedTargets) {
    if ((-not $AllowSelf) -and ($targetRoot -eq $repoRoot)) {
        throw 'Refusing to sync project template onto the self-hosting repo root. Pass -AllowSelf only if you intentionally want to overwrite live docs.'
    }

    Sync-SourceTree -SourceRoot $templateRoot -DestinationRoot $targetRoot -PreserveLiveArtifacts:(-not $IncludeLiveArtifacts) -SkipRelativePrefix @('templates\version_reset\')
    Sync-SourceTree -SourceRoot $versionResetRoot -DestinationRoot (Join-Path $targetRoot 'templates\version_reset')
}
