# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이번 문서의 핵심 목표: `[이 프로젝트가 해결해야 하는 핵심 문제]`
- 이 starter가 기본으로 담는 것: 요구사항 구조, scope/out-of-scope, FR/NFR, change control, approval history 골격, non-trivial change governance placeholder
- 이 starter가 기본으로 결정하지 않는 것: 제품 도메인, 외부 provider, 구체 일정, 배포 환경, 고유 명사
- 이 starter를 새 프로젝트에 적용한 뒤 가장 먼저 정할 것: 제품 목표, 핵심 사용자, 승인 기준, 실환경 검증 필요성
- 운영 규모가 커질 수 있으면 early baseline으로 둘 것: `feature/bugfix/maintenance/refactor/architecture-change` taxonomy, mandatory self-review, `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`, lightweight/full impact check
- 현재 requirement baseline: `[현재 승인된 기준선]`
- 다음 역할이 꼭 읽어야 할 포인트: deep interview만 요청된 turn은 discovery-only이고, `REQUIREMENTS.md` 승인 전에는 관련 artifact를 새 기준선으로 sync하지 않는다. context/decision artifact는 support doc이지 current-state truth가 아니다

## Status
- Document Status: Draft / Needs User Answers / Ready for Approval / Approved
- Owner: Planner
- Current Requirement Baseline: `[현재 승인된 기준선]`
- Requirements Sync Status: Pending Requirement Approval / In Sync / Downstream Update Required / Needs Re-Approval
- Last Requirement Change At: [YYYY-MM-DD HH:MM]
- Last Updated At: [YYYY-MM-DD HH:MM]
- Last Approved By: [승인자]
- Last Approved At: [YYYY-MM-DD HH:MM]

## Open Questions
- [사용자에게 확인할 핵심 질문 1]
- [사용자에게 확인할 핵심 질문 2]
- [실환경/배포/승인 관련 질문]

