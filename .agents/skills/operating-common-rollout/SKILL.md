---
name: operating-common-rollout
description: Safely standardize and propagate a common change discovered in one operating project into this self-hosting template repo and sibling operating projects. Use this whenever the user says a shared skill, rule, workflow, script, or starter-bound document was updated in one operating repo and should now update the standard template and roll out everywhere else. This is a self-hosting-only operating skill and must not be copied into `templates_starter` or downstream repos.
---

# Operating Common Rollout

이 스킬은 한 운영 프로젝트에서 검증된 공통 변경을 `repo_harness_template`의 canonical source로 끌어올리고, 필요한 운영 프로젝트들로 안전하게 재배포할 때 사용한다.

이 스킬의 목표는 단순 복사가 아니다. 먼저 변경을 일반화하고, 어느 층의 canonical source를 수정해야 하는지 분류한 뒤, rollout 범위와 검증까지 닫는 것이다.

필요하면 아래 reference를 추가로 읽는다.

- `references/path_matrix.md`: 변경 유형별 canonical 경로, rollout 대상, stop condition 요약

## 1. 시작 순서

항상 아래 순서로 시작한다.

1. `AGENTS.md`
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md > ## Active Locks`
5. downstream 공통 동작 변경이면 `.agents/rules/template_repo.md`

그다음 아래를 확인한다.

- source project 경로
- source project에서 실제로 바뀐 파일/폴더
- 이 변경이 공통 변경인지, project-local 변경인지
- 다른 repo에 같은 경로 커스터마이징이 있는지

## 2. 먼저 변경 층을 분류한다

변경을 아래 네 가지 중 하나로 먼저 분류한다.

### A. self-hosting only

이 저장소에서만 의미가 있는 운영 스킬, 운영 메모, local validator, handoff용 규칙이다.

예:

- root `AGENTS.md`
- root `.agents/artifacts/*`
- root 전용 운영 스킬
- self-hosting only helper 문서

이 경우:

- root만 수정한다.
- `templates_starter`와 downstream 운영 프로젝트에는 rollout하지 않는다.

### B. shared starter-bound source

운영 프로젝트들에 실제로 배포되는 공통 규칙/워크플로/스킬/스크립트다.

예:

- `templates_starter/.agents/skills/*`
- `templates_starter/.agents/rules/*`
- `templates_starter/.agents/workflows/*`
- `templates_starter/.agents/scripts/*`

이 경우:

- 필요하면 root 대응 source도 같이 맞춘다.
- 그다음 `.agents/scripts/sync_template_docs.ps1`로 rollout한다.

### C. shared skill mirrored in root and starter

self-hosting repo도 직접 사용하는 공통 스킬이라 root와 starter 양쪽에 모두 존재하는 경우다.

예:

- `.agents/skills/expo_real_device_test/*`
- `templates_starter/.agents/skills/expo_real_device_test/*`

이 경우:

1. root canonical skill source를 먼저 갱신한다.
2. starter 대응 source를 같이 갱신한다.
3. downstream 운영 프로젝트들에 rollout한다.

### D. live project artifact only

특정 운영 프로젝트의 현재 상태 문서나 로컬 task/history처럼 다른 프로젝트에 복제하면 안 되는 내용이다.

예:

- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- 실제 제품 요구사항/테스트 결과/배포 상태

이 경우:

- 다른 프로젝트로 복사하지 않는다.
- 필요하면 구조나 schema만 template source에 반영한다.

## 3. source project에서 가져올 때 지켜야 할 규칙

- 먼저 source project에서 변경이 실제로 검증됐는지 확인한다.
- 그대로 복사하기 전에 project-specific 값을 일반화한다.
- 아래 항목이 남아 있으면 바로 rollout하지 않는다.

점검 항목:

- 앱 이름
- package name / bundle id
- task ID
- provider 이름
- 사용자 계정, secret, URL
- 특정 프로젝트 화면명/문구를 공통 정책처럼 단정한 표현

일반화 원칙:

- 고정값은 `<package>`, `현재 체크리스트`, `현재 활성 task`처럼 현재 문맥 치환형으로 바꾼다.
- 테스트 범위는 현재 프로젝트 문서에서 다시 읽도록 유도한다.
- 특정 운영 프로젝트에서만 맞는 예시는 “예시”로만 남기거나 제거한다.

## 4. skill folder는 파일 하나가 아니라 폴더 단위로 본다

공통 스킬 rollout에서는 `SKILL.md`만 보지 않는다.

같이 확인할 것:

- `references/`
- `scripts/`
- `assets/`
- 하위 helper 문서

shared skill에 새 reference가 생겼다면 폴더 전체를 기준으로 canonical source를 맞춘다. `SKILL.md`만 덮어쓰면 누락이 생긴다.

## 5. 실제 rollout 절차

### shared skill / rule / workflow / script인 경우

1. source project 변경분을 읽고 공통화가 필요한 부분을 정리한다.
2. root canonical source를 갱신한다.
3. starter 대응 source를 갱신한다.
4. active lock과 target scope를 다시 확인한다.
5. 아래 스크립트로 rollout한다.

```powershell
& ".agents/scripts/sync_template_docs.ps1" -Preset "active_operating_projects"
```

특정 repo만 대상이면 `-TargetRepo`를 쓴다.

### self-hosting only 운영 스킬인 경우

1. root `.agents/skills/<skill-name>/`만 만든다.
2. `templates_starter`에는 넣지 않는다.
3. downstream 운영 프로젝트로 rollout하지 않는다.

## 6. 수작업 복사가 허용되는 경우

아래 조건을 모두 만족하면 수작업 복사도 허용한다.

- 대상이 shared skill folder다.
- source project에서 이미 검증됐다.
- project-specific 값이 제거됐다.
- 다른 운영 프로젝트에 local customization이 없다.
- 폴더 전체를 같은 상대 경로로 복사한다.

이때도 아래는 반드시 한다.

- root canonical source 갱신
- starter 대응 source 갱신
- target repo diff 확인
- validator 또는 최소 diff 검증

## 7. 검증

rollout 뒤에는 최소한 아래를 확인한다.

### root self-hosting repo

```powershell
& ".agents/scripts/check_harness_docs.ps1"
```

### downstream 운영 프로젝트

- target 파일이 실제로 생겼는지
- template source 대비 diff가 사라졌는지
- 필요하면 각 repo의 `check_harness_docs.ps1` 결과를 확인한다

skill rollout이면 특히 아래를 확인한다.

- `SKILL.md`
- `references/*`
- 새 하위 폴더 존재 여부

## 8. 기록

작업 시작 시:

- `TASK_LIST.md`에 task와 active lock 추가
- `CURRENT_STATE.md`에 현재 focus 반영

작업 종료 시:

- task 완료 처리
- active lock 제거
- `CURRENT_STATE.md`와 `TASK_LIST.md` handoff를 최신 상태로 갱신
- root validator 다시 실행

## 9. stop condition

아래 중 하나면 자동 rollout을 멈춘다.

- self-hosting only인지 downstream 공통 동작인지 모호하다
- 다른 repo에 같은 경로 local customization이 있다
- live artifact를 template source처럼 복사하려 한다
- source 변경에 secret 또는 민감값이 섞여 있다
- 활성 lock scope가 겹친다
- source project에서 아직 검증되지 않았다

## 10. 기본 출력 형식

사용자에게는 보통 아래 순서로 보고한다.

1. source project와 가져올 변경 범위
2. 변경 층 분류 결과
3. canonical source 수정 경로
4. rollout 대상
5. 검증 결과
6. 남은 위험 또는 미반영 대상
