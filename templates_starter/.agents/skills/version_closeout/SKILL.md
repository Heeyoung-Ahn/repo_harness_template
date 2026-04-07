---
name: Version Closeout
description: 리뷰와 배포가 완료된 버전을 아카이빙하고, 현재 상태 요약과 handoff archive까지 함께 정리해 다음 버전을 가볍게 시작하게 만드는 표준 스킬
---

# Version Closeout Skill

이 스킬은 **하나의 버전이 리뷰와 배포까지 모두 완료된 뒤** 실행합니다. 목적은 릴리즈 기록을 archive로 옮기고, 다음 버전이 `CURRENT_STATE.md` 중심으로 바로 시작될 수 있게 만드는 것입니다.

> 같은 버전 작업 중 하루를 마감할 때는 `day_wrap_up`을 사용합니다.

## 사전 조건
- 대상 버전 번호가 확정되어 있어야 합니다.
- `REVIEW_REPORT.md`와 `DEPLOYMENT_PLAN.md`에 승인 / 배포 결과가 기록되어 있어야 합니다.
- `TASK_LIST.md`의 `## Active Locks`가 정리되어 있거나 남은 사유가 명시되어 있어야 합니다.
- rules / workflows / artifacts를 다루므로 `korean-artifact-utf8-guard`를 함께 적용합니다.

## 실행 절차

### 1단계: 릴리즈 범위와 이월 항목 확인
- 이번 버전에 포함된 기능, 테스트 결과, 배포 결과, 미완료 backlog를 확인합니다.

### 2단계: 버전별 아카이빙
- `.agents/artifacts/archive/releases/vX.X.X/` 폴더를 생성합니다.
- 아래 문서를 이동 또는 복사합니다.
  - `CURRENT_STATE.md`
  - `PROJECT_HISTORY.md` (snapshot copy only, live file은 유지)
  - `HANDOFF_ARCHIVE.md`
  - `TASK_LIST.md`
  - `IMPLEMENTATION_PLAN.md`
  - `WALKTHROUGH.md`
  - `REVIEW_REPORT.md`
  - `DEPLOYMENT_PLAN.md`

### 3단계: Living Documents 유지
- `PROJECT_HISTORY.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `UI_DESIGN.md` (UI 프로젝트만)

필요 시 snapshot을 archive에 보관할 수 있습니다.

### 4단계: 다음 버전 문서 뼈대 생성
- 아래 명령으로 reset 대상 7개 문서를 canonical template에서 복원합니다.
- 이 프로젝트에서 canonical reset source는 `templates/version_reset/artifacts/`입니다.

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/reset_version_artifacts.ps1"
```

- reset 대상:
  - `CURRENT_STATE.md`
  - `HANDOFF_ARCHIVE.md`
  - `TASK_LIST.md`
  - `IMPLEMENTATION_PLAN.md`
  - `WALKTHROUGH.md`
  - `REVIEW_REPORT.md`
  - `DEPLOYMENT_PLAN.md`
- reset 직후에는 새 버전 starter content만 최소 범위로 채웁니다.
  - `CURRENT_STATE.md`: `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`, `Recent History Summary`
  - `TASK_LIST.md`: `Current Release Target`, carry-over backlog, `## Active Locks`, 초기 `## Handoff Log` 1건
- `IMPLEMENTATION_PLAN.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `HANDOFF_ARCHIVE.md`는 canonical 구조를 유지하고, 새 버전 작업이 실제로 열릴 때 해당 역할이 채웁니다.
- `PROJECT_HISTORY.md`는 프로젝트 전체 이력이므로 reset하지 않습니다. version closeout 시 릴리즈 요약 1건을 append하고 live 문서로 계속 유지합니다.
- `# Walkthrough (Draft)`, `# Review Report (Draft)`, `# Deployment Plan (Draft)`, `# Implementation Plan (Draft)`, `# CURRENT STATE SNAPSHOT` 같은 대체 제목이나 축약 스키마를 새로 쓰지 않습니다.
- `CURRENT_STATE.md`에는 `single source of truth` 같은 표현을 쓰지 않습니다. 이 문서는 resume router이고, 실제 task / lock 기준은 `TASK_LIST.md`입니다.

### 5단계: 릴리즈 요약 반영
- `PROJECT_HISTORY.md`에 버전 closeout 요약을 append합니다.
- `CHANGELOG.md`에 핵심 변경 사항을 기록합니다.
- `README.md`는 저장소 소개 문서이므로, 사용자가 명시적으로 요청한 경우에만 함께 갱신합니다.
