$ErrorActionPreference = 'Stop'

$findings = [System.Collections.Generic.List[object]]::new()

function Add-Finding {
    param(
        [Parameter(Mandatory = $true)][string]$Severity,
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Message
    )

    $script:findings.Add([pscustomobject]@{
        Severity = $Severity
        Path = $Path
        Message = $Message
    })
}

function U {
    param([Parameter(Mandatory = $true)][string]$Escaped)

    return [regex]::Unescape($Escaped)
}

function Get-LineFieldValue {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Label
    )

    $escapedLabel = [regex]::Escape($Label)
    $pattern = '(?m)^- {0}:[ \t]*(?<value>[^\r\n]+?)\s*$' -f $escapedLabel
    $match = [regex]::Match($Text, $pattern)
    if ($match.Success) {
        return $match.Groups['value'].Value.Trim()
    }

    return $null
}

function Is-ConcreteValue {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $false
    }
    if ($Value -match '\[' -or $Value -match '/' -or $Value -match '^`.+`$') {
        return $false
    }

    return $true
}

function Contains-Any {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string[]]$Patterns
    )

    foreach ($pattern in $Patterns) {
        if ($Text.Contains($pattern)) {
            return $true
        }
    }

    return $false
}

function Normalize-Scope {
    param([string]$Scope)

    if ([string]::IsNullOrWhiteSpace($Scope)) {
        return ''
    }

    $value = $Scope.Trim().Trim([char]96).Trim()
    $value = $value -replace '\\', '/'
    $value = $value -replace '/\*+$', ''
    $value = $value -replace '\*+$', ''
    return $value.TrimEnd('/')
}

function Get-MarkdownTitle {
    param([string]$Text)

    if ([string]::IsNullOrEmpty($Text)) {
        return $null
    }

    $normalizedText = $Text.TrimStart([char]0xFEFF)
    $match = [regex]::Match($normalizedText, '\A(?:[ \t]*\r?\n)*#\s+(?<title>[^\r\n]+?)\s*(?:\r?\n|$)')
    if ($match.Success) {
        return $match.Groups['title'].Value.Trim()
    }

    return $null
}

function Get-SectionBody {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Heading
    )

    $escapedHeading = [regex]::Escape($Heading)
    $pattern = '(?ms)^{0}\r?\n(?<body>.*?)(?=^## |\z)' -f $escapedHeading
    $match = [regex]::Match($Text, $pattern)
    if ($match.Success) {
        return $match.Groups['body'].Value
    }

    return ''
}

function Get-NormalizedBulletLines {
    param([string]$SectionBody)

    $lines = @()
    foreach ($match in [regex]::Matches($SectionBody, '(?m)^- (?<value>.+?)\s*$')) {
        $value = $match.Groups['value'].Value.Trim()
        if ($value -match '^\[') {
            continue
        }

        $value = $value -replace '^\*\*[^:]+:\*\*\s*', ''
        $value = $value -replace '\s+', ' '
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            $lines += $value.Trim()
        }
    }

    return $lines
}

function Get-HandoffEntryMatches {
    param([string]$Text)

    return [regex]::Matches($Text, '(?ms)^### \[(?<timestamp>[^\]]+)\] \[(?<from>[^\]]+)\] -> \[(?<to>[^\]]+)\]\r?\n(?<body>.*?)(?=^### |\z)')
}

function Validate-ArtifactSchema {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][pscustomobject]$Schema
    )

    $title = Get-MarkdownTitle -Text $Text
    if ($title -ne $Schema.ExpectedTitle) {
        if ([string]::IsNullOrWhiteSpace($title)) {
            Add-Finding -Severity 'ERROR' -Path $Path -Message ('Missing or malformed top-level title. Expected "# {0}".' -f $Schema.ExpectedTitle)
        } else {
            Add-Finding -Severity 'ERROR' -Path $Path -Message ('Unexpected top-level title: "{0}". Expected "# {1}".' -f $title, $Schema.ExpectedTitle)
        }
    }

    foreach ($section in $Schema.RequiredSections) {
        if (-not $Text.Contains($section)) {
            Add-Finding -Severity 'ERROR' -Path $Path -Message ('Missing required section: {0}' -f $section)
        }
    }

    foreach ($field in $Schema.RequiredFields) {
        if (-not $Text.Contains($field)) {
            Add-Finding -Severity 'ERROR' -Path $Path -Message ('Missing required field: {0}' -f $field)
        }
    }

    foreach ($check in $Schema.ForbiddenChecks) {
        if ([regex]::IsMatch($Text, $check.Pattern)) {
            Add-Finding -Severity 'ERROR' -Path $Path -Message $check.Message
        }
    }
}

function Validate-RecommendedArtifactShape {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Path,
        [string[]]$RecommendedSections = @(),
        [string[]]$RecommendedFields = @()
    )

    foreach ($section in $RecommendedSections) {
        if (-not $Text.Contains($section)) {
            Add-Finding -Severity 'WARNING' -Path $Path -Message ('Live artifact is missing recommended migrated section: {0}' -f $section)
        }
    }

    foreach ($field in $RecommendedFields) {
        if (-not $Text.Contains($field)) {
            Add-Finding -Severity 'WARNING' -Path $Path -Message ('Live artifact is missing recommended migrated field: {0}' -f $field)
        }
    }
}

