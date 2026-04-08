# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이 reset baseline의 목표: version closeout 뒤 새 버전을 열더라도 profile/runtime/pack truth와 rollout defer 경계를 빠르게 다시 고정한다
- 현재 stage: Planning and Architecture
- 현재 iteration: Kickoff - Next Version Contract Freeze
- 이번 iteration의 주요 Task ID: `PLN-01`, `PLN-02`, `PLN-03`
- 이번 iteration의 Requirement IDs: `FR-01`~`FR-12`, `NFR-01`~`NFR-08`
- 현재 구현 기준 Requirement Baseline: Hybrid Harness Template v0.1
- 지금 바로 필요한 검증: requirement / architecture / plan sync, profile/pack/runtime baseline 재확인
- 남아 있는 release gate (manual / dependency / compliance): planning iteration에서는 none
- optional self-hosting tool boundary check: `.omx/*`나 visibility tool은 truth가 아니어야 한다
- enterprise-governed pack / governance control check: pack activation prerequisite와 dry-run/reporting defer policy를 요구사항에 다시 고정하고, optional guardrail field는 core path를 무겁게 만들지 않게 둔다
- 현재 green level target: `Targeted`
- branch freshness precheck: 새 버전 planning baseline이 최신 요구사항 기준으로 맞는지 확인한다
- user-captured manual test expected: 웹앱 / browser-facing UI scope가 있으면 relevant `TST-*` 또는 `REL-*`에서 browser-based smoke 또는 user browser raw report를 남긴다
- 다음 역할이 꼭 알아야 할 위험: completion review와 dry-run/reporting 전 actual rollout을 열면 안 된다

## Status
- Document Status: Draft
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`
- Requirement Baseline: Hybrid Harness Template v0.1
- Change Sync Check: Synced
- Last Updated At: 2026-04-08 13:30

## Current Iteration
- Iteration name: Kickoff - Next Version Contract Freeze
- Scope: 운영 프로필, runtime contract, optional pack, rollout defer policy를 새 버전 기준으로 다시 고정한다
- Main Task IDs: `PLN-01`, `PLN-02`, `PLN-03`
- Change requests in scope: project-specific `CR-*`를 여기에 적는다
- Exit criteria: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`가 같은 baseline을 가리킨다
- Green level target: `Targeted`
- Branch freshness precheck: planning 문서가 최신 요구사항 기준으로 맞는지 확인한다
- User-captured manual test expected: 웹앱 / browser-facing UI scope가 있으면 browser-based smoke 또는 user browser raw report를 남긴다
- Manual / environment validation still open: none
- Dependency / compliance gate still open: none

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-07] Template Maintainer: reset implementation plan baseline을 hybrid runtime / governed pack / rollout defer 기준으로 강화했다.
- [2026-04-08] Template Maintainer: reset implementation plan에 task packet context contract, recurrence review, AI-specific review checklist, optional guardrail regression baseline을 추가했다.

## Objective
- 이번 버전의 목표: project-specific 요구사항을 template baseline 위에 안전하게 다시 올리고, optional pack과 rollout timing을 초반에 고정한다
- 릴리즈 단위: `contract freeze -> optional pack/governed fixture -> optional visibility -> review -> deploy / rollout decision`
- 성공 기준: completion review 전 actual rollout을 열지 않으면서 필요한 evidence와 gate를 문서화한다

## Delivery Strategy
- 구현 전략: core truth를 먼저 고정하고 optional layer는 나중에 올린다
- 단계적 릴리즈 여부: Yes
- 리스크가 큰 영역의 선행 검증 필요 여부: Yes. pack activation, runtime boundary, rollout defer policy는 먼저 닫는다

## Requirement Trace

