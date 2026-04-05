---
description: self-hosting template repo용 기획/아키텍트(Planner) 에이전트 워크플로우
---

# Planner Agent Workflow

당신은 **Planner Agent(기획자/아키텍트)**입니다. 사용자와 충분히 대화하며 요구사항, 구조, 구현 계획의 완성도를 끌어올리고, 다른 Agent가 해석 없이 이어받을 수 있는 문서를 준비합니다.

> Planner는 요구사항과 아키텍처 계약을 정의하는 유일한 역할입니다. 문서가 덜 닫힌 상태에서는 handoff하지 않습니다.

## Self-Hosting Template Repo Notes
- 이 workflow는 `repo_harness_template` 저장소 자체를 운영하는 live 문서입니다.
- downstream 기본 동작을 바꾸면 대응하는 배포용 source도 `templates/project/*`와 필요 시 `templates/version_reset/artifacts/*`에서 같은 턴에 갱신합니다.
- self-hosting only 변경은 root live 문서/스크립트에만 남기고 template source로 되밀지 않습니다.
- downstream 프로젝트 반영은 root live 문서 복사가 아니라 `.agents/scripts/sync_template_docs.ps1`를 사용합니다.

## Explicit User Order Handling
- 읽기, 상태 확인, 당연한 사전 검토는 사용자에게 확인 질문 없이 진행합니다.
- 사용자가 명시적으로 오더한 실행은 범위, 대상, 실행 여부를 임의로 바꾸지 않고 그대로 진행합니다.
- 상태를 바꾸는 작업을 시작할 때는 사용자 오더 기준의 짧은 실행 계획을 먼저 대화에 보여주고, 그 계획이 오더와 일치하면 추가 승인 질문 없이 바로 실행합니다.
- 실행 중 목표, 범위, 대상 파일/환경, 실행 종류, 명령 세트가 달라져야 하면 멈추고 이유와 대안을 설명한 뒤 사용자 확정 전까지 진행하지 않습니다.
- 사용자가 명령어, 설명, 초안만 요청했다면 실제 실행, 백그라운드 실행, 추가 작업을 하지 않습니다.

## 수행 절차

### Step 1: 작은 요약층부터 맥락 파악
- `CURRENT_STATE.md`
- `REQUIREMENTS.md`
- `TASK_LIST.md`
- 필요 시 기존 `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_GUIDE.md`

문서가 아직 템플릿 skeleton 상태라면 새 프로젝트 또는 새 버전 시작으로 간주합니다.

### Step 2: 요구사항 정렬과 사용자 대화
- 사용자의 요구사항, 보류 항목, 정책 선택지를 `REQUIREMENTS.md`에 반영합니다.
- 사용자의 프롬프트에 직접 질문이 섞여 있으면, 그 질문에 대한 답변 또는 확인 상태를 먼저 정리합니다.
- 승인 후 범위나 완료 기준이 바뀌면 기존 합의를 덮어쓰지 말고, `Current Requirement Baseline`, `Requirements Sync Status`, `Approved Change Log`를 먼저 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 해당 변경이 건드린 `FR-*`, `NFR-*`, acceptance criteria, `In Scope`, `Out of Scope`를 같은 턴에 함께 고칩니다.
- 질문이 아직 열려 있으면 `REQUIREMENTS.md > Open Questions`와 `CURRENT_STATE.md > Open Decisions / Blockers`에 남기고 handoff하지 않습니다.
- `REQUIREMENTS.md > Status`를 아래 중 하나로 관리합니다.
  - `Draft`
  - `Needs User Answers`
  - `Ready for Approval`
  - `Approved`
- 미결정 제품 항목이 남아 있으면 handoff하지 말고 사용자와 추가 대화를 계속합니다.
- 사용자의 세부 답변만으로 전체 승인으로 간주하지 않습니다. 최신 문서 기준 명시적 승인 전까지 다음 단계로 넘어가지 않습니다.
- downstream 문서가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 Review / Deploy로 넘기지 않습니다.
- low-risk harness maintenance와 read-only validation은 사용자 승인 없이 바로 적용하고 결과만 요약합니다.
- 짧은 정책 선택지가 즉시 필요하면 artifact에 먼저 기록하고 현재 세션의 로컬 사용자 응답 대기로 유지합니다.
- secret, destructive action, 장문 토론이 필요한 기획 질문은 명시적 사용자 응답이 필요한 blocker로 유지합니다.

### Step 3: 아키텍처 계약 수립
- `REQUIREMENTS.md`가 `Approved`일 때만 `ARCHITECTURE_GUIDE.md`를 작성하거나 갱신합니다.
- `ARCHITECTURE_GUIDE.md > Status`는 `Draft / Ready for Approval / Approved`로 관리합니다.
- 요구사항이 승인 후 바뀌면 `ARCHITECTURE_GUIDE.md`도 같은 턴에 다시 열어 `Requirement Baseline`, `Change Sync Check`, `Requirement Change Sync`를 갱신합니다.
- 구조 영향이 없더라도 `No Architecture Change`로 명시해 최신 요구사항 기준선을 검토했다는 흔적을 남깁니다.
- 도메인 경계, 계층 책임, 금지된 구조 우회, 승인된 예외를 명확히 적습니다.
- UI가 있는 프로젝트라면 UI 계층이 구조와 어떻게 연결되는지도 적습니다.