$labelUserConfirmPending = U '\uC0AC\uC6A9\uC790 \uB2F5\uBCC0 / \uD655\uC778 \uB300\uAE30'
$placeholderScope = '[' + (U '\uAE30\uB2A5/\uB3C4\uBA54\uC778 \uBC94\uC704 \uC791\uC131') + ']'
$placeholderRequirement = '[' + (U '\uC694\uAD6C\uC0AC\uD56D') + ']'
$placeholderAcceptance = '[' + (U '\uC5B4\uB5A4 \uC0C1\uD0DC\uAC00 \uB418\uBA74 \uCDA9\uC871\uC778\uC9C0') + ']'
$planPlaceholderTask = '[' + (U '\uAC1C\uBC1C \uC791\uC5C5') + ']'
$planPlaceholderRisk = '[' + (U '\uB9AC\uC2A4\uD06C') + ']'
$planPlaceholderImpact = '[' + (U '\uC601\uD5A5') + ']'
$planPlaceholderResponse = '[' + (U '\uB300\uC751') + ']'
$planQuestionPhrase = U '\uC9C8\uBB38\uC774'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$pathMap = @{
    CurrentState       = Join-Path $repoRoot '.agents\artifacts\CURRENT_STATE.md'
    HandoffArchive     = Join-Path $repoRoot '.agents\artifacts\HANDOFF_ARCHIVE.md'
    TaskList           = Join-Path $repoRoot '.agents\artifacts\TASK_LIST.md'
    Requirements       = Join-Path $repoRoot '.agents\artifacts\REQUIREMENTS.md'
    Architecture       = Join-Path $repoRoot '.agents\artifacts\ARCHITECTURE_GUIDE.md'
    ImplementationPlan = Join-Path $repoRoot '.agents\artifacts\IMPLEMENTATION_PLAN.md'
    Walkthrough        = Join-Path $repoRoot '.agents\artifacts\WALKTHROUGH.md'
    ReviewReport       = Join-Path $repoRoot '.agents\artifacts\REVIEW_REPORT.md'
    DeploymentPlan     = Join-Path $repoRoot '.agents\artifacts\DEPLOYMENT_PLAN.md'
    WorkspaceRule      = Join-Path $repoRoot '.agents\rules\workspace.md'
    PlanWorkflow       = Join-Path $repoRoot '.agents\workflows\plan.md'
    DeployWorkflow     = Join-Path $repoRoot '.agents\workflows\deploy.md'
    ReviewWorkflow     = Join-Path $repoRoot '.agents\workflows\review.md'
    TestWorkflow       = Join-Path $repoRoot '.agents\workflows\test.md'
    HandoffWorkflow    = Join-Path $repoRoot '.agents\workflows\handoff.md'
    ExpoDeviceSkill    = Join-Path $repoRoot '.agents\skills\expo_real_device_test\SKILL.md'
    ResetScript        = Join-Path $repoRoot '.agents\scripts\reset_version_artifacts.ps1'
}

$templateArtifactMap = @{
    CurrentState       = Join-Path $repoRoot 'templates\version_reset\artifacts\CURRENT_STATE.md'
    HandOffArchive     = Join-Path $repoRoot 'templates\version_reset\artifacts\HANDOFF_ARCHIVE.md'
    TaskList           = Join-Path $repoRoot 'templates\version_reset\artifacts\TASK_LIST.md'
    ImplementationPlan = Join-Path $repoRoot 'templates\version_reset\artifacts\IMPLEMENTATION_PLAN.md'
    Walkthrough        = Join-Path $repoRoot 'templates\version_reset\artifacts\WALKTHROUGH.md'
    ReviewReport       = Join-Path $repoRoot 'templates\version_reset\artifacts\REVIEW_REPORT.md'
    DeploymentPlan     = Join-Path $repoRoot 'templates\version_reset\artifacts\DEPLOYMENT_PLAN.md'
}

foreach ($entry in $pathMap.GetEnumerator()) {
    if (-not (Test-Path -LiteralPath $entry.Value)) {
        Add-Finding -Severity 'ERROR' -Path $entry.Value -Message 'Missing required harness document.'
    }
}

foreach ($entry in $templateArtifactMap.GetEnumerator()) {
    if (-not (Test-Path -LiteralPath $entry.Value)) {
        Add-Finding -Severity 'ERROR' -Path $entry.Value -Message 'Missing required reset template artifact.'
    }
}

if ($findings.Count -gt 0) {
    foreach ($finding in $findings) {
        Write-Output ('{0}: {1} - {2}' -f $finding.Severity, $finding.Path, $finding.Message)
    }
    Write-Output ('SUMMARY: {0} error(s), 0 warning(s)' -f $findings.Count)
    exit 1
}

$utf8 = [System.Text.Encoding]::UTF8
$culture = [System.Globalization.CultureInfo]::InvariantCulture

$currentStateText = [System.IO.File]::ReadAllText($pathMap.CurrentState, $utf8)
$currentStateLines = [System.IO.File]::ReadAllLines($pathMap.CurrentState, $utf8)
$taskListText = [System.IO.File]::ReadAllText($pathMap.TaskList, $utf8)
$handoffArchiveText = [System.IO.File]::ReadAllText($pathMap.HandoffArchive, $utf8)
$requirementsText = [System.IO.File]::ReadAllText($pathMap.Requirements, $utf8)
$architectureText = [System.IO.File]::ReadAllText($pathMap.Architecture, $utf8)
$implementationPlanText = [System.IO.File]::ReadAllText($pathMap.ImplementationPlan, $utf8)
$walkthroughText = [System.IO.File]::ReadAllText($pathMap.Walkthrough, $utf8)
$reviewReportText = [System.IO.File]::ReadAllText($pathMap.ReviewReport, $utf8)
$deploymentPlanText = [System.IO.File]::ReadAllText($pathMap.DeploymentPlan, $utf8)
$workspaceText = [System.IO.File]::ReadAllText($pathMap.WorkspaceRule, $utf8)
$planWorkflowText = [System.IO.File]::ReadAllText($pathMap.PlanWorkflow, $utf8)
$deployWorkflowText = [System.IO.File]::ReadAllText($pathMap.DeployWorkflow, $utf8)
$reviewWorkflowText = [System.IO.File]::ReadAllText($pathMap.ReviewWorkflow, $utf8)
$testWorkflowText = [System.IO.File]::ReadAllText($pathMap.TestWorkflow, $utf8)
$handoffWorkflowText = [System.IO.File]::ReadAllText($pathMap.HandoffWorkflow, $utf8)
$expoDeviceSkillText = [System.IO.File]::ReadAllText($pathMap.ExpoDeviceSkill, $utf8)
$templateCurrentStateText = [System.IO.File]::ReadAllText($templateArtifactMap.CurrentState, $utf8)
$templateHandoffArchiveText = [System.IO.File]::ReadAllText($templateArtifactMap.HandOffArchive, $utf8)
$templateTaskListText = [System.IO.File]::ReadAllText($templateArtifactMap.TaskList, $utf8)
$templateImplementationPlanText = [System.IO.File]::ReadAllText($templateArtifactMap.ImplementationPlan, $utf8)
$templateWalkthroughText = [System.IO.File]::ReadAllText($templateArtifactMap.Walkthrough, $utf8)
$templateReviewReportText = [System.IO.File]::ReadAllText($templateArtifactMap.ReviewReport, $utf8)
$templateDeploymentPlanText = [System.IO.File]::ReadAllText($templateArtifactMap.DeploymentPlan, $utf8)

