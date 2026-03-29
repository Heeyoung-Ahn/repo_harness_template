---
name: feature-artifact-sync
description: 코드, UI, 테스트, 리뷰, 문서 변경 뒤 이 워크스페이스의 기능 관련 아티팩트를 동기화하는 스킬. 기능 구현이나 수정으로 제품 동작, 아키텍처, UI 흐름, QA 상태, review 범위, dependency audit 결과, handoff 상태, README/docs, AI 기능 요약이 바뀌어 `.agents/artifacts/*.md`와 지원 문서를 함께 최신화해야 할 때 사용한다. 특히 대형 PR, dirty worktree, active lock, 부분 승인 상태에서 문서를 과장 없이 맞춰야 할 때 반드시 사용한다.
---

# Feature Artifact Sync

이 스킬은 같은 버전 작업을 진행하는 중 코드 변경과 문서 상태를 다시 맞추는 절차를 제공합니다.

## 인코딩 가드

- `.agents/artifacts/*.md`, `.agents/rules/*.md`, `AGENTS.md`, `README.md`, `docs/*.md`를 건드리면 먼저 `korean-artifact-utf8-guard`를 적용한다.
- 위 문서는 최종 결과를 UTF-8 (BOM 없음)으로 유지한다. PowerShell이나 스크립트 경로를 쓰면 명시적 UTF-8 읽기/쓰기를 사용한다.

> 버전 종료 아카이빙은 `Version Closeout`을 사용한다.
>
> 하루 마감 정리는 `Day Wrap Up`을 사용한다.

## 빠른 판단

다음 중 하나라도 해당하면 이 스킬을 사용한다.

- 기능 구현 또는 버그 수정으로 제품 동작 설명이 바뀌었다.
- 저장 구조, 서비스 책임, 도메인 경계가 바뀌었다.
- 화면 흐름, 탭 구조, 설정 진입점, 버튼 동선이 바뀌었다.
- 테스트 결과, blocker, 수동 검증 상태가 바뀌었다.
- 리뷰 결과, 승인 범위, 배포 준비 상태가 바뀌었다.
- dependency audit, 라이선스, 빌드 필요 여부 같은 운영 판단이 바뀌었다.
- README, 사용자 문서, AI 기능 총람까지 같이 맞춰야 한다.

## 1단계: 먼저 "어떤 종류의 변경인지" 분류한다

문서를 열기 전에 변경 유형을 먼저 나눈다.

- **제품 계약 변경**
  - 요구사항, 아키텍처, UI 규칙 변경

- **구현 상태 변경**
  - Task 진행, lock 상태, handoff, 테스트 결과 변경

- **증빙 / 게이트 변경**
  - review 결과, dependency audit, 실기기 검증, 배포 준비 상태 변경

- **지원 문서 변경**
  - README, docs, AI 기능 요약 변경

이 분류를 먼저 해두면 필요 없는 문서를 과도하게 고치지 않게 된다.

## 2단계: 변경 범위를 재구성한다

최소한 아래를 확인한다.

- `git status`
- `git diff --stat`
- 최근 handoff
- `TASK_LIST.md > ## Active Locks`
- 필요 시 `CURRENT_STATE.md`

### 여기서 반드시 판단할 것

- 어떤 Task ID와 연결되는지
- active lock과 겹치는지
- 이미 완료된 사실인지, 아직 예정인 일인지
- 대형 PR / dirty worktree 상황인지

문서에는 적을 수 있는 사실만 사용한다. 구현되지 않은 내용을 완료처럼 쓰지 않는다.

## 3단계: 어떤 문서를 동기화할지 최소 집합으로 고른다

기본 매핑은 [artifact-map.md](./references/artifact-map.md)를 따른다.

### 자주 쓰는 매핑

