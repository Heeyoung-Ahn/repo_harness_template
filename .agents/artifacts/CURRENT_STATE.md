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
- Version / Milestone: Template Repo Separation
- Current Stage: Documentation and Closeout
- Current Focus: self-hosting `AGENTS.md`와 `workspace.md`에 표준 템플릿 운영 지침을 명문화했다
- Current Release Goal: self-hosting 운영 문서와 starter/reset template를 혼동 없이 유지하고 운영 프로젝트에 rollout한다
- Requirements Status: Draft
- Requirement Baseline:
- Requirements Sync Check: In Sync / Downstream Update Required / Needs Re-Approval
- Architecture Status: Draft
- Plan Status: Draft
- Review Gate: Pending
- Manual / Environment Gate: Pending
- Dependency / Compliance Gate: Pending
- Last Synced From Task / Handoff: 2026-04-06 DEV-09 completed
- Sync Checked At: 2026-04-06
- Task List Sync Check: In Sync
- Document Health: root validator 통과, mojibake 없음, downstream validator는 warning-only
- Last Updated By / At: Developer Agent / 2026-04-06

## Next Recommended Agent
- Recommended role: Planner or Developer
- Reason: 다음 유지보수는 live/source/reset 중 어느 층인지 먼저 분류하면 된다.
- Trigger to switch: downstream 기본 동작 변경, self-hosting 운영 규칙 변경, template rollout 요청

## Must Read Next
- 1. `TASK_LIST.md > ## Active Locks + 관련 Task ID row`
- 2. `.agents/rules/template_repo.md`
- 3. downstream 기본 동작 변경이면 `templates_starter/AGENTS.md`, `templates_starter/.agents/rules/workspace.md`, `templates_starter/.agents/workflows/*`, `templates/version_reset/artifacts/*`
- Optional follow-up: `.agents/scripts/sync_template_docs.ps1`, `.agents/runtime/downstream_target_presets.psd1`, `templates_starter/templates/version_reset/artifacts/*`
- Do not read by default: `README.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent: [필요할 때만 작성]
- Reviewer Agent: [필요할 때만 작성]
- DevOps / release gate: [필요할 때만 작성]
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `AGENTS.md`, `.agents/rules/workspace.md`, `.agents/rules/template_repo.md`, `.agents/skills/operating-common-rollout/*`
- Current locks to respect: none
- Worktree recommendation: self-hosting entry/rules 문서와 template source 규칙을 함께 유지한다

## Task Pointers
- PLN-01~PLN-04: self-hosting vs deployable source 분리 기준 정리 완료
- DEV-01~DEV-03: starter/reset/live source 분리와 validator/sync script 정비 완료
- DEV-04: rollout target preset을 script hard-code 대신 `.agents/runtime/downstream_target_presets.psd1`로 분리
- DOC-03~DOC-04: root `README.md`를 self-hosting/starter/reset 구조 기준으로 갱신했고, starter manual은 `templates_starter/PROJECT_WORKFLOW_MANUAL.md`에만 둔다
- TST-01~TST-02: root/starter/downstream 검증과 dry-run, mojibake 점검 완료
- REL-01~REL-03: WATV Auto Login, AI Video Creator, Daily English Spark에 safe rollout 완료

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: none
- Dependency / compliance gate: none
- 사용자 답변 / 확인 대기: none
- 기술 블로커: none
- Document / harness maintenance: starter assembled root와 root reset canonical source는 항상 함께 맞춘다
- Stale lock watch: none
- Needs User Decision: none

## Latest Handoff Summary
- Handoff source: Developer Agent / 2026-04-06
- Completed: self-hosting `AGENTS.md`와 `.agents/rules/workspace.md`에 표준 템플릿 운영 기준, workflow 비의존 원칙, 공통 변경 rollout 기본 절차를 명문화했다.
- Next: 이후 self-hosting 표준 템플릿 관리는 AGENTS/workspace/template_repo/artifacts와 root `operating-common-rollout` 기준으로 진행한다.
- Notes: workflow 문서는 선택 참고이며, 필수 입력 문서가 아니다.

## Recent History Summary
- 2026-04-04: 명시적 사용자 오더 준수 규칙을 표준 템플릿과 운영 프로젝트에 반영했다.
- 2026-04-05: root live 문서와 deployable template source가 섞여 보이는 문제를 구조적으로 분리하기로 결정했다.
- 2026-04-05: starter/reset source tree와 self-hosting live 문서/validator/sync script를 분리 정리했다.
- 2026-04-05: `sync_template_docs.ps1`를 기존 운영 프로젝트 safe rollout용으로 보강하고, 세 운영 프로젝트에 `templates/version_reset` 포함 구조를 반영했다.
- 2026-04-05: 운영 프로젝트 집합 변동에 대비해 rollout target preset을 `.agents/runtime/downstream_target_presets.psd1`로 분리했다.
- 2026-04-06: starter root를 `templates_starter/*`로 재편했고 root `templates/*`는 canonical reset source로 유지했다.
- 2026-04-06: empty `docs/`와 `tools/`를 삭제하고, 3개 운영 프로젝트에 새 구조를 rollout했다.
- 2026-04-06: Daily English Spark에서 확장한 `expo_real_device_test`를 표준 source와 두 운영 프로젝트에 rollout했다.
- 2026-04-06: `expo_real_device_test` 스킬 폴더에 일반형 `adb_quickstart` reference 문서를 추가했다.
- 2026-04-06: `expo_real_device_test` 최신본을 운영 프로젝트 3곳에 재롤아웃했고 root 전용 `operating-common-rollout` 운영 스킬을 추가했다.
- 2026-04-06: self-hosting `AGENTS.md`와 `workspace.md`에 표준 템플릿 운영 지침과 workflow 비의존 원칙을 추가했다.