| Requirement ID | Covered By Task IDs | Notes |
|---|---|---|
| FR-01 | `PLN-01`, `DEV-01`, `TST-01` | profile baseline |
| FR-03 | `PLN-01`, `DEV-01`, `TST-01` | `team.json` contract |
| FR-04 | `PLN-02`, `DEV-02`, `TST-01` | governed pack activation |
| FR-05 | `PLN-02`, `DEV-03`, `TST-02` | optional visibility / read-only boundary |
| FR-06 | `PLN-02`, `DEV-03`, `REV-01` | `.omx/*` not-truth rule |
| FR-07 | `PLN-03`, `DEV-04`, `TST-02`, `REL-02` | rollout defer / dry-run-reporting |
| FR-08 | `PLN-01`, `DEV-01`, `REV-01` | task packet context/invariant/evidence contract |
| FR-09 | `PLN-01`, `DEV-01`, `REV-01` | discovery contract가 architecture invariant와 failure mode를 포함 |
| FR-10 | `PLN-03`, `DEV-05`, `DOC-01` | recurrence review와 preventive action routing |
| FR-11 | `PLN-02`, `DEV-05`, `REV-01` | AI-specific review checklist baseline |
| FR-12 | `PLN-02`, `DEV-03`, `TST-03` | optional visibility risk signal은 read-only 유지 |
| FR-13 | `PLN-03`, `TST-02`, `REL-02` | browser-facing web scope는 browser-based test evidence로 manual/environment gate를 닫는다 |
| NFR-01 | `PLN-01`, `DEV-01` | starter generic 유지 |
| NFR-03 | `PLN-02`, `DEV-02`, `TST-01` | enterprise burden opt-in |
| NFR-04 | `PLN-03`, `DEV-04`, `REL-02` | local-first evidence and dry-run |
| NFR-06 | `PLN-01`, `DEV-01`, `REV-01` | phrasing이 달라도 invariant와 do-not-break path 유지 |
| NFR-07 | `PLN-03`, `DEV-05`, `DOC-01` | recurrence review는 artifact noise를 최소화 |
| NFR-08 | `PLN-02`, `DEV-03`, `TST-03` | optional guardrail field와 signal이 starter default를 무겁게 만들지 않음 |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| TEMPLATE-02 | `PLN-01`, `PLN-02`, `PLN-03` | runtime boundary, governed pack, rollout defer 기본 검증 추가 | Synced | reset baseline refresh |
| TEMPLATE-03 | `PLN-01`, `PLN-02`, `PLN-03`, `DEV-05`, `TST-03` | task packet contract, recurrence review, shared checklist, optional guardrail regression 추가 | Synced | reset reinforcement baseline refresh |
| TEMPLATE-04 | `PLN-03`, `TST-02`, `REL-02` | browser-based web test gate와 deploy preflight evidence 추가 | Synced | reset browser-validation baseline refresh |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.
>
> 모든 task packet은 아래 기본 필드를 함께 유지합니다.
> `Required Context Inputs`
> `Architecture Invariants`
> `Known Traps`
> `Do-Not-Break Paths`
> `Evidence Required Before Close`

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | project-specific profile/runtime baseline을 확정한다 | In: `team.json`, profile required fields, goal/scope sync. Out: optional runtime rollout | validator pass, requirement/architecture/plan sync | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md` | profile/pack choice가 요구사항 수준에서 불명확하면 Planner/User로 올린다 |
| DEV-02 | `enterprise_governed` activation guide와 governed fixture를 필요한 경우 정리한다 | In: pack docs, governance controls, activation examples. Out: actual enterprise rollout | pack 미활성 상태에서 core flow 유지, pack 활성 시 required field/path 명시 | runtime/contracts/pack docs, review/deploy artifacts | pack 미활성 상태까지 깨지면 Planner로 올린다 |
| DEV-03 | optional visibility / monitor 또는 `.omx/*` visibility를 read-only 경계 안에 정리한다 | In: read-only visibility, summary, link-out. Out: write action | no write path, `.omx/*` not-truth, visibility boundary documented | architecture/implementation/review/deploy artifacts | write path나 truth drift가 생기면 Reviewer/User로 올린다 |
| DEV-04 | rollout-ready dry-run/reporting과 defer policy를 정리한다 | In: dry-run, reporting, deployment decision. Out: actual rollout mutation | dry-run evidence exists, actual rollout은 defer 상태 유지 | implementation/deployment/current state/task artifacts | actual rollout이 필요해지면 User/Planner로 올린다 |
| DEV-05 | reinforcement contract를 reset baseline에 반영한다 | In: task packet context contract, recurrence review, shared checklist baseline, optional guardrail field. Out: new control plane or mandatory enterprise burden | reset baseline sync pass, recurrence review는 existing artifact에만 기록되고 optional guardrail field는 dormant placeholder로 유지 | reset artifacts, reset skills mirror targets, runtime contracts, review/deploy artifacts | reset default가 무거워지거나 새 top-level truth가 생기면 Planner/User로 올린다 |
| TST-03 | reset reinforcement regression을 검증한다 | In: validator, mirror sync, optional visibility risk signal regression. Out: actual rollout | validator pass, root/starter/reset mirror sync, optional signal remains read-only | validator/test artifacts, current-state/task artifacts | contract mismatch나 parser break가 나면 Planner/Developer로 올린다 |

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
- Scope: profile/runtime/pack contract freeze
- Main Task IDs: `PLN-01`, `PLN-02`, `DEV-01`, `TST-01`
- Requirement IDs: `FR-01`~`FR-04`, `NFR-01`~`NFR-03`
- Validation focus: validator pass, required field/path/pack activation rule

### Iteration 2
- Scope: optional visibility와 rollout defer/dry-run 정책 정리
- Main Task IDs: `DEV-03`, `DEV-04`, `DEV-05`, `TST-02`, `TST-03`, `REV-01`, `REL-02`
- Requirement IDs: `FR-05`~`FR-12`, `NFR-04`~`NFR-08`
- Validation focus: read-only boundary, `.omx/*` not-truth, task packet context contract, recurrence review, optional guardrail regression, actual rollout deferred

### Iteration 3
- Scope: review closure와 deploy / rollout decision
- Main Task IDs: `REV-02`, `REL-01`, `REL-03`, `DOC-01`
- Requirement IDs: release-scope selected subset
- Validation focus: reviewed scope, deployment gate, dry-run/reporting evidence, closeout readiness

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | profile/runtime/pack/validator 작업의 기본 환경 |
| Staging / Preview | Pre-release verification | optional self-hosting visibility, dry-run/reporting evidence |
| Production | Final release | actual rollout은 completion review 뒤에만 연다 |

## Validation Gates
- green level ladder: `Targeted / Package / Workspace / Merge Ready`
- 정적 검증 gate: `check_harness_docs.ps1`, runtime/profile/pack validation, optional fixture regression
- 수동 / 실환경 gate: optional visibility smoke, 웹앱 / browser-facing UI scope의 browser-rendered smoke 또는 user browser raw report, dry-run/report output review, 사용자 raw report alignment
- 보안 / dependency / compliance gate: no new write path, no `.omx/*` truth promotion, dependency additions 발생 시 재감사
- optional self-hosting tool / starter boundary gate: starter default unchanged, visibility/runtime is optional
- recurrence gate: `없음` 판정은 문서에 남기지 않고, issue 또는 preventive action이 있을 때만 current-state/handoff/follow-up을 남긴다
- task packet contract gate: `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 context / invariant / trap / do-not-break / close evidence를 기본 계약으로 유지한다
- enterprise-governed / critical-domain gate: protected path, HITL, critical-domain verification trace 유지
- branch freshness gate: long-running branch / stale baseline 여부 확인
- 요구사항 변경 동기화 gate: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md` sync
- release-ready 판단 기준: reviewed scope approved, dry-run/reporting complete, actual rollout decision documented

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| optional layer가 core template를 무겁게 만듦 | starter 채택 저하 | core truth를 먼저 닫고 optional pack/runtime은 opt-in으로 유지 | Planner / Developer |
| `.omx/*`가 truth처럼 오해됨 | 운영 혼선 | requirements/architecture/review/deploy 문서에 not-truth rule을 반복 명시 | Planner / Reviewer |
| actual rollout을 너무 일찍 실행함 | 운영 프로젝트 리스크 | dry-run/reporting gate와 defer policy를 deploy/review artifact에 명시 | Planner / DevOps |

## Handoff Notes
- Designer required: TBD by project scope
- Reviewer focus: pack activation, `.omx/*` truth boundary, visibility read-only 유지, rollout defer gate
- DevOps preflight notes: actual rollout은 reviewed scope와 dry-run/reporting evidence 뒤에만 연다
- Build artifact reuse / rebuild note: visibility/runtime이 있더라도 local-first와 read-only 기본값을 유지한다
