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
- `Latest Handoff Summary`는 최신 delta만 남기고, `Task Pointers`와 `Recent History Summary`에 같은 원문을 반복 복사하지 않습니다.
- `Last Updated By / At`는 실제 마지막 갱신 주체와 시각으로 즉시 덮어씁니다.

## Snapshot
- Version / Milestone: Hybrid Harness Completion
- Current Stage: Development and Test Loop
- Current Focus: `CR-06` sync는 끝났다. 다음은 `DEV-01`, `DEV-02`, `TST-01`, `REV-01` / `REV-02`, `REL-01` / `REL-02`다
- Current Release Goal: self-hosting 템플릿 안에서 hybrid harness를 완성하고, rollout은 completion gate가 닫힌 뒤에만 연다
- Requirements Status: Approved
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: In Sync
- Architecture Status: Approved (`CR-06` synced)
- Plan Status: Active (`PLN-09` synced, `TST-02` completed)
- Review Gate: Not Started
- Manual / Environment Gate: Not Started
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-08 13:30 handoff
- Sync Checked At: 2026-04-08 13:30
- Task List Sync Check: In Sync
- Document Health: `CR-06` sync를 마쳤다. 다음은 `DEV-01`, `DEV-02`, `TST-01`, `REV-01` / `REV-02`, `REL-01` / `REL-02`다
- Last Updated By / At: Codex / 2026-04-08 13:30

## Next Recommended Agent
- Recommended role: Developer
- Reason: `PLN-09` sync가 끝났고, 다음 병목은 `DEV-01`, `DEV-02`다.
- Trigger to switch: `DEV-01`, `DEV-02`가 끝나면 Tester가 `TST-01`을 닫고, 그 다음 Reviewer / DevOps가 `REV-01` / `REV-02`, `REL-01` / `REL-02`를 이어간다.

## Must Read Next
- 1. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + Task Packet Ledger + Validation Gates`
- 2. `.agents/artifacts/TASK_LIST.md > TST-02 + REV-01/REV-02 + REL-01/REL-02 + latest handoff`
- 3. `.agents/artifacts/DEPLOYMENT_PLAN.md > Quick Read + Preflight Checklist + Validation Gate Notes`
- Optional follow-up: `.agents/rules/template_repo.md`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: `DEV-01`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Relevant paths / modules: `.agents/artifacts/{IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md,DEPLOYMENT_PLAN.md}`, `tools/project-monitor-web/*`
- Current locks to respect: none
- Worktree recommendation: local preview / review / deploy evidence만 진행하고 actual rollout은 completion gate 전까지 열지 않는다

## Task Pointers
- `PLN-09`: completed. `CR-06` browser-based web test contract를 live/starter/reset baseline에 동기화했다.
- `DEV-06`: completed. shared skill mirror, governance contract, PMW risk signal을 반영했다.
- `TST-03`: completed. root/starter validator, PMW test, Korean mojibake check를 통과했다.
- `TST-02`: completed. loopback bind, static asset, API allow/block, decision packet/history/risk signal, `WhatIf` dry-run 경로를 확인했다.
- `DEV-01`, `DEV-02`, `TST-01`: pending. `TST-02` 뒤 completion path의 다음 묶음이다.

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: none
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: none
- Document / harness maintenance: `CR-06` sync는 닫혔다. 이후 `DEV-01 -> DEV-02 -> TST-01 -> REV/REL`을 이어간다

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-08 13:30
- Completed: `PLN-09`로 웹앱 / browser-facing UI scope의 browser-based test contract를 live/starter/reset baseline과 current release deploy gate에 동기화했다.
- Next: Developer가 `DEV-01`, `DEV-02`를 수행하고, 이후 Tester가 `TST-01`을 닫는다. 그 다음 Reviewer / DevOps가 `REV-01` / `REV-02`, `REL-01` / `REL-02`를 이어간다.
- First Next Action: `.omx/README.md`와 governed pack source, validator contract를 다시 읽고 `DEV-01`, `DEV-02` 최소 baseline을 구현한다.
- Notes: active lock은 없다. user는 local PMW를 브라우저에서 보며 후속 UI 코멘트를 줄 수 있고, operating-project rollout은 현재 버전 범위 밖이며 `REL-03` 전에는 열지 않는다.

## Recent History Summary
- 2026-04-08: PMW 승인본에 `Project History` view, project selector, launcher icon, stop icon, top-bar `Exit`를 포함했다.
- 2026-04-08: `CR-04` 승인 후 approval queue decision packet view와 PMW workspace 구현을 live code에 반영했다.
- 2026-04-08: `PLN-04`로 completion gate와 rollout entry criteria를 `DEPLOYMENT_PLAN.md`까지 고정했다.
- 2026-04-08: `CR-05` 승인 후 task packet context contract, recurrence gate, AI-specific review checklist, optional guardrail field, PMW risk signal을 반영하고 회귀 검증까지 마쳤다.
- 2026-04-08: `CR-06` 승인 후 웹앱 / browser-facing UI scope의 브라우저 기반 테스트 규칙을 live/starter/reset baseline에 반영했다.
