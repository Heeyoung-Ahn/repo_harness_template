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

## 실행 절차

### 1단계: 릴리즈 범위와 이월 항목 확인
- 이번 버전에 포함된 기능, 테스트 결과, 배포 결과, 미완료 backlog를 확인합니다.

### 2단계: 버전별 아카이빙
- `.agents/artifacts/archive/releases/vX.X.X/` 폴더를 생성합니다.
- 아래 문서를 이동 또는 복사합니다.
  - `CURRENT_STATE.md`
  - `HANDOFF_ARCHIVE.md`
  - `TASK_LIST.md`
  - `IMPLEMENTATION_PLAN.md`
  - `WALKTHROUGH.md`
  - `REVIEW_REPORT.md`
  - `DEPLOYMENT_PLAN.md`

### 3단계: Living Documents 유지
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `UI_DESIGN.md` (UI 프로젝트만)

필요 시 snapshot을 archive에 보관할 수 있습니다.

### 4단계: 다음 버전 문서 뼈대 생성
- 새 `CURRENT_STATE.md`
- 새 `HANDOFF_ARCHIVE.md`
- 새 `TASK_LIST.md`
- 새 `IMPLEMENTATION_PLAN.md`
- 새 `WALKTHROUGH.md`
- 새 `REVIEW_REPORT.md`
- 새 `DEPLOYMENT_PLAN.md`

새 `TASK_LIST.md`에는 초기 `## Handoff Log` entry를 남깁니다.  
새 `CURRENT_STATE.md`에는 다음 시작 역할과 `Must Read Next`를 적습니다.

### 5단계: 릴리즈 요약 반영
- `CHANGELOG.md` 또는 `README.md`에 핵심 변경 사항을 기록합니다.
