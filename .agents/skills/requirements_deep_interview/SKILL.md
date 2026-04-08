---
name: requirements_deep_interview
description: Planner가 `REQUIREMENTS.md`를 새로 쓰거나 수정하기 전에 구조화된 deep interview를 수행하는 스킬. 요구사항이 복잡하거나 단순해 보여도 빠뜨리기 쉬운 범위, acceptance, evidence, UI pain point, open question을 먼저 정리해야 할 때 반드시 사용한다. 특히 change request, 새 버전 planning, operator-facing UI, `Project Monitor Web`, mockup-first intake, 정책/승인/rollout 기준 정의가 섞인 작업이면 항상 이 스킬을 먼저 사용한다.
---

# Requirements Deep Interview

이 스킬은 OMX `deep-interview` 아이디어를 내부화한 Planner 전용 discovery 절차입니다.

핵심 원칙은 두 가지입니다.
- 이 스킬은 항상 `REQUIREMENTS.md` 작성 전에 먼저 수행한다.
- interview 결과 자체는 truth가 아니며, 최종 합의는 반드시 artifact에 정리한다.

## 목표
- 사용자의 요구를 goal, actor, scope, constraint, evidence, acceptance 단위로 구조화한다.
- 모호한 표현을 implementation 이전에 requirement language로 바꾼다.
- UI/operator-facing 범위가 있으면 pain point와 mockup input까지 같이 수집한다.

## Output Contract
- 최소 결과는 아래 8가지를 포함해야 한다.
  - problem statement
  - user/actor
  - in scope
  - out of scope
  - workflow or operating flow
  - constraints / boundaries
  - evidence / test expectation
  - open questions / approval points
- 아래 6가지는 기능이 단순해 보여도 기본으로 수집한다.
  - cross-module invariant
  - backward compatibility expectation
  - forbidden shortcut
  - sensitive path or do-not-break flow
  - likely failure mode
  - review / test evidence expectation
- UI/operator-facing 범위면 아래 4가지를 추가한다.
  - current pain points
  - must-see information
  - must-change flow
  - mockup validation task

## 수행 절차

### Step 1. 현재 기준선 확인
- `CURRENT_STATE.md`, `TASK_LIST.md`, 기존 `REQUIREMENTS.md`의 relevant scope를 먼저 읽는다.
- 이미 승인된 baseline과 새 요청이 어디서 충돌하는지 먼저 적는다.

### Step 2. 문제를 다시 쓰기
- 사용자의 말을 바로 requirement로 복사하지 말고, 먼저 아래 질문에 답하는 형태로 정리한다.
  - 무엇을 해결하려는가
  - 누가 쓰는가
  - 지금 무엇이 불편한가
  - 이번 턴에서 꼭 바뀌어야 하는 것은 무엇인가
  - 아직 바꾸지 말아야 하는 것은 무엇인가

### Step 3. 범위와 경계를 나누기
- `In Scope`
- `Out of Scope`
- `Must Preserve`
- `Needs User Answer`
- `Cross-Module Invariants`
- `Sensitive Paths / Do-Not-Break Flows`

경계가 애매하면 implementation으로 보내지 말고 `Open Questions`로 남긴다.

### Step 4. acceptance와 evidence로 바꾸기
- 각 요구는 가능하면 `무엇이 보여야 하는지`, `무엇이 금지되는지`, `무엇으로 확인할지`까지 바꾼다.
- review / preview / dry-run / manual feedback 같은 근거 형태를 함께 적는다.
- close evidence가 없는 요구는 아직 닫힌 요구가 아니다.

### Step 5. 구조 리스크와 실패 모드를 미리 묻기
- 이 변경이 깨뜨리면 안 되는 cross-module invariant는 무엇인가
- 기존 사용자나 운영 흐름과의 backward compatibility 제약은 무엇인가
- AI가 하기 쉬운 금지된 shortcut이나 임시 우회는 무엇인가
- 민감 경로, protected path, approval-sensitive path가 있는가
- 가장 가능성 높은 failure mode와 review/test evidence는 무엇인가

### Step 6. UI/operator-facing 범위 추가 질문
- current 화면에서 가장 불편한 점은 무엇인가
- 30초 안에 보여야 하는 정보는 무엇인가
- 현재 흐름에서 반드시 바뀌어야 하는 동선은 무엇인가
- 구현 전에 mockup으로 먼저 확인할 것은 무엇인가

### Step 7. artifact로 동기화
- 결과를 `REQUIREMENTS.md > Quick Read`, `Open Questions`, `In Scope`, `Out of Scope`, `FR/NFR`, acceptance criteria로 옮긴다.
- 필요하면 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`까지 같은 턴에 동기화한다.
- task packet이 필요한 범위면 `IMPLEMENTATION_PLAN.md`에 context / invariant / trap / evidence contract까지 함께 반영한다.

## Guardrails
- `.omx/*`, raw interview note, free-form brainstorm은 truth가 아니다.
- mockup 승인 전 UI implementation scope를 닫지 않는다.
- user-facing question이 남아 있으면 `Needs User Answers` 상태를 유지한다.