$wordCount = ([regex]::Matches($currentStateText, '\S+')).Count
if ($currentStateLines.Count -gt 120) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE exceeds line limit: {0} lines.' -f $currentStateLines.Count)
}
if ($wordCount -gt 800) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE exceeds word limit: {0} words.' -f $wordCount)
}
if ([regex]::IsMatch($currentStateText, '(?m)^## \d{4}-\d{2}-\d{2}\b')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message 'CURRENT_STATE still contains dated update blocks.'
}

$resetArtifactSchemas = @{
    CurrentState = [pscustomobject]@{
        ExpectedTitle  = 'Current State'
        RequiredSections = @(
            '## Snapshot',
            '## Next Recommended Agent',
            '## Must Read Next',
            '## Required Skills',
            '## Active Scope',
            '## Task Pointers',
            '## Open Decisions / Blockers',
            '## Latest Handoff Summary',
            '## Recent History Summary'
        )
        RequiredFields = @(
            'Review Gate',
            'Requirement Baseline',
            'Requirements Sync Check',
            'Current Green Level',
            'Branch Freshness',
            'First Next Action',
            $labelUserConfirmPending
        )
        ForbiddenChecks = @(
            [pscustomobject]@{
                Pattern = '(?mi)^#\s*CURRENT STATE SNAPSHOT\s*$'
                Message = 'CURRENT_STATE uses a forbidden closeout title. Use "# Current State".'
            },
            [pscustomobject]@{
                Pattern = '(?i)single source of truth'
                Message = 'CURRENT_STATE should not describe itself as single source of truth.'
            }
        )
    }
    HandOffArchive = [pscustomobject]@{
        ExpectedTitle    = 'Handoff Archive'
        RequiredSections = @('## Usage Rules', '## Archived Entries')
        RequiredFields   = @()
        ForbiddenChecks  = @()
    }
    TaskList = [pscustomobject]@{
        ExpectedTitle    = 'Task List'
        RequiredSections = @('## Current Release Target', '## Active Locks', '## Blockers', '## Handoff Log')
        RequiredFields   = @('Current Stage', 'Current Focus', 'Current Release Goal', 'Current Green Level', 'Branch Freshness')
        ForbiddenChecks  = @()
    }
    ImplementationPlan = [pscustomobject]@{
        ExpectedTitle    = 'Implementation Plan'
        RequiredSections = @('## Quick Read', '## Status', '## Current Iteration', '## Validation Commands', '## Requirement Trace', '## Requirement Change Impact', '## Task Packet Ledger')
        RequiredFields   = @('Requirement Baseline', 'Change Sync Check', 'Green level target', 'Branch freshness precheck', 'User-captured manual test expected')
        ForbiddenChecks  = @(
            [pscustomobject]@{
                Pattern = '(?mi)^#\s*Implementation Plan \(Draft\)\s*$'
                Message = 'IMPLEMENTATION_PLAN uses a forbidden closeout title. Use "# Implementation Plan".'
            }
        )
    }
    Walkthrough = [pscustomobject]@{
        ExpectedTitle    = 'Walkthrough'
        RequiredSections = @('## Quick Read', '## Latest Result', '## Test Scope Snapshot', '## User Report Alignment', '## Commands Executed', '## Automated Test Results', '## Branch Freshness', '## Failure Classification and Recovery', '## Manual Test Checklist', '## User-Captured Manual Test Report', '## Bugs / Mismatches Found')
        RequiredFields   = @('Requirement Baseline Tested', 'Requirements Sync Check', 'Green Level Achieved', 'Branch Freshness at Test Time', 'User-Captured Manual Test Status')
        ForbiddenChecks  = @(
            [pscustomobject]@{
                Pattern = '(?mi)^#\s*Walkthrough \(Draft\)\s*$'
                Message = 'WALKTHROUGH uses a forbidden closeout title. Use "# Walkthrough".'
            }
        )
    }
    ReviewReport = [pscustomobject]@{
        ExpectedTitle    = 'Review Report'
        RequiredSections = @('## Quick Read', '## Approval Status', '## Findings', '## Residual Release Risks', '## Document / Harness Debt')
        RequiredFields   = @('Requirement Baseline Reviewed', 'Requirements Sync Check', 'Green Level Reviewed', 'Branch Freshness Reviewed')
        ForbiddenChecks  = @(
            [pscustomobject]@{
                Pattern = '(?mi)^#\s*Review Report \(Draft\)\s*$'
                Message = 'REVIEW_REPORT uses a forbidden closeout title. Use "# Review Report".'
            }
        )
    }
    DeploymentPlan = [pscustomobject]@{
        ExpectedTitle    = 'Deployment Plan'
        RequiredSections = @('## Quick Read', '## Release Status', '## Preflight Checklist', '## Deployment History')
        RequiredFields   = @('Requirement Baseline for Release', 'Requirements Sync Gate', 'Reviewer Gate', 'Current Green Level', 'Branch Freshness for Release')
        ForbiddenChecks  = @(
            [pscustomobject]@{
                Pattern = '(?mi)^#\s*Deployment Plan \(Draft\)\s*$'
                Message = 'DEPLOYMENT_PLAN uses a forbidden closeout title. Use "# Deployment Plan".'
            }
        )
    }
}

