# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: 장기 비용을 줄이는 운영 계약을 먼저 구현하고, 그 위에 `Project Monitor Web` Phase 1 MVP를 올린다.
- 현재 stage: Deployment
- 현재 iteration: Deployment Prep - Dependency and Compliance Gate
- 이번 iteration의 주요 Task ID: `REL-06`
- 이번 iteration의 Requirement IDs: `FR-09`, `NFR-03`, `NFR-04`, `NFR-05`
- 현재 구현 기준 Requirement Baseline: `Scalable Governance Profiles v0.2`
- 지금 바로 필요한 검증: concrete self-hosting target selection, preview bring-up smoke, deployment preflight closeout
- 남아 있는 release gate (manual / dependency / compliance): first self-hosting target selection과 preview bring-up 검증
- 다음 역할이 꼭 알아야 할 위험: dependency/compliance gate는 닫혔지만 실제 배포 대상과 manual environment gate가 아직 열려 있다.

## Status
- Document Status: Ready for Deployment Decision
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `UI_DESIGN.md`
- Requirement Baseline: Scalable Governance Profiles v0.2
- Change Sync Check: Synced
- Last Updated At: 2026-04-06 23:49

## Current Iteration
- Iteration name: Deployment Prep - Dependency and Compliance Gate
- Scope: `REL-06`에서 `Project Monitor Web`의 local Node/web stack을 점검했다. `package-lock.json`을 생성해 audit 근거를 고정했고, npm 직접 의존성이 비어 있음을 확인했으며, 기본 bind host를 loopback(`127.0.0.1`)으로 하드닝했다. 다음은 첫 self-hosting target을 정하고 preview bring-up을 실행하는 것이다.
- Main Task IDs: `REL-06`
- Change requests in scope: `CR-01`
- Exit criteria: `package-lock.json`이 추가되고, `npm ls --depth=0` empty, `npm audit --json` 0 vulnerabilities, `node --test` pass, local server가 loopback 기본 bind로 동작하며, 결과가 `DEPLOYMENT_PLAN.md`와 상태 artifact에 반영된다.
- Manual / environment validation still open: 첫 self-hosting target 선택, preview bring-up, 실제 host 기준 smoke
- Dependency / compliance gate still open: none

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-06] DevOps: `REL-06`을 완료했고 `Project Monitor Web`에 `package-lock.json`을 추가해 dependency audit 근거를 고정한 뒤 npm dependency/compliance gate와 local server loopback hardening 결과를 deployment prep에 반영했다.
- [2026-04-06] Reviewer: `REV-04`를 완료했고 `DEV-15` delta 승인과 다음 deployment preflight 진입 상태를 구현 계획에 반영했다.
- [2026-04-06] Developer: `DEV-15`로 parser required section sync, reset source mirror sync, regression test를 반영했고 reviewer 재확인 단계로 넘겼다.
- [2026-04-06] Developer: `DEV-13`, `DEV-14` 범위로 reserved future hook contract, optional `health_snapshot.json`, self-hosting/downstream promotion boundary를 구현/문서화했다.
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
| FR-05 | PLN-08, DEV-11, TST-03, DEV-15, REV-04 | mandatory source와 heading/field parser contract sync |
| FR-06 | DEV-11, DEV-12, TST-04 | blocker/gate projection |
| FR-07 | DSG-05, DEV-12, TST-04 | 수동 새로고침 기반 정적 viewer |
| FR-08 | DEV-13, REV-03 | future hook reservation only |
| FR-09 | PLN-08, DEV-14, DEV-15, REV-03, REV-04 | self-hosting web app과 starter/reset boundary |
| NFR-01 | DEV-11, REV-03 | solo 오버헤드 최소화 |
| NFR-02 | DEV-11, DEV-12, REV-03 | team/large traceability |
| NFR-03 | DEV-12, DEV-13 | local-first |
| NFR-04 | DEV-11, DEV-12, DEV-15, REV-03, REV-04 | parser/projection과 UI 분리 |
| NFR-05 | PLN-08, DEV-11, DEV-15, REV-03, REV-04 | change-expensive contract upfront |
| NFR-06 | DSG-05, DEV-12, REV-03 | 업무 가치 중심 UI |
| NFR-07 | TST-03, TST-04, DEV-15 | real-project artifact regression |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | PLN-08, DSG-05, DEV-11, DEV-12, DEV-13, DEV-14, DEV-15, TST-03, TST-04, REV-03, REV-04 | parser contract regression, team registry validation, web monitor read-only smoke, source split review, reset source mirror sync | Synced | `v0.2` 승인 기준 반영 완료 |

## Task Packet Ledger

