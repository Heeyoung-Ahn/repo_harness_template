# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 계획의 목표: `[현재 프로젝트 목표]`
- 현재 stage: `[Planning and Architecture / Design Gate / Development and Test Loop / Review Gate / Deployment / Documentation and Closeout]`
- 현재 iteration: `[iteration 이름]`
- 이번 iteration의 주요 Task ID: `[PLN-* / DEV-* / TST-* / REV-* / REL-*]`
- 이번 iteration의 Requirement IDs: `[FR-* / NFR-*]`
- 현재 구현 기준 Requirement Baseline: `[현재 승인된 기준선]`
- refactor/architecture-change planning rule: non-trivial change는 primary type, self-review, impact tier를 먼저 정하고, 필요 시 `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`를 함께 갱신한다
- 지금 바로 필요한 검증: `[가장 먼저 확인할 검증]`
- 남아 있는 release gate (manual / dependency / compliance): `[열려 있는 gate]`
- 현재 green level target: `[None / Targeted / Package / Workspace / Merge Ready]`
- branch freshness precheck: `[확인 필요 사항]`
- user-captured manual test expected: `[필요 시 적는다]`
- 다음 역할이 꼭 알아야 할 위험: `[즉시 알아야 할 리스크]`

## Status
- Document Status: Draft / Ready for Execution / In Progress
- Owner: Planner / Developer
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`
- Requirement Baseline: `[현재 승인된 기준선]`
- Change Sync Check: Synced / Pending Requirement Approval / Planner Update Needed
- Last Updated At: [YYYY-MM-DD HH:MM]

## Current Iteration
- Iteration name: `[iteration 이름]`
- Scope: `[이번 iteration의 범위]`
- Main Task IDs: `[Task ID 목록]`
- Change requests in scope: `[CR-* 또는 없음]`
- Exit criteria: `[이 iteration을 닫는 기준]`
- Green level target: `[목표 green level]`
- Branch freshness precheck: `[브랜치 신선도 확인 기준]`
- User-captured manual test expected: `[필요 시 사용자 raw report 또는 브라우저/실기기 검증 요구]`
- Manual / environment validation still open: `[남아 있는 항목]`
- Dependency / compliance gate still open: `[남아 있는 항목]`

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [YYYY-MM-DD] Planner: initial draft

## Objective
- 이번 버전의 목표: `[이번 릴리즈/iteration에서 달성할 결과]`
- 릴리즈 단위: `[예: contract freeze -> implementation -> test -> review -> deploy]`
- 성공 기준: `[release-ready 또는 iteration exit 기준]`

## Delivery Strategy
- 구현 전략: `[핵심 전략]`
- 단계적 릴리즈 여부: Yes / No
- 리스크가 큰 영역의 선행 검증 필요 여부: Yes / No

## Requirement Trace

| Requirement ID | Covered By Task IDs | Notes |
|---|---|---|
| FR-01 | `PLN-01`, `DEV-01`, `TST-01` | [요구사항 요약] |
| FR-02 | `PLN-01`, `DEV-01`, `TST-01`, `REV-01` | non-trivial change taxonomy / self-review |
| FR-03 | `PLN-01`, `DEV-01`, `TST-01` | `SYSTEM_CONTEXT.md` / `DOMAIN_CONTEXT.md` contract |
| FR-04 | `PLN-01`, `DEV-01`, `TST-01`, `REV-01` | `DECISION_LOG.md` / impact contract |
| NFR-01 | `PLN-01`, `DEV-01`, `REV-01` | [비기능 요구사항 요약] |
| NFR-02 | `PLN-01`, `DEV-01`, `TST-01` | change-governance baseline은 default를 과도하게 무겁게 만들지 않음 |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | `PLN-01` | [갱신한 검증] | Synced / Pending Requirement Approval / Pending | [메모] |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.
>
> 모든 task packet은 아래 기본 필드를 함께 유지합니다.
> `Required Context Inputs`
> `Architecture Invariants`
> `Known Traps`
> `Do-Not-Break Paths`
> `Evidence Required Before Close`
> `Primary Change Type`
> `Self-Review Summary`
> `Impact Tier`
> `Decision Log Entry` (required change only)

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | [개발 작업 목표] | In: [범위]. Out: [제외 범위] | [수용 기준] | [갱신할 artifact] | [상향 조건] |
| DEV-02 | [change governance / context artifact 구현 목표] | In: taxonomy, self-review, context/decision artifact, impact contract. Out: debt register, incident lane | [수용 기준] | [갱신할 artifact] | [상향 조건] |
| TST-01 | [검증 작업 목표] | In: [범위]. Out: [제외 범위] | [검증 기준] | [갱신할 artifact] | [상향 조건] |
| TST-02 | [change governance / context artifact 검증 목표] | In: contract trace, validator, artifact boundary. Out: incident lane | [검증 기준] | [갱신할 artifact] | [상향 조건] |
| REV-01 | [리뷰 작업 목표] | In: [범위]. Out: [제외 범위] | [리뷰 기준] | [갱신할 artifact] | [상향 조건] |
| REL-01 | [배포 작업 목표] | In: [범위]. Out: [제외 범위] | [배포 기준] | [갱신할 artifact] | [상향 조건] |

## Stage Plan

| Stage | Goal | Primary Owner | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| Planning and Architecture | 요구사항과 구조 확정 | Planner | User request received | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md` 승인 |
| Design Gate | UI 범위 설계 또는 비UI 판정 | Designer / Planner | Architecture approved | `UI_DESIGN.md` 준비 또는 비UI 기록 완료 |
| Development and Test Loop | 구현과 검증 반복 | Developer / Tester | Ready for Execution | current iteration pass |
| Review Gate | 구조 / 보안 / 품질 심사 | Reviewer | release-scope tests passed | `REVIEW_REPORT.md` 승인 |
| Deployment | 배포 실행과 기록 | DevOps | Review approved | `DEPLOYMENT_PLAN.md` 갱신 |
| Documentation and Closeout | 같은 버전 정리 또는 버전 종료 | Documenter | Deployment completed or day wrap up needed | 다음 세션 시작점 정리 |

