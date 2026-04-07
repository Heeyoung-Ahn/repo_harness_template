# Current State

> 모든 Agent의 기본 진입 라우터입니다.  
> `day_start`는 이 문서를 resume router로 사용하고, task / lock의 실제 기준은 항상 `TASK_LIST.md`에서 다시 확인합니다.

## Maintenance Rules
- 이 문서는 가능하면 120줄 이하, 800단어 이하로 유지합니다.
- dated `Update` 블록을 누적하지 말고, 항상 최신 snapshot 1개만 replace-in-place로 유지합니다.
- 작업 중 turn-by-turn 상태 갱신은 이 문서에서만 관리합니다.
- `TASK_LIST.md > ## Handoff Log`는 역할 전환, 세션 종료, lock handoff 때만 추가합니다.
- `REVIEW_REPORT.md`는 리뷰가 끝났을 때 1회, `DEPLOYMENT_PLAN.md`는 배포 직전/직후 1회만 갱신합니다.
- artifact harness 오류와 release blocker는 같은 것으로 취급하지 않고, 필요한 경우 별도 maintenance follow-up으로 올립니다.
- `Must Read Next`에는 지금 실제로 필요한 문서와 섹션만 적습니다.
- `Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`은 `TASK_LIST.md > Current Release Target`과 같은 값으로 유지합니다.
- 상세 문서와 요약이 충돌하면 상세 문서가 우선이며, 즉시 이 문서를 고칩니다.
- rules / workflows / artifacts를 수정했다면 handoff 전에 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행합니다.
- 오래된 Handoff 원문은 `HANDOFF_ARCHIVE.md`로 이동하고, 여기에는 live summary만 남깁니다.
- `Latest Handoff Summary`는 최신 delta만 남기고, `Task Pointers`와 `Recent History Summary`에 같은 원문을 반복 복사하지 않습니다.
- 이 문서는 진입 라우터이며, 요구사항 / 아키텍처 / 구현 계획 / 테스트 계약 자체를 대체하지 않습니다.
- `Last Updated By / At`는 실제 마지막 갱신 주체와 시각으로 즉시 덮어씁니다.

## Snapshot
- Version / Milestone: Hybrid Harness Completion
- Current Stage: Planning and Architecture
- Current Focus: `CR-03 Hybrid Harness Completion` draft를 approval-ready 수준으로 정리하고, rollout-ready completion 범위와 defer policy를 고정한다
- Current Release Goal: self-hosting 템플릿 안에서 hybrid harness를 완성본 수준으로 마무리하고, operating-project rollout은 completion gate가 닫힌 뒤에만 연다
- Requirements Status: Draft
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: Needs Re-Approval
- Architecture Status: Draft
- Plan Status: Draft
- Review Gate: Not Started
- Manual / Environment Gate: Not Started
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-07 DOC-05 closeout completed
- Sync Checked At: 2026-04-07
- Task List Sync Check: In Sync
- Document Health: `v0.3` snapshot을 `.agents/artifacts/archive/releases/v0.3/`에 보관했고 reset 후 `CR-03` draft starter content를 채웠다
- Last Updated By / At: Codex / 2026-04-07 14:53

## Next Recommended Agent
- Recommended role: Planner
- Reason: 현재 남은 첫 작업은 `CR-03 Hybrid Harness Completion` 요구사항 초안 정리와 approval-ready baseline 고정이다.
- Trigger to switch: requirement/architecture draft가 정리되고 implementation task packet으로 넘어갈 때

## Must Read Next
- 1. `.agents/artifacts/REQUIREMENTS.md > Quick Read + Pending Change Requests`
- 2. `.agents/artifacts/ARCHITECTURE_GUIDE.md > Quick Read + Requirement Change Sync`
- 3. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + Task Packet Ledger`
- Optional follow-up: `.agents/rules/template_repo.md`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/artifacts/{REQUIREMENTS.md,ARCHITECTURE_GUIDE.md,IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md}`, `.omx/README.md`, `.agents/runtime/{team.json,governance_controls.json}`, `tools/project-monitor-web/*`, `templates_starter/*`, `templates/version_reset/artifacts/*`
- Current locks to respect: none
- Worktree recommendation: 다음 턴에서는 planning sync에만 집중하고, actual rollout이나 operating-project mutation은 completion gate가 닫힐 때까지 열지 않는다

## Task Pointers
- `PLN-01`: `CR-03` requirement draft와 rollout defer policy를 먼저 고정한다.
- `PLN-02`: hybrid runtime reference / governed fixture / monitor visibility boundary를 architecture에 동기화한다.
- `PLN-03`: rollout-ready completion을 위한 task packet과 acceptance gate를 implementation plan에 고정한다.

## Open Decisions / Blockers
- Release blocker: none for planning kickoff
- Manual / environment-specific blocker: none
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: `CR-03` draft 승인
- 기술 블로커: none
- Document / harness maintenance: current version closeout은 끝났고, next-version artifact seed도 완료됐다
- Stale lock watch: none
- Needs User Decision: `Hybrid Harness Completion v0.1` draft approval

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-07 14:53
- Completed: `Scalable Governance Profiles v0.3` snapshot을 archive했고 reset source로 artifact를 초기화한 뒤 `Hybrid Harness Completion` draft를 열었다. local preview는 closeout 전에 정리했고 rollout은 완성본 이후로 defer하기로 결정했다.
- Next: Planner가 `CR-03` draft를 approval-ready 수준으로 정리한 뒤 architecture / implementation plan을 같은 baseline으로 맞춘다.
- First Next Action: `REQUIREMENTS.md > Pending Change Requests`와 `Quick Read`를 먼저 읽고 `PLN-01`을 닫는다.
- Notes: operating-project rollout은 현재 버전 범위 밖이다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.2`에서 profile/schema/parser/monitor Phase 1 baseline을 고정했다.
- 2026-04-07: `v0.3`에서 enterprise-governed pack, `governance_controls.json`, optional `.omx` compatibility를 standard source에 반영했다.
- 2026-04-07: developer PC preview bring-up과 `CR-02` follow-up review를 완료한 뒤 `v0.3`를 archive하고 새 버전 draft를 열었다.
