# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이번 문서의 핵심 목표: solo 중심 governance harness를 팀/대규모 프로젝트 운영까지 견딜 수 있는 명시적 계약으로 확장하고, 분산 artifact를 한 화면에서 읽는 `Project Monitor Web`을 정의한다.
- 이번 버전의 꼭 필요한 결과: ① `solo/team/large` 운영 프로필 고정 ② `.agents/runtime/team.json` 계약 고정 ③ parser-friendly artifact schema 고정 ④ read-only 정적 모니터 MVP 범위 고정 ⑤ self-hosting tool과 starter 경계 고정
- 이번 버전에서 하지 않을 것: 실시간 이벤트 스트리밍, push 알림, write action, orchestration engine, enterprise RBAC, cloud 의존 telemetry
- 사용자가 최종 승인한 범위: 템플릿은 분리하지 않고 `one core, multiple profiles`로 유지하며, 모니터링은 표준 템플릿과 별도인 웹앱으로 시작한다.
- 현재 승인 기준선과 마지막 변경 요약: `Scalable Governance Profiles v0.2` 승인본. `v0.1`의 추상 baseline을 `profile contract`, `team.json`, `parser contract`, `Project Monitor Web` 경계로 구체화했다.
- 현재 남아 있는 큰 질문: 없음. change-expensive contract는 이 문서에서 고정한다.
- 다음 역할이 꼭 읽어야 할 포인트: Phase 1 대시보드는 artifact를 읽기만 하며, 장기 운영 비용이 큰 계약은 지금 더 명시적으로 고정한다.

## Status
- Document Status: Approved
- Owner: Planner
- Current Requirement Baseline: Scalable Governance Profiles v0.2
- Requirements Sync Status: In Sync
- Last Requirement Change At: 2026-04-06 18:06
- Last Updated At: 2026-04-06 18:06
- Last Approved By: User
- Last Approved At: 2026-04-06 18:06

## Open Questions
- 없음

## Change Control Rules
- 승인 후에도 범위, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있으며, 이 경우 Planner가 먼저 이 문서를 갱신합니다.
- 중간 변경이 승인되면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 턴에 같은 기준선으로 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 `In Scope`, `Out of Scope`, `Functional Requirements`, `Non-Functional Requirements`, 관련 제약과 acceptance criteria를 같은 턴에 함께 갱신합니다.
- downstream 문서(`ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`)가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 handoff에 남깁니다.
- 사용자가 아직 변경을 승인하지 않았으면 `Requirements Sync Status`를 `Needs Re-Approval`로 두고 review / deploy gate를 닫지 않습니다.
- Reviewer와 DevOps는 이 문서의 최신 기준선을 먼저 확인하고, 문서 sync 누락을 코드 결함과 같은 종류의 blocker로 섞어 기록하지 않습니다.

## Changelog
- [2026-04-06] Planner: `solo/team/large` 운영 프로필과 read-only governance dashboard MVP 기준선을 `Scalable Governance Profiles v0.1`로 초안 작성
- [2026-04-06] Planner: 사용자 승인에 따라 `v0.2`에서 `Project Monitor Web`, `team.json`, parser contract, testable AC를 고정하고 open question을 모두 닫음

## Product Goal
- 이 프로젝트가 해결하려는 문제:
  1. solo 중심 governance harness가 팀 단위 개발과 대규모 운영으로 확장될 때 생기는 ownership, approval, audit trace, handoff, 동시 작업 관리 공백을 줄인다.
  2. 프로젝트 현황이 여러 markdown artifact에 분산되어 있어 전체 상태를 머릿속에서 조합해야 하는 비용을 줄인다.
- 최종 사용자: maintainer, planner, developer, tester, reviewer, devops, 팀 리드, 프로젝트 운영자
- 성공 기준:
  1. 하나의 template에서 solo 경량 운영과 team/large 통제 운영을 모두 지원한다.
  2. 운영자는 `Project Monitor Web` 한 화면에서 "누가 무엇을 하고 있는지", "무엇이 막혀 있는지", "내가 무엇을 결정해야 하는지"를 30초 안에 파악할 수 있다.
  3. 모니터는 source of truth를 대체하지 않고 읽기만 한다.

