# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: 장기 비용을 줄이는 운영 계약을 먼저 구현하고, 그 위에 `Project Monitor Web` Phase 1 MVP를 올린다.
- 현재 stage: Development and Test Loop
- 현재 iteration: Iteration 3 - Future Hooks and Promotion Boundary
- 이번 iteration의 주요 Task ID: `DEV-13`, `DEV-14`, `REV-03`
- 이번 iteration의 Requirement IDs: `FR-01`~`FR-09`, `NFR-01`~`NFR-07`
- 현재 구현 기준 Requirement Baseline: `Scalable Governance Profiles v0.2`
- 지금 바로 필요한 검증: future hook reservation only 유지, promotion boundary sync, source-of-truth review 준비, root validator 통과
- 남아 있는 release gate (manual / dependency / compliance): monitor stack dependency/compliance audit, promotion boundary review, source split review
- 다음 역할이 꼭 알아야 할 위험: contract를 흐리게 두고 UI부터 만들면 장기 운영 비용이 다시 커진다.

## Status
- Document Status: Ready for Execution
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`
- Requirement Baseline: Scalable Governance Profiles v0.2
- Change Sync Check: Synced
- Last Updated At: 2026-04-06 18:55

## Current Iteration
- Iteration name: Iteration 3 - Future Hooks and Promotion Boundary
- Scope: future hook reservation, health snapshot contract, self-hosting only promotion 규칙, source-of-truth review 준비를 정리한다.
- Main Task IDs: `DEV-13`, `DEV-14`, `REV-03`
- Change requests in scope: `CR-01`
- Exit criteria: realtime runtime을 추가하지 않은 상태로 reserved hook contract, health snapshot shape, self-hosting/downstream promotion boundary, review focus가 명시된다.
- Manual / environment validation still open: none
- Dependency / compliance gate still open: local Node/web stack dependency/compliance audit와 local server surface review 필요

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-06] Developer: `DEV-11`, `DEV-12`, `TST-03`, `TST-04`를 완료했고 `team.json`, parser/projection, `Project Monitor Web` Phase 1 MVP, read-only regression test를 구현한 뒤 current iteration을 3단계로 전환했다.
- [2026-04-06] Planner: `Scalable Governance Profiles v0.1` baseline과 dashboard MVP 중심의 단계별 구현 로드맵 초안 작성
- [2026-04-06] Planner: `v0.2` 승인에 맞춰 `Contract First -> Project Monitor Web -> Future Hooks` 순서로 구현 계획을 재정렬

## Objective
- 이번 버전의 목표: `one core, multiple profiles`를 장기 비용 관점에서 흔들리지 않는 명시적 계약으로 만들고, 별도 웹앱인 `Project Monitor Web` Phase 1을 구현 가능한 수준으로 정의한다.
- 릴리즈 단위: `Contract First -> Project Monitor Web Phase 1 -> Future Hooks and Promotion Rules`
- 성공 기준: 구현 task가 requirement trace로 연결되고, 이후 UI나 adapter를 바꿔도 core schema와 parser contract가 유지된다.

## Delivery Strategy
- 구현 전략: change-expensive contract를 먼저 고정하고 나서 monitor를 구현한다.
- 단계적 릴리즈 여부: Yes. `Contracts -> Monitor Phase 1 -> Future Hooks -> Optional Promotion`
- 리스크가 큰 영역의 선행 검증 필요 여부: Yes. parser robustness, team registry contract, read-only 경계는 UI 구현 전에 고정한다.

## Requirement Trace

| Requirement ID | Covered By Task IDs | Notes |
|---|---|---|
| FR-01 | PLN-08, DEV-11, TST-03 | profile required field 고정 |
| FR-02 | PLN-08, DEV-11, TST-03 | core schema와 parser field 일관성 |
| FR-03 | PLN-08, DEV-11, TST-03 | `.agents/runtime/team.json` 계약 |
| FR-04 | DSG-05, DEV-12, TST-04 | `Project Monitor Web` 5개 패널 |
| FR-05 | PLN-08, DEV-11, TST-03 | mandatory source와 heading/field parser contract |
| FR-06 | DEV-11, DEV-12, TST-04 | blocker/gate projection |
| FR-07 | DSG-05, DEV-12, TST-04 | 수동 새로고침 기반 정적 viewer |
| FR-08 | DEV-13, REV-03 | future hook reservation only |
| FR-09 | PLN-08, DEV-14, REV-03 | self-hosting web app과 starter 경계 |
| NFR-01 | DEV-11, REV-03 | solo 오버헤드 최소화 |
| NFR-02 | DEV-11, DEV-12, REV-03 | team/large traceability |
| NFR-03 | DEV-12, DEV-13 | local-first |
| NFR-04 | DEV-11, DEV-12, REV-03 | parser/projection과 UI 분리 |
| NFR-05 | PLN-08, DEV-11, REV-03 | change-expensive contract upfront |
| NFR-06 | DSG-05, DEV-12, REV-03 | 업무 가치 중심 UI |
| NFR-07 | TST-03, TST-04 | real-project artifact regression |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | PLN-08, DSG-05, DEV-11, DEV-12, DEV-13, DEV-14, TST-03, TST-04, REV-03 | parser contract regression, team registry validation, web monitor read-only smoke, source split review | Synced | `v0.2` 승인 기준 반영 완료 |

## Stage Plan

| Stage | Goal | Primary Owner | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| Planning and Architecture | 요구사항과 구조 확정 | Planner | User request received | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md` 승인 |
| Design Gate | UI 범위 확정 | Designer / Planner | Architecture approved | `UI_DESIGN.md` 승인 |
| Development and Test Loop | contract와 monitor 구현 | Developer / Tester | Ready for Execution | parser contract와 monitor MVP pass |
| Review Gate | 구조 / 보안 / 품질 심사 | Reviewer | Phase 1 tests passed | `REVIEW_REPORT.md` 승인 |
| Deployment | self-hosting tool 배치 및 기록 | DevOps | Review approved | `DEPLOYMENT_PLAN.md` 갱신 |
| Documentation and Closeout | 같은 버전 정리 | Documenter | Deployment completed or day wrap up needed | 다음 세션 시작점 정리 |

