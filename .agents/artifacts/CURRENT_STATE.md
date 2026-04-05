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
- Current Focus: root live docs와 `templates/project/*`, `templates/version_reset/artifacts/*`가 완전히 분리되었고, downstream rollout은 live artifact 보존 sync로 수행한다
- Current Release Goal: self-hosting 운영 문서와 starter/reset template를 혼동 없이 유지하고 기존 운영 프로젝트에도 안전하게 rollout한다
- Requirements Status: Draft
- Requirement Baseline:
- Requirements Sync Check: In Sync / Downstream Update Required / Needs Re-Approval
- Architecture Status: Draft
- Plan Status: Draft
- Review Gate: Pending
- Manual / Environment Gate: Pending
- Dependency / Compliance Gate: Pending
- Last Synced From Task / Handoff: 2026-04-05 safe downstream rollout
- Sync Checked At: 2026-04-05
- Task List Sync Check: In Sync
- Document Health: root/starter/reset source tree가 분리되었고, validator 2종과 3개 downstream repo rollout 검증까지 통과했다
- Last Updated By / At: Developer Agent / 2026-04-05

## Next Recommended Agent
- Recommended role: Planner or Developer
- Reason: 다음 template maintenance 요청이 들어오면 root live 문서와 `templates/project/*`, `templates/version_reset/artifacts/*` 중 어느 쪽을 바꿔야 하는지 먼저 분류해야 합니다.
- Trigger to switch: downstream 기본 동작 변경, self-hosting 운영 규칙 변경, template rollout 요청

## Must Read Next
- 1. `TASK_LIST.md > ## Active Locks + 관련 Task ID row`
- 2. `.agents/rules/template_repo.md`
- 3. downstream 기본 동작을 바꾸는 작업이면 `templates/project/AGENTS.md`, `templates/project/.agents/rules/workspace.md`, 관련 `templates/project/.agents/workflows/*`, `templates/version_reset/artifacts/*`
- Optional follow-up: `.agents/scripts/sync_template_docs.ps1`, `.agents/runtime/downstream_target_presets.psd1`, `templates/project/.agents/scripts/check_harness_docs.ps1`
- Do not read by default: `README.md`, `templates/project/PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent: [필요할 때만 작성]
- Reviewer Agent: [필요할 때만 작성]
- DevOps / release gate: [필요할 때만 작성]
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `AGENTS.md`, `.agents/rules/*`, `.agents/workflows/*`, `.agents/scripts/*`, `templates/project/*`, `templates/version_reset/artifacts/*`
- Current locks to respect: none
- Worktree recommendation: root live docs와 template source를 같은 턴에 만질 때는 대응 경로를 쌍으로 확인

## Task Pointers
- PLN-01~PLN-04: self-hosting vs deployable source 분리 기준 정리 완료
- DEV-01~DEV-03: `templates/project/*`, `templates/version_reset/artifacts/*`, live docs, validator/sync script 정비 완료
- DEV-04: rollout target preset을 script hard-code 대신 `.agents/runtime/downstream_target_presets.psd1`로 분리
- DOC-03~DOC-04: root `README.md`를 self-hosting/starter/reset 구조 기준으로 갱신했고, root `PROJECT_WORKFLOW_MANUAL.md`는 삭제한 뒤 starter manual만 `templates/project/PROJECT_WORKFLOW_MANUAL.md`에 유지
- TST-01~TST-02: root/starter/downstream 검증과 dry-run, mojibake 점검 완료
- REL-01~REL-03: WATV Auto Login, AI Video Creator, Daily English Spark에 safe rollout 완료

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: none
- Dependency / compliance gate: none
- 사용자 답변 / 확인 대기: none
- 기술 블로커: none
- Document / harness maintenance: downstream standard behavior를 바꾸는 작업이면 `templates/project/*`, `templates/version_reset/artifacts/*`, sync script 기준을 함께 갱신해야 함
- Stale lock watch: none
- Needs User Decision: none

## Latest Handoff Summary
- Handoff source: Developer Agent / 2026-04-05
- Completed: root live 문서와 deployable template source를 분리했고, `sync_template_docs.ps1`를 live artifact 보존 기본값으로 강화한 뒤 3개 운영 프로젝트에 rollout했다.
- Next: 이후 유지보수는 먼저 self-hosting only 변경인지 downstream 기본 동작 변경인지 분류한 뒤 대응 경로를 수정한다.
- Notes: downstream rollout은 root live 문서 복사가 아니라 `templates/project/*` source + `templates/version_reset/artifacts/*`를 기준으로 한다.

## Recent History Summary
- 2026-04-04: 명시적 사용자 오더 준수 규칙을 표준 템플릿과 운영 프로젝트에 반영했다.
- 2026-04-05: root live 문서와 deployable template source가 섞여 보이는 문제를 구조적으로 분리하기로 결정했다.
- 2026-04-05: `templates/project/*`, `templates/version_reset/artifacts/*` source tree와 self-hosting live 문서/validator/sync script를 분리 정리했다.
- 2026-04-05: `sync_template_docs.ps1`를 기존 운영 프로젝트 safe rollout용으로 보강하고, 세 운영 프로젝트에 `templates/version_reset` 포함 구조를 반영했다.
- 2026-04-05: 운영 프로젝트 집합 변동에 대비해 rollout target preset을 `.agents/runtime/downstream_target_presets.psd1`로 분리했다.
- 2026-04-05: root `README.md`는 self-hosting 저장소 설명으로 갱신했고, root `PROJECT_WORKFLOW_MANUAL.md`는 제거하여 starter manual만 `templates/project/PROJECT_WORKFLOW_MANUAL.md`에 남겼다.
