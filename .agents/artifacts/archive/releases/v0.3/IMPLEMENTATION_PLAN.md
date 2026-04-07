# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: 현재 preview bring-up deployment gate를 유지한 채 `Core + Enterprise Pack` 계약과 optional OMX compatibility를 standard template에 반영한다.
- 현재 stage: Deployment
- 현재 iteration: Deployment Decision - First Preview Bring-Up
- 이번 iteration의 주요 Task ID: `DEP-GATE-01`
- 이번 iteration의 Requirement IDs: `FR-09`, `NFR-03`, `NFR-04`, `NFR-05`
- 현재 구현 기준 Requirement Baseline: `Scalable Governance Profiles v0.3`
- 지금 바로 필요한 검증: concrete self-hosting target selection, preview bring-up smoke, deployment preflight closeout, `CR-02` template/validator sync check
- 남아 있는 release gate (manual / dependency / compliance): first self-hosting target selection과 preview bring-up 검증
- optional self-hosting tool boundary check: `.omx/*` sidecar는 optional이고 `Project Monitor Web`은 계속 self-hosting only다
- 현재 green level target: `Targeted` for `CR-02` template contract, current release stays below `Ready to Deploy`
- branch freshness precheck: preview bring-up 전 최신 planning/runtime/template source가 같은 baseline을 보는지 확인
- user-captured manual test expected: current release preview bring-up에서 host/URL/openability smoke
- 다음 역할이 꼭 알아야 할 위험: `CR-02`는 다음 버전/contract 확장이지 현재 preview evidence를 대체하지 않는다

