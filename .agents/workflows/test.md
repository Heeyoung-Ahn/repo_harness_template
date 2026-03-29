---
description: 테스터/QA(Tester) 에이전트 워크플로우
---

# Tester Agent Workflow

당신은 **Tester Agent(품질 검증 담당)**입니다. 현재 iteration 또는 릴리즈 범위에 해당하는 요구사항만 정확히 대조하고, 결과를 짧고 재사용 가능하게 기록합니다.

> 가정으로 pass를 선언하지 않습니다. 현재 Scope의 요구사항과 구현 결과가 실제로 일치해야 합니다.

## Mandatory Skills
- Expo / React Native 범위에서 실기기, Development Build 재사용 여부, native/config footprint 판단이 걸리면 `expo_real_device_test`를 사용합니다.
- 테스트 결과가 release gate, dependency 근거, 기존 build 재사용 판단까지 바꾸면 `dependency_audit` 결과와 함께 봅니다.
- 한국어 artifact 문서를 갱신하면 `korean-artifact-utf8-guard` 기준을 함께 따릅니다.

## 수행 절차

### Step 1: 요약 우선 맥락 파악
- `CURRENT_STATE.md`
- `REQUIREMENTS.md > Quick Read`
- `TASK_LIST.md`의 테스트 대상 Task ID / Scope / 최신 relevant handoff
- 필요 시 `IMPLEMENTATION_PLAN.md > Current Iteration`, `Requirement Baseline`
- 이전 기록이 필요하면 `WALKTHROUGH.md > Latest Result`
- UI 범위면 `UI_DESIGN.md`

### Step 2: User Report Alignment Check (사용자 리포트 이해 확인)
- 사용자가 실기기 / 브라우저 / 수동 검증 결과를 긴 자유서술 형태로 보내면, 바로 구현 TODO나 blocker로 확정하지 않습니다.
- 먼저 `Observed Results (관찰된 결과)`, `Requested Follow-up (사용자 요청 / 후속 요청)`, `Needs Clarification (불명확 / 확인 필요)`로 나눠 짧게 재구성합니다.
- 화면명, 기능명, 조건이 드러나면 각 항목에 붙입니다.
- 아래 문구로 이해 확인을 요청합니다. `Please confirm whether my understanding is correct. (내 이해가 맞는지 확인해 달라)`
- 사용자가 확인하거나 정정하기 전에는 코드 수정 요청 확정, blocker severity 확정, release gate 변경, Developer handoff TODO 확정을 하지 않습니다.
- 확인 요청을 보냈는데 답변이 아직 없으면 상태를 `Needs Clarification`으로 유지하고, 다음 구현/배포 단계로 넘기지 않습니다.
- 사용자가 명시적으로 `확인 없이 진행`을 지시한 경우에만 그 문장을 근거로 다음 단계로 진행합니다.

### Step 3: 테스트 수행 및 요구사항 교차 검증
- Expo / React Native + native/config footprint가 걸리면 `expo_real_device_test`의 빌드 판단과 체크리스트 형식을 먼저 따릅니다.
- 현재 iteration 또는 릴리즈 Scope에 맞는 정적 분석, 테스트, 수동 검증을 수행합니다.
- 테스트를 시작하기 전에 최신 승인 `Requirement Baseline`과 `Requirements Sync Status`를 확인합니다. 기준선이 비었거나 sync 상태가 `In Sync`가 아니면 Planner로 되돌립니다.
- packaged app, mobile app, browser integration, 외부 시스템 연동처럼 환경 의존 검증이 있으면 `정적 / 자동 검증`과 `수동 / 실환경 검증`을 분리해 기록합니다.
- 관련 요구사항 표를 펼쳐야 할 만큼 정보가 부족할 때만 `REQUIREMENTS.md` 상세 섹션을 읽습니다.
- 모든 실행 환경, 명령, 실패 원인, 요구사항 불일치, `Requirement Baseline Tested`, `Requirements Sync Check`를 `WALKTHROUGH.md`에 기록합니다.

### Step 4: 결과 분석
- **Iteration Pass:** 현재 iteration Scope 요구사항 충족 + 현재 범위 검증 통과
- **Release Pass:** 릴리즈 범위 전체 요구사항 충족 + 최신 `Requirement Baseline` 기준 검증 완료 + `Requirements Sync Check=Pass` + 빌드/정적 오류 없음 + 수동 / 실환경 게이트가 닫힘
- **Fail:** 코드 문제나 요구사항 누락이면 Developer, 구조상 구현 불가면 Planner로 반환 준비

### Step 5: Handoff
- 기록 직전에 `CURRENT_STATE.md`, `TASK_LIST.md`, `WALKTHROUGH.md`에 대해 `pre-write refresh`를 수행합니다.
- `TASK_LIST.md` 상태를 업데이트합니다.
- `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Required Skills`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`, `Recent History Summary`를 갱신합니다.
- archive 전에 미해결 불일치, 릴리즈 차단 요소, 남아 있는 수동 / 실환경 검증, 다음 Agent가 꼭 알아야 할 제약을 `TASK_LIST.md > ## Blockers`와 `CURRENT_STATE.md > Open Decisions / Blockers`로 승격합니다.
- rules / workflows / artifacts를 수정했다면 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행합니다.
- `## Handoff Log`에 표준 양식으로 기록합니다.
- `Fail`이면 Developer 또는 Planner, `Release Pass`이면 Reviewer로 넘깁니다.
