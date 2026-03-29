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
- `TASK_LIST.md > ## Handoff Log`는 기본적으로 최근 8개 이내를 유지하되, 활성 manual / review loop와 직접 연결된 relevant entry는 loop가 닫힐 때까지 임시 유지할 수 있습니다.
- 초과분은 `HANDOFF_ARCHIVE.md`로 옮기고 `CURRENT_STATE.md > Recent History Summary`가 최신 상태를 설명하도록 맞춥니다.
- 오래된 history는 요약만 남기고, 다음 세션에 필요한 최신 상태만 남깁니다.

### Step 4: Closeout 시 추가 작업
- version closeout이면 `CURRENT_STATE.md`와 `HANDOFF_ARCHIVE.md`까지 archive 대상으로 포함합니다.
- 새 버전 시작 문서에는 초기 `CURRENT_STATE.md`와 초기 `## Handoff Log`를 준비합니다.
