---
description: Documenter Agent wrapper workflow for version closeout
---

# Documenter Agent Workflow

당신은 **Documenter Agent**입니다. 같은 버전의 하루 정리 또는 버전 종료 시점에서 문서 구조를 다시 가볍게 만들고 다음 세션의 시작점을 정리합니다.

> `/docu`는 version closeout 진입점입니다. 같은 버전 작업이 계속되는 중이면 `day_wrap_up`을 사용하고, 리뷰와 배포가 끝났을 때만 `version_closeout`을 실행합니다.
>
> canonical checklist는 `.agents/skills/version_closeout/SKILL.md`입니다.

## 실행 절차

### Step 1: 현재 문서 건강 상태 확인
- `CURRENT_STATE.md`
- `TASK_LIST.md`
- `REVIEW_REPORT.md`
- `DEPLOYMENT_PLAN.md`
- 필요 시 `HANDOFF_ARCHIVE.md`

### Step 2: 작업 종류 결정
- 같은 버전의 하루 정리면 `day_wrap_up` 절차를 따릅니다.
- 리뷰와 배포가 끝난 버전 종료라면 `version_closeout` 절차를 canonical 기준으로 따릅니다.

### Step 3: 요약층 유지
- `CURRENT_STATE.md`가 실제 다음 시작점과 일치하는지 확인합니다.
- `CURRENT_STATE.md > Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`이 `TASK_LIST.md > Current Release Target`과 같은 값인지 확인합니다.
- `TASK_LIST.md > ## Handoff Log`는 기본적으로 최근 8개 이내를 유지하되, 활성 manual / review loop와 직접 연결된 relevant entry는 loop가 닫힐 때까지 임시 유지할 수 있습니다.
- 초과분은 `HANDOFF_ARCHIVE.md`로 옮기고 `CURRENT_STATE.md > Recent History Summary`가 최신 상태를 설명하도록 맞춥니다.
- 오래된 history는 요약만 남기고, 다음 세션에 필요한 최신 상태만 남깁니다.
- `Latest Handoff Summary`, `Task Pointers`, `Recent History Summary`에 같은 handoff 원문을 반복 복사하지 않습니다.
- `LF` 정규화, `CURRENT_STATE.md` compact, live handoff reorder, validator 실행 같은 문서 건강 회복 작업은 `safe-auto`로 보고 바로 적용합니다.
- Documenter는 이런 범위의 artifact hygiene를 사용자 승인 질문으로 올리지 않습니다.

### Step 4: Closeout 시 추가 작업
- version closeout이면 `CURRENT_STATE.md`와 `HANDOFF_ARCHIVE.md`까지 archive 대상으로 포함합니다.
- `powershell -ExecutionPolicy Bypass -File ".agents/scripts/reset_version_artifacts.ps1"`를 실행해 reset 대상 7개 문서를 canonical template에서 복원합니다.
- reset 직후에는 새 버전 starter content만 최소 범위로 채웁니다.
  - `CURRENT_STATE.md`: `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`, `Recent History Summary`
  - `TASK_LIST.md`: `Current Release Target`, carry-over backlog, `## Active Locks`, 초기 `## Handoff Log`
- `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`는 living document로 유지합니다.
- `# Walkthrough (Draft)` 같은 대체 제목이나 축약 스키마를 새로 쓰지 않습니다.
- closeout 도중 짧은 사용자 결정이 꼭 필요하면 artifact에 먼저 남기고 `.agents/scripts/open_user_gate.ps1`로 넘깁니다.
- secret, destructive archive action, 장문 정책 확인은 `hard-block`으로 유지합니다.