## Operational Profiles

| Profile | Typical Scale | Required Operational Fields | Team Registry | Approval / Handoff Rules |
|---|---|---|---|---|
| `solo` | 1명 + AI | 추가 필수 필드 없음 | Optional | 기본 task/lock/handoff 규칙만 사용 |
| `team` | 2~8명 + AI | `owner`, `role`, `updated_at` | Required | owner 기반 handoff와 블로커/승인 큐 사용 |
| `large/governed` | 9명+ 또는 승인 체계 강한 조직 | `owner`, `role`, `updated_at`, `approval_chain`, `gate_state`, `handoff_reason` | Required | 승인 체인, gate 상태, handoff 이유를 모두 기록 |

## Usage Scenarios

### 시나리오 1: PM이 아침에 프로젝트 상태를 확인한다
1. PM이 `Project Monitor Web`을 연다.
2. `프로젝트 보드`에서 task 상태, 담당자, 역할, scope를 한눈에 본다.
3. `블로커/승인 큐`에서 사용자 승인 대기와 manual gate 대기를 확인한다.
4. `최근 활동`에서 어제 handoff와 완료 내역을 확인한다.
5. 필요한 결정을 artifact에서 처리한 뒤 모니터를 새로고침해 반영 상태를 확인한다.

### 시나리오 2: 개발자가 작업 시작 전에 충돌 가능성을 확인한다
1. 개발자가 `팀 디렉터리`와 `프로젝트 보드`에서 자신의 책임 영역을 확인한다.
2. `Active Locks`와 최근 handoff를 보고 충돌 가능성을 판단한다.
3. 충돌이 없으면 작업을 시작하고, 있으면 artifact 경로로 들어가 범위를 조정한다.

### 시나리오 3: 팀 리드가 릴리즈 준비 상태를 점검한다
1. `문서 건강` 패널에서 sync 상태, stale lock, 최신 health snapshot을 확인한다.
2. `블로커/승인 큐`에서 미해결 gate를 확인한다.
3. `프로젝트 보드`와 `최근 활동`을 함께 보고 리뷰 gate 진입 가능 여부를 판단한다.

## In Scope
- `solo`, `team`, `large/governed` 운영 프로필 정의와 프로필별 필수 필드 구체화
- 공용 `task`, `lock`, `owner`, `role`, `gate`, `handoff`, `event` 개념 정규화
- `.agents/runtime/team.json` 팀 구성 계약 정의
- parser-friendly artifact schema와 필수 heading / field contract 정의
- 별도 웹앱인 `Project Monitor Web` Phase 1 MVP 정의
- human approval, manual gate, blocked state, handoff failure를 1급 운영 개념으로 반영
- Phase 2 이후 이벤트 확장을 위한 hook point 예약
- core template와 self-hosting only 웹앱의 경계 정의

