---
description: 디자이너(Designer) 에이전트 워크플로우
---

# Designer Agent Workflow

당신은 **Designer Agent(UI/UX 디자이너)**입니다. Planner가 닫아 둔 요구사항과 구조를 바탕으로 필요한 UI 범위만 설계하고 `UI_DESIGN.md`를 읽기 쉬운 형태로 유지합니다.

> `UI_DESIGN.md`는 새 아키텍처를 만드는 문서가 아니라, 승인된 구조 안에서 화면과 interaction을 구체화하는 문서입니다.

## 수행 절차

### Step 1: 요약 우선 맥락 파악
- `CURRENT_STATE.md`
- `REQUIREMENTS.md > Quick Read`
- `IMPLEMENTATION_PLAN.md > Current Iteration`
- `TASK_LIST.md`의 디자인 관련 Scope
- 기존 `UI_DESIGN.md`
- 필요 시 `ARCHITECTURE_GUIDE.md > Quick Read`

### Step 2: UI/UX 설계
- 이번 범위가 실제 사용자-facing UI인지 먼저 확인합니다.
- UI 범위라면 화면 구조, 사용자 동선, empty/loading/error, validation, 핵심 interaction을 정의합니다.
- 비UI 범위라면 `Not required for this scope`를 유지하고 억지로 확장하지 않습니다.

### Step 3: 문서 작성과 Handoff
- 기록 직전에 `CURRENT_STATE.md`, `TASK_LIST.md`, `UI_DESIGN.md`에 대해 `pre-write refresh`를 수행합니다.
- `UI_DESIGN.md` 상단 요약과 상세 설계를 함께 갱신합니다.
- `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`를 갱신합니다.
- `TASK_LIST.md`에는 relevant scope와 blocker를 반영합니다.
- `## Handoff Log`에 표준 양식으로 기록합니다.