## Change Control Rules
- 사용자가 `deep interview`나 discovery만 요청했으면 current turn output은 질문 패킷과 interview snapshot까지만 허용하고, 이 문서를 같은 turn에 drafting하지 않습니다.
- 승인 후에도 범위, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있으며, 이 경우 Planner가 먼저 이 문서를 갱신합니다.
- 중간 변경이 아직 미승인 상태면 `Requirements Sync Status`를 `Pending Requirement Approval`로 두고 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`를 새 기준선으로 sync하지 않습니다.
- 중간 변경이 승인되면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 턴에 같은 기준선으로 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 `In Scope`, `Out of Scope`, `Functional Requirements`, `Non-Functional Requirements`, 관련 제약과 acceptance criteria를 같은 턴에 함께 갱신합니다.
- downstream 문서(`ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`)가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 handoff에 남깁니다.
- 사용자가 아직 변경을 승인하지 않았으면 `Requirements Sync Status`를 `Needs Re-Approval`로 두고 review / deploy gate를 닫지 않습니다.
- Reviewer와 DevOps는 이 문서의 최신 기준선을 먼저 확인하고, 문서 sync 누락을 코드 결함과 같은 종류의 blocker로 섞지 않습니다.

## Changelog
- [YYYY-MM-DD] Planner: initial draft

## Product Goal
- 이 프로젝트가 해결하려는 문제:
  1. [핵심 문제]
  2. [보조 문제 또는 운영 문제]
- 최종 사용자: [주 사용자군]
- 성공 기준:
  1. [성공 기준 1]
  2. [성공 기준 2]

## In Scope
- [이번 범위에 포함되는 기능 또는 정책]
- [이번 범위에 포함되는 검증 또는 운영 조건]
- [이번 범위에 포함되는 문서/도메인]
- non-trivial change taxonomy, mandatory self-review, `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`, change impact contract

## Out of Scope
- [이번 범위에서 제외하는 기능]
- [이번 범위에서 제외하는 실험/리팩터/배포]
- [후속 change request로 분리할 내용]
- debt register, incident/hotfix/postmortem lane, SLO/alerting/canary 같은 운영 성숙도 확장

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | [기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| FR-02 | [기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| FR-03 | 모든 non-trivial change는 `feature`, `bugfix`, `maintenance`, `refactor`, `architecture-change` 중 primary change type을 선언해야 한다. | High | ① planning 또는 task packet에 primary type이 남는다. ② ambiguous case는 dominant type과 secondary impact를 기록한다. |
| FR-04 | 모든 non-trivial change는 reviewer gate 전에 self-review를 남겨야 한다. | High | ① self-review에 changed path, invariant/contract impact, verification result, open risk가 남는다. ② trivial mechanical edit만 예외로 둘 수 있다. |
| FR-05 | 프로젝트는 `SYSTEM_CONTEXT.md`를 통해 시스템 경계와 유지보수 hotspot을 보존해야 한다. | High | ① subsystem responsibility, integration seam, shared contract, hotspot, do-not-break path가 정리된다. ② current-state raw log를 복사하지 않는다. |
| FR-06 | 프로젝트는 `DOMAIN_CONTEXT.md`를 통해 도메인 개념과 invariant를 보존해야 한다. | High | ① 핵심 용어, lifecycle, invariant, exception rule, domain hotspot이 정리된다. ② domain rule 변경 시 함께 갱신한다. |
| FR-07 | 프로젝트는 `DECISION_LOG.md`를 append-only 결정 이력으로 유지해야 한다. | High | ① `architecture-change`는 mandatory다. ② qualifying `refactor`도 shared contract/API/schema, migration/deprecation, ownership boundary change가 있으면 mandatory다. |
| FR-08 | 프로젝트는 change impact를 lightweight/full 두 단계로 평가해야 한다. | High | ① 모든 non-trivial change는 lightweight impact check를 남긴다. ② high-impact change는 full impact contract를 남긴다. |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | [비기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| NFR-02 | [비기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| NFR-03 | change-governance baseline은 core/starter default를 과도하게 무겁게 만들면 안 된다. | High | ① mandatory 절차는 non-trivial change 중심으로 제한된다. ② full impact contract와 decision log는 조건부로만 강제된다. |
| NFR-04 | context/change-governance artifact는 current-state truth를 중복하거나 오염시키면 안 된다. | High | ① context/decision artifact는 stable reference 또는 append-only history로만 사용된다. ② blocker/handoff/release gate는 기존 truth artifact가 계속 소유한다. |

## Constraints
- 기술 제약: [예: 플랫폼, 언어, 데이터 계약]
- 운영 제약: [예: 승인 절차, 환경 제약]
- 프로세스 제약: 모든 non-trivial change는 change type, self-review, impact tier를 먼저 결정하고, qualifying `refactor` / `architecture-change`는 decision log까지 남긴다.
- 정보 소유권 제약: `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`는 support/reference artifact이며 current-state truth를 대체하지 않는다.
- 일정 제약: [예: 마감, 병행 작업]
- 법무/보안/플랫폼 제약: [필요 시 적는다]

## Dependencies
- 외부 서비스: [없음 / 서비스 목록]
- 내부 시스템: [의존 문서/모듈/계약]
- 인증/배포/인프라 의존성: [필요 시 적는다]

## Assumptions
- [현재 전제로 두는 조건]
- [사용자/환경에 대한 가정]
- [추가 확인 전 임시로 두는 가정]

## Approved Change Log

| Change ID | Approved At | Summary | Affected Requirement IDs | Downstream Sync Needed | Sync Status |
|---|---|---|---|---|---|
| 없음 | - | 아직 승인된 change request 없음 | - | - | - |

## Pending Change Requests

| Change ID | Status | Requested By | Summary | Affected Areas | Next Action |
|---|---|---|---|---|---|
| 없음 | - | - | 현재 열린 change request 없음 | - | 실제 변경이 생기면 추가 |

## Approval History
- [YYYY-MM-DD] [승인자]: [승인 또는 보류 결정]
