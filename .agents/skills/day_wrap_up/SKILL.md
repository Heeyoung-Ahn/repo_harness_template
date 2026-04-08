---
name: Day Wrap Up
description: 오늘 하루 진행했던 업무 내용을 검토하여 물리적 아티팩트 문서들을 정리하고 하루 일과를 마무리하는 스킬. 특히 active lock이 남아 있는 다중 Agent 작업, 실기기 검증 대기, dependency audit 후속 조치, 부분 승인 상태를 다음 세션으로 정확히 넘겨야 할 때 반드시 사용한다. 사용자가 `오늘 작업은 여기까지`, `오늘은 마무리`, `내일 이어서 보자`, `day wrap up`처럼 오늘 세션을 닫고 다음 진입점을 남기려는 표현을 쓰면 바로 이 스킬을 사용한다.
---

# Day Wrap Up Skill

이 스킬은 **같은 버전 작업을 계속하는 중간 단계에서** 하루의 개발 사이클을 종료하기 전에 실행합니다.

목표는 단순 요약이 아니라 아래 5가지를 정확히 남기는 것입니다.

1. 오늘 실제로 끝난 것
2. 아직 안 끝난 것
3. 누가 어떤 lock을 계속 갖고 있는지
4. 반복되는 이슈 패턴이 있었는지
5. 다음 세션이 바로 시작할 수 있는 정확한 진입점

> 이 스킬은 버전 아카이빙을 하지 않습니다. 리뷰와 배포가 끝난 버전을 정리할 때는 `Version Closeout` 또는 Documenter 워크플로우를 사용합니다.

## 사전 조건

- 오늘 진행한 개발, 기획, 디자인, 테스트, 리뷰, 또는 문서 정리 내역이 존재해야 합니다.
- `.agents/artifacts/TASK_LIST.md`의 상태와 Handoff Log를 갱신할 수 있어야 합니다.

## 1단계: 일일 작업 리뷰

최소한 아래를 확인한다.

- `git status`
- `git diff --stat`
- `CURRENT_STATE.md`
- `TASK_LIST.md`
- 필요 시 `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`

### 여기서 먼저 정리할 것

- 오늘 실제로 바뀐 코드/문서/스킬
- 완료된 Task ID
- 진행 중인 Task ID
- 남은 수동 검증, 리뷰, dependency, 배포 후속

## 2단계: Issue Pattern Review

매일 아래 3개 항목을 점검한다.

1. 전역 맥락 상실과 아키텍처 표류
2. 무통제 재생성으로 인한 중복/추상화 부채
3. 검증·보안 가드레일 부족으로 인한 런타임 불안정

각 항목은 반드시 아래 셋 중 하나로 판정한다.

- `없음`
- `징후 있음`
- `확인됨`

### `징후 있음` 이상이면 바로 남길 것

- 증거: 어떤 변경, 증상, 리뷰 코멘트, 실패가 있었는지
- 영향 범위: 관련 Task ID, 경로, 모듈, 문서
- 반복 여부: 이번 릴리즈에서 처음인지, 최근 handoff/day wrap up에서 반복됐는지
- 원인 분류: `spec`, `context`, `review`, `test`, `security`, `guardrail`, `ownership` 중 어디가 비어 있었는지
- 재발 방지 액션: 어떤 rule, skill, checklist, validator, test, artifact를 바꿔야 같은 문제가 줄어드는지

### 기록 규칙

- `없음` 판정은 내부적으로 수행하되 artifact에는 남기지 않는다.
- 새 top-level 회고 문서는 만들지 않는다.
- 다음 세션이 바로 알아야 하는 내용은 `CURRENT_STATE.md`와 `TASK_LIST.md > Handoff Log`에 남긴다.
- confirmed repeat issue가 preventive rule로 승격됐거나 승격이 필요하면 `.agents/artifacts/PREVENTIVE_MEMORY.md`를 함께 갱신한다.
- 구조적 예방 조치가 필요하면 `TASK_LIST.md`에 follow-up task를 만든다.
- 기준선이나 규칙이 바뀌면 관련 `rule`, `skill`, `checklist`, `contract`를 직접 수정 대상으로 연결한다.
- 같은 release에서 같은 issue class가 2회 이상 보이면 handoff note로 끝내지 말고 follow-up task와 update target을 함께 남긴다.
- 검증·보안 가드레일 부족이 `확인됨`이면 preventive action이 정리되기 전까지 blocker 또는 open gate로 남긴다.

### `PREVENTIVE_MEMORY.md`에 남길 기준

- `확인됨`: 같은 issue class가 반복됐고 재발 방지 규칙과 검사 방법이 분명하면 `## Active Preventive Rules`에 즉시 승격한다.
- `징후 있음`: 증거는 있으나 아직 rule/check method가 덜 구체적이면 `## Promotion Candidates`에 남긴다.
- 승격할 때는 최소한 아래 4개를 함께 적는다.
  - `Repeated Mistake / Trigger`
  - `Preventive Rule`
  - `Check Method`
  - `Source / Evidence`
- preventive rule이 새 `rule`, `skill`, `checklist`, `validator`를 만들거나 바꾸는 경우 해당 수정 경로를 같은 턴에 연결한다.

## 3단계: 오늘 완료 / 미완료를 분리한다

- 오늘 끝난 작업은 `TASK_LIST.md` 상태와 handoff에 반영한다.
- 오늘 해결하지 못한 버그, 미완성 기능, 수동 검증, dependency triage는 미완료 상태로 남긴다.
- "준비 완료"와 "실행 완료"를 섞어 쓰지 않는다.
- `CURRENT_STATE.md > Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`을 `TASK_LIST.md > Current Release Target`과 같은 값으로 맞춘다.

