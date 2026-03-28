---
name: feature-artifact-sync
description: 코드, UI, 테스트, 리뷰, 문서 변경 뒤 이 워크스페이스의 기능 관련 아티팩트를 동기화하는 스킬. 기능 구현이나 수정으로 제품 동작, 아키텍처, UI 흐름, QA 상태, handoff 상태, README/docs, AI 기능 요약이 바뀌어 `.agents/artifacts/*.md`와 지원 문서를 함께 최신화해야 할 때 사용한다.
---

# Feature Artifact Sync

이 스킬은 같은 버전 작업을 진행하는 중, 코드 변경과 문서 상태를 다시 맞추는 절차를 제공한다.

> 버전 종료 아카이빙은 `Version Closeout`을 사용한다.
>
> 하루 마감 정리는 `Day Wrap Up`을 사용한다.

## 빠른 판단

다음 중 하나라도 해당하면 이 스킬을 사용한다.

- 기능 구현 또는 버그 수정으로 제품 동작 설명이 바뀌었다.
- 저장 구조, 서비스 책임, 도메인 경계가 바뀌었다.
- 화면 흐름, 탭 구조, 설정 진입점, 버튼 동선이 바뀌었다.
- 테스트 결과, blocker, 수동 검증 상태가 바뀌었다.
- 리뷰 결과, 승인 여부, 배포 준비 상태가 바뀌었다.
- README, 사용자 문서, AI 기능 총람까지 같이 맞춰야 한다.

## 작업 순서

### 1. 변경 범위를 재구성한다

- `git status`, `git diff --stat`, 최근 handoff를 보고 어떤 Task ID와 기능 범위가 바뀌었는지 잡는다.
- `TASK_LIST.md`의 `## Active Locks`를 확인하고, 겹치는 범위가 있으면 섣불리 문서를 덮어쓰지 않는다.
- 문서에 적을 수 있는 사실만 사용한다. 구현되지 않은 내용을 완료처럼 쓰지 않는다.

### 2. 어떤 문서를 동기화할지 고른다

- 기본 매핑은 [artifact-map.md](./references/artifact-map.md)를 따른다.
- 문서 갱신이 필요한지 확신이 없으면, 변경 성격을 기준으로 가장 가까운 아티팩트부터 대조한다.

### 3. 문서를 올바른 순서로 갱신한다

아래 순서를 우선한다.

1. 계약 문서: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`
2. 실행 문서: `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`
3. 증빙 문서: `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`
4. 지원 문서: `README.md`, `docs/*`, `ai_features_summary.md`

순서를 지키는 이유:
- 요구사항과 아키텍처가 먼저 닫혀야 나머지 문서 표현이 흔들리지 않는다.
- 테스트나 리뷰 결과는 실제 실행 근거가 생긴 뒤에만 적어야 한다.

### 4. 프로젝트 운영 규칙을 같이 반영한다

- 아티팩트 본문은 한국어로 유지한다.
- `TASK_LIST.md`의 Handoff Log는 항상 맨 아래에 추가한다.
- `Completed`, `Next`, `Notes` 라벨은 그대로 유지하고 내용만 한국어로 쓴다.
- 날짜와 버전 번호는 상대 표현 대신 실제 값으로 쓴다.
- 다른 스킬이나 워크플로우가 정본인 영역은 중복 정의하지 않는다.

### 5. 마지막으로 교차 검증한다

- `TASK_LIST.md`의 상태, lock, handoff가 현재 단계와 맞는지 확인한다.
- `WALKTHROUGH.md`와 `REVIEW_REPORT.md`에는 실제로 수행한 검증만 남긴다.
- `README.md`, `docs/*`, `ai_features_summary.md`는 사용자나 다음 작업자가 오해할 표현이 없는지 본다.
- 수동 검증이나 배포가 남아 있으면 완료처럼 쓰지 않고 미완료 상태를 명확히 남긴다.

## 중단 조건

아래 상황이면 이 스킬만으로 밀어붙이지 말고 역할을 되돌린다.

- 요구사항 자체가 아직 닫히지 않았는데 문서 확정이 필요한 경우
- 아키텍처 계약을 바꿔야 하는데 Planner 승인 없이 진행 중인 경우
- 현재 lock 범위와 겹치는 문서를 다른 Agent가 수정 중인 경우
- 버전 종료 아카이빙을 섞어 처리하려는 경우

## 출력 기대치

이 스킬을 사용한 결과는 보통 아래를 포함해야 한다.

- 어떤 변경 때문에 어떤 문서를 갱신했는지 짧은 근거
- 아직 남아 있는 수동 검증, 리뷰, 배포, blocker 상태
- 필요하면 다음 Agent가 바로 이어받을 수 있는 handoff 문구

## 리소스

- 아티팩트별 갱신 기준과 예외: [artifact-map.md](./references/artifact-map.md)
