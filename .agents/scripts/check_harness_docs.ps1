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
    $pattern = '(?m)^- {0}:\s*(?<value>.+?)\s*$' -f $escapedLabel
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
}

foreach ($entry in $pathMap.GetEnumerator()) {
    if (-not (Test-Path -LiteralPath $entry.Value)) {
        Add-Finding -Severity 'ERROR' -Path $entry.Value -Message 'Missing required harness document.'
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

$wordCount = ([regex]::Matches($currentStateText, '\S+')).Count
if ($currentStateLines.Count -gt 120) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE exceeds line limit: {0} lines.' -f $currentStateLines.Count)
}
if ($wordCount -gt 800) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('CURRENT_STATE exceeds word limit: {0} words.' -f $wordCount)
}
if ([regex]::IsMatch($currentStateText, '(?m)^## \d{4}-\d{2}-\d{2}\b')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message 'CURRENT_STATE still contains dated update blocks.'
}

foreach ($section in @(
    '## Snapshot',
    '## Next Recommended Agent',
    '## Must Read Next',
    '## Required Skills',
    '## Active Scope',
    '## Task Pointers',
    '## Open Decisions / Blockers',
    '## Latest Handoff Summary',
    '## Recent History Summary'
)) {
    if (-not $currentStateText.Contains($section)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Missing required CURRENT_STATE section: {0}' -f $section)
    }
}

