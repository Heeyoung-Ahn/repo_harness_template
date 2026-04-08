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
- Current Focus: 표준 템플릿 전주기 validation test case를 정의하고, user confirmation 뒤 실제 검증을 연다. `TST-02` PMW feedback pending은 별도 blocker로 유지한다
- Current Release Goal: hybrid harness completion gate를 먼저 닫고, operating-project rollout은 정리 스케줄과 safe selective sync path 준비 뒤 다시 연다
- Requirements Status: Approved
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: In Sync
- Architecture Status: Approved (`CR-06` synced)
- Plan Status: Active (`PLN-09` synced, `PLN-10` validation case draft completed; execution pending user confirmation)
- Review Gate: Not Started
- Manual / Environment Gate: Open (`TST-02` user PMW feedback pending)
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-09 00:48 `PLN-10`
- Sync Checked At: 2026-04-09 00:48
- Task List Sync Check: In Sync
- Document Health: `CR-06` sync 완료, `PLN-10` validation case draft 완료, `TST-02` user feedback pending, `DOC-03`/`PM-001` 반영 완료, `BACKLOG-01`은 dry-run만 수행했다
- Last Updated By / At: Codex / 2026-04-09 00:48

## Next Recommended Agent
- Recommended role: User / Tester
- Reason: validation case confirmation과 `TST-02` PMW feedback이 둘 다 user 입력을 기다린다.
- Trigger to switch: user가 case를 승인하거나 PMW feedback을 주면 Planner / Tester가 다음 task를 연다.

## Must Read Next
- 1. `.agents/artifacts/VALIDATION_TEST_CASES.md > Quick Read + Case Summary + Recommended First Batch`
- 2. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Validation Gates + Task Packet Ledger`
- 3. `.agents/artifacts/TASK_LIST.md > PLN-10 + ## Blockers + latest handoff`
- Optional on PMW / rollout resume: `.agents/artifacts/DEPLOYMENT_PLAN.md > Preflight Checklist + Validation Gate Notes`, `.agents/rules/template_repo.md`, `.agents/artifacts/PREVENTIVE_MEMORY.md > ## Active Preventive Rules`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: `PLN-10`, `TST-02`, `DEV-01`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Relevant paths / modules: `.agents/artifacts/{CURRENT_STATE.md,TASK_LIST.md,DEPLOYMENT_PLAN.md,PROJECT_HISTORY.md,VALIDATION_TEST_CASES.md}`, `tools/project-monitor-web/*`
- Current locks to respect: none
- Worktree recommendation: 내일 아침 `TST-02` browser feedback부터 재개한다. rollout은 safe selective sync path 준비 전까지 다시 열지 않는다

## Task Pointers
- `PLN-10`: completed. `VALIDATION_TEST_CASES.md`에 Daily English Spark / PMW / template hygiene 기반 stress case를 정리했다. 실행은 user confirmation 뒤 연다.
- `TST-02`: open. 1차 browser smoke와 dry-run evidence는 확보했지만 user PMW feedback을 기다린다.
- `DOC-03`: completed. starter/reset scaffold 정리와 `PREVENTIVE_MEMORY.md` 연결을 마쳤다.
- `BACKLOG-01`: pending. current `sync_template_docs.ps1`로는 selective rollout이 안전하지 않아 downstream mutation을 defer했다.
- `PLN-09`, `TST-03`: completed. `CR-06` sync와 관련 검증은 끝났다.
- `DEV-01`, `DEV-02`, `TST-01`: pending. `TST-02` 정리 뒤 이어간다.

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: `TST-02` user PMW browser feedback pending
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: `VALIDATION_TEST_CASES.md` confirmation, PMW browser review feedback
- Document / harness maintenance: validation execution은 user confirmation 뒤 연다. `BACKLOG-01`은 selective path filter / live artifact allowlist 정리 뒤 재개한다

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-09 00:11
- Completed: `BACKLOG-01` dry-run 결과를 기록하고 actual rollout을 defer했다.
- Next: user가 PMW feedback을 남기면 Tester가 `TST-02`를 재판정한다. validation execution은 case confirmation 뒤 연다.
- First Next Action: PMW를 브라우저에서 열고 feedback을 남긴다.

## Recent History Summary
- 2026-04-09: `BACKLOG-01` rollout dry-run 결과 current `sync_template_docs.ps1`는 unrelated starter dirty file 전파와 live `PREVENTIVE_MEMORY.md` 누락 위험이 있어 actual downstream mutation 없이 defer했다.
- 2026-04-08: `CR-05` 승인 후 task packet context contract, recurrence gate, AI-specific review checklist, optional guardrail field, PMW risk signal을 반영하고 회귀 검증까지 마쳤다.
- 2026-04-08: `CR-06` 승인 후 웹앱 / browser-facing UI scope의 브라우저 기반 테스트 규칙을 live/starter/reset baseline에 반영했다.