$liveArtifactSchemas = @{
    CurrentState = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.CurrentState.ExpectedTitle
        RequiredSections = $resetArtifactSchemas.CurrentState.RequiredSections
        RequiredFields   = @('Review Gate', 'Requirement Baseline', 'Requirements Sync Check', $labelUserConfirmPending)
        ForbiddenChecks  = $resetArtifactSchemas.CurrentState.ForbiddenChecks
    }
    HandOffArchive = $resetArtifactSchemas.HandOffArchive
    TaskList = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.TaskList.ExpectedTitle
        RequiredSections = $resetArtifactSchemas.TaskList.RequiredSections
        RequiredFields   = @('Current Stage', 'Current Focus', 'Current Release Goal')
        ForbiddenChecks  = $resetArtifactSchemas.TaskList.ForbiddenChecks
    }
    ImplementationPlan = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.ImplementationPlan.ExpectedTitle
        RequiredSections = @('## Quick Read', '## Status', '## Current Iteration', '## Validation Commands', '## Requirement Trace', '## Requirement Change Impact')
        RequiredFields   = @('Requirement Baseline', 'Change Sync Check')
        ForbiddenChecks  = $resetArtifactSchemas.ImplementationPlan.ForbiddenChecks
    }
    Walkthrough = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.Walkthrough.ExpectedTitle
        RequiredSections = @('## Quick Read', '## Latest Result', '## Test Scope Snapshot', '## User Report Alignment', '## Commands Executed', '## Automated Test Results', '## Manual Test Checklist', '## Bugs / Mismatches Found')
        RequiredFields   = @('Requirement Baseline Tested', 'Requirements Sync Check')
        ForbiddenChecks  = $resetArtifactSchemas.Walkthrough.ForbiddenChecks
    }
    ReviewReport = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.ReviewReport.ExpectedTitle
        RequiredSections = $resetArtifactSchemas.ReviewReport.RequiredSections
        RequiredFields   = @('Requirement Baseline Reviewed', 'Requirements Sync Check')
        ForbiddenChecks  = $resetArtifactSchemas.ReviewReport.ForbiddenChecks
    }
    DeploymentPlan = [pscustomobject]@{
        ExpectedTitle    = $resetArtifactSchemas.DeploymentPlan.ExpectedTitle
        RequiredSections = $resetArtifactSchemas.DeploymentPlan.RequiredSections
        RequiredFields   = @('Requirement Baseline for Release', 'Requirements Sync Gate', 'Reviewer Gate')
        ForbiddenChecks  = $resetArtifactSchemas.DeploymentPlan.ForbiddenChecks
    }
}

Validate-ArtifactSchema -Text $currentStateText -Path '.agents/artifacts/CURRENT_STATE.md' -Schema $liveArtifactSchemas.CurrentState
Validate-ArtifactSchema -Text $handoffArchiveText -Path '.agents/artifacts/HANDOFF_ARCHIVE.md' -Schema $liveArtifactSchemas.HandOffArchive
Validate-ArtifactSchema -Text $taskListText -Path '.agents/artifacts/TASK_LIST.md' -Schema $liveArtifactSchemas.TaskList
Validate-ArtifactSchema -Text $implementationPlanText -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Schema $liveArtifactSchemas.ImplementationPlan
Validate-ArtifactSchema -Text $walkthroughText -Path '.agents/artifacts/WALKTHROUGH.md' -Schema $liveArtifactSchemas.Walkthrough
Validate-ArtifactSchema -Text $reviewReportText -Path '.agents/artifacts/REVIEW_REPORT.md' -Schema $liveArtifactSchemas.ReviewReport
Validate-ArtifactSchema -Text $deploymentPlanText -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Schema $liveArtifactSchemas.DeploymentPlan
Validate-ArtifactSchema -Text $templateCurrentStateText -Path 'templates/version_reset/artifacts/CURRENT_STATE.md' -Schema $resetArtifactSchemas.CurrentState
Validate-ArtifactSchema -Text $templateHandoffArchiveText -Path 'templates/version_reset/artifacts/HANDOFF_ARCHIVE.md' -Schema $resetArtifactSchemas.HandOffArchive
Validate-ArtifactSchema -Text $templateTaskListText -Path 'templates/version_reset/artifacts/TASK_LIST.md' -Schema $resetArtifactSchemas.TaskList
Validate-ArtifactSchema -Text $templateImplementationPlanText -Path 'templates/version_reset/artifacts/IMPLEMENTATION_PLAN.md' -Schema $resetArtifactSchemas.ImplementationPlan
Validate-ArtifactSchema -Text $templateWalkthroughText -Path 'templates/version_reset/artifacts/WALKTHROUGH.md' -Schema $resetArtifactSchemas.Walkthrough
Validate-ArtifactSchema -Text $templateReviewReportText -Path 'templates/version_reset/artifacts/REVIEW_REPORT.md' -Schema $resetArtifactSchemas.ReviewReport
Validate-ArtifactSchema -Text $templateDeploymentPlanText -Path 'templates/version_reset/artifacts/DEPLOYMENT_PLAN.md' -Schema $resetArtifactSchemas.DeploymentPlan

Validate-RecommendedArtifactShape -Text $currentStateText -Path '.agents/artifacts/CURRENT_STATE.md' -RecommendedFields @('Current Green Level', 'Branch Freshness', 'First Next Action')
Validate-RecommendedArtifactShape -Text $taskListText -Path '.agents/artifacts/TASK_LIST.md' -RecommendedFields @('Current Green Level', 'Branch Freshness')
Validate-RecommendedArtifactShape -Text $implementationPlanText -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -RecommendedSections @('## Task Packet Ledger') -RecommendedFields @('Green level target', 'Branch freshness precheck', 'User-captured manual test expected')
Validate-RecommendedArtifactShape -Text $walkthroughText -Path '.agents/artifacts/WALKTHROUGH.md' -RecommendedSections @('## Branch Freshness', '## Failure Classification and Recovery', '## User-Captured Manual Test Report') -RecommendedFields @('Green Level Achieved', 'Branch Freshness at Test Time', 'User-Captured Manual Test Status')
Validate-RecommendedArtifactShape -Text $reviewReportText -Path '.agents/artifacts/REVIEW_REPORT.md' -RecommendedFields @('Green Level Reviewed', 'Branch Freshness Reviewed')
Validate-RecommendedArtifactShape -Text $deploymentPlanText -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -RecommendedFields @('Current Green Level', 'Branch Freshness for Release')

$latestHandoffBullets = Get-NormalizedBulletLines -SectionBody (Get-SectionBody -Text $currentStateText -Heading '## Latest Handoff Summary')
$recentHistoryBullets = Get-NormalizedBulletLines -SectionBody (Get-SectionBody -Text $currentStateText -Heading '## Recent History Summary')
$taskPointerBullets = Get-NormalizedBulletLines -SectionBody (Get-SectionBody -Text $currentStateText -Heading '## Task Pointers')

$duplicateResumeLines = @($latestHandoffBullets | Where-Object { $recentHistoryBullets -contains $_ -or $taskPointerBullets -contains $_ } | Select-Object -Unique)
if ($duplicateResumeLines.Count -gt 0) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE repeats the same resume line across sections: {0}' -f ($duplicateResumeLines[0]))
}

foreach ($requiredField in @(
    'Current Requirement Baseline',
    'Requirements Sync Status',
    'Last Requirement Change At',
    '## Change Control Rules',
    '## Approved Change Log'
)) {
    if (-not $requirementsText.Contains($requiredField)) {
        Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/REQUIREMENTS.md' -Message ('REQUIREMENTS is missing field or section: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline',
    'Change Sync Check',
    'Last Requirement Sync At',
    '## Requirement Change Sync'
)) {
    if (-not $architectureText.Contains($requiredField)) {
        Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message ('ARCHITECTURE_GUIDE is missing field or section: {0}' -f $requiredField)
    }
}

