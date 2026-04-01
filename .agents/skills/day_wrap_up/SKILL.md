---
name: Day Wrap Up
description: 오늘 하루 진행했던 업무 내용을 검토하여 물리적 아티팩트 문서들을 정리하고 하루 일과를 마무리하는 스킬. 특히 active lock이 남아 있는 다중 Agent 작업, 실기기 검증 대기, dependency audit 후속 조치, 부분 승인 상태를 다음 세션으로 정확히 넘겨야 할 때 반드시 사용한다.
---

# Day Wrap Up Skill

이 스킬은 **같은 버전 작업을 계속하는 중간 단계에서** 하루의 개발 사이클을 종료하기 전에 실행합니다.

목표는 단순 요약이 아니라 아래 4가지를 정확히 남기는 것입니다.

1. 오늘 실제로 끝난 것
2. 아직 안 끝난 것
3. 누가 어떤 lock을 계속 갖고 있는지
4. 다음 세션이 바로 시작할 수 있는 정확한 진입점

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

## 2단계: 오늘 완료 / 미완료를 분리한다

- 오늘 끝난 작업은 `TASK_LIST.md` 상태와 handoff에 반영한다.
- 오늘 해결하지 못한 버그, 미완성 기능, 수동 검증, dependency triage는 미완료 상태로 남긴다.
- "준비 완료"와 "실행 완료"를 섞어 쓰지 않는다.
- `CURRENT_STATE.md > Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`을 `TASK_LIST.md > Current Release Target`과 같은 값으로 맞춘다.

### 특히 구분할 것

- `정적 검증 통과`
- `실기기 검증 대기`
- `review 승인 범위`
- `release-ready 여부`

## 3단계: Active Lock을 보수적으로 다룬다

`TASK_LIST.md > ## Active Locks`를 확인하고 아래 원칙을 따른다.

- 내가 실제로 끝낸 작업만 lock 해제한다.
- 다른 Agent가 잡고 있는 lock은 임의로 해제하지 않는다.
- lock을 유지한 채 하루를 넘길 경우, `## Active Locks`의 `Note`와 최신 handoff에 유지 이유와 다음 세션 첫 액션을 함께 적는다.
- stale lock 의심이 있어도 증거 없이 정리하지 않는다. `workspace.md` 절차를 따른다.

## 4단계: 실기기 / 빌드 / dependency 후속을 명시한다

이 워크스페이스에서는 day wrap up 때 아래를 자주 놓친다. 빠뜨리지 않는다.

- 현재 dirty diff 기준으로 기존 Development APK 재사용 가능한지
- native/config 변경 때문에 다음 세션에서 새 `development` 빌드가 필요한지
- 다음 실행 명령이 무엇인지
  - 예: `npx expo start --dev-client -c --tunnel`
- 실기기 수동 검증 체크리스트가 남아 있는지
- dependency audit triage가 남아 있는지

## 5단계: 아티팩트를 정리한다

필요한 문서만 갱신한다.

- 진행 상태 / lock / handoff: `TASK_LIST.md`
- 최신 추천 역할 / open blocker / 다음 진입점: `CURRENT_STATE.md`
- 테스트 결과: `WALKTHROUGH.md`
- 리뷰 상태: `REVIEW_REPORT.md`
- 배포 준비 상태: `DEPLOYMENT_PLAN.md`

문서에는 실제 사실만 적는다.

## 6단계: Handoff Log를 남긴다

`TASK_LIST.md` 하단의 `## Handoff Log`에 아래 형식으로 추가한다.

```markdown
### [YYYY-MM-DD HH:MM] [Day Wrap Up] -> [Next Session / Planned Agent]
- **Completed:** [오늘 완료한 작업 요약]
- **Next:** [다음 세션 첫 작업과 순서]
- **Notes:** [남은 리스크, lock, 실기기/의존성 후속]
```

### 좋은 `Next`의 조건

- 누가 시작하는지 분명하다.
- 첫 `Task ID`가 적혀 있다.
- 첫 명령이나 첫 문서가 backticks로 분명하다.
- blocker, manual gate, dependency gate가 있으면 첫 순서 전에 적혀 있다.
- "필요 시"가 아니라 구체적인 순서가 적혀 있다.

## 7단계: `CURRENT_STATE.md`를 마지막에 맞춘다

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

## 완료 후 사용자 보고 원칙

사용자에게는 아래 3가지만 짧게 전달한다.

1. 오늘 무엇을 정리했는지
2. 무엇이 아직 남았는지
3. 다음 세션 첫 작업이 무엇인지

불필요한 인사말이나 과장된 완료 표현은 쓰지 않는다.
