# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이번 문서의 핵심 목표: `[이 프로젝트가 해결해야 하는 핵심 문제]`
- 이 starter가 기본으로 담는 것: 요구사항 구조, scope/out-of-scope, FR/NFR, change control, approval history 골격
- 이 starter가 기본으로 결정하지 않는 것: 제품 도메인, 외부 provider, 구체 일정, 배포 환경, 고유 명사
- 이 starter를 새 프로젝트에 적용한 뒤 가장 먼저 정할 것: 제품 목표, 핵심 사용자, 승인 기준, 실환경 검증 필요성
- 현재 requirement baseline: `[현재 승인된 기준선]`
- 다음 역할이 꼭 읽어야 할 포인트: deep interview만 요청된 turn은 discovery-only이고, `REQUIREMENTS.md` 승인 전에는 관련 artifact를 새 기준선으로 sync하지 않는다

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

## Out of Scope
- [이번 범위에서 제외하는 기능]
- [이번 범위에서 제외하는 실험/리팩터/배포]
- [후속 change request로 분리할 내용]

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | [기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| FR-02 | [기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | [비기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |
| NFR-02 | [비기능 요구사항] | High / Medium / Low | [어떤 상태가 되면 충족인지] |

## Constraints
- 기술 제약: [예: 플랫폼, 언어, 데이터 계약]
- 운영 제약: [예: 승인 절차, 환경 제약]
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