> `DEV-13`, `DEV-14`, `REV-03`는 future contract를 명시적으로 고정하고 review cost를 낮추는 패킷으로 관리한다.

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-13 | reserved hook name과 optional `health_snapshot.json` contract를 고정한다 | In: hook name, emit point, placeholder runtime contract, parser/domain exposure. Out: websocket, queue, watcher, push transport | architecture/monitor code에 reserved contract가 반영되고 read-only 경계가 유지된다 | `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`, `.agents/runtime/health_snapshot.json`, `tools/project-monitor-web/*` | Phase 1에 transport/runtime producer를 넣어야 한다면 User/Planner로 올린다 |
| DEV-14 | self-hosting only 도구와 starter-bound shared contract의 promotion boundary를 고정한다 | In: root/starter 경계표, starter generic template 보강, optional placeholder file. Out: starter 기본 monitor runtime shipping, downstream rollout 실행 | boundary table과 starter generic prompt가 생기고 reset/source split 규칙과 충돌하지 않는다 | `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`, `templates_starter/.agents/*` | starter 기본 동작에 web runtime을 넣어야 한다면 User 판단으로 전환한다 |
| DEV-15 | `REV-03-01`, `REV-03-02`를 닫기 위해 parser contract와 reset source mirror sync를 재작업한다 | In: `ARCHITECTURE_GUIDE.md` parser contract sync, `parse-architecture-guide.js` required section sync, regression test 추가, reset source prompt mirror. Out: 새로운 runtime 기능, scope 확장, Phase 2 transport | root contract와 parser 구현이 같은 required section을 가리키고 reset source mirror 2곳이 starter prompt와 같은 항목을 가진다 | `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`, `templates/version_reset/artifacts/IMPLEMENTATION_PLAN.md`, `templates_starter/templates/version_reset/artifacts/IMPLEMENTATION_PLAN.md`, `tools/project-monitor-web/*` | finding을 닫으려면 requirement 자체를 바꿔야 한다면 Planner/User로 올린다 |
| REV-04 | `DEV-15` delta만 재검토해 `REV-03` finding closure를 확인한다 | In: parser contract row, parser warning rule, reset source mirror sync, regression evidence. Out: unrelated monitor UI behavior, dependency audit decision | `REV-03-01`, `REV-03-02`가 닫혔고 validator/test evidence가 최신이면 review gate를 갱신한다 | `REVIEW_REPORT.md`, `TASK_LIST.md`, `CURRENT_STATE.md` | 재작업으로 requirement/architecture baseline이 바뀌면 Planner로 되돌린다 |
| REL-06 | dependency/compliance gate와 local server surface review를 닫는다 | In: `package-lock.json` 생성, npm audit evidence, local HTTP surface review, loopback default bind, deployment-prep artifact sync. Out: public hosting, new SaaS infra, provider-specific runtime 추가 | npm dependency가 empty로 확인되고 audit가 0 vulnerabilities를 반환하며, local server가 read-only/whitelist/loopback 기본 bind를 유지하고 결과가 deployment artifact에 기록된다 | `DEPLOYMENT_PLAN.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`, `tools/project-monitor-web/package-lock.json`, `tools/project-monitor-web/server.js` | 외부 host exposure나 새 runtime dependency가 필요해지면 User/Planner로 올린다 |

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

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | parser, team registry, `Project Monitor Web` 개발과 validator 실행의 기본 환경 |
| Staging / Preview | Pre-release verification | read-only monitor UI smoke와 fixture regression 확인 |
| Production | Final release | root self-hosting tool 운영 환경, downstream starter에는 직접 포함하지 않음 |

## Validation Gates
- 정적 검증 gate: `check_harness_docs.ps1`, parser/unit tests, team registry schema validation, fixture regression
- 수동 / 실환경 gate: monitor Phase 1 UI smoke, 수동 새로고침, source artifact link-out, blocked/pending approval 표시 정확도
- 보안 / dependency / compliance gate: `package-lock.json` 생성 후 `npm audit --json`, `npm ls --depth=0`, local server surface 검토, loopback default bind 확인
- future contract gate: reserved hook name과 optional health snapshot contract는 존재하되 realtime transport와 write path를 추가하지 않는다
- promotion boundary gate: self-hosting only runtime과 starter-bound shared contract가 문서/소스에서 구분되어야 한다
- 요구사항 변경 동기화 gate: `v0.2` baseline과 UI/architecture/plan/task state가 항상 같은 contract를 가리켜야 한다.
- release-ready 판단 기준: contract, parser, monitor MVP, source split review, dependency/compliance gate가 모두 통과하고 실제 self-hosting target 기준 manual gate가 닫힌다.

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
- Reviewer focus: contract-first 구현 여부, read-only 경계, parser required section 정합성, reset source mirror sync, reserved hook name, optional health snapshot contract, self-hosting only boundary
- DevOps preflight notes: dependency/compliance gate는 `REL-06`에서 닫혔고, 다음은 concrete self-hosting target 선택과 preview bring-up smoke다.
- Build artifact reuse / rebuild note: `tools/project-monitor-web`은 외부 npm runtime dependency 없이 local Node server, parser/projection, plain JS dashboard, generated `package-lock.json`으로 구성되며, local server는 기본적으로 `127.0.0.1`에 bind된다. 다음 단계는 실제 internal host를 선택해 deployment preflight를 닫는 것이다.
