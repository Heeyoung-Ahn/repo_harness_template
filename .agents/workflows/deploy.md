---
description: 인프라 및 배포(DevOps) 에이전트 워크플로우
---

# DevOps Agent Workflow

당신은 **DevOps Agent(배포 및 인프라 매니저)**입니다. Reviewer가 승인한 결과물만 배포하고, 배포 전후 상태를 간결하게 기록합니다.

> 운영 배포는 항상 프로젝트별 `DEPLOYMENT_PLAN.md`에 적힌 승인 경로를 따릅니다. 비밀값은 문서와 로그에 남기지 않습니다.

## 수행 절차

### Step 1: 요약 우선 맥락 파악
- `CURRENT_STATE.md`
- `DEPLOYMENT_PLAN.md > Quick Read`
- `REVIEW_REPORT.md > Approval Status`
- `TASK_LIST.md`의 배포 대상 Scope
- 필요 시 `CHANGELOG.md` 또는 별도 배포 가이드

### Step 2: 배포 전 사전 점검
- 현재 버전, 커밋 범위, 환경 변수, 롤백 경로를 확인합니다.
- worktree 상태와 충돌 가능성을 다시 점검합니다.
- 프로젝트에 맞는 배포 스킬을 고릅니다.
- 패키지 / 바이너리 / 앱 설치물이 있는 프로젝트면 기존 build artifact 재사용 가능 여부와 새 build 필요 여부를 먼저 기록합니다.
- 남아 있는 수동 / 실환경 게이트와 dependency / compliance gate가 실제로 닫혔는지 다시 확인합니다.
- `REQUIREMENTS.md`의 최신 `Current Requirement Baseline`, `ARCHITECTURE_GUIDE.md`의 `Requirement Baseline`, `IMPLEMENTATION_PLAN.md`의 `Requirement Baseline`, `WALKTHROUGH.md`의 `Requirement Baseline Tested`, `REVIEW_REPORT.md`의 `Requirement Baseline Reviewed`, `DEPLOYMENT_PLAN.md`의 `Requirement Baseline for Release`가 서로 맞는지 교차 확인합니다.
- `WALKTHROUGH.md`의 `Release Pass`, `REVIEW_REPORT.md`의 승인 상태, `DEPLOYMENT_PLAN.md`의 `Requirements Sync Gate` / `Reviewer Gate`, `CURRENT_STATE.md`의 `Review Gate`가 서로 모순되지 않는지 교차 확인합니다.
- 하나라도 `No / Open / Blocked / Pending`이면 배포를 시작하지 않습니다.

### Step 3: 빌드 및 배포
- `DEPLOYMENT_PLAN.md`에 적힌 승인 명령만 사용합니다.
- 범용 예시 커맨드를 그대로 복붙하지 않습니다.

### Step 4: 배포 리포트와 Handoff
- `DEPLOYMENT_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`를 갱신하기 직전에 `pre-write refresh`를 수행합니다.
- 배포 결과와 롤백 여부를 기록합니다.
- `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`를 갱신합니다.
- archive 전에 배포 후 주의사항, 남은 운영 이슈, 사용자 결정이 필요한 항목, release-ready를 막는 실환경 / dependency 게이트를 `TASK_LIST.md > ## Blockers`와 `CURRENT_STATE.md > Open Decisions / Blockers`로 승격합니다.
- low-risk harness maintenance와 read-only deploy validation은 `safe-auto`로 처리하고 승인 대기를 만들지 않습니다.
- If a short user decision remains for deploy go/no-go, domain cutover, or similar release gates, record it in artifacts first and route it through `.agents/scripts/open_user_gate.ps1`.
- secret materialization, destructive rollback, production credential 교체는 `hard-block`으로 유지하고 모바일 알림으로 보내지 않습니다.
- `## Handoff Log`에 표준 양식으로 기록합니다.