foreach ($requiredField in @(
    'Review Gate',
    'Requirement Baseline',
    'Requirements Sync Check',
    $labelUserConfirmPending
)) {
    if (-not $currentStateText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/CURRENT_STATE.md' -Message ('Missing required CURRENT_STATE field: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Current Requirement Baseline',
    'Requirements Sync Status',
    'Last Requirement Change At',
    '## Change Control Rules',
    '## Approved Change Log'
)) {
    if (-not $requirementsText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REQUIREMENTS.md' -Message ('REQUIREMENTS is missing required field or section: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline',
    'Change Sync Check',
    'Last Requirement Sync At',
    '## Requirement Change Sync'
)) {
    if (-not $architectureText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message ('ARCHITECTURE_GUIDE is missing required field or section: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline',
    'Change Sync Check',
    '## Requirement Change Impact'
)) {
    if (-not $implementationPlanText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message ('IMPLEMENTATION_PLAN is missing required field or section: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline Tested',
    'Requirements Sync Check'
)) {
    if (-not $walkthroughText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/WALKTHROUGH.md' -Message ('WALKTHROUGH is missing required field: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline Reviewed',
    'Requirements Sync Check'
)) {
    if (-not $reviewReportText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/REVIEW_REPORT.md' -Message ('REVIEW_REPORT is missing required field: {0}' -f $requiredField)
    }
}

foreach ($requiredField in @(
    'Requirement Baseline for Release',
    'Requirements Sync Gate'
)) {
    if (-not $deploymentPlanText.Contains($requiredField)) {
        Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message ('DEPLOYMENT_PLAN is missing required field: {0}' -f $requiredField)
    }
}

$handoffPattern = '(?m)^### \[(?<timestamp>[^\]]+)\] \[(?<from>[^\]]+)\] -> \[(?<to>[^\]]+)\]$'
$handoffMatches = [regex]::Matches($taskListText, $handoffPattern)
if ($handoffMatches.Count -gt 0) {
    $latestHandoff = $null
    $latestTimestamp = [datetime]::MinValue

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
    }
}

$lockPattern = '(?m)^\|\s*(?<task>[^|\r\n]+)\|\s*(?<owner>[^|\r\n]+)\|\s*(?<role>[^|\r\n]+)\|\s*(?<started>[^|\r\n]+)\|\s*(?<scope>[^|\r\n]+)\|\s*(?<note>[^|\r\n]+)\|\s*$'
$lockRows = [regex]::Matches($taskListText, $lockPattern) | Where-Object {
    $_.Groups['task'].Value.Trim() -ne 'Task ID' -and
    $_.Groups['task'].Value.Trim() -notmatch '^-+$'
}

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

if (-not $deploymentPlanText.Contains('Reviewer Gate:')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/DEPLOYMENT_PLAN.md' -Message 'DEPLOYMENT_PLAN is missing the Reviewer Gate field.'
}

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
    Add-Finding -Severity 'ERROR' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the replace-in-place snapshot rule.'
}
if (-not $workspaceText.Contains('check_harness_docs.ps1')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the validator execution rule.'
}
if (-not $workspaceText.Contains('Requirement Trace')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the Requirement Trace rule.'
}
if (-not $workspaceText.Contains('REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing the mandatory 3-document requirement-change sync rule.'
}
if (-not $workspaceText.Contains('manual gate pending') -or -not $workspaceText.Contains('user decision pending')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/rules/workspace.md' -Message 'workspace.md is missing stale-lock stop tokens.'
}

if (-not $planWorkflowText.Contains($planQuestionPhrase)) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the user-question-first rule.'
}
if (-not $planWorkflowText.Contains('Requirement Trace')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the Requirement Trace rule.'
}
if (-not $planWorkflowText.Contains('No Architecture Change')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/plan.md' -Message 'plan.md is missing the architecture-sync acknowledgement rule.'
}
if (-not $reviewWorkflowText.Contains('code_review_checklist')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/review.md' -Message 'review.md is missing the code_review_checklist skill reference.'
}
if (-not $reviewWorkflowText.Contains('dependency_audit')) {
    Add-Finding -Severity 'WARNING' -Path '.agents/workflows/review.md' -Message 'review.md is missing the dependency_audit skill reference.'
}
if (-not $reviewWorkflowText.Contains('ARCHITECTURE_GUIDE.md') -or -not $reviewWorkflowText.Contains('Requirement Baseline Reviewed')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/review.md' -Message 'review.md is missing the requirement-baseline cross-check rule.'
}
if (-not $testWorkflowText.Contains('expo_real_device_test')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the expo_real_device_test skill reference.'
}
if (-not $testWorkflowText.Contains('User Report Alignment Check')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user report alignment step.'
}
if (
    (-not $testWorkflowText.Contains('Observed Results')) -or
    (-not $testWorkflowText.Contains('Requested Follow-up')) -or
    (-not $testWorkflowText.Contains('Needs Clarification'))
) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user report alignment buckets.'
}
if (-not $testWorkflowText.Contains('Please confirm whether my understanding is correct.')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the user confirmation prompt.'
}
if (-not $testWorkflowText.Contains('Needs Clarification')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the no-response clarification rule.'
}
if (-not $testWorkflowText.Contains('Requirement Baseline Tested') -or -not $testWorkflowText.Contains('Requirements Sync Check')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/test.md' -Message 'test.md is missing the requirement-baseline test sync rule.'
}
if (-not $handoffWorkflowText.Contains('check_harness_docs.ps1')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/handoff.md' -Message 'handoff.md is missing the validator step.'
}
if (-not $handoffWorkflowText.Contains('Requirement Baseline')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/handoff.md' -Message 'handoff.md is missing the requirement-baseline stale check.'
}
if (
    (-not $deployWorkflowText.Contains('Release Pass')) -or
    (-not $deployWorkflowText.Contains('Reviewer Gate')) -or
    (-not $deployWorkflowText.Contains('ARCHITECTURE_GUIDE.md')) -or
    (-not $deployWorkflowText.Contains('Requirement Baseline for Release'))
) {
    Add-Finding -Severity 'ERROR' -Path '.agents/workflows/deploy.md' -Message 'deploy.md is missing cross-gate release checks.'
}
if (-not $expoDeviceSkillText.Contains('User Report Alignment Check')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the user report alignment step.'
}
if (-not $expoDeviceSkillText.Contains('Please confirm whether my understanding is correct.')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the user confirmation prompt.'
}
if (-not $expoDeviceSkillText.Contains('Needs Clarification')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/skills/expo_real_device_test/SKILL.md' -Message 'Expo Real Device Test skill is missing the no-response clarification rule.'
}
if (-not $implementationPlanText.Contains('## Requirement Trace')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/IMPLEMENTATION_PLAN.md' -Message 'IMPLEMENTATION_PLAN is missing the Requirement Trace section.'
}
if (-not $architectureText.Contains('## Requirement Change Sync')) {
    Add-Finding -Severity 'ERROR' -Path '.agents/artifacts/ARCHITECTURE_GUIDE.md' -Message 'ARCHITECTURE_GUIDE is missing the Requirement Change Sync section.'
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
