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
- Current Focus: `PLN-04`로 completion gate와 rollout entry criteria를 deployment 문서까지 고정했다. 다음 단계는 `TST-02` preview regression, `REV-01` / `REV-02` review closure, `REL-01` / `REL-02` evidence capture다
- Current Release Goal: self-hosting 템플릿 안에서 hybrid harness를 완성하고, rollout은 completion gate가 닫힌 뒤에만 연다
- Requirements Status: Approved
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: In Sync
- Architecture Status: Approved (`CR-04` synced)
- Plan Status: Active (`PLN-04` synced, `TST-02` pending)
- Review Gate: Not Started
- Manual / Environment Gate: Not Started
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-08 Day Wrap Up
- Sync Checked At: 2026-04-08 01:51
- Task List Sync Check: In Sync
- Document Health: approved `CR-04` baseline, `PLN-04` completion gate, day-wrap handoff가 live task/current-state에 동기화됐다. 다음은 `TST-02`, `REV-01` / `REV-02`, `REL-01` / `REL-02`다
- Last Updated By / At: Codex / 2026-04-08 01:51

## Next Recommended Agent
- Recommended role: Tester
- Reason: planning debt는 닫혔고, 다음 병목은 `TST-02` preview regression과 `REL-01` / `REL-02` evidence capture다.
- Trigger to switch: `TST-02`가 끝나면 Reviewer가 `REV-01` / `REV-02`를 이어가고, 그 다음 DevOps가 `REL-01` / `REL-02`를 닫는다.

## Must Read Next
- 1. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + Task Packet Ledger + Validation Gates`
- 2. `.agents/artifacts/TASK_LIST.md > TST-02 + REV-01/REV-02 + REL-01/REL-02`
- 3. `.agents/artifacts/DEPLOYMENT_PLAN.md > Quick Read + Preflight Checklist + Validation Gate Notes`
- Optional follow-up: `.agents/rules/template_repo.md`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Relevant paths / modules: `.agents/artifacts/{REQUIREMENTS.md,ARCHITECTURE_GUIDE.md,IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md,PROJECT_HISTORY.md,UI_DESIGN.md}`, `.agents/skills/requirements_deep_interview/*`, `tools/project-monitor-web/*`
- Current locks to respect: none
- Worktree recommendation: planning sync만 진행하고 actual rollout은 completion gate 전까지 열지 않는다

## Task Pointers
- `PLN-07`: completed. `CR-04` decision-packet requirement / architecture / plan sync를 반영했다.
- `DSG-05`: completed. decision-packet IA와 wireframe을 반영했다.
- `DSG-06`: completed. user 승인으로 `CR-04` baseline을 닫고 implementation scope를 확정했다.
- `DEV-03`: completed. PMW workspace / decision packet / history / project selector / launcher-stop assets를 구현했다.

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: none
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: none
- 기술 블로커: none
- Document / harness maintenance: planning debt는 닫혔고, 남은 것은 evidence capture와 review/deploy gate execution이다
- Stale lock watch: none
- Needs User Decision: none

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-08 01:47
- Completed: `PLN-04` 완료 상태와 stale active lock을 정리했고, 오늘 delta를 다음 세션 진입 기준에 맞춰 재정렬했다.
- Next: Tester가 `TST-02` preview regression을 수행하고, 이후 Reviewer / DevOps가 `REV-01` / `REV-02`, `REL-01` / `REL-02`를 순서대로 이어간다.
- First Next Action: `DEPLOYMENT_PLAN.md`의 Quick Read + Preflight Checklist를 다시 읽고 `cd "C:\Newface\30 Github\repo_harness_template\tools\project-monitor-web"; npm start` 후 `http://127.0.0.1:4173`에서 `/api/projects`, decision packet, history view, launcher/stop affordance까지 포함한 `TST-02` smoke를 수행한다.
- Notes: `PLN-04` lock은 제거했다. operating-project rollout은 현재 버전 범위 밖이며 `REL-03` 전에는 열지 않는다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.2`에서 profile/schema/parser/monitor baseline을 고정했다.
- 2026-04-07: `v0.3`에서 enterprise-governed pack, `governance_controls.json`, optional `.omx` compatibility를 source에 반영했다.
- 2026-04-07: developer PC preview bring-up과 `CR-02` follow-up review 뒤 `v0.3`를 archive하고 새 버전 draft를 열었다.
- 2026-04-08: PMW 승인본에 `Project History` view, project selector, launcher icon, stop icon, top-bar `Exit`를 포함했다.
- 2026-04-08: `CR-04` 승인 후 approval queue decision packet view와 PMW workspace 구현을 live code에 반영했다.
- 2026-04-08: `PLN-04`로 completion gate와 rollout entry criteria를 `DEPLOYMENT_PLAN.md`까지 고정했고, 다음 focus를 evidence capture와 review/deploy gate execution으로 넘겼다.
