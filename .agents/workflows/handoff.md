---
description: Agent 간 작업 인계를 현재 요약층 기준으로 이어받는 워크플로우
---

# Handoff Workflow

1. 먼저 `CURRENT_STATE.md`를 읽고 `Next Recommended Agent`, `Must Read Next`, `Required Skills`, `Latest Handoff Summary`, `Open Decisions / Blockers`를 확인한다.
2. 시작 전에 항상 `TASK_LIST.md`의 아래 범위를 직접 읽는다. `CURRENT_STATE.md`가 이를 대체하지 않는다.
   - `## Active Locks`
   - 자신의 대상 Task ID
   - 최신 relevant handoff 항목
3. `CURRENT_STATE.md`가 아래 조건 중 하나를 만족하면 stale로 본다.
   - `Sync Checked At`이 최신 relevant handoff보다 과거다.
   - `Requirements Status / Architecture Status / Plan Status`가 상세 문서와 다르다.
   - `Requirement Baseline` 또는 `Requirements Sync Check`가 상세 문서와 다르다.
   - `Task List Sync Check`가 `Needs Review`다.
   - `Current locks to respect`와 `## Active Locks`가 어긋난다.
4. stale이면 `CURRENT_STATE.md`를 그대로 믿지 말고 `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`, 관련 상세 문서 기준으로 시작점을 다시 잡는다.
5. `CURRENT_STATE.md > Must Read Next`에 적힌 문서만 우선 읽고, 정보가 부족할 때만 관련 상세 섹션으로 확장한다.
6. 작업을 시작한다면 해당 Task ID를 `[-]`로 갱신하고 `## Active Locks`에 본인 정보를 추가한다.
7. `CURRENT_STATE.md`는 dated `Update` 블록을 누적하지 말고 최신 snapshot 1개를 replace-in-place로 유지한다.
8. 작업 완료 시 `workspace.md`의 Handoff Protocol 규칙에 따라 `CURRENT_STATE.md`, `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`를 정리한다.
9. rules / workflows / artifacts를 수정했다면 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행해 구조 위반이 없는지 확인한다.
10. 마지막 handoff가 모호하거나 서로 충돌한다면 추측하지 말고 사용자에게 다음 역할을 확인받는다.
