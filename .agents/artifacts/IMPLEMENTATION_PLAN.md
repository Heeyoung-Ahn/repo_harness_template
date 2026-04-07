# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: current `v0.3` contract와 preview evidence를 기반으로 hybrid harness를 rollout-ready 완성본 수준까지 self-hosting 템플릿 안에서 마무리한다
- 현재 stage: Planning and Architecture
- 현재 iteration: Planning Kickoff - `CR-03 Hybrid Harness Completion`
- 이번 iteration의 주요 Task ID: `PLN-01`, `PLN-02`, `PLN-03`, `PLN-04`
- 이번 iteration의 Requirement IDs: `FR-14`, `FR-15`, `FR-16`, `FR-17`, `NFR-10`, `NFR-11`
- 현재 구현 기준 Requirement Baseline: Hybrid Harness Completion v0.1
- 지금 바로 필요한 검증: requirements / architecture / plan / task sync, archive/reset 정상 완료, rollout defer policy 명시
- 남아 있는 release gate (manual / dependency / compliance): current iteration은 planning only이므로 none
- optional self-hosting tool boundary check: `.omx/*`와 monitor delta는 root self-hosting only로 유지한다
- enterprise-governed pack / governance control check: pack은 optional overlay를 유지하되 governed fixture와 activation guide는 rollout-ready 수준으로 끌어올린다
- 현재 green level target: `Targeted`
- branch freshness precheck: 새 버전 draft는 `v0.3` archive 이후 clean baseline에서 시작한다
- user-captured manual test expected: none in planning iteration
- 다음 역할이 꼭 알아야 할 위험: operating-project rollout은 current version 범위 밖이며 completion gate 전에는 열지 않는다