$handoffMatches = Get-HandoffEntryMatches -Text $taskListText
if ($handoffMatches.Count -gt 5) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message ('Handoff Log has {0} live entries. Keep it within 5 unless an active loop requires more.' -f $handoffMatches.Count)
}
if ($handoffMatches.Count -gt 0) {
    $latestHandoff = $null
    $latestTimestamp = [datetime]::MinValue
    $lastHandoff = $handoffMatches[$handoffMatches.Count - 1]

    foreach ($match in $handoffMatches) {
        try {
            $timestamp = [datetime]::ParseExact($match.Groups['timestamp'].Value, 'yyyy-MM-dd HH:mm', $culture)
        } catch {
            continue
        }

        if ($timestamp -gt $latestTimestamp) {
            $latestTimestamp = $timestamp
            $latestHandoff = $match
        }
    }

    if ($null -ne $latestHandoff) {
        $latestHandoffText = '[{0}] [{1}] -> [{2}]' -f $latestHandoff.Groups['timestamp'].Value, $latestHandoff.Groups['from'].Value, $latestHandoff.Groups['to'].Value
        $syncedValue = Get-LineFieldValue -Text $currentStateText -Label 'Last Synced From Task / Handoff'
        if ($syncedValue) {
            $syncedValue = $syncedValue.Trim().Trim([char]96)
        }
        if ($syncedValue -and $syncedValue -ne $latestHandoffText) {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE handoff sync mismatch. CURRENT_STATE={0} / TASK_LIST={1}' -f $syncedValue, $latestHandoffText)
        }

        if ($latestHandoff.Index -ne $lastHandoff.Index) {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message 'Latest handoff by timestamp is not the last live Handoff Log entry. Append newest delta at the bottom.'
        }

        $handoffSource = Get-LineFieldValue -Text $currentStateText -Label 'Handoff source'
        if ($handoffSource) {
            $expectedBits = @(
                $latestHandoff.Groups['from'].Value,
                $latestHandoff.Groups['timestamp'].Value.Substring(0, 10)
            )
            if (-not (Contains-Any -Text $handoffSource -Patterns $expectedBits)) {
                Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Latest Handoff Summary source may be stale. CURRENT_STATE={0} / TASK_LIST={1}' -f $handoffSource, $latestHandoffText)
            }
        }
    }
}

$lockPattern = '(?m)^\|\s*(?<task>[^|\r\n]+)\|\s*(?<owner>[^|\r\n]+)\|\s*(?<role>[^|\r\n]+)\|\s*(?<started>[^|\r\n]+)\|\s*(?<scope>[^|\r\n]+)\|\s*(?<note>[^|\r\n]+)\|\s*$'
$lockRows = [regex]::Matches($taskListText, $lockPattern) | Where-Object {
    $_.Groups['task'].Value.Trim() -ne 'Task ID' -and
    $_.Groups['task'].Value.Trim() -notmatch '^-+$'
}

$activeLockRows = @($lockRows | Where-Object {
    $_.Groups['task'].Value.Trim() -notin @('없음', 'None') -and
    $_.Groups['started'].Value.Trim() -ne '-'
})

$normalizedScopes = @()
foreach ($row in $lockRows) {
    $scope = Normalize-Scope -Scope $row.Groups['scope'].Value
    if ($scope -and $scope -notmatch '\[') {
        $normalizedScopes += [pscustomobject]@{
            Task = $row.Groups['task'].Value.Trim()
            Scope = $scope
        }
    }
}

for ($i = 0; $i -lt $normalizedScopes.Count; $i++) {
    for ($j = $i + 1; $j -lt $normalizedScopes.Count; $j++) {
        $left = $normalizedScopes[$i]
        $right = $normalizedScopes[$j]
        $isOverlap =
            ($left.Scope -eq $right.Scope) -or
            ($left.Scope.StartsWith($right.Scope + '/')) -or
            ($right.Scope.StartsWith($left.Scope + '/'))

        if ($isOverlap) {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message ('Active lock scope overlap risk: {0}={1} / {2}={3}' -f $left.Task, $left.Scope, $right.Task, $right.Scope)
        }
    }
}

$latestDayWrapUp = $null
$latestDayWrapUpTimestamp = [datetime]::MinValue
foreach ($match in $handoffMatches) {
    if ($match.Groups['from'].Value -ne 'Day Wrap Up') {
        continue
    }

    try {
        $timestamp = [datetime]::ParseExact($match.Groups['timestamp'].Value, 'yyyy-MM-dd HH:mm', $culture)
    } catch {
        continue
    }

    if ($timestamp -gt $latestDayWrapUpTimestamp) {
        $latestDayWrapUpTimestamp = $timestamp
        $latestDayWrapUp = $match
    }
}

if ($null -ne $latestDayWrapUp) {
    $latestDayWrapUpBody = $latestDayWrapUp.Groups['body'].Value
    $nextMatch = [regex]::Match($latestDayWrapUpBody, '(?im)^- (?:\*\*)?Next:(?:\*\*)?\s*(?<value>.+?)\s*$')
    $notesMatch = [regex]::Match($latestDayWrapUpBody, '(?im)^- (?:\*\*)?Notes:(?:\*\*)?\s*(?<value>.+?)\s*$')

    if ($nextMatch.Success) {
        $nextValue = $nextMatch.Groups['value'].Value.Trim()
        if ($nextValue -notmatch '(?:PLN|DSG|DEV|TST|REV|REL|DOC|BACKLOG)-\d+') {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message 'Day Wrap Up handoff Next should include the first Task ID for the next session.'
        }
        if ($nextValue -notmatch '`[^`]+`|[A-Za-z0-9_\-/]+\.md') {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message 'Day Wrap Up handoff Next should include the first document or command in backticks.'
        }
    }

    if ($activeLockRows.Count -gt 0) {
        $notesValue = ''
        if ($notesMatch.Success) {
            $notesValue = $notesMatch.Groups['value'].Value.Trim()
        }

        $mentionsLock = $notesValue -match '(?i)\block\b'
        if (-not $mentionsLock) {
            foreach ($row in $activeLockRows) {
                if ($notesValue.Contains($row.Groups['task'].Value.Trim())) {
                    $mentionsLock = $true
                    break
                }
            }
        }

        if (-not $mentionsLock) {
            Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/TASK_LIST.md' -Message 'Active locks remain, but the latest Day Wrap Up notes do not explain the retained lock or first next action.'
        }
    }
}