## Status
- Document Status: Ready for Deployment Decision
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`
- Requirement Baseline: Scalable Governance Profiles v0.3
- Change Sync Check: Synced
- Last Updated At: 2026-04-07 13:43

## Current Iteration
- Iteration name: Deployment Decision - First Preview Bring-Up
- Scope: `REL-06`에서 dependency/compliance gate를 닫았고, 현재 release blocker는 첫 self-hosting preview target 선택과 bring-up evidence다. `CR-02 Enterprise Hybrid Harness`는 template source / validator / workflow contract로 반영하되 현재 deployment focus를 재정의하지 않는다.
- Main Task IDs: `DEP-GATE-01`
- Change requests in scope: `CR-01`, `CR-02`
- Exit criteria: 첫 preview target이 결정되고, preview bring-up smoke가 기록되며, 결과가 `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`에 반영된다.
- Green level target: `Targeted`
- Branch freshness precheck: preview bring-up 직전 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `team.json`, starter/reset source가 모두 `v0.3`를 가리키는지 확인한다.
- User-captured manual test expected: preview host에서 대시보드 접근 가능 여부와 artifact refresh smoke
- Manual / environment validation still open: 첫 self-hosting target 선택, preview bring-up, 실제 host 기준 smoke
- Dependency / compliance gate still open: none

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
powershell -ExecutionPolicy Bypass -File "templates_starter/.agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-06] DevOps: `REL-06`을 완료했고 `Project Monitor Web`에 `package-lock.json`을 추가해 dependency audit 근거를 고정한 뒤 npm dependency/compliance gate와 local server loopback hardening 결과를 deployment prep에 반영했다.
- [2026-04-06] Reviewer: `REV-04`를 완료했고 `DEV-15` delta 승인과 다음 deployment preflight 진입 상태를 구현 계획에 반영했다.
- [2026-04-06] Developer: `DEV-13`, `DEV-14`, `DEV-15`로 future hook, health snapshot, starter/reset boundary, parser sync를 마무리했다.
- [2026-04-07] Planner / Developer / Tester: `CR-02 Enterprise Hybrid Harness`를 반영해 enterprise-governed pack, `governance_controls.json`, optional `.omx` compatibility, workflow/validator alignment를 추가했다.

## Objective
- 이번 버전의 목표: `one core, multiple profiles`를 장기 비용 관점에서 흔들리지 않는 명시적 계약으로 만들고, 별도 웹앱인 `Project Monitor Web` Phase 1을 유지한 채 enterprise hybrid harness contract를 standard template에 올린다.
- 릴리즈 단위: `Contracts -> Project Monitor Web Phase 1 -> Future Hooks -> Enterprise Hybrid Harness follow-up`
- 성공 기준: 현재 release blocker는 preview bring-up으로 유지되면서, 이후 enterprise/domain 확장이 core truth plane을 흔들지 않는 표준 source가 준비된다.

## Delivery Strategy
- 구현 전략: change-expensive contract를 먼저 고정하고, current release deployment focus는 그대로 유지한다.
- 단계적 릴리즈 여부: Yes. `Contracts -> Monitor Phase 1 -> Future Hooks -> Enterprise Hybrid Harness -> Optional Sandbox`
- 리스크가 큰 영역의 선행 검증 필요 여부: Yes. protected path/HITL/critical-domain gate, optional `.omx` truth boundary, reset/source sync는 feature rollout 전에 validator로 고정한다.

## Requirement Trace

| Requirement ID | Covered By Task IDs | Notes |
|---|---|---|
| FR-01 | PLN-08, DEV-11, TST-03, PLN-09 | core profiles 유지 |
| FR-02 | PLN-08, DEV-11, TST-03, PLN-09 | core schema와 parser field 일관성 |
| FR-03 | PLN-08, DEV-11, TST-03, PLN-09, DEV-16, TST-05 | `team.json` + `active_packs` + approval authority contract |
| FR-04 | DSG-05, DEV-12, TST-04 | `Project Monitor Web` 5개 패널 |
| FR-05 | PLN-08, DEV-11, TST-03, DEV-15, REV-04, TST-05 | mandatory source와 heading/field parser contract sync |
| FR-06 | DEV-11, DEV-12, TST-04, DEV-16 | blocker/gate projection + human gate trace |
| FR-07 | DSG-05, DEV-12, TST-04 | 수동 새로고침 기반 정적 viewer |
| FR-08 | DEV-13, REV-03, PLN-09 | future hook reservation only |
| FR-09 | PLN-08, DEV-14, DEV-15, REV-03, REV-04, PLN-09, DEV-16 | self-hosting web app / starter / optional `.omx` boundary |
| FR-10 | PLN-09, DEV-16, TST-05 | enterprise-governed pack overlay |
| FR-11 | PLN-09, DEV-16, TST-05 | `governance_controls.json` contract |
| FR-12 | PLN-09, DEV-16 | OMX workflow compatibility mapping |
| FR-13 | PLN-09, DEV-16, TST-05 | skeptical evaluator + mutation/property/edge-case gate |
| NFR-01 | DEV-11, REV-03, DEV-16 | solo 오버헤드 최소화 |
| NFR-02 | DEV-11, DEV-16, TST-05 | team/large/enterprise traceability |
| NFR-03 | DEV-12, DEV-13, DEV-16 | local-first |
| NFR-04 | DEV-11, DEV-12, DEV-15, DEV-16 | parser/projection과 UI/orchestration 분리 |
| NFR-05 | PLN-08, DEV-11, DEV-15, PLN-09, DEV-16 | change-expensive contract upfront |
| NFR-06 | DSG-05, DEV-12, REV-03 | 업무 가치 중심 UI |
| NFR-07 | TST-03, TST-04, DEV-15, TST-05 | real-project artifact regression |
| NFR-08 | PLN-09, DEV-16, TST-05 | core generic / pack opt-in 유지 |
| NFR-09 | PLN-09, DEV-16, TST-05 | `.omx` sidecar not-truth boundary |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | PLN-08, DSG-05, DEV-11, DEV-12, DEV-13, DEV-14, DEV-15, TST-03, TST-04, REV-03, REV-04 | parser contract regression, team registry validation, web monitor read-only smoke, source split review, reset source mirror sync | Synced | `v0.2` 승인 기준 반영 완료 |
| CR-02 | PLN-09, DEV-16, TST-05 | enterprise pack placeholder sync, runtime contract validation, workflow compatibility check, protected path/HITL/critical-domain validator regression | Synced | current preview deployment gate는 그대로 유지하고 next-version contract만 확장 |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| PLN-09 | `CR-02 Enterprise Hybrid Harness`를 planning artifact와 live task/state에 동기화한다 | In: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`. Out: current preview host 실행 | 세 planning artifact baseline이 `v0.3`로 맞고 current deployment focus가 유지된다 | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md` | release blocker 정의 자체를 바꿔야 하거나 preview target이 바뀌면 User/Planner로 올린다 |
| DEV-16 | starter/reset/runtime/workflow/validator에 enterprise hybrid harness contract를 반영한다 | In: enterprise-governed pack docs, `governance_controls.json`, `team.json` active packs, workflow OMX mapping, `.omx` guidance, validator extension. Out: actual sandbox runtime, starter default orchestration engine, downstream rollout 실행 | starter/reset/runtime source가 생기고 optional pack이 dormant 상태로 유지되며 root/starter validator가 contract를 이해한다 | `templates_starter/*`, `templates/version_reset/artifacts/*`, `templates_starter/templates/version_reset/artifacts/*`, `.agents/runtime/*`, `.agents/rules/*`, `.agents/workflows/*`, `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1` | starter 기본 동작이 OMX/runtime dependency를 요구하게 되면 User/Planner로 올린다 |
| TST-05 | enterprise-governed pack과 profile-aware validator 계약을 회귀 검증한다 | In: `team.json`, `governance_controls.json`, enterprise pack placeholder, root/starter validator pass. Out: preview deployment smoke, downstream rollout 실행 | root validator와 starter validator가 pass하고, enterprise pack required field/path rule이 script에 반영된다 | `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1`, `CURRENT_STATE.md`, `TASK_LIST.md` | validation rule이 existing v0.2 live repo를 부당하게 fail시키면 Planner/User로 올린다 |

## Stage Plan

| Stage | Goal | Primary Owner | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| Planning and Architecture | 요구사항과 구조 확정 | Planner | User request received | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md` 승인 |
| Design Gate | UI 범위 확정 | Designer / Planner | Architecture approved | `UI_DESIGN.md` 승인 |
| Development and Test Loop | contract와 monitor 구현 | Developer / Tester | Ready for Execution | parser contract와 monitor MVP pass |
| Review Gate | 구조 / 보안 / 품질 심사 | Reviewer | Phase 1 tests passed 또는 review finding rework 완료 | `REVIEW_REPORT.md` 승인 |
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
- Scope: future hook reservation, health snapshot contract, self-hosting only promotion 규칙을 정리하고 review drift 2건을 다시 닫는다.
- Main Task IDs: `DEV-13`, `DEV-14`, `DEV-15`, `REV-03`, `REV-04`
- Requirement IDs: `FR-08`, `FR-09`, `NFR-03`, `NFR-04`, `NFR-05`
- Validation focus: hook points reserved only, no premature realtime path, starter/reset boundary sync, parser contract required section 정합성

### Iteration 4
- Scope: `CR-02 Enterprise Hybrid Harness`를 starter/reset/runtime/workflow/validator에 반영한다.
- Main Task IDs: `PLN-09`, `DEV-16`, `TST-05`
- Requirement IDs: `FR-03`, `FR-09`, `FR-10`, `FR-11`, `FR-12`, `FR-13`, `NFR-02`, `NFR-04`, `NFR-05`, `NFR-08`, `NFR-09`
- Validation focus: `active_packs`, `governance_controls.json`, enterprise pack placeholder sync, protected path/HITL/critical-domain rule, optional `.omx` truth boundary

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | parser, runtime contract, validator, `Project Monitor Web` 개발과 검증의 기본 환경 |
| Staging / Preview | Pre-release verification | read-only monitor UI smoke와 fixture regression, first preview bring-up |
| Production | Final release | root self-hosting tool 운영 환경, downstream starter에는 직접 포함하지 않음 |

## Validation Gates
- green level ladder: `Targeted / Package / Workspace / Merge Ready`
- 정적 검증 gate: `check_harness_docs.ps1`, parser/unit tests, team registry schema validation, governance controls validation, fixture regression
- 수동 / 실환경 gate: monitor Phase 1 UI smoke, 수동 새로고침, source artifact link-out, blocked/pending approval 표시 정확도, preview bring-up smoke
- 보안 / dependency / compliance gate: `package-lock.json` 생성 후 `npm audit --json`, `npm ls --depth=0`, local server surface 검토, loopback default bind 확인
- enterprise-governed / critical-domain gate: protected path, human review required scope, critical domain, skeptical evaluator lane, mutation/property/edge-case verification trace가 모두 존재해야 한다
- optional self-hosting tool / starter boundary gate: `Project Monitor Web`와 `.omx/*`는 self-hosting only이며 starter 기본 동작을 바꾸지 않는다
- branch freshness gate: preview bring-up, review, rollout 전 latest baseline과 runtime/template source를 재확인한다
- 요구사항 변경 동기화 gate: `v0.3` baseline과 architecture/plan/task/runtime/template state가 항상 같은 contract를 가리켜야 한다
- release-ready 판단 기준: current contract, parser, monitor MVP, source split review, dependency/compliance gate, preview bring-up gate가 모두 통과해야 한다

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| enterprise 규율이 core template를 무겁게 만듦 | starter 채택 저하 | `enterprise_governed`를 optional pack으로만 유지하고 core flow는 `solo` 기준으로 검증 | Planner / Developer |
| `.omx/*`가 truth처럼 오해됨 | 운영 혼선 | documentation + validator + workflow에서 auxiliary sidecar rule을 명시 | Planner / Developer / Tester |
| approval/budget/audit 도메인에서 자동화가 human gate를 우회 | release / compliance 리스크 | `governance_controls.json`, pack docs, skeptical evaluator gate, HITL 기본값으로 차단 | Planner / Reviewer |
| reset/source mirror drift | downstream template 오류 | root/starter reset mirror sync와 validator를 함께 유지 | Developer / Tester |
| current deployment focus가 next-version contract 작업과 섞임 | preview gate 지연 | `DEP-GATE-01`을 current blocker로 분리 기록하고 CR-02를 follow-up track으로 관리 | Planner / DevOps |

## Handoff Notes
- Designer required: No, `UI_DESIGN.md` 승인본을 기준으로 유지한다.
- Reviewer focus: pack activation rule, protected path/HITL, `.omx` truth boundary, skeptical evaluator / mutation-property-edge-case gate, current preview blocker와 contract extension의 분리
- DevOps preflight notes: dependency/compliance gate는 닫혔고, current release의 남은 일은 first preview target selection과 bring-up smoke다. `CR-02`는 rollout/preview 증거를 대체하지 않는다.
- Build artifact reuse / rebuild note: `tools/project-monitor-web`은 외부 npm runtime dependency 없이 local Node server, parser/projection, plain JS dashboard, generated `package-lock.json`으로 구성되며, optional `.omx/*` contract는 self-hosting auxiliary state일 뿐 runtime dependency가 아니다.
