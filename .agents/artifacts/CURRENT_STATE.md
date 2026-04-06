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
- Current Focus: 공통 테스트 프로세스에 상세 사용자 피드백 수집과 Developer handoff 기준을 표준화했다
- Current Release Goal: self-hosting 운영 문서와 starter/reset template를 혼동 없이 유지하면서 공통 테스트 피드백 절차를 운영 프로젝트까지 안전하게 rollout한다
- Requirements Status: Draft
- Requirement Baseline:
- Requirements Sync Check: In Sync / Downstream Update Required / Needs Re-Approval
- Architecture Status: Draft
- Plan Status: Draft
- Review Gate: Pending
- Manual / Environment Gate: Pending
- Dependency / Compliance Gate: Pending
- Last Synced From Task / Handoff: 2026-04-06 DEV-10 completed
- Sync Checked At: 2026-04-06
- Task List Sync Check: In Sync
- Document Health: root validator 통과, mojibake 없음, active operating projects rollout 완료
- Last Updated By / At: Developer Agent / 2026-04-06

## Next Recommended Agent
- Recommended role: Tester or Developer
- Reason: 이후 실제 수동 테스트에서는 `Expected User Outcome`, `Feedback Capture Plan`, `Developer Feedback Handoff` 구조를 그대로 쓰면 된다.
- Trigger to switch: 실제 manual test 실행, 사용자 feedback handoff 기반 후속 구현, 공통 테스트 절차 추가 개정

## Must Read Next
- 1. `TASK_LIST.md > Current Release Target + 관련 Task row`
- 2. 실제 manual test 전이면 `.agents/workflows/test.md`, `.agents/artifacts/WALKTHROUGH.md`
- 3. 공통 테스트 절차 변경이면 `.agents/rules/template_repo.md`, `templates_starter/.agents/workflows/test.md`, `templates/version_reset/artifacts/WALKTHROUGH.md`
- Optional follow-up: `.agents/scripts/sync_template_docs.ps1`, `.agents/runtime/downstream_target_presets.psd1`, `templates_starter/templates/version_reset/artifacts/*`
- Do not read by default: `README.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent: [필요할 때만 작성]
- Reviewer Agent: [필요할 때만 작성]
- DevOps / release gate: [필요할 때만 작성]
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/workflows/test.md`, `.agents/skills/expo_real_device_test/*`, `.agents/artifacts/WALKTHROUGH.md`, `templates_starter/.agents/workflows/test.md`, `templates_starter/.agents/skills/expo_real_device_test/*`, `templates_starter/.agents/artifacts/WALKTHROUGH.md`, `templates/version_reset/artifacts/WALKTHROUGH.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`
- Current locks to respect: none
- Worktree recommendation: 공통 테스트 절차 변경은 workflow + walkthrough + shared skill + starter manual을 같이 본다

## Task Pointers
- DEV-10: 공통 manual test에 `Expected User Outcome`, `Feedback Capture Plan`, 비압축 `Developer Feedback Handoff`를 추가했다.
- DEV-09: self-hosting 운영 규칙과 workflow 비의존 원칙 정리 완료.
- DEV-08/07: `expo_real_device_test` shared skill과 reference source 정비 완료.
- REL-01~03/TST-02: downstream safe rollout과 dry-run 구조 완료.

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
- Completed: 공통 테스트 workflow, `WALKTHROUGH.md` templates, `expo_real_device_test`, starter manual에 상세 사용자 feedback 수집과 비압축 Developer handoff 기준을 추가하고 active operating projects 3곳에 rollout했다.
- Next: 실제 manual test에서는 `Expected User Outcome`, `Feedback Capture Plan`, `Developer Feedback Handoff` 구조를 채워 Developer loop로 넘긴다.
- Notes: Daily English Spark의 수동 테스트 artifact 흐름을 일반화해 모든 앱 제작 범위에 적용했다.

## Recent History Summary
- 2026-04-05: root live 문서와 deployable template source 분리, safe downstream rollout 구조를 정리했다.
- 2026-04-06: starter root를 `templates_starter/*`로 재편하고 root `templates/*`를 canonical reset source로 유지했다.
- 2026-04-06: `expo_real_device_test` shared skill과 `adb_quickstart` reference를 root/starter/downstream에 정비했다.
- 2026-04-06: self-hosting `AGENTS.md`와 `workspace.md`에 표준 템플릿 운영 지침을 추가했다.
- 2026-04-06: 공통 manual test에 상세 사용자 feedback 수집과 비압축 Developer handoff 절차를 표준화했다.