## Iteration Plan

### Iteration 1
- Scope: `[첫 iteration 범위]`
- Main Task IDs: `[Task ID 목록]`
- Requirement IDs: `[FR-* / NFR-*]`
- Validation focus: `[핵심 검증 포인트]`

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | [로컬 개발/검증 목적] |
| Preview / Staging | Pre-release verification | [사전 검증 목적] |
| Production | Final release | [배포 시점 확인 사항] |

## Validation Gates
- green level ladder: `None / Targeted / Package / Workspace / Merge Ready`
- 정적 검증 gate: `[예: lint, typecheck, validator, unit test]`
- 수동 / 실환경 gate: `[예: 브라우저 smoke, 실기기 raw report, 운영 환경 확인]`
- 보안 / dependency / compliance gate: `[필요 시 기록]`
- branch freshness gate: `[확인 기준]`
- change governance gate: non-trivial change는 change type, self-review, impact tier를 남기고, high-impact change는 `DECISION_LOG.md`와 full impact contract를 남긴다
- 요구사항 변경 동기화 gate: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md` sync
- release-ready 판단 기준: `[최종 판단 기준]`

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| [리스크] | [영향] | [완화책] | [담당자] |
| context artifact가 current-state copy로 변질 | duplicate truth와 stale docs 증가 | context/decision artifact를 stable reference와 append-only history로 제한한다 | Planner / Documenter |

## Handoff Notes
- Designer required: `[필요 시 적는다]`
- Reviewer focus: `[리뷰 핵심 포인트]`
- DevOps preflight notes: `[배포 전 주의점]`
- Build artifact reuse / rebuild note: `[재사용/재빌드 판단]`
