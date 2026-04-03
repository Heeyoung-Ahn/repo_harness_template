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
- Version / Milestone: `template-maintenance`
- Current Stage: `Documentation and Closeout`
- Current Focus: `원격 승인 제외 이후 기본 템플릿 설명 문서 동기화`
- Current Release Goal: `원격 승인 자산을 backup으로 격리한 기본 템플릿 설명을 최신 상태로 유지`
- Requirements Status: `N/A (template maintenance)`
- Requirement Baseline: `remote-approval-removal-2026-04-03`
- Requirements Sync Check: `In Sync`
- Architecture Status: `No Architecture Change`
- Plan Status: `Completed`
- Review Gate: `Not Requested`
- Manual / Environment Gate: `None`
- Dependency / Compliance Gate: `Not Assessed`
- Last Synced From Task / Handoff: `DOC-05`
- Sync Checked At: `2026-04-04`
- Task List Sync Check: `In Sync`
- Document Health: `README / PROJECT_WORKFLOW_MANUAL가 backup 구조와 로컬 승인 기준에 맞게 재동기화 진행 중`
- Last Updated By / At: `Codex / 2026-04-04`

## Next Recommended Agent
- Recommended role: `Planner`
- Reason: `원격 승인 없는 기본 템플릿 기준으로 다음 범위 조정이나 새 프로젝트 baseline 작성이 가능함`
- Trigger to switch: `추가 템플릿 범위 변경이나 새 프로젝트 요구사항 정리가 필요할 때`

## Must Read Next
- 1. `TASK_LIST.md > Current Release Target + Workflow Stage: Documentation and Closeout`
- 2. `.agents/rules/workspace.md > 7. Handoff and Validation, 9. User Decision Handling`
- 3. `PROJECT_WORKFLOW_MANUAL.md > 10. 사용자 승인 처리는 어떻게 하는가`
- Optional follow-up: `backup/remote_approval/README.md`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent: [필요할 때만 작성]
- Reviewer Agent: [필요할 때만 작성]
- DevOps / release gate: [필요할 때만 작성]
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: `DOC-05`
- Relevant paths / modules: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `backup/remote_approval`, `.agents/rules`, `.agents/artifacts`
- Current locks to respect: `DOC-05 (self)`
- Worktree recommendation: `Not needed`

## Task Pointers
- `DOC-05` Last relevant handoff: `없음 (current session)`
- `DOC-05` Current owner / next check: `Codex / README + manual sync 후 closeout`
- `DOC-05` Blocker or caution: `README와 매뉴얼은 설명 문서이며 운영 정본이 아님`

## Open Decisions / Blockers
- Release blocker: `없음`
- Manual / environment-specific blocker: `없음`
- Dependency / compliance gate: `없음`
- 사용자 답변 / 확인 대기: `없음`
- 기술 블로커: `없음`
- Document / harness maintenance: `완료`
- Stale lock watch: `없음`
- Needs User Decision: `없음`

## Latest Handoff Summary
- Handoff source: `DOC-04 / Codex / 2026-04-03`
- Completed: `원격 승인 스킬, 앱, 스크립트, runtime 예시를 backup으로 이관하고 기본 템플릿 참조를 제거함`
- Next: `추가 템플릿 범위 조정이 없으면 현재 상태 유지`
- Notes: `기본 템플릿은 로컬 사용자 승인 전제만 유지함`

## Recent History Summary
- `2026-04-03` 원격 승인 관련 자산을 `backup/remote_approval`로 이관함.
- `2026-04-03` rules / workflows / tutorial 문구를 로컬 사용자 승인 기준으로 정리함.
- `2026-04-03` 기본 템플릿에서 별도 승인 운영 계층 전제를 제거함.
