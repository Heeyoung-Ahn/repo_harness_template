[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$TaskId,
    [Parameter(Mandatory = $true)][string]$Prompt,
    [ValidateSet('safe-auto', 'remote-choice', 'hard-block')][string]$DecisionClass = 'remote-choice',
    [string[]]$Options = @('approve', 'hold', 'reject'),
    [string]$Context,
    [string]$ProjectName,
    [string]$DecisionId,
    [string]$DefaultAction = 'hold',
    [int]$LocalResponseGraceMinutes = 10,
    [string]$RuntimeHome,
    [string]$OpenedBy
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'approval_common.ps1')

$repoRoot = Resolve-HarnessRepoRoot
if ([string]::IsNullOrWhiteSpace($ProjectName)) {
    $ProjectName = Split-Path -Leaf $repoRoot
}
if ([string]::IsNullOrWhiteSpace($DecisionId)) {
    $DecisionId = New-HarnessDecisionId
}
if ([string]::IsNullOrWhiteSpace($OpenedBy)) {
    $OpenedBy = '{0}@{1}' -f $env:USERNAME, $env:COMPUTERNAME
}

$presence = Get-HarnessPresenceState -RuntimeHome $RuntimeHome
$statePath = Get-HarnessApprovalStatePath -RepoRoot $repoRoot -DecisionId $DecisionId

if ($DecisionClass -eq 'safe-auto') {
    [pscustomobject]@{
        status         = 'auto_apply'
        decision_class = 'safe-auto'
        decision_id    = $DecisionId
        task_id        = $TaskId
        presence_mode  = $presence.mode
        repo_root      = $repoRoot
        note           = 'Apply the safe maintenance directly and summarize the outcome afterward.'
    }
    return
}

if ($DecisionClass -eq 'hard-block') {
    $state = [ordered]@{
        version        = 1
        status         = 'blocked_local'
        decision_class = 'hard-block'
        task_id        = $TaskId
        decision_id    = $DecisionId
        prompt         = $Prompt
        context        = $Context
        project_name   = $ProjectName
        options        = @(Convert-HarnessOptions -OptionValues $Options)
        default_action = $DefaultAction
        delivery_mode  = 'never'
        presence_mode  = $presence.mode
        repo_root      = $repoRoot
        opened_by      = $OpenedBy
        state_path     = $statePath
        created_at     = Get-HarnessTimestamp
        updated_at     = Get-HarnessTimestamp
    }

    Write-HarnessJson -Path $statePath -Value $state
    [pscustomobject]$state
    return
}

$deliveryMode = if ($presence.mode -eq 'away') { 'always' } else { 'local-first' }
$invokeScript = Join-Path $PSScriptRoot 'invoke_user_gate.ps1'
$invokeParams = @{
    TaskId                    = $TaskId
    Prompt                    = $Prompt
    Options                   = $Options
    ProjectName               = $ProjectName
    DecisionId                = $DecisionId
    DefaultAction             = $DefaultAction
    DeliveryMode              = $deliveryMode
    LocalResponseGraceMinutes = $LocalResponseGraceMinutes
}

if ($PSBoundParameters.ContainsKey('Context')) {
    $invokeParams['Context'] = $Context
}

& $invokeScript @invokeParams | Out-Null
$state = Read-HarnessJson -Path $statePath
if ($null -eq $state) {
    throw "Expected approval state at '$statePath' after invoke_user_gate execution."
}

$state.decision_class = 'remote-choice'
$state.presence_mode = $presence.mode
$state.repo_root = $repoRoot
$state.opened_by = $OpenedBy
$state.watcher_managed = $true
$state.updated_at = Get-HarnessTimestamp

Write-HarnessJson -Path $statePath -Value $state
[pscustomobject]$state