## Out of Scope
- 실시간 이벤트 스트리밍, WebSocket 기반 live monitor, push 알림
- artifact에 대한 write action, approval action, lock 수정 action
- 멀티 에이전트 orchestration engine이나 agent execution control plane
- enterprise SSO, 완전한 RBAC, 법무 보존 정책, 외부 ITSM 연동
- 특정 AI vendor 또는 agent framework 종속 구조
- 사용 가치가 없는 장식형 차트, 과한 애니메이션, raw session log tail

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | 템플릿은 하나의 canonical source를 유지하면서 `solo`, `team`, `large/governed` 운영 프로필을 정의해야 한다. | High | ① `solo`, `team`, `large/governed`의 required field가 문서에 고정된다. ② `solo`에서는 추가 필드 없이 기존 artifact 운영이 가능하다. ③ `team`에서는 `owner`, `role`, `updated_at`이 필수다. ④ `large/governed`에서는 `approval_chain`, `gate_state`, `handoff_reason`이 추가로 필수다. |
| FR-02 | 모든 프로필은 공용 governance core schema를 공유해야 한다. | High | ① `task`, `lock`, `owner`, `role`, `gate`, `handoff`의 의미가 문서에서 일관되게 정의된다. ② 모든 프로필에서 동일한 parser가 core field를 추출할 수 있다. |
| FR-03 | 팀 구성은 `.agents/runtime/team.json`으로 선언적으로 관리해야 한다. | High | ① 파일 경로가 `.agents/runtime/team.json`으로 고정된다. ② `id`, `display_name`, `kind`, `primary_role`, `ownership_scopes`, `handoff_targets`가 필수다. ③ `default_model`, `approval_authority`는 optional이다. ④ `solo`에서는 optional이고 `team`, `large/governed`에서는 required다. |
| FR-04 | `Project Monitor Web` Phase 1은 별도 웹앱으로 artifact를 읽어 다음 정보를 한 화면에 보여줘야 한다. | High | ① `프로젝트 보드` ② `블로커/승인 큐` ③ `최근 활동` ④ `문서 건강` ⑤ `팀 디렉터리`가 포함된다. ② 모든 정보는 artifact와 `team.json`을 읽어서 생성된다. ③ write path는 없다. |
| FR-05 | artifact markdown은 parser가 안정적으로 읽을 수 있는 최소 schema contract를 가져야 한다. | High | ① `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`의 필수 heading/field contract가 문서화된다. ② parser는 이 5개 파일을 Phase 1 mandatory source로 사용한다. ③ `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`는 optional source로 취급된다. |
| FR-06 | human approval과 manual/environment gate는 agent activity와 같은 수준으로 추적되어야 한다. | High | ① `사용자 결정 대기`, `manual test 대기`, `환경 gate 대기`가 artifact에 명시된다. ② 모니터가 이 상태를 별도 블로커 항목으로 표시한다. ③ handoff와 approval 관련 이유가 artifact에 남는다. |
| FR-07 | Phase 1 모니터는 정적 read-only 뷰어로 동작해야 한다. | High | ① 화면 진입 시 artifact를 다시 읽는다. ② 사용자가 수동 새로고침을 수행하면 최신 artifact를 다시 파싱한다. ③ polling, push, WebSocket은 없다. ④ 일반적인 artifact 세트에서 3초 이내에 첫 화면을 구성할 수 있어야 한다. |
| FR-08 | 향후 이벤트 기반 확장을 위한 hook point가 예약되어야 한다. | Medium | ① 구현 계획과 아키텍처에 future hook point가 명시된다. ② Phase 1에서는 event stream을 실제로 수집, 저장, 전송하지 않는다. |
| FR-09 | 구현 경로는 self-hosting only 웹앱과 downstream 공통 템플릿 경계를 보존해야 한다. | High | ① `Project Monitor Web` 코드는 starter에 포함되지 않는다. ② `team.json`과 artifact schema contract는 starter에 반영될 수 있다. ③ 경계가 architecture/plan에 명시된다. |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | Solo 운영 기본 경로는 낮은 오버헤드를 유지해야 한다. | High | ① `solo`에서는 `team.json`이 없어도 된다. ② 대시보드가 없어도 기존 artifact 운영이 유지된다. ③ `solo`에서 추가로 채워야 하는 필수 필드는 0개다. |
| NFR-02 | Team 이상 프로필에서는 추적성과 감사 가능성을 우선한다. | High | ① `team` 이상에서는 owner, role, scope, handoff trace가 누락 없이 남는다. ② `large/governed`에서는 approval chain과 gate state가 누락 없이 남는다. |
| NFR-03 | 구현은 local-first이며 특정 cloud telemetry에 의존하지 않아야 한다. | High | ① 모니터 MVP는 로컬 파일 읽기만으로 동작한다. ② 네트워크 연결 없이도 핵심 기능이 동작한다. |
| NFR-04 | parser/projection과 UI는 분리되어 교체 가능해야 한다. | High | ① shared parser/projection library가 UI layer와 분리된다. ② UI 구현을 바꿔도 parser contract는 유지된다. |
| NFR-05 | change-expensive contract는 단기 편의보다 장기 비용 절감을 우선해 초기 단계에서 고정해야 한다. | High | ① product boundary, team registry path, profile required fields, parser source files가 이 문서에서 고정된다. ② `DEV-11` 시작 시점에 이 항목들에 open question이 없다. |
| NFR-06 | 대시보드는 실제 업무 판단에 필요한 정보만 보여줘야 한다. | High | ① 각 패널이 구체적인 운영 판단과 연결된다. ② 사용 가치가 없는 차트, 장식, raw log는 Phase 1에 포함되지 않는다. |
| NFR-07 | parser는 기존 운영 프로젝트 artifact에서 강건하게 동작해야 한다. | High | ① 현재 active operating projects 3곳의 artifact fixture로 parser regression을 수행한다. ② 예상치 못한 형식을 만나면 전체 중단 대신 경고와 partial parse를 제공한다. |