## Iteration Plan

### Iteration 1
- Scope: profile required field, `team.json`, artifact parser contract, starter 반영 범위를 고정한다.
- Main Task IDs: `DEV-11`, `TST-03`
- Requirement IDs: `FR-01`, `FR-02`, `FR-03`, `FR-05`, `FR-06`, `FR-09`, `NFR-01`, `NFR-02`, `NFR-05`, `NFR-07`
- Validation focus: contract completeness, parser mandatory source coverage, solo/team/large fallback

### Iteration 2
- Scope: `tools/project-monitor-web` Phase 1 MVP를 구현한다.
- Main Task IDs: `DEV-12`, `TST-04`
- Requirement IDs: `FR-04`, `FR-06`, `FR-07`, `NFR-03`, `NFR-04`, `NFR-06`, `NFR-07`
- Validation focus: project board, blocker/approval queue, recent activity, document health, team directory, read-only refresh 흐름

### Iteration 3
- Scope: future hook reservation, health snapshot contract, self-hosting only promotion 규칙을 정리한다.
- Main Task IDs: `DEV-13`, `DEV-14`, `REV-03`
- Requirement IDs: `FR-08`, `FR-09`, `NFR-03`, `NFR-04`, `NFR-05`
- Validation focus: hook points reserved only, no premature realtime path, starter boundary and promotion 조건

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | parser, team registry, `Project Monitor Web` 개발과 validator 실행의 기본 환경 |
| Staging / Preview | Pre-release verification | read-only monitor UI smoke와 fixture regression 확인 |
| Production | Final release | root self-hosting tool 운영 환경, downstream starter에는 직접 포함하지 않음 |

## Validation Gates
- 정적 검증 gate: `check_harness_docs.ps1`, parser/unit tests, team registry schema validation, fixture regression
- 수동 / 실환경 gate: monitor Phase 1 UI smoke, 수동 새로고침, source artifact link-out, blocked/pending approval 표시 정확도
- 보안 / dependency / compliance gate: web stack 선정 후 dependency audit, local server surface 검토
- 요구사항 변경 동기화 gate: `v0.2` baseline과 UI/architecture/plan/task state가 항상 같은 contract를 가리켜야 한다.
- release-ready 판단 기준: contract, parser, monitor MVP, source split review가 모두 통과하고 read-only 경계가 유지된다.

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| contract를 흐리게 둔 채 UI부터 구현 | 장기 유지비 상승 | `DEV-11`에서 required field와 parser contract를 먼저 고정 | Planner / Developer |
| monitor가 truth처럼 사용됨 | 운영 혼선 | write path 금지, source artifact 링크와 refresh semantics 명시 | Planner / Developer |
| `team.json`이 과하게 무거워짐 | solo 채택 저하 | `solo`에서는 optional 유지, required field 최소화 | Planner / Developer |
| parser가 실제 artifact 형식을 견디지 못함 | monitor 신뢰도 저하 | active operating projects fixture regression 우선 | Developer / Tester |
| self-hosting tool이 starter와 섞임 | template drift | `DEV-14`에서 promotion boundary를 먼저 확정 | Planner / Reviewer |

## Handoff Notes
- Designer required: No, `UI_DESIGN.md` 승인본을 기준으로 구현한다.
- Reviewer focus: contract-first 구현 여부, read-only 경계, parser robustness, self-hosting only boundary
- DevOps preflight notes: web stack lock 후 dependency/compliance gate를 다시 확인한다.
- Build artifact reuse / rebuild note: `tools/project-monitor-web`에 local Node server, parser/projection, plain JS dashboard와 test entrypoint가 추가됐다. 다음 단계는 future hook과 promotion boundary를 문서/리뷰 기준으로 닫는 것이다.
