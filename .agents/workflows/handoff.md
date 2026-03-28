---
description: Agent 간 작업 인계를 현재 요약층 기준으로 이어받는 워크플로우
---

# Handoff Workflow

1. `.agents/artifacts/CURRENT_STATE.md`를 먼저 읽는다.
2. 시작 전에 항상 `TASK_LIST.md`의 아래 범위를 직접 읽는다. `CURRENT_STATE.md`가 이를 대체하지 않는다.
   - `## Active Locks`
   - 자신의 대상 Task ID
   - 최신 relevant handoff 항목
3. `CURRENT_STATE.md`가 아래 조건 중 하나를 만족하면 stale로 본다.
   - `Sync Checked At`이 최신 relevant handoff보다 과거다.
   - `Requirements Status / Architecture Status / Plan Status`가 상세 문서와 다르다.
   - `Task List Sync Check`가 `Needs Review`다.
   - `Current locks to respect`와 `## Active Locks`가 어긋난다.
4. stale이면 `CURRENT_STATE.md`를 그대로 믿지 말고 `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`, 관련 상세 문서 기준으로 시작점을 다시 잡는다.
5. `CURRENT_STATE.md > Next Recommended Agent`와 `Must Read Next`를 기준으로 다음 역할과 읽을 문서를 정한다.
6. 필요한 경우에만 관련 문서의 `Quick Read`나 상단 상태 블록을 읽고, 정보가 부족할 때만 상세 섹션으로 확장한다.
7. `PROJECT_WORKFLOW_MANUAL.md`와 `HANDOFF_ARCHIVE.md`는 현재 문서만으로 역할 판단이 안 되거나, 충돌/회고/closeout이 필요할 때만 읽는다.
8. 작업을 시작하거나 문서를 갱신하기 직전에는 `CURRENT_STATE.md`, `TASK_LIST.md`, 대상 파일에 대해 `pre-write refresh`를 수행한다.
9. 해당 역할 workflow를 실행하고, 종료 시 `workspace.md`의 Handoff Protocol에 따라 `CURRENT_STATE.md`, `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`를 정리한다.
10. 마지막 handoff가 모호하거나 서로 충돌한다면 추측하지 말고 사용자에게 다음 역할을 확인받는다.
