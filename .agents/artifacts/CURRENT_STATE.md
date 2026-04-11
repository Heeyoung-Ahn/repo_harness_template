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
- Current Focus: 문서 inventory/review는 닫혔고 다음 code lane은 `DEV-02`; `TST-02`는 PMW manual retest다
- Current Release Goal: hybrid harness completion gate를 먼저 닫고, rollout은 selective sync path 준비 뒤 다시 연다
- Requirements Status: Approved
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: In Sync
- Architecture Status: Approved (`CR-08` synced)
- Plan Status: Active (`DOC-04`, `DOC-05` complete; `DEV-02`, `TST-01` pending)
- Review Gate: Not Started
- Manual / Environment Gate: Open (`TST-02` PMW retest pending)
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-12 00:39 `DOC-05` closed without deletions
- Sync Checked At: 2026-04-12 00:39
- Task List Sync Check: In Sync
- Document Health: `DOC-04` catalog and `DOC-05` review complete with no deletions, validation batch 1 and `DEV-01` complete, `TST-02` retest pending, `BACKLOG-01`/`CR-09` defer
- Last Updated By / At: Codex / 2026-04-12 00:39

## Next Recommended Agent
- Recommended role: Developer
- Reason: 문서 inventory/review가 닫혔고 다음 실제 구현 lane은 `DEV-02` enterprise-governed activation guide / fixture baseline이다.
- Trigger to switch: 기본 next lane은 `DEV-02`, user가 PMW retest feedback을 주면 `TST-02`로 전환한다.

## Must Read Next
- 1. `.agents/artifacts/REQUIREMENTS.md > Quick Read + FR-14~FR-17 + FR-33~FR-38`
- 2. `.agents/artifacts/ARCHITECTURE_GUIDE.md > Approved Boundaries + Operating Context Artifacts`
- 3. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + DEV-02/TST-01 + DEV-01 packet`
- 4. `.agents/artifacts/TASK_LIST.md > DEV-02 + TST-02 + BACKLOG-01 + ## Blockers`
- 5. `.agents/artifacts/VALIDATION_TEST_CASES.md > Recommended First Batch + CR-08 Coverage Map`
- Optional self-hosting runtime reference: `.omx/RUNTIME_REFERENCE.md`
- Optional on document maintenance resume: `MARKDOWN_DOCUMENT_CATALOG.md`
- Optional on rollout resume: `.agents/rules/template_repo.md`, `.agents/artifacts/DEPLOYMENT_PLAN.md > Preflight Checklist`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: `TST-02`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`, `BACKLOG-01`
- Relevant paths / modules: `.agents/artifacts/{REQUIREMENTS.md,ARCHITECTURE_GUIDE.md,IMPLEMENTATION_PLAN.md,VALIDATION_TEST_CASES.md,CURRENT_STATE.md,TASK_LIST.md,SYSTEM_CONTEXT.md,DOMAIN_CONTEXT.md,DECISION_LOG.md,DEPLOYMENT_PLAN.md,PROJECT_HISTORY.md}`, `MARKDOWN_DOCUMENT_CATALOG.md`, `tools/project-monitor-web/*`
- Current locks to respect: none
- Worktree recommendation: code lane는 `DEV-02`로 이어가고, manual lane는 user PMW retest 뒤 `TST-02`를 다시 판정한다.

## Task Pointers
- `DOC-04` / `DOC-05`: completed. whole-repo markdown inventory를 스캔해 `MARKDOWN_DOCUMENT_CATALOG.md`를 만들었고, user review 결과 삭제는 진행하지 않고 전체 유지로 기록했다.
- `TST-02`: open. user PMW feedback은 반영했고 browser retest로 project registry / signal rail / header source trace를 다시 확인한다.
- `BACKLOG-01`: pending. selective rollout safety issue 때문에 actual downstream mutation은 defer 상태다.

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: `TST-02` PMW browser retest pending
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: PMW retest feedback
- `CR-09`: maintenance/debt register follow-up
- Document / harness maintenance: `BACKLOG-01`은 selective path filter / live artifact allowlist 뒤 재개한다. actual rollout execution은 여전히 범위 밖이다

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-12 00:39
- Completed: `DOC-05`를 no-op close했다. user review 결과 delete-review 후보는 모두 유지하고, 카탈로그는 reviewed-retained 기준으로 갱신한다.
- Next: code lane는 `DEV-02`, manual lane는 PMW retest 후 `TST-02` 재판정이다.
- First Next Action: `IMPLEMENTATION_PLAN.md > DEV-02` packet을 읽고 `enterprise_governed` activation guide / governed fixture baseline 범위를 구현한다.

## Recent History Summary
- 2026-04-12: user review 결과 markdown cleanup 후보는 모두 유지하기로 했고 `DOC-05`를 삭제 없이 닫았다.
- 2026-04-12: whole-repo markdown inventory를 스캔해 `MARKDOWN_DOCUMENT_CATALOG.md`를 생성했고, 9개 delete-review 후보를 분류했다.
- 2026-04-11: `DEV-07` / `TST-04`를 닫고 change-governance source와 validator regression을 반영했다.
- 2026-04-11: validation cases에 `CR-08` coverage를 흡수하고 first batch(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`)를 execution-ready task로 열었다.
- 2026-04-11: first validation batch(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`)를 실행했고 four-case batch는 pass다. actual rollout execution은 계속 `BACKLOG-01` 범위 밖이다.
