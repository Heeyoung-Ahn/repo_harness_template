# Current State

> 모든 Agent의 기본 진입 요약 문서입니다.  
> 시작할 때는 이 문서를 먼저 읽고, 여기 적힌 `Must Read Next` 범위만 추가로 읽습니다.

## Maintenance Rules
- 이 문서는 가능하면 120줄 이하, 800단어 이하로 유지합니다.
- dated `Update` 블록을 누적하지 말고, 항상 최신 snapshot 1개만 replace-in-place로 유지합니다.
- 진행 경과 원문은 `TASK_LIST.md > ## Handoff Log` 또는 `HANDOFF_ARCHIVE.md`로 보냅니다.
- `Must Read Next`에는 지금 실제로 필요한 문서만 적습니다.
- 상세 문서와 요약이 충돌하면 상세 문서가 우선이며, 즉시 이 문서를 고칩니다.
- rules / workflows / artifacts를 수정했다면 handoff 전에 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행합니다.
- 오래된 Handoff 원문은 `HANDOFF_ARCHIVE.md`로 이동하고, 여기에는 요약만 남깁니다.
- 활성 manual test / review 루프가 열려 있으면 관련 handoff 원문은 `TASK_LIST.md`에 임시 유지할 수 있고, 그 이유를 `Recent History Summary`에서 설명합니다.
- 이 문서는 진입 라우터이며, 요구사항 / 아키텍처 / 구현 계획 / 테스트 계약 자체를 대체하지 않습니다.
- 승인 후 요구사항이나 완료 기준이 바뀌면 `Requirement Baseline`과 `Requirements Sync Check`를 즉시 갱신하고, downstream 문서 sync가 끝나기 전에는 review / deploy gate를 닫지 않습니다.
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
- Do not read by default: `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Tester Agent:
- Reviewer Agent:
- DevOps / release gate:
- Rules / workflows / artifact edits:

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
