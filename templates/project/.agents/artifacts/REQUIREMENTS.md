# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이번 문서의 핵심 목표:
- 이번 버전의 꼭 필요한 결과:
- 이번 버전에서 하지 않을 것:
- 사용자가 최종 승인한 범위:
- 현재 승인 기준선과 마지막 변경 요약:
- 현재 남아 있는 큰 질문:
- 다음 역할이 꼭 읽어야 할 포인트:

## Status
- Document Status: Draft / Needs User Answers / Ready for Approval / Approved
- Owner: Planner
- Current Requirement Baseline:
- Requirements Sync Status: In Sync / Downstream Update Required / Needs Re-Approval
- Last Requirement Change At: [YYYY-MM-DD HH:MM]
- Last Updated At: [YYYY-MM-DD HH:MM]
- Last Approved By: [User]
- Last Approved At: [YYYY-MM-DD HH:MM]

## Open Questions
- [비어 있으면 `없음`]

## Change Control Rules
- 승인 후에도 범위, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있으며, 이 경우 Planner가 먼저 이 문서를 갱신합니다.
- 중간 변경이 승인되면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 턴에 같은 기준선으로 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 `In Scope`, `Out of Scope`, `Functional Requirements`, `Non-Functional Requirements`, 관련 제약과 acceptance criteria를 같은 턴에 함께 갱신합니다.
- downstream 문서(`ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`)가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 handoff에 남깁니다.
- 사용자가 아직 변경을 승인하지 않았으면 `Requirements Sync Status`를 `Needs Re-Approval`로 두고 review / deploy gate를 닫지 않습니다.
- Reviewer와 DevOps는 이 문서의 최신 기준선을 먼저 확인하고, 문서 sync 누락을 코드 결함과 같은 종류의 blocker로 섞어 기록하지 않습니다.

## Changelog
- [YYYY-MM-DD] Planner: initial draft

## Product Goal
- 이 프로젝트가 해결하려는 문제:
- 최종 사용자:
- 성공 기준:

## In Scope
- [기능/도메인 범위 작성]

## Out of Scope
- [이번 버전에서 하지 않을 것 작성]

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | [요구사항] | High | [어떤 상태가 되면 충족인지] |
| FR-02 | [요구사항] | Medium | [어떤 상태가 되면 충족인지] |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | [성능/보안/가용성/접근성 등] | High | [측정 기준 또는 조건] |
| NFR-02 | [성능/보안/가용성/접근성 등] | Medium | [측정 기준 또는 조건] |

## Constraints
- 기술 제약:
- 운영 제약:
- 일정 제약:
- 법무/보안/플랫폼 제약:

## Dependencies
- 외부 서비스:
- 내부 시스템:
- 인증/배포/인프라 의존성:

## Assumptions
- [현재 가정]

## Approved Change Log

| Change ID | Approved At | Summary | Affected Requirement IDs | Downstream Sync Needed | Sync Status |
|---|---|---|---|---|---|
| CR-01 | [YYYY-MM-DD HH:MM] | [변경 요약] | [FR-01, NFR-01] | Architecture / Plan / Task / Test / Review / Deploy | In Sync / Pending |

## Pending Change Requests

| Change ID | Status | Requested By | Summary | Affected Areas | Next Action |
|---|---|---|---|---|---|
| CR-02 | Proposed / Waiting User Approval | [User / Planner] | [변경 요약] | [Scope / acceptance / UI / release criteria] | [다음 조치] |

## Approval History
- [YYYY-MM-DD HH:MM] [User]: Draft reviewed
- [YYYY-MM-DD HH:MM] [User]: Approved for architecture planning