## Status
- Document Status: Draft
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`
- Requirement Baseline: Hybrid Harness Completion v0.1
- Change Sync Check: Synced
- Last Updated At: 2026-04-07 14:53

## Current Iteration
- Iteration name: Planning Kickoff - `CR-03 Hybrid Harness Completion`
- Scope: `v0.3` closeout 이후 새 버전 draft를 열고, hybrid harness completion을 rollout-ready 범위로 정의한다. current iteration에서는 operating-project rollout을 실행하지 않는다
- Main Task IDs: `PLN-01`, `PLN-02`, `PLN-03`, `PLN-04`
- Change requests in scope: `CR-03`
- Exit criteria: requirement / architecture / implementation / task baseline이 같은 draft contract를 가리키고, user approval을 요청할 수 있는 수준까지 정리된다
- Green level target: `Targeted`
- Branch freshness precheck: archive path `.agents/artifacts/archive/releases/v0.3/`가 존재하고 version reset이 완료된 상태를 확인한다
- User-captured manual test expected: none
- Manual / environment validation still open: none
- Dependency / compliance gate still open: none

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
powershell -ExecutionPolicy Bypass -File "templates_starter/.agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-07] Planner: `Scalable Governance Profiles v0.3` closeout 이후 `Hybrid Harness Completion v0.1` draft를 열고 planning baseline을 초기화했다.

## Objective
- 이번 버전의 목표: hybrid harness를 운영 프로젝트에 rollout 가능한 완성본 수준까지 self-hosting 템플릿 안에서 마무리한다.
- 릴리즈 단위: `CR-03 draft -> runtime/governed fixture completion -> monitor hybrid visibility -> rollout-ready dry-run/reporting`
- 성공 기준: self-hosting hybrid runtime reference, governed fixture baseline, monitor visibility, rollout defer/completion gate가 모두 정리되고 operating-project rollout 전 필요한 evidence가 self-hosting repo 안에서 재현된다.

## Delivery Strategy
- 구현 전략: current truth plane과 starter generic boundary를 유지한 채 root self-hosting completion부터 닫는다.
- 단계적 릴리즈 여부: Yes. `planning -> completion implementation -> review -> self-hosting revalidation -> rollout decision`
- 리스크가 큰 영역의 선행 검증 필요 여부: Yes. governed fixture, monitor visibility, dry-run/reporting, rollout defer gate를 먼저 고정한다.

## Requirement Trace

| Requirement ID | Covered By Task IDs | Notes |
|---|---|---|
| FR-09 | `PLN-02`, `DEV-01`, `DEV-03`, `REV-01` | self-hosting vs starter boundary 유지 |
| FR-10 | `PLN-02`, `DEV-02`, `TST-01`, `REV-01` | enterprise overlay remains opt-in |
| FR-11 | `PLN-02`, `DEV-02`, `TST-01` | governance controls rollout-ready baseline |
| FR-12 | `PLN-02`, `DEV-01`, `REV-01` | OMX compatibility remains optional only |
| FR-13 | `PLN-03`, `DEV-02`, `TST-01`, `REV-01` | critical-domain verification lane 유지 |
| FR-14 | `PLN-01`, `DEV-01`, `REV-01` | hybrid runtime reference / HUD / runbook |
| FR-15 | `PLN-01`, `DEV-02`, `TST-01`, `REV-01` | governed fixture and activation guide |
| FR-16 | `PLN-02`, `DEV-03`, `TST-02`, `REL-01` | monitor hybrid visibility and readiness summary |
| FR-17 | `PLN-04`, `DEV-04`, `TST-02`, `REL-02`, `REL-03` | rollout-ready dry-run/reporting and defer gate |
| NFR-08 | `PLN-01`, `DEV-02`, `REV-01` | core generic / pack opt-in 유지 |
| NFR-09 | `PLN-02`, `DEV-01`, `REV-01` | `.omx/*` never becomes truth |
| NFR-10 | `PLN-01`, `DEV-01`, `DEV-02`, `TST-01` | starter generic / no rollout before completion |
| NFR-11 | `PLN-04`, `DEV-03`, `DEV-04`, `TST-02`, `REL-02` | local reproducibility and dry-run evidence |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-03 | `PLN-01`, `PLN-02`, `PLN-03`, `PLN-04` | requirement/architecture/plan/task sync, validator rerun, closeout archive check | Synced | approval pending draft for next version |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | root self-hosting hybrid runtime reference / HUD / runbook을 정리한다 | In: `.omx/*`, root docs/runtime visibility, self-hosting boundary. Out: starter default runtime, operating-project rollout | root/starter validator pass, truth boundary 유지, `.omx` not-truth rule 유지 | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, root self-hosting docs | starter 기본 동작이 OMX 의존적으로 바뀌면 Planner/User로 올린다 |
| DEV-02 | `enterprise_governed` activation guide와 governed fixture baseline을 완성한다 | In: starter/reset governed docs, runtime contract examples, validator fixtures. Out: real enterprise domain rollout | governed fixture가 validator에 걸리고 pack 미활성 시 core flow가 그대로 pass | starter/reset source, runtime contracts, validators, `TASK_LIST.md` | pack 미활성 상태까지 fail시키면 Planner/User로 올린다 |
| DEV-03 | `Project Monitor Web`에 hybrid visibility와 rollout readiness summary를 추가한다 | In: read-only UI, projection, summary cards/panels. Out: write action, live polling, orchestration control plane | local preview smoke pass, root/snapshot/file contract 유지 | monitor source, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT_PLAN.md` | UI change가 별도 design approval을 요구하면 Planner/Designer로 올린다 |
| DEV-04 | operating-project mutation 없는 rollout-ready dry-run/reporting을 만든다 | In: dry-run, reporting, evidence capture. Out: actual downstream mutation | dry-run output이 completion gate 판단 근거가 되고 actual rollout은 수행하지 않는다 | deploy/plan artifacts, sync/reporting paths | 실제 rollout 실행이 필요해지면 User/Planner로 올린다 |
| TST-01 | governed fixture와 validator regression을 검증한다 | In: root/starter validator, fixture coverage, pack activation rules. Out: operating-project rollout | validator pass, governed fixture required fields/path rules 확인 | validators, `CURRENT_STATE.md`, `TASK_LIST.md` | existing generic starter까지 깨지면 Planner로 올린다 |
| TST-02 | local preview와 dry-run evidence를 검증한다 | In: preview smoke, monitor regression, dry-run outputs. Out: non-local deployment | preview smoke pass, dry-run evidence captured, no downstream mutation | deploy/review/current-state artifacts | preview가 non-loopback or write path로 바뀌면 DevOps/Reviewer로 올린다 |

## Stage Plan

| Stage | Goal | Primary Owner | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| Planning and Architecture | `CR-03` draft와 completion gate 확정 | Planner | `v0.3` closeout complete | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` draft sync |
| Design Gate | monitor UI delta 필요 여부 결정 | Designer / Planner | Architecture draft ready | `UI_DESIGN.md` 필요성 판정 |
| Development and Test Loop | completion implementation과 regression | Developer / Tester | Ready for Execution | runtime/governed/monitor/dry-run tasks pass |
| Review Gate | completion scope 구조 / 보안 / 품질 심사 | Reviewer | release-scope tests passed | `REVIEW_REPORT.md` 승인 |
| Deployment | self-hosting revalidation과 rollout decision | DevOps | Review approved | `DEPLOYMENT_PLAN.md`에 dry-run/reporting 결과 기록 |
| Documentation and Closeout | current version 정리 | Documenter | Deployment decision recorded | 다음 세션 시작점 정리 |

## Iteration Plan

### Iteration 1
- Scope: requirement/architecture freeze와 self-hosting runtime reference + governed fixture baseline을 닫는다.
- Main Task IDs: `PLN-01`, `PLN-02`, `DEV-01`, `DEV-02`, `TST-01`
- Requirement IDs: `FR-14`, `FR-15`, `FR-09`, `FR-10`, `FR-11`, `FR-12`, `FR-13`, `NFR-08`, `NFR-09`, `NFR-10`
- Validation focus: truth boundary, pack activation, governed fixture, validator regression

### Iteration 2
- Scope: monitor hybrid visibility와 rollout-ready dry-run/reporting을 정리한다.
- Main Task IDs: `DEV-03`, `DEV-04`, `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Requirement IDs: `FR-16`, `FR-17`, `NFR-10`, `NFR-11`
- Validation focus: local preview smoke, read-only monitor regression, dry-run/reporting evidence, rollout defer gate

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | root self-hosting runtime reference, validator, monitor 변경 개발 |
| Staging / Preview | Pre-release verification | developer PC local preview와 dry-run/reporting evidence |
| Production | Final release | current version에서는 operating-project rollout 전 단계까지만 다룬다 |

## Validation Gates
- green level ladder: `Targeted / Package / Workspace / Merge Ready`
- 정적 검증 gate: root/starter validator, runtime/profile/governed fixture checks, monitor tests
- 수동 / 실환경 gate: local preview smoke, monitor read-only regression, dry-run/report output review
- 보안 / dependency / compliance gate: no new write path, optional runtime remains local-first, dependency additions 발생 시 재감사
- optional self-hosting tool / starter boundary gate: `.omx/*`와 monitor delta는 root only, starter default unchanged
- enterprise-governed / critical-domain gate: protected path, HITL, critical domain, skeptical evaluator trace 유지
- branch freshness gate: archive 기준선 이후 draft/implementation only
- 요구사항 변경 동기화 gate: `CR-03` draft가 requirements/architecture/plan/task에 동기화돼야 한다
- release-ready 판단 기준: completion implementation pass, review pass, self-hosting revalidation pass, rollout-ready dry-run/report complete

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| completion scope가 다시 문서-only 수준에 머묾 | rollout 기준 불명확 | runtime reference, governed fixture, monitor visibility, dry-run/report를 모두 completion gate에 묶는다 | Planner |
| starter가 optional runtime 때문에 무거워짐 | generic template 채택 저하 | root self-hosting only와 starter shared source를 계속 분리한다 | Planner / Developer |
| rollout defer policy가 흐려짐 | 운영 프로젝트 premature mutation | `FR-17`과 `REL-02`에서 dry-run only를 명시하고 actual rollout을 backlog로 분리한다 | Planner / DevOps |
| monitor 확장 중 read-only 경계가 무너짐 | 보안 / 구조 리스크 | write path 금지, preview smoke, reviewer focus로 차단한다 | Developer / Reviewer |

## Handoff Notes
- Designer required: TBD by `DSG-01`
- Reviewer focus: `.omx` truth boundary, governed fixture correctness, monitor read-only 유지, rollout defer gate
- DevOps preflight notes: current version의 preview evidence는 archive에 남겼고, next version에서는 actual rollout이 아니라 self-hosting revalidation + dry-run/reporting까지만 수행한다
- Build artifact reuse / rebuild note: current monitor는 plain Node server 기반이며 next version에서도 local-first 전제를 유지한다
