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
- Version / Milestone:
- Current Stage:
- Current Focus:
- Current Release Goal:
- Requirements Status:
- Requirement Baseline:
- Requirements Sync Check: In Sync / Downstream Update Required / Needs Re-Approval
- Architecture Status:
- Plan Status:
- Review Gate:
- Manual / Environment Gate:
- Dependency / Compliance Gate:
- Last Synced From Task / Handoff:
- Sync Checked At:
- Task List Sync Check: In Sync / Needs Review
- Document Health:
- Last Updated By / At:

## Next Recommended Agent
- Recommended role:
- Reason:
- Trigger to switch:

## Must Read Next
- 1. `TASK_LIST.md > ## Active Locks + 관련 Task ID row`
- 2. [필수 문서 경로 + 읽어야 할 섹션]
- 3. [필수 문서 경로 + 읽어야 할 섹션]
- Optional follow-up:
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent: [필요할 때만 작성]
- Reviewer Agent: [필요할 때만 작성]
- DevOps / release gate: [필요할 때만 작성]
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard` 등 필요 시만 작성

## Active Scope
- Active Task IDs:
- Relevant paths / modules:
- Current locks to respect:
- Worktree recommendation:

## Task Pointers
- [Task ID] Last relevant handoff:
- [Task ID] Current owner / next check:
- [Task ID] Blocker or caution:

## Open Decisions / Blockers
- Release blocker:
- Manual / environment-specific blocker:
- Dependency / compliance gate:
- 사용자 답변 / 확인 대기:
- 기술 블로커:
- Document / harness maintenance:
- Stale lock watch:
- Needs User Decision:

## Latest Handoff Summary
- Handoff source:
- Completed:
- Next:
- Notes:

## Recent History Summary
- [최근 기록 요약 1]
- [최근 기록 요약 2]
- [최근 기록 요약 3]