- 요구사항 변경: `REQUIREMENTS.md`
- 구조 변경: `ARCHITECTURE_GUIDE.md`
- 화면/동선 변경: `UI_DESIGN.md`
- 진행 상태 / 락 / handoff 변경: `TASK_LIST.md`, `CURRENT_STATE.md`
- 자동/수동 검증 결과 변경: `WALKTHROUGH.md`
- 리뷰 상태 변경: `REVIEW_REPORT.md`
- 배포 준비 / build / device-test / dependency gate 변경: `DEPLOYMENT_PLAN.md`
- 사용자 안내 변경: `README.md`, `docs/*`
- AI 모델/기능 요약 변경: `ai_features_summary.md`

### 불필요한 과수정 금지

- 계약이 안 바뀌었으면 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`를 손대지 않는다.
- 단순 review / audit / device-test 후속이면 증빙 문서와 상태 문서만 갱신한다.
- skill/process 문서 변경만 있었으면 제품 계약 문서를 건드리지 않는다.

## 4단계: 문서를 올바른 순서로 갱신한다

아래 순서를 우선한다.

1. 계약 문서: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`
2. 실행 문서: `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`
3. 증빙 문서: `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`
4. 상태 문서: `CURRENT_STATE.md`
5. 지원 문서: `README.md`, `docs/*`, `ai_features_summary.md`

순서를 지키는 이유:

- 요구사항과 아키텍처가 먼저 닫혀야 나머지 문서 표현이 흔들리지 않는다.
- 테스트나 리뷰 결과는 실제 실행 근거가 생긴 뒤에만 적어야 한다.
- `CURRENT_STATE.md`는 마지막에 갱신해야 최신 handoff와 추천 역할이 맞는다.

## 5단계: 부분 승인 / 부분 검증 상태를 정확히 쓴다

이 워크스페이스에서는 아래 표현을 특히 조심한다.

- `정적 검증 통과`
- `실기기 검증 대기`
- `reviewed scope 승인`
- `release 준비 보류`
- `기존 Development APK 재사용 가능`
- `native/config 변경 시 새 development build 필요`

### 쓰면 안 되는 표현

- 실기기 테스트를 안 했는데 완료처럼 쓰는 표현
- active lock 상태의 진행 중 코드를 승인 범위에 포함하는 표현
- dependency audit 결과가 있는데 release risk를 숨기는 표현

## 6단계: 프로젝트 운영 규칙을 같이 반영한다

- 아티팩트 본문은 한국어로 유지한다.
- `TASK_LIST.md`의 Handoff Log는 항상 맨 아래에 추가한다.
- `Completed`, `Next`, `Notes` 라벨은 그대로 유지하고 내용만 한국어로 쓴다.
- 날짜와 버전 번호는 상대 표현 대신 실제 값으로 쓴다.
- 다른 스킬이나 워크플로우가 정본인 영역은 중복 정의하지 않는다.

## 7단계: 마지막 교차 검증

최소한 아래를 다시 확인한다.

- `TASK_LIST.md`의 상태, lock, handoff가 현재 단계와 맞는지
- `CURRENT_STATE.md`의 추천 역할과 open blockers가 최신인지
- `WALKTHROUGH.md`와 `REVIEW_REPORT.md`에는 실제로 수행한 검증만 적었는지
- `DEPLOYMENT_PLAN.md`에 device-test / dependency gate가 반영됐는지
- `README.md`, `docs/*`, `ai_features_summary.md`가 사용자에게 오해를 주지 않는지

## 중단 조건

아래 상황이면 이 스킬만으로 밀어붙이지 말고 역할을 되돌린다.

- 요구사항 자체가 아직 닫히지 않았는데 문서 확정이 필요한 경우
- 아키텍처 계약을 바꿔야 하는데 Planner 승인 없이 진행 중인 경우
- 현재 lock 범위와 겹치는 문서를 다른 Agent가 수정 중인 경우
- 버전 종료 아카이빙을 섞어 처리하려는 경우

## 출력 기대치

이 스킬을 사용한 결과는 보통 아래를 포함해야 한다.

- 어떤 변경 때문에 어떤 문서를 갱신했는지 짧은 근거
- 아직 남아 있는 수동 검증, 리뷰, 배포, dependency, blocker 상태
- 필요하면 다음 Agent가 바로 이어받을 수 있는 handoff 문구