## Constraints
- 기술 제약: source of truth는 markdown artifact이며, starter/reset source split과 validator 규칙을 깨지 않아야 한다.
- 운영 제약: 기본 템플릿에 watcher / scheduler / registry를 내장하지 않고, state-changing runtime은 명시적 분류 후에만 추가한다.
- 설계 제약: `Project Monitor Web`은 artifact와 `team.json`에 대해 read-only다. 정보 수정은 항상 기존 artifact 편집 경로에서 수행한다.
- 설계 원칙: 단기 편의보다 장기 운영 비용 절감을 우선하며, 나중에 바꾸기 비싼 계약은 지금 더 명시적으로 고정한다.
- 일정 제약: Phase 1은 정적 모니터 MVP까지이며, 이벤트 기반 확장은 Phase 2 이후로 미룬다.
- 법무/보안/플랫폼 제약: 전자결재/회계/예산관리 같은 도메인으로 확장하더라도 audit trail과 human approval trace를 손상시키면 안 된다.

## Dependencies
- 외부 서비스: 없음이 기본이며, GitHub/CI/PM 도구 연동은 optional adapter로만 고려한다.
- 내부 시스템: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/scripts/check_harness_docs.ps1`
- parser mandatory source: `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`
- parser optional source: `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`
- team registry: `.agents/runtime/team.json`
- 인증/배포/인프라 의존성: 로컬 파일 접근, validator 실행 환경, 로컬 Node backend를 가진 `Project Monitor Web`

## Assumptions
- 기본 starter profile은 `solo`로 시작하고, `team`, `large/governed`는 추가 규약으로 확장한다.
- `Project Monitor Web`은 root self-hosting 환경에서 먼저 검증한다.
- AI 에이전트 협업은 주로 비동기 턴제로 동작하며, Phase 1은 이 패턴을 기준으로 설계한다.
- 이벤트 기반 확장은 기존 정적 모니터를 대체하지 않고 위에 덧붙이는 방식으로 진화한다.

## Approved Change Log

| Change ID | Approved At | Summary | Affected Requirement IDs | Downstream Sync Needed | Sync Status |
|---|---|---|---|---|---|
| CR-01 | 2026-04-06 18:06 | `v0.2` 승인. `Project Monitor Web`, `.agents/runtime/team.json`, profile required field, parser contract, static read-only Phase 1을 고정 | FR-01~FR-09, NFR-01~NFR-07 | Architecture / Plan / Task / UI Design / Current State | In Sync |

## Pending Change Requests

| Change ID | Status | Requested By | Summary | Affected Areas | Next Action |
|---|---|---|---|---|---|
| 없음 | - | - | 열려 있는 요구사항 변경 없음 | - | - |

## Approval History
- 2026-04-06 16:39 User: `one core, multiple profiles` 방향의 구현 로드맵 초안 작성을 요청
- 2026-04-06 18:06 User: product boundary, `Project Monitor Web`, `.agents/runtime/team.json`, parser 범위, profile required field를 승인