$requirementsStatus = Get-LineFieldValue -Text $requirementsText -Label 'Document Status'
$requirementsBaseline = Get-LineFieldValue -Text $requirementsText -Label 'Current Requirement Baseline'
$requirementsSyncStatus = Get-LineFieldValue -Text $requirementsText -Label 'Requirements Sync Status'
$architectureStatus = Get-LineFieldValue -Text $architectureText -Label 'Document Status'
$architectureBaseline = Get-LineFieldValue -Text $architectureText -Label 'Requirement Baseline'
$architectureChangeSync = Get-LineFieldValue -Text $architectureText -Label 'Change Sync Check'
$planStatus = Get-LineFieldValue -Text $implementationPlanText -Label 'Document Status'
$planRequirementBaseline = Get-LineFieldValue -Text $implementationPlanText -Label 'Requirement Baseline'
$planChangeSync = Get-LineFieldValue -Text $implementationPlanText -Label 'Change Sync Check'
$currentRequirementsStatus = Get-LineFieldValue -Text $currentStateText -Label 'Requirements Status'
$currentRequirementBaseline = Get-LineFieldValue -Text $currentStateText -Label 'Requirement Baseline'
$currentRequirementsSync = Get-LineFieldValue -Text $currentStateText -Label 'Requirements Sync Check'
$currentStage = Get-LineFieldValue -Text $currentStateText -Label 'Current Stage'
$currentFocus = Get-LineFieldValue -Text $currentStateText -Label 'Current Focus'
$currentReleaseGoal = Get-LineFieldValue -Text $currentStateText -Label 'Current Release Goal'
$taskListCurrentStage = Get-LineFieldValue -Text $taskListText -Label 'Current Stage'
$taskListCurrentFocus = Get-LineFieldValue -Text $taskListText -Label 'Current Focus'
$taskListCurrentReleaseGoal = Get-LineFieldValue -Text $taskListText -Label 'Current Release Goal'
$currentArchitectureStatus = Get-LineFieldValue -Text $currentStateText -Label 'Architecture Status'
$currentPlanStatus = Get-LineFieldValue -Text $currentStateText -Label 'Plan Status'
$releasePass = Get-LineFieldValue -Text $walkthroughText -Label 'Release Pass'
$walkthroughRequirementBaseline = Get-LineFieldValue -Text $walkthroughText -Label 'Requirement Baseline Tested'
$walkthroughRequirementsSync = Get-LineFieldValue -Text $walkthroughText -Label 'Requirements Sync Check'

if ((Is-ConcreteValue $currentRequirementsStatus) -and $currentRequirementsStatus -eq 'Approved' -and $requirementsStatus -ne 'Approved') {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Requirements status mismatch. CURRENT_STATE={0} / REQUIREMENTS={1}' -f $currentRequirementsStatus, $requirementsStatus)
}
if ((Is-ConcreteValue $currentArchitectureStatus) -and $currentArchitectureStatus -eq 'Approved' -and $architectureStatus -ne 'Approved') {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Architecture status mismatch. CURRENT_STATE={0} / ARCHITECTURE={1}' -f $currentArchitectureStatus, $architectureStatus)
}
if ((Is-ConcreteValue $currentPlanStatus) -and $currentPlanStatus -eq 'Ready for Execution' -and $planStatus -ne 'Ready for Execution') {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Plan status mismatch. CURRENT_STATE={0} / IMPLEMENTATION_PLAN={1}' -f $currentPlanStatus, $planStatus)
}

if ((Is-ConcreteValue $currentStage) -and (Is-ConcreteValue $taskListCurrentStage) -and $currentStage -ne $taskListCurrentStage) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Current stage mismatch. CURRENT_STATE={0} / TASK_LIST={1}' -f $currentStage, $taskListCurrentStage)
}
if ((Is-ConcreteValue $currentFocus) -and (Is-ConcreteValue $taskListCurrentFocus) -and $currentFocus -ne $taskListCurrentFocus) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Current focus mismatch. CURRENT_STATE={0} / TASK_LIST={1}' -f $currentFocus, $taskListCurrentFocus)
}
if ((Is-ConcreteValue $currentReleaseGoal) -and (Is-ConcreteValue $taskListCurrentReleaseGoal) -and $currentReleaseGoal -ne $taskListCurrentReleaseGoal) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Current release goal mismatch. CURRENT_STATE={0} / TASK_LIST={1}' -f $currentReleaseGoal, $taskListCurrentReleaseGoal)
}

if ($requirementsStatus -eq 'Approved' -and -not (Is-ConcreteValue $requirementsBaseline)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REQUIREMENTS.md' -Message 'REQUIREMENTS is Approved but Current Requirement Baseline is not concrete.'
}
if ($architectureStatus -eq 'Approved' -and -not (Is-ConcreteValue $architectureBaseline)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message 'ARCHITECTURE_GUIDE is Approved but Requirement Baseline is not concrete.'
}
if ($planStatus -eq 'Ready for Execution' -and -not (Is-ConcreteValue $planRequirementBaseline)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message 'IMPLEMENTATION_PLAN is Ready for Execution but Requirement Baseline is not concrete.'
}

if ((Is-ConcreteValue $currentRequirementBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $currentRequirementBaseline -ne $requirementsBaseline) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Requirement baseline mismatch. CURRENT_STATE={0} / REQUIREMENTS={1}' -f $currentRequirementBaseline, $requirementsBaseline)
}

if ((Is-ConcreteValue $requirementsSyncStatus) -and $requirementsSyncStatus -eq 'In Sync') {
    if ((Is-ConcreteValue $currentRequirementsSync) -and $currentRequirementsSync -ne 'In Sync') {
        Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('REQUIREMENTS sync is In Sync but CURRENT_STATE Requirements Sync Check={0}.' -f $currentRequirementsSync)
    }
    if ((Is-ConcreteValue $architectureBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $architectureBaseline -ne $requirementsBaseline) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message ('Architecture baseline mismatch. ARCHITECTURE={0} / REQUIREMENTS={1}' -f $architectureBaseline, $requirementsBaseline)
    }
    if ((Is-ConcreteValue $planRequirementBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $planRequirementBaseline -ne $requirementsBaseline) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message ('Plan baseline mismatch. IMPLEMENTATION_PLAN={0} / REQUIREMENTS={1}' -f $planRequirementBaseline, $requirementsBaseline)
    }
    if ((Is-ConcreteValue $architectureChangeSync) -and @('Synced', 'No Architecture Change') -notcontains $architectureChangeSync) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message ('REQUIREMENTS sync is In Sync but Architecture Change Sync Check={0}.' -f $architectureChangeSync)
    }
    if ((Is-ConcreteValue $planChangeSync) -and $planChangeSync -ne 'Synced') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message ('REQUIREMENTS sync is In Sync but Plan Change Sync Check={0}.' -f $planChangeSync)
    }
}

