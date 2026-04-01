---
name: Day Start
description: 다음 날 업무 시작 전, 현재 상태 요약과 최신 블로커를 읽어 필요한 문서만 선별 로드하며 맥락을 복원하는 스킬
---

# Day Start Skill

새로운 대화 세션이나 하루 일과를 시작할 때, 긴 문서를 한꺼번에 읽지 않고도 현재 상태를 정확히 복원하기 위한 절차입니다.

## 시작 전 점검 절차

### 1단계: `CURRENT_STATE.md`부터 확인
- `.agents/artifacts/CURRENT_STATE.md`를 가장 먼저 읽습니다.
- `Next Recommended Agent`, `Must Read Next`, `Open Decisions / Blockers`, `Latest Handoff Summary`를 기준으로 오늘의 시작 지점을 잡습니다.
- 이 문서는 resume router입니다. task / lock의 실제 기준은 `TASK_LIST.md`에서 다시 확인합니다.
- 아래 조건 중 하나라도 맞으면 `CURRENT_STATE.md`를 stale로 봅니다.
  - `Sync Checked At`이 최신 relevant handoff보다 과거
  - `Current Stage`, `Current Focus`, `Current Release Goal`이 `TASK_LIST.md > Current Release Target`과 다름
  - `Last Synced From Task / Handoff` 또는 `Latest Handoff Summary`가 최신 relevant handoff와 어긋남
  - `Task List Sync Check`가 `Needs Review`
  - `Current locks to respect`와 실제 `## Active Locks`가 어긋남
- stale이면 `TASK_LIST.md > ## Active Locks`, 관련 Task row, 최신 relevant handoff를 다시 읽고 시작점을 재구성합니다.

### 2단계: 필요한 문서만 추가 로드
- fresh하면 `TASK_LIST.md > ## Active Locks`, 관련 Task row, 최신 relevant handoff까지만 먼저 확인하고 시작합니다.
- `Must Read Next`에 적힌 문서를 읽되, `TASK_LIST.md > ## Active Locks`와 관련 Task row 확인은 항상 포함합니다.
- 보통은 `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md` 중 오늘 역할에 필요한 범위만 읽으면 충분해야 합니다.
- `HANDOFF_ARCHIVE.md`는 기본적으로 읽지 않습니다.
- `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`는 현재 task와 직접 연결된 blocker, gate, 또는 실환경 검증이 있을 때만 추가로 읽습니다.

### 3단계: lock / blocker / 실패 기록 점검
- `TASK_LIST.md > ## Active Locks`를 확인해 남아 있는 점유 상태를 봅니다.
- `CURRENT_STATE.md > Open Decisions / Blockers`와 필요 시 `WALKTHROUGH.md`, `REVIEW_REPORT.md`의 최근 결과를 확인합니다.
- 해결되지 않은 치명적 버그나 stale lock이 있으면 새 기능보다 먼저 다룹니다.

### 4단계: 오늘의 작업 범위 고정
- 오늘 수행할 Task ID 1~3개와 Scope를 정합니다.
- 첫 Task ID와 첫 문서 또는 첫 명령을 작업 시작 전에 스스로 한 줄로 확정합니다.
- 실제 작업 시작 전에는 `workspace.md`의 `pre-write refresh` 규칙에 따라 `CURRENT_STATE.md`, `TASK_LIST.md`, 대상 파일을 다시 확인합니다.