### 특히 구분할 것

- `정적 검증 통과`
- `실기기 검증 대기`
- `review 승인 범위`
- `release-ready 여부`
- `green level이 Targeted / Package / Workspace / Merge Ready 중 어디까지 닫혔는지`
- `branch freshness 이슈인지 실제 제품 결함인지`

## 4단계: Active Lock을 보수적으로 다룬다

`TASK_LIST.md > ## Active Locks`를 확인하고 아래 원칙을 따른다.

- 내가 실제로 끝낸 작업만 lock 해제한다.
- 다른 Agent가 잡고 있는 lock은 임의로 해제하지 않는다.
- lock을 유지한 채 하루를 넘길 경우, `## Active Locks`의 `Note`와 최신 handoff에 유지 이유와 다음 세션 첫 액션을 함께 적는다.
- stale lock 의심이 있어도 증거 없이 정리하지 않는다. `workspace.md` 절차를 따른다.

## 5단계: 실기기 / 빌드 / dependency 후속을 명시한다

이 워크스페이스에서는 day wrap up 때 아래를 자주 놓친다. 빠뜨리지 않는다.

- 현재 dirty diff 기준으로 기존 Development APK 재사용 가능한지
- native/config 변경 때문에 다음 세션에서 새 `development` 빌드가 필요한지
- 다음 실행 명령이 무엇인지
  - 예: `npx expo start --dev-client -c --tunnel`
- 실기기 수동 검증 체크리스트가 남아 있는지
- dependency audit triage가 남아 있는지

## 6단계: 아티팩트를 정리한다

필요한 문서만 갱신한다.

- 진행 상태 / lock / handoff / follow-up: `TASK_LIST.md`
- 최신 추천 역할 / open blocker / 다음 진입점: `CURRENT_STATE.md`
- 장기 이력 / 주요 결정 / 큰 진척: `PROJECT_HISTORY.md`
- 반복 실수 -> 예방 규칙 -> 검사 방법: `PREVENTIVE_MEMORY.md`
- 테스트 결과: `WALKTHROUGH.md`
- 리뷰 상태: `REVIEW_REPORT.md`
- 배포 준비 상태: `DEPLOYMENT_PLAN.md`

문서에는 실제 사실만 적는다.

`PROJECT_HISTORY.md`에는 아래처럼 사건 중심 항목만 추가한다.
- 승인되거나 뒤집힌 주요 결정
- 구조나 범위를 바꾼 구현 마일스톤
- review / deploy / closeout 같은 gate closure
- 다음 버전으로 넘긴 핵심 이유

## 7단계: Handoff Log를 남긴다

`TASK_LIST.md` 하단의 `## Handoff Log`에 아래 형식으로 추가한다.

```markdown
### [YYYY-MM-DD HH:MM] [Day Wrap Up] -> [Next Session / Planned Agent]
- **Completed:** [오늘 완료한 작업 요약]
- **Next:** [다음 세션 첫 작업과 순서]
- **First Action:** [다음 세션이 바로 실행할 첫 문서 또는 첫 명령]
- **Notes:** [남은 리스크, lock, recurrence follow-up, 실기기/의존성 후속]
```

### 좋은 `Next`의 조건

- 누가 시작하는지 분명하다.
- 첫 `Task ID`가 적혀 있다.
- 첫 명령이나 첫 문서가 backticks로 분명하다.
- blocker, manual gate, dependency gate가 있으면 첫 순서 전에 적혀 있다.
- green level, branch freshness, blocker category 중 다음 세션 판단에 필요한 것이 적혀 있다.
- recurrence follow-up이나 preventive action이 있으면 다음 순서와 함께 적혀 있다.
- `PREVENTIVE_MEMORY.md`를 갱신했으면 관련 rule ID 또는 candidate ID가 적혀 있다.
- "필요 시"가 아니라 구체적인 순서가 적혀 있다.

## 8단계: `CURRENT_STATE.md`를 마지막에 맞춘다

마감 직전에는 아래 필드를 다시 확인한다.

- `Snapshot`
- `Next Recommended Agent`
- `Must Read Next`
- `Task Pointers`
- `Open Decisions / Blockers`
- `Latest Handoff Summary`
- `Recent History Summary`

`CURRENT_STATE.md`는 마지막에 맞춰야 다음 세션 진입점이 정확해진다.
- `Latest Handoff Summary`는 최신 delta만 적고, `Task Pointers`와 `Recent History Summary`에 같은 handoff 원문을 반복 복사하지 않는다.
- `CURRENT_STATE.md`가 길어지면 과거 상세는 `HANDOFF_ARCHIVE.md`와 relevant artifact에 남기고, resume에 필요한 사실만 압축한다.

## 9단계: `PROJECT_HISTORY.md` append 여부를 판단한다

아래 중 하나라도 있으면 `PROJECT_HISTORY.md`에 1~3개 항목을 추가한다.

- `CR-*` 수준의 요구사항/정책 변경
- architecture / workflow / runtime contract의 방향 전환
- major task 완료로 baseline이 바뀐 경우
- review / deploy / version closeout 같은 전환점

day wrap up에서는 raw 작업일지가 아니라 사건 요약만 남긴다.

## 완료 후 사용자 보고 원칙

사용자에게는 아래 3가지만 짧게 전달한다.

1. 오늘 무엇을 정리했는지
2. 무엇이 아직 남았는지
3. 다음 세션 첫 작업이 무엇인지

불필요한 인사말이나 과장된 완료 표현은 쓰지 않는다.