$requirementsPlaceholders = @(
    $placeholderScope,
    $placeholderRequirement,
    $placeholderAcceptance
)
if ($requirementsStatus -eq 'Approved' -and (Contains-Any -Text $requirementsText -Patterns $requirementsPlaceholders)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REQUIREMENTS.md' -Message 'REQUIREMENTS is Approved but still contains placeholders.'
}

$planPlaceholders = @(
    $planPlaceholderTask,
    $planPlaceholderRisk,
    $planPlaceholderImpact,
    $planPlaceholderResponse
)
if ($planStatus -eq 'Ready for Execution' -and (Contains-Any -Text $implementationPlanText -Patterns $planPlaceholders)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message 'IMPLEMENTATION_PLAN is Ready for Execution but still contains placeholders.'
}

$approvedRequirementIds = [regex]::Matches($requirementsText, '(?m)^\|\s*(?<id>(?:FR|NFR)-\d+)\s*\|\s*(?<req>[^|\r\n]+)\|') |
    Where-Object { $_.Groups['req'].Value -notmatch '\[' } |
    ForEach-Object { $_.Groups['id'].Value } |
    Select-Object -Unique

if ($planStatus -eq 'Ready for Execution' -and $approvedRequirementIds.Count -gt 0) {
    foreach ($reqId in $approvedRequirementIds) {
        if (-not $implementationPlanText.Contains($reqId) -and -not $taskListText.Contains($reqId)) {
            Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message ('Approved requirement is not traceable in plan or task list: {0}' -f $reqId)
        }
    }
}

$readyToDeploy = Get-LineFieldValue -Text $deploymentPlanText -Label 'Ready to Deploy'
$deploymentRequirementBaseline = Get-LineFieldValue -Text $deploymentPlanText -Label 'Requirement Baseline for Release'
$deploymentRequirementsGate = Get-LineFieldValue -Text $deploymentPlanText -Label 'Requirements Sync Gate'
$reviewerGate = Get-LineFieldValue -Text $deploymentPlanText -Label 'Reviewer Gate'
$manualGate = Get-LineFieldValue -Text $deploymentPlanText -Label 'Manual / Environment Gate'
$dependencyGate = Get-LineFieldValue -Text $deploymentPlanText -Label 'Dependency / Compliance Gate'
$reviewStatus = Get-LineFieldValue -Text $reviewReportText -Label 'Static Review Status'
$reviewReadiness = Get-LineFieldValue -Text $reviewReportText -Label 'Release Readiness'
$reviewRequirementBaseline = Get-LineFieldValue -Text $reviewReportText -Label 'Requirement Baseline Reviewed'
$reviewRequirementsSync = Get-LineFieldValue -Text $reviewReportText -Label 'Requirements Sync Check'
$currentReviewGate = Get-LineFieldValue -Text $currentStateText -Label 'Review Gate'

if ((Is-ConcreteValue $reviewReadiness) -and $reviewReadiness -eq 'Ready') {
    if ($reviewRequirementsSync -ne 'Pass') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('Release Readiness=Ready but Requirements Sync Check={0}.' -f $reviewRequirementsSync)
    }
    if ((Is-ConcreteValue $reviewRequirementBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $reviewRequirementBaseline -ne $requirementsBaseline) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('Review baseline mismatch. REVIEW_REPORT={0} / REQUIREMENTS={1}' -f $reviewRequirementBaseline, $requirementsBaseline)
    }
}

if ((Is-ConcreteValue $releasePass) -and $releasePass -eq 'Yes') {
    if ($walkthroughRequirementsSync -ne 'Pass') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/WALKTHROUGH.md' -Message ('Release Pass=Yes but Requirements Sync Check={0}.' -f $walkthroughRequirementsSync)
    }
    if ((Is-ConcreteValue $walkthroughRequirementBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $walkthroughRequirementBaseline -ne $requirementsBaseline) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/WALKTHROUGH.md' -Message ('Walkthrough baseline mismatch. WALKTHROUGH={0} / REQUIREMENTS={1}' -f $walkthroughRequirementBaseline, $requirementsBaseline)
    }
}

if ((Is-ConcreteValue $requirementsSyncStatus) -and $requirementsSyncStatus -ne 'In Sync') {
    if ($reviewRequirementsSync -eq 'Pass') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('REQUIREMENTS sync is {0} but REVIEW_REPORT Requirements Sync Check=Pass.' -f $requirementsSyncStatus)
    }
    if ($walkthroughRequirementsSync -eq 'Pass') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/WALKTHROUGH.md' -Message ('REQUIREMENTS sync is {0} but WALKTHROUGH Requirements Sync Check=Pass.' -f $requirementsSyncStatus)
    }
    if ($deploymentRequirementsGate -eq 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('REQUIREMENTS sync is {0} but Requirements Sync Gate=Closed.' -f $requirementsSyncStatus)
    }
    if ((Is-ConcreteValue $currentRequirementsSync) -and $currentRequirementsSync -eq 'In Sync') {
        Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('REQUIREMENTS sync is {0} but CURRENT_STATE Requirements Sync Check=In Sync.' -f $requirementsSyncStatus)
    }
}

