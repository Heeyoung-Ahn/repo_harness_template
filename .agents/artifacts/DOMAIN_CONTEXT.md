# Domain Context

> 핵심 도메인 용어, invariant, lifecycle, exception rule, maintenance hotspot을 정리하는 stable reference입니다.
> current task 상태와 release gate truth는 계속 기존 artifact가 소유합니다.

## Quick Read
- 목적: 유지보수자와 reviewer가 이 저장소의 운영 도메인 개념과 불변식을 빠르게 복원한다.
- 현재 도메인 요약: 이 저장소는 AI/human 협업 프로젝트를 위한 repo-level governance harness의 self-hosting canonical source다.
- 이 문서가 다루는 것: 용어, lifecycle, invariant, exception rule, domain hotspot.
- 이 문서가 대체하지 않는 것: current stage, active lock, blocker, release gate, raw handoff, diff log.
- 기본 update trigger: 용어 정의, lifecycle, invariant, exception rule이 바뀌는 feature / bugfix / refactor / architecture-change.

## Usage Rules
- stable domain rule만 남긴다. current snapshot이나 task 진행 메모를 복사하지 않는다.
- 시스템 구조와 경계는 `SYSTEM_CONTEXT.md`와 `ARCHITECTURE_GUIDE.md`를 우선한다.
- decision rationale이나 대안 비교는 `DECISION_LOG.md`에 append-only로 남긴다.
- trivial mechanical edit는 여기에 기록하지 않는다.
- domain rule이 바뀌면 관련 task packet, review evidence, decision log trigger와 함께 갱신한다.

## Domain Terms
| Term | Meaning | Notes |
|---|---|---|
| Requirement Baseline | 현재 승인된 제품 계약 기준선 | `REQUIREMENTS.md`가 정본이다 |
| Change Request (`CR-*`) | 승인된 중간 변경 단위 | requirement/architecture/plan sync를 동반한다 |
| Task Packet | 실행 단위별 invariant/evidence/change-governance 계약 | `IMPLEMENTATION_PLAN.md > Task Packet Ledger`에 남긴다 |
| Non-trivial Change | trivial mechanical edit를 제외한 구현/구조/운영 영향 변경 | primary type, self-review, impact tier가 필요하다 |
| Primary Change Type | `feature / bugfix / maintenance / refactor / architecture-change` 중 dominant type | mixed scope면 dominant type과 secondary impact를 남긴다 |
| Impact Tier | `lightweight / full` 두 단계 영향 평가 | full은 architecture-change와 qualifying refactor에 강하다 |
| Decision Log Trigger | `DECISION_LOG.md` entry가 필수인지 판단하는 조건 | architecture-change는 mandatory, qualifying refactor는 conditional |
| Support Artifact | stable reference 또는 append-only history를 위한 보조 문서 | current-state truth를 대체하지 않는다 |
| Manual / Environment Gate | 사람 확인이나 로컬 환경 검증이 필요한 release gate | agent activity와 별도의 운영 개념이다 |
| Profile / Pack | `solo`, `team`, `large/governed` profile과 optional `enterprise_governed` overlay | starter default burden을 분리한다 |

## Lifecycle and Invariants
- Planner는 deep interview와 approval을 통해 baseline을 닫고, 그 다음 Architecture/Plan sync가 이어진다.
- Developer는 승인된 boundary 안에서 구현하고 non-trivial change의 type, self-review, impact tier를 남긴다.
- Tester/Reviewer/DevOps는 같은 baseline과 task packet contract를 기준으로 gate를 닫는다.
- current-state truth는 항상 `.agents/*`와 runtime contract에 남는다. support artifact나 `.omx/*`는 보조 입력일 뿐이다.
- `architecture-change`는 항상 `DECISION_LOG.md`와 full impact contract를 남긴다.
- `refactor`라도 shared contract/API/schema, cross-module invariant, ownership boundary, migration/deprecation을 건드리면 decision log와 full impact contract가 필요하다.
- support artifact는 current stage, blocker, release gate를 대신 기록하지 않는다.
- starter default는 generic해야 하며 enterprise burden은 opt-in pack으로만 올린다.
- browser-facing UI scope는 API-only evidence로 manual/environment gate를 닫지 않는다.

## Exception Rules and Maintenance Hotspots
- `trivial mechanical edit`만 self-review mandatory 예외다. 이유는 task packet이나 change summary에 남긴다.
- PMW는 read-only monitor가 원칙이지만, self-hosting local convenience 범위의 `project-registry.json` 갱신과 local server stop request는 예외적으로 허용한다.
- `enterprise_governed` pack이 비활성일 때는 governed artifact가 dormant placeholder여도 core flow를 막지 않는다.
- validator, sync/reset script, PMW parser/projection, shared workflow/skill mirror는 작은 문구 변경도 전역 contract drift를 만들기 쉬운 hotspot이다.