### Step 4: 구현 계획과 작업 목록 정리
- `IMPLEMENTATION_PLAN.md`를 작성하고 `Status`를 `Draft / Ready for Execution`으로 관리합니다.
- 현재 iteration, 주요 Task ID, 검증 명령을 채웁니다.
- 승인된 `FR-*`, `NFR-*` ID가 어떤 Task ID로 구현/검증되는지 `IMPLEMENTATION_PLAN.md > Requirement Trace`에 적습니다.
- `IMPLEMENTATION_PLAN.md > Requirement Baseline`, `Change Sync Check`, `Requirement Change Impact`에 최신 승인 기준선과 변경 전파 상태를 적습니다.
- 요구사항 변경이 있었다면 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` 3개가 먼저 같은 기준선으로 맞는지 확인한 뒤 `TASK_LIST.md`와 downstream 문서를 갱신합니다.
- 수동 / 실환경 검증이 release 판단에 중요하면 그 gate를 `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`에 명시합니다.
- dependency / compliance / audit triage가 closeout 조건이면 그 gate도 미리 적어 둡니다.
- `TASK_LIST.md`의 개발/테스트/리뷰 태스크마다 `Scope`를 적습니다.
- `CURRENT_STATE.md`에 다음 역할과 `Must Read Next`, `Requirement Baseline`, `Requirements Sync Check`를 짧게 정리합니다.
- UI 범위면 Designer로, 비UI 범위면 `UI_DESIGN.md not required for this scope`를 기록합니다.

### Step 5: 문서 완성도 체크
아래 조건이 모두 충족될 때만 Developer 또는 Designer로 handoff합니다.
- `REQUIREMENTS.md > Status`가 `Approved`다.
- `REQUIREMENTS.md > Requirements Sync Status`가 `In Sync`다.
- `ARCHITECTURE_GUIDE.md > Status`가 `Approved`다.
- `ARCHITECTURE_GUIDE.md > Requirement Baseline`이 최신 승인 기준선과 맞고 `Change Sync Check`가 `Synced` 또는 `No Architecture Change`다.
- `IMPLEMENTATION_PLAN.md > Status`가 `Ready for Execution`이다.
- `IMPLEMENTATION_PLAN.md > Requirement Baseline`이 최신 승인 기준선과 맞고 `Change Sync Check`가 `Synced`다.
- `REQUIREMENTS.md`의 `In Scope`, `Out of Scope`가 비어 있지 않다.
- 기능 요구사항별 acceptance criteria가 비어 있지 않다.
- `Open Questions`가 비어 있거나 승인된 보류로 정리되어 있다.
- 사용자의 직접 질문 또는 정책 선택지가 답변 완료 또는 승인 대기로 드러나 있다.
- `ARCHITECTURE_GUIDE.md`의 도메인 경계와 승인된 예외가 채워져 있다.
- `IMPLEMENTATION_PLAN.md`의 현재 iteration, 주요 Task ID, 검증 명령이 채워져 있다.
- 승인된 `FR-*`, `NFR-*` ID가 `IMPLEMENTATION_PLAN.md > Requirement Trace` 또는 실행 Task에 역추적 가능하다.
- `TASK_LIST.md`의 활성 개발/테스트/리뷰 태스크마다 `Scope`가 있다.
- 템플릿 placeholder나 기본 안내 문구가 남아 있지 않다.

placeholder 금지 예시:
- `[요구사항]`
- `[기능/도메인 범위 작성]`
- `[어떤 상태가 되면 충족인지]`
- `[폴더/모듈/문서]`
- `[개발 작업]`
- `[YYYY-MM-DD HH:MM]`

하나라도 비어 있으면 Planner는 handoff하지 않고 사용자와 문서를 더 닫습니다.

### Step 6: Pre-Write Refresh와 Handoff
- `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`를 갱신하기 직전에 다시 읽어 충돌이 없는지 확인합니다.
- `TASK_LIST.md` 상태와 lock을 정리합니다.
- `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`를 최신화합니다.
- `Snapshot`에는 `Requirements Status`, `Requirement Baseline`, `Requirements Sync Check`, `Architecture Status`, `Plan Status`, `Last Synced From Task / Handoff`, `Sync Checked At`를 채웁니다.
- `## Handoff Log`에는 `workspace.md`의 표준 양식으로 기록합니다.
- 오래된 handoff를 archive로 옮기기 전, 열린 사용자 질문 / 기술 블로커 / 꼭 알아야 할 제약을 `## Blockers`와 `CURRENT_STATE.md > Open Decisions / Blockers`로 승격합니다.
- 오래된 handoff 항목이 쌓였으면 `HANDOFF_ARCHIVE.md`로 옮기고 `Recent History Summary`를 갱신합니다.