if ((Is-ConcreteValue $readyToDeploy) -and $readyToDeploy -eq 'Yes') {
    if ($reviewStatus -ne 'Approved') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('Ready to Deploy=Yes but Static Review Status={0}.' -f $reviewStatus)
    }
    if ($reviewReadiness -ne 'Ready') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('Ready to Deploy=Yes but Release Readiness={0}.' -f $reviewReadiness)
    }
    if ($deploymentRequirementsGate -ne 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('Ready to Deploy=Yes but Requirements Sync Gate={0}.' -f $deploymentRequirementsGate)
    }
    if ($reviewerGate -ne 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('Ready to Deploy=Yes but Reviewer Gate={0}.' -f $reviewerGate)
    }
    if ($manualGate -ne 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('Ready to Deploy=Yes but Manual / Environment Gate={0}.' -f $manualGate)
    }
    if ($dependencyGate -ne 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('Ready to Deploy=Yes but Dependency / Compliance Gate={0}.' -f $dependencyGate)
    }
    if ($requirementsSyncStatus -ne 'In Sync') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REQUIREMENTS.md' -Message ('Ready to Deploy=Yes but Requirements Sync Status={0}.' -f $requirementsSyncStatus)
    }
    if ((Is-ConcreteValue $deploymentRequirementBaseline) -and (Is-ConcreteValue $requirementsBaseline) -and $deploymentRequirementBaseline -ne $requirementsBaseline) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('Deployment baseline mismatch. DEPLOYMENT_PLAN={0} / REQUIREMENTS={1}' -f $deploymentRequirementBaseline, $requirementsBaseline)
    }
    if ((Is-ConcreteValue $currentReviewGate) -and $currentReviewGate -ne 'Closed') {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Ready to Deploy=Yes but CURRENT_STATE Review Gate={0}.' -f $currentReviewGate)
    }
}

if (-not $workspaceText.Contains('replace-in-place snapshot')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the replace-in-place snapshot rule.'
}
if (-not $workspaceText.Contains('check_harness_docs.ps1')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the validator execution rule.'
}
if (-not $workspaceText.Contains('Requirement Trace')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the Requirement Trace rule.'
}
if (-not $workspaceText.Contains('REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the mandatory 3-document requirement-change sync rule.'
}
if (-not $workspaceText.Contains('manual gate pending') -or -not $workspaceText.Contains('user decision pending')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing stale-lock stop tokens.'
}

if (-not $planWorkflowText.Contains($planQuestionPhrase)) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the user-question-first rule.'
}
if (-not $planWorkflowText.Contains('Requirement Trace')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the Requirement Trace rule.'
}
if (-not $planWorkflowText.Contains('Task Packet Ledger')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the task packet rule.'
}
if (-not $planWorkflowText.Contains('No Architecture Change')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the architecture-sync acknowledgement rule.'
}
if (-not $reviewWorkflowText.Contains('code_review_checklist')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/review.md' -Message 'review.md is missing the code_review_checklist skill reference.'
}
if (-not $reviewWorkflowText.Contains('dependency_audit')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/review.md' -Message 'review.md is missing the dependency_audit skill reference.'
}
if (-not $reviewWorkflowText.Contains('ARCHITECTURE_GUIDE.md') -or -not $reviewWorkflowText.Contains('Requirement Baseline Reviewed')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/review.md' -Message 'review.md is missing the requirement-baseline cross-check rule.'
}
if (-not $reviewWorkflowText.Contains('Green Level Reviewed') -or -not $reviewWorkflowText.Contains('Branch Freshness Reviewed')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/review.md' -Message 'review.md is missing the green-level or branch-freshness review rule.'
}
if (-not $testWorkflowText.Contains('expo_real_device_test')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the expo_real_device_test skill reference.'
}
if (-not $testWorkflowText.Contains('User Report Alignment Check')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user report alignment step.'
}
if (
    (-not $testWorkflowText.Contains('Observed Results')) -or
    (-not $testWorkflowText.Contains('Requested Follow-up')) -or
    (-not $testWorkflowText.Contains('Needs Clarification'))
) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user report alignment buckets.'
}
if (-not $testWorkflowText.Contains('Please confirm whether my understanding is correct.')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user confirmation prompt.'
}
if (-not $testWorkflowText.Contains('Needs Clarification')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the no-response clarification rule.'
}
if (-not $testWorkflowText.Contains('Requirement Baseline Tested') -or -not $testWorkflowText.Contains('Requirements Sync Check')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the requirement-baseline test sync rule.'
}
if (-not $testWorkflowText.Contains('Green Level Achieved') -or -not $testWorkflowText.Contains('Branch Freshness')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the green-level or branch-freshness test rule.'
}
if (-not $testWorkflowText.Contains('User-Captured Manual Test Report')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user-captured manual test synthesis rule.'
}
if (-not $handoffWorkflowText.Contains('check_harness_docs.ps1')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/handoff.md' -Message 'handoff.md is missing the validator step.'
}
if (-not $handoffWorkflowText.Contains('Requirement Baseline')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/handoff.md' -Message 'handoff.md is missing the requirement-baseline stale check.'
}
if (-not $handoffWorkflowText.Contains('First Action')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/handoff.md' -Message 'handoff.md is missing the first-action resume rule.'
}
if (
    (-not $deployWorkflowText.Contains('Release Pass')) -or
    (-not $deployWorkflowText.Contains('Reviewer Gate')) -or
    (-not $deployWorkflowText.Contains('ARCHITECTURE_GUIDE.md')) -or
    (-not $deployWorkflowText.Contains('Requirement Baseline for Release'))
) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/deploy.md' -Message 'deploy.md is missing cross-gate release checks.'
}
if (-not $deployWorkflowText.Contains('green level') -or -not $deployWorkflowText.Contains('branch freshness')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/deploy.md' -Message 'deploy.md is missing the green-level or branch-freshness preflight rule.'
}
if (-not $expoDeviceSkillText.Contains('User Report Alignment Check')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the user report alignment step.'
}
if (-not $expoDeviceSkillText.Contains('Please confirm whether my understanding is correct.')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the user confirmation prompt.'
}
if (-not $expoDeviceSkillText.Contains('Needs Clarification')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the no-response clarification rule.'
}
if (-not $expoDeviceSkillText.Contains('User Test Results')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the user raw result template.'
}
if (-not $architectureText.Contains('## Requirement Change Sync')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message 'ARCHITECTURE_GUIDE is missing the Requirement Change Sync section.'
}

$errors = @($findings | Where-Object { $_.Severity -eq 'ERROR' })
$warnings = @($findings | Where-Object { $_.Severity -eq 'WARNING' })

if ($findings.Count -eq 0) {
    Write-Output 'PASS: harness docs look consistent.'
    exit 0
}

foreach ($finding in $findings) {
    Write-Output ('{0}: {1} - {2}' -f $finding.Severity, $finding.Path, $finding.Message)
}

Write-Output ('SUMMARY: {0} error(s), {1} warning(s)' -f $errors.Count, $warnings.Count)

if ($errors.Count -gt 0) {
    exit 1
}

exit 0
