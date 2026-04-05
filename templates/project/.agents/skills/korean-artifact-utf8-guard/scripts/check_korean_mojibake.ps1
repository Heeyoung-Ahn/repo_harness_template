param(
    [Parameter(Mandatory = $true)]
    [string[]]$Path
)

$ErrorActionPreference = "Stop"
$utf8 = [System.Text.Encoding]::UTF8
$cp949 = [System.Text.Encoding]::GetEncoding(949)
$scanExtensions = @(".md", ".txt", ".ts", ".tsx", ".js", ".jsx", ".json", ".yml", ".yaml")
$suspects = New-Object System.Collections.Generic.List[object]

function Get-TextStats {
    param([string]$Text)

    $hangul = 0
    $compat = 0
    $replacement = 0
    $question = 0

    foreach ($char in $Text.ToCharArray()) {
        $code = [int][char]$char

        if ($code -ge 0xAC00 -and $code -le 0xD7A3) {
            $hangul++
        }

        if ($code -ge 0xF900 -and $code -le 0xFAFF) {
            $compat++
        }

        if ($code -eq 0xFFFD) {
            $replacement++
        }

        if ($char -eq '?') {
            $question++
        }
    }

    return [pscustomobject]@{
        Hangul = $hangul
        Compat = $compat
        Replacement = $replacement
        Question = $question
        Score = ($hangul * 3) - ($compat * 3) - ($replacement * 4) - $question
    }
}

function Get-RepairCandidate {
    param([string]$Text)

    try {
        return $utf8.GetString($cp949.GetBytes($Text))
    } catch {
        return $null
    }
}

function Add-Suspect {
    param(
        [string]$FilePath,
        [int]$LineNumber,
        [string]$Original,
        [string]$Candidate
    )

    $suspects.Add([pscustomobject]@{
        FilePath = $FilePath
        LineNumber = $LineNumber
        Original = $Original
        Candidate = $Candidate
    }) | Out-Null
}

$files = foreach ($inputPath in $Path) {
    $resolved = Resolve-Path -LiteralPath $inputPath -ErrorAction Stop
    foreach ($entry in $resolved) {
        if (Test-Path -LiteralPath $entry -PathType Container) {
            Get-ChildItem -LiteralPath $entry -Recurse -File | Where-Object {
                $scanExtensions -contains $_.Extension.ToLowerInvariant()
            }
        } else {
            Get-Item -LiteralPath $entry
        }
    }
}

foreach ($file in $files | Sort-Object FullName -Unique) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $lines = $content -split "`r?`n"

    for ($index = 0; $index -lt $lines.Length; $index++) {
        $line = $lines[$index]
        $stats = Get-TextStats -Text $line
        $candidate = Get-RepairCandidate -Text $line
        $candidateLooksBetter = $false

        if ($null -ne $candidate -and $candidate -ne $line) {
            $candidateStats = Get-TextStats -Text $candidate
            $candidateLooksBetter =
                ($candidateStats.Hangul -gt 0) -and
                (
                    ($candidateStats.Hangul -gt $stats.Hangul) -or
                    ($candidateStats.Score -ge ($stats.Score + 4))
                )
        }

        $hasCompat = $stats.Compat -gt 0
        $hasReplacement = $stats.Replacement -gt 0
        $hasQuestionCluster = $stats.Question -ge 2

        if ($hasCompat -or $hasReplacement -or ($hasQuestionCluster -and $candidateLooksBetter)) {
            Add-Suspect -FilePath $file.FullName -LineNumber ($index + 1) -Original $line -Candidate $candidate
        }
    }
}

if ($suspects.Count -eq 0) {
    Write-Output "No mojibake suspects found."
    exit 0
}

foreach ($suspect in $suspects) {
    Write-Output ("SUSPECT {0}:{1}" -f $suspect.FilePath, $suspect.LineNumber)
    Write-Output ("  original:  {0}" -f $suspect.Original)
    if ($null -ne $suspect.Candidate -and $suspect.Candidate -ne $suspect.Original) {
        Write-Output ("  candidate: {0}" -f $suspect.Candidate)
    }
}

exit 1
