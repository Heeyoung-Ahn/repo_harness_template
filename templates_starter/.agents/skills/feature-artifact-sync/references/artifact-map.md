# Artifact Map

이 문서는 `feature-artifact-sync` 스킬이 어떤 변경을 어떤 문서에 반영해야 하는지 빠르게 판단하기 위한 참조표다.

## 1. 변경 유형별 매핑

| 변경 유형 | 우선 갱신 문서 | 함께 볼 문서 | 메모 |
|---|---|---|---|
| 제품 동작, 범위, 정책이 바뀜 | `REQUIREMENTS.md` | `TASK_LIST.md`, `docs/*`, 명시적으로 요청된 외부 문서 | 구현 사실보다 제품 계약이 먼저다. |
| 도메인 경계, 저장 구조, 서비스 책임이 바뀜 | `ARCHITECTURE_GUIDE.md` | `IMPLEMENTATION_PLAN.md`, `REVIEW_REPORT.md` | 승인 없는 구조 변경이면 Planner 재개입을 검토한다. |
| IA, 탭 구조, 화면 동선, 설정 플로우가 바뀜 | `UI_DESIGN.md` | `REQUIREMENTS.md`, `WALKTHROUGH.md`, `docs/*` | UI가 외부 문서에 노출되면 명시적으로 요청된 문서만 같이 본다. |
| 구현 범위, 다음 단계, blocker 상태가 바뀜 | `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md` | `WALKTHROUGH.md` | 진행률과 남은 게이트를 실제 상태에 맞춘다. |
| 자동 테스트, smoke, 수동 검증 결과가 생김 | `WALKTHROUGH.md` | `TASK_LIST.md` | 실제 수행 명령, 결과, 미완료 검증을 구분해서 적는다. |
| 리뷰 승인/반려, 구조 리스크가 생김 | `REVIEW_REPORT.md` | `ARCHITECTURE_GUIDE.md`, `TASK_LIST.md` | 리뷰 의견과 구현 수정 요구를 분리한다. |
| 배포 절차, 배포 상태, 릴리즈 체크가 바뀜 | `DEPLOYMENT_PLAN.md` | `CHANGELOG.md`, 별도 배포 가이드 | 배포 전 준비와 실제 배포 완료를 섞지 않는다. |
| AI 모델, 프롬프트, 기능 설명이 바뀜 | `ai_features_summary.md` | `REQUIREMENTS.md`, `docs/*`, 명시적으로 요청된 외부 문서 | 내부 모델 변경이 사용자 경험에 영향이 있으면 요구사항/문서도 같이 본다. |
| 설정/정책/신뢰 안내 문구가 바뀜 | `REQUIREMENTS.md`, `docs/*`, 명시적으로 요청된 외부 문서 | `WALKTHROUGH.md`, `REVIEW_REPORT.md` | 실제 데이터 흐름과 문구가 어긋나지 않아야 한다. |

## 2. 문서별 체크포인트

### `REQUIREMENTS.md`

- 사용자 관점 계약이 정말 바뀌었을 때만 수정한다.
- 구현 세부 코드명보다 제품 규칙과 범위를 적는다.
- 아직 결정되지 않은 정책을 완료형 문장으로 쓰지 않는다.

### `ARCHITECTURE_GUIDE.md`

- 저장 위치, 서비스 책임, 도메인 경계, 데이터 흐름이 바뀌었을 때만 수정한다.
- 단순 UI 문구나 테스트 로그는 넣지 않는다.

### `IMPLEMENTATION_PLAN.md`

- 구현 단계, 완료 기준, 남은 검증 순서, 중간 게이트를 현재 상태에 맞춘다.
- 이미 끝난 단계를 다음 작업처럼 남겨두지 않는다.

### `TASK_LIST.md`

- 상태 표시는 `[ ]`, `[-]`, `[x]`, `[!]`만 사용한다.
- `## Active Locks`와 실제 점유 상태를 맞춘다.
- Handoff Log는 항상 맨 아래에 추가한다.

### `WALKTHROUGH.md`

- 실제 실행한 명령과 관찰만 남긴다.
- sandbox 실패와 사용자 보류를 구분해서 기록한다.
- 아직 하지 않은 실기기 검증을 완료처럼 적지 않는다.

### `REVIEW_REPORT.md`

- 리뷰어 관점의 승인/반려, 구조 리스크, 보안 관찰을 적는다.
- 테스트 로그나 구현 계획을 반복해서 옮기지 않는다.

### `DEPLOYMENT_PLAN.md`

- 배포 준비 체크, 실제 배포 결과, 남은 릴리즈 리스크를 적는다.
- 개발 중간 상태를 배포 완료처럼 쓰지 않는다.

### `README.md`, `docs/*`

- `README.md`와 `PROJECT_WORKFLOW_MANUAL.md`는 비운영 문서다.
- 운영 프로세스의 입력 문서로 사용하지 않는다.
- 사용자 노출 또는 저장소 소개를 위해 명시적으로 요청된 경우에만 갱신한다.
- 내부 handoff 메모를 섞지 않는다.

### `ai_features_summary.md`

- AI 기능 이름, 사용 메뉴, 모델, 프롬프트 특징을 현재 코드와 맞춘다.
- 모델 교체나 품질 정책 변경이 있으면 누락 없이 반영한다.

## 3. 권장 갱신 순서

1. 바뀐 사실을 코드와 테스트 결과로 먼저 확인한다.
2. 계약 문서(`REQUIREMENTS`, `ARCHITECTURE`, `UI_DESIGN`)를 고친다.
3. 실행 문서(`IMPLEMENTATION_PLAN`, `TASK_LIST`)를 현재 단계에 맞춘다.
4. 증빙 문서(`WALKTHROUGH`, `REVIEW_REPORT`, `DEPLOYMENT_PLAN`)를 실제 실행 결과로 채운다.
5. 외부 노출 문서(`docs`, `ai_features_summary`, 명시적으로 요청된 외부 문서)를 맞춘다.

## 4. 이 스킬을 쓰지 말아야 하는 경우

- 하루 마감 문서 정리만 필요하다면 `Day Wrap Up`
- 버전 아카이빙과 다음 버전 뼈대 생성이 필요하다면 `Version Closeout`
- 충돌 해결이 핵심이라면 `Conflict Resolver`
