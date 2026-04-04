---
description: Agent 간 작업 인계를 현재 요약층 기준으로 이어받는 워크플로우
---

# Handoff Workflow

## Explicit User Order Handling
- 읽기, 상태 확인, 당연한 사전 검토는 사용자에게 확인 질문 없이 진행합니다.
- 사용자가 명시적으로 오더한 실행은 범위, 대상, 실행 여부를 임의로 바꾸지 않고 그대로 진행합니다.
- 상태를 바꾸는 작업을 시작할 때는 사용자 오더 기준의 짧은 실행 계획을 먼저 대화에 보여주고, 그 계획이 오더와 일치하면 추가 승인 질문 없이 바로 실행합니다.
- 실행 중 목표, 범위, 대상 파일/환경, 실행 종류, 명령 세트가 달라져야 하면 멈추고 이유와 대안을 설명한 뒤 사용자 확정 전까지 진행하지 않습니다.
- 사용자가 명령어, 설명, 초안만 요청했다면 실제 실행, 백그라운드 실행, 추가 작업을 하지 않습니다.

1. 먼저 `CURRENT_STATE.md`를 읽고 `Next Recommended Agent`, `Must Read Next`, `Required Skills`, `Latest Handoff Summary`, `Open Decisions / Blockers`를 확인한다. 이 문서는 resume router이지 task / lock truth가 아니다.
2. 시작 전에 항상 `TASK_LIST.md`의 아래 범위를 직접 읽는다. `CURRENT_STATE.md`가 이를 대체하지 않는다.
   - `## Active Locks`
   - 자신의 대상 Task ID
   - 최신 relevant handoff 항목
3. `CURRENT_STATE.md`가 아래 조건 중 하나를 만족하면 stale로 본다.
   - `Sync Checked At`이 최신 relevant handoff보다 과거다.
   - `Current Stage / Current Focus / Current Release Goal`이 `TASK_LIST.md > Current Release Target`과 다르다.
   - `Requirements Status / Architecture Status / Plan Status`가 상세 문서와 다르다.
   - `Requirement Baseline` 또는 `Requirements Sync Check`가 상세 문서와 다르다.
   - `Last Synced From Task / Handoff` 또는 `Latest Handoff Summary`가 최신 relevant handoff와 다르다.
   - `Task List Sync Check`가 `Needs Review`다.
   - `Current locks to respect`와 `## Active Locks`가 어긋난다.
4. stale이면 `CURRENT_STATE.md`를 그대로 믿지 말고 `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`, 관련 상세 문서 기준으로 시작점을 다시 잡는다.
5. fresh하면 `## Active Locks`, relevant task row, 최신 relevant handoff까지만 먼저 확인하고 시작한다. `CURRENT_STATE.md > Must Read Next`에 적힌 문서는 그 다음 우선순위로 읽고, 정보가 부족할 때만 관련 상세 섹션으로 확장한다.
6. `HANDOFF_ARCHIVE.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`는 현재 task와 직접 연결된 blocker, gate, 또는 실환경 검증이 있을 때만 추가로 읽는다.
7. 작업을 시작한다면 해당 Task ID를 `[-]`로 갱신하고 `## Active Locks`에 본인 정보를 추가한다.
8. `CURRENT_STATE.md`는 dated `Update` 블록을 누적하지 말고 최신 snapshot 1개를 replace-in-place로 유지한다.
9. 작업 완료 시 `workspace.md`의 Handoff Protocol 규칙에 따라 `CURRENT_STATE.md`, `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`를 정리한다. `## Handoff Log`에는 최신 delta만 남기고 상세 구현 로그는 관련 artifact에 남긴다.
10. low-risk harness maintenance (`LF` 정규화, `CURRENT_STATE.md` compact, live handoff reorder, validator 실행)는 사용자 승인 없이 바로 적용한 뒤 결과만 handoff에 남깁니다.
11. If handoff is caused by `Needs User Decision` or `manual gate pending`, record the gate in artifacts first and keep it as a local user decision in the active session.
12. secret, token, destructive action, 장문 설명이 필요한 질문은 명시적 사용자 응답이 필요한 blocker로 유지합니다.
13. rules / workflows / artifacts를 수정했다면 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행해 구조 위반이 없는지 확인한다.
14. 마지막 handoff가 모호하거나 서로 충돌한다면 추측하지 말고 사용자에게 다음 역할을 확인받는다.
