# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: current `v0.3` contract와 preview evidence를 기반으로 hybrid harness를 `준운영 수준`의 rollout-ready 완성본까지 self-hosting 템플릿 안에서 마무리한다
- 현재 stage: Development and Test Loop
- 현재 iteration: `Iteration 2` Completion Gate and Preview Evidence
- 이번 iteration의 주요 Task ID: `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`, `DEV-01`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- 이번 iteration의 Requirement IDs: `FR-14`~`FR-17`, `FR-24`~`FR-38`, `NFR-10`, `NFR-11`, `NFR-15`~`NFR-21`
- 현재 구현 기준 Requirement Baseline: Hybrid Harness Completion v0.1
- 지금 바로 필요한 검증: first validation batch(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`) execution packet, `CR-08` requirements/architecture/task sync, change taxonomy/self-review contract, context/decision artifact scaffold, impact tier rule, browser-rendered local preview regression, governed fixture baseline, dry-run/reporting output, review closure readiness
- 남아 있는 release gate (manual / dependency / compliance): `manual/environment`, `dependency/compliance` 모두 open
- optional self-hosting tool boundary check: `.omx/*`와 monitor delta는 root self-hosting only로 유지한다
- enterprise-governed pack / governance control check: pack은 optional overlay를 유지하되 governed fixture와 activation guide는 rollout-ready 수준으로 끌어올린다
- 현재 green level target: `Targeted`
- branch freshness precheck: 새 버전 draft는 `v0.3` archive 이후 clean baseline에서 시작한다
- user-captured manual test expected: 웹앱 / browser-facing UI scope에서는 relevant `TST-*` 또는 `REL-*`에서 browser-based smoke 또는 user browser raw report를 남긴다
- 다음 역할이 꼭 알아야 할 위험: operating-project rollout은 current version 범위 밖이며 `preview revalidation + review closure + dry-run/reporting` completion gate 전에는 열지 않는다. `CR-08` change-governance/context baseline은 live/starter truth와 중복 없이 반영되어야 하고, conditional gate를 unconditional burden으로 바꾸면 안 된다.

## Status
- Document Status: Active (`PLN-11` synced)
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`
- Requirement Baseline: Hybrid Harness Completion v0.1
- Change Sync Check: Synced
- Last Updated At: 2026-04-11 22:58

## Current Iteration
- Iteration name: `Iteration 2` Completion Gate and Preview Evidence
- Scope: approved `CR-03`~`CR-07` baseline 구현과 `TST-02` preview revalidation은 정리 단계다. 이번 delta에서는 `CR-08` operating capability baseline을 same-turn으로 sync했고, 이어서 `DEV-07`에서 non-trivial change taxonomy, mandatory self-review, `SYSTEM_CONTEXT.md` / `DOMAIN_CONTEXT.md` / `DECISION_LOG.md`, lightweight/full impact contract를 live/starter workflow/skill/source에 연결했다. 그 다음 단계로 first validation batch(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`)를 실제 execution packet으로 열어 evidence-driven stress validation을 바로 시작할 수 있게 한다.
- Main Task IDs: `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`, `DEV-01`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Change requests in scope: `CR-03`, `CR-04`, `CR-05`, `CR-06`, `CR-07`, `CR-08`
- Exit criteria: `PLN-11`이 `CR-08` planning sync를 닫고, 이어서 `DEV-07`, `TST-04`, `DEV-01`, `DEV-02`, `TST-01`, `REV-01`, `REV-02`, `REL-01`, `REL-02`가 completion gate를 닫은 뒤 `REL-03`에서 operating-project rollout defer 또는 진입 결정을 문서화한다
- Green level target: `Targeted`
- Branch freshness precheck: archive path `.agents/artifacts/archive/releases/v0.3/`가 존재하고 version reset이 완료된 상태를 확인한다
- User-captured manual test expected: 웹앱 / browser-facing UI scope에서는 browser-based smoke 또는 user browser raw report를 관련 `TST-*` / `REL-*`에 남긴다
- Manual / environment validation still open: `TST-02`, `REL-01`
- Dependency / compliance gate still open: `REL-02` completion evidence 전까지 open

## Validation Commands
```bash
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
powershell -ExecutionPolicy Bypass -File "templates_starter/.agents/scripts/check_harness_docs.ps1"
```

## Changelog
- [2026-04-07] Planner: `Scalable Governance Profiles v0.3` closeout 이후 `Hybrid Harness Completion v0.1` draft를 열고 planning baseline을 초기화했다.
- [2026-04-07] Planner: `CR-03` requirement revision에 맞춰 `준운영 수준` completion bar와 visibility-first HUD 기준을 implementation plan에 동기화했다.
- [2026-04-07] Planner: PMW usability delta를 feedback-first / mockup-first로 다시 열고 mandatory deep-interview planner skill, `PROJECT_HISTORY.md` artifact를 execution planning에 반영했다.
- [2026-04-11] Planner: `CR-08` 승인에 따라 change taxonomy, mandatory self-review, context/decision artifact, two-tier impact contract를 iteration 2 planning baseline과 next task packet에 추가했다.
- [2026-04-11] Developer: `DEV-01`에서 root self-hosting runtime reference / HUD / runbook source를 `.omx/README.md`, `.omx/RUNTIME_REFERENCE.md`에 정리하고 baseline 문서에 경로를 연결했다.
- [2026-04-08] Planner: user feedback을 반영해 PMW workspace IA, lighter palette, artifact-aware overview, project selector, icon/exit shell affordance를 design-gate acceptance와 `DEV-03` 입력 기준에 추가했다.
- [2026-04-08] Planner: user 승인에 따라 `DSG-03`를 닫고 `DEV-03` 입력 기준을 approved PMW workspace, `Project History` view, launcher/stop icon까지 구체화했다.
- [2026-04-08] Planner: user 지시에 따라 `CR-04` decision packet draft를 열고, approval context compression과 PMW decision packet wireframe을 plan 범위에 추가했다.
- [2026-04-08] Developer: approved PMW workspace / decision packet / project selector / history view / launcher-stop assets를 구현하고 test suite를 통과시켰다.
- [2026-04-08] Planner: `PLN-04`를 마감하며 completion gate와 post-completion rollout entry criteria를 `DEPLOYMENT_PLAN.md`까지 같은 문장으로 고정했다.
- [2026-04-08] Planner / Developer: `CR-05` 승인에 따라 task packet context contract, recurrence gate, governance guardrail contract, PMW risk signal을 same-turn sync 대상으로 추가했다.
- [2026-04-11] Planner / Developer: `CR-07` 승인에 따라 PMW project registry add/delete, compact signal rail, source-aware header, local server stop convenience를 plan acceptance와 live PMW code에 반영했다.

## Objective
- 이번 버전의 목표: hybrid harness를 운영 프로젝트에 rollout 가능한 완성본 수준까지 self-hosting 템플릿 안에서 마무리한다.
- 릴리즈 단위: `CR-03 draft -> runtime/governed fixture completion -> monitor hybrid visibility -> rollout-ready dry-run/reporting`
- 성공 기준: self-hosting hybrid runtime reference / HUD / runbook, governed fixture + validator baseline, monitor visibility, local preview 재검증, review closure, rollout defer/dry-run evidence contract가 모두 정리되고 operating-project rollout 전 필요한 evidence가 self-hosting repo 안에서 재현된다.

## Delivery Strategy
- 구현 전략: current truth plane과 starter generic boundary를 유지한 채 root self-hosting completion부터 닫는다.
- 단계적 릴리즈 여부: Yes. `planning -> completion implementation -> self-hosting preview revalidation -> review closure -> dry-run/reporting -> rollout decision`
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
| FR-17 | `PLN-04`, `DEV-04`, `TST-02`, `VAL-08`, `REL-02`, `REL-03` | rollout-ready dry-run/reporting and defer gate |
| FR-18 | `PLN-03`, `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03` | PMW 같은 UI delta는 mockup 승인 뒤 implementation으로 진행 |
| FR-19 | `PLN-02`, `PLN-05`, `VAL-01`, `REV-01` | shared deep-interview skill을 requirements capture 선행 절차로 고정 |
| FR-20 | `PLN-06`, `DOC-01`, `DOC-02` | `PROJECT_HISTORY.md` artifact와 closeout/day-wrap-up integration |
| FR-21 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | PMW workspace IA와 card-to-content navigation |
| FR-22 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | local multi-project selector와 context separation |
| FR-23 | `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | launcher/stop icon과 top-bar exit 같은 self-hosting shell affordance |
| FR-24 | `PLN-07`, `DSG-05`, `DSG-06`, `DEV-03`, `TST-02` | approval queue의 decision packet projection과 read-only decision context |
| FR-25 | `PLN-08`, `DEV-06`, `TST-03` | task packet context/invariant/trap/evidence contract |
| FR-26 | `PLN-08`, `DEV-06`, `REV-01` | deep-interview가 architecture invariant와 failure mode까지 수집 |
| FR-27 | `PLN-08`, `DEV-06`, `TST-03`, `DOC-01` | day-wrap recurrence gate와 preventive action routing |
| FR-28 | `PLN-08`, `DEV-06`, `TST-03`, `REV-01` | AI-specific review checklist와 governance guardrail contract |
| FR-29 | `PLN-08`, `DEV-06`, `TST-03`, `TST-02` | PMW risk signal read model과 decision packet context 강화 |
| FR-30 | `PLN-09`, `TST-02`, `REL-01` | browser-facing web scope는 browser-based test evidence로 manual/environment gate를 닫는다 |
| FR-31 | `DEV-03`, `TST-02` | self-hosting local project registry management |
| FR-32 | `DEV-03`, `TST-02`, `REL-01` | source-aware header와 local server lifecycle convenience |
| FR-33 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-03`, `VAL-08`, `REV-01` | non-trivial change taxonomy 선언 |
| FR-34 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `REV-01` | mandatory self-review for non-trivial changes |
| FR-35 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-03` | `SYSTEM_CONTEXT.md` contract과 update trigger |
| FR-36 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01` | `DOMAIN_CONTEXT.md` contract과 update trigger |
| FR-37 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-03`, `VAL-08`, `REV-01` | `DECISION_LOG.md` append-only contract과 trigger |
| FR-38 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-08`, `REV-01`, `REL-02` | lightweight/full change impact contract |
| NFR-08 | `PLN-01`, `DEV-02`, `REV-01` | core generic / pack opt-in 유지 |
| NFR-09 | `PLN-02`, `DEV-01`, `REV-01` | `.omx/*` never becomes truth |
| NFR-10 | `PLN-01`, `DEV-01`, `DEV-02`, `TST-01` | starter generic / no rollout before completion |
| NFR-11 | `PLN-04`, `DEV-03`, `DEV-04`, `TST-02`, `REL-02` | local reproducibility and dry-run evidence |
| NFR-12 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `REV-01` | mockup-first validation으로 PMW 재작업 비용 축소 |
| NFR-13 | `PLN-02`, `PLN-05`, `REV-01` | discovery notes are advisory, artifacts remain truth |
| NFR-14 | `DSG-01`, `DSG-02`, `DEV-03`, `TST-02` | PMW default palette는 밝고 읽기 쉬운 operator workspace를 유지 |
| NFR-15 | `PLN-07`, `DSG-05`, `DEV-03`, `TST-02` | decision packet first view만으로도 결정 맥락을 이해할 수 있어야 함 |
| NFR-16 | `PLN-08`, `DEV-06`, `TST-03` | 같은 요구를 다른 phrasing으로 받아도 invariant와 do-not-break path 유지 |
| NFR-17 | `PLN-08`, `DEV-06`, `DOC-01` | recurrence review는 artifact noise를 최소화하면서 repeat issue를 막음 |
| NFR-18 | `PLN-08`, `DEV-06`, `TST-03`, `REV-01` | optional governance extension과 PMW signal 강화가 generic/local-first 기본값을 깨지 않음 |
| NFR-19 | `DEV-03`, `TST-02` | compact neutral workspace와 auto-height signal rail 유지 |
| NFR-20 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-01`, `VAL-03`, `VAL-08` | change-governance baseline은 core/starter default를 과도하게 무겁게 만들지 않음 |
| NFR-21 | `PLN-11`, `DEV-07`, `TST-04`, `VAL-03`, `VAL-07`, `DOC-01` | context/change-governance artifact는 current-state truth를 중복하지 않음 |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-03 | `PLN-01`, `PLN-02`, `PLN-03`, `PLN-04`, `PLN-05`, `PLN-06`, `DSG-01`, `DSG-02`, `DSG-03` | requirement/architecture/plan/task sync, validator rerun, closeout archive check, workflow/skill/source update | In Sync | revised wireframe and approval were captured; implementation can start |
| CR-04 | `PLN-07`, `DSG-05`, `DSG-06`, `DEV-03`, `TST-02` | decision packet requirement/ui sync, PMW implementation, test rerun | In Sync | approval queue의 상세 결정 패킷 view를 승인/구현 상태로 반영했다 |
| CR-05 | `PLN-08`, `DEV-06`, `TST-03` | requirements/architecture/plan/task sync, shared skill mirror update, governance runtime contract update, PMW parser/projection/render regression, validator rerun | In Sync | AI coding critique reinforcement과 recurrence gate를 shared baseline에 반영했다 |
| CR-06 | `PLN-09`, `TST-02`, `REL-01` | requirements/architecture/plan/workflow/template sync, browser-based preview evidence contract, validator rerun | In Sync | 웹앱 / browser-facing scope는 browser-rendered smoke 또는 user browser raw report를 manual gate에 연결한다 |
| CR-07 | `DEV-03`, `TST-02` | requirements/architecture/plan/ui/task sync, PMW project registry write guard, snapshot/header source regression, browser preview rerun | In Sync | project registry add/delete, compact signal rail, source-aware header, local server stop convenience를 live PMW code와 같은 턴에 동기화했다 |
| CR-08 | `PLN-11`, `DEV-07`, `TST-04` | requirements/architecture/plan/task/current-state/starter sync, root/starter validator rerun, mojibake check | In Sync | change taxonomy, mandatory self-review, context/decision artifact, two-tier impact contract를 live/starter baseline에 추가했다 |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.
>
> 모든 task packet은 아래 기본 필드를 함께 유지합니다.
> `Required Context Inputs`: 먼저 읽어야 하는 artifact / runtime contract / evidence
> `Architecture Invariants`: 건드리면 안 되는 구조 규칙과 전역 일관성
> `Known Traps`: 최근 반복된 실수, 금지된 shortcut, shadow-ai 류 우회 위험
> `Do-Not-Break Paths`: 회귀가 치명적인 경로와 민감 파일 / module boundary
> `Evidence Required Before Close`: 완료 처리 전 남겨야 하는 validator / smoke / review / deploy 근거
> `Primary Change Type`: `feature / bugfix / maintenance / refactor / architecture-change`
> `Self-Review Summary`: non-trivial change의 self-review 결과 또는 trivial exemption reason
> `Impact Tier`: `lightweight / full`
> `Decision Log Entry`: required change에서 남긴 `DECISION_LOG.md` entry 또는 N/A

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | root self-hosting hybrid runtime reference / HUD / runbook을 정리한다 | In: `.omx/*`, root docs/runtime visibility, self-hosting boundary. Out: starter default runtime, operating-project rollout | root/starter validator pass, `.omx/README.md`와 `.omx/RUNTIME_REFERENCE.md`에 truth boundary / PMW HUD / local runbook이 정리되고, `.omx` not-truth rule이 유지된다 | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `.omx/README.md`, `.omx/RUNTIME_REFERENCE.md` | starter 기본 동작이 OMX 의존적으로 바뀌면 Planner/User로 올린다 |
| DEV-02 | `enterprise_governed` activation guide와 governed fixture baseline을 완성한다 | In: starter/reset governed docs, runtime contract examples, validator fixtures. Out: real enterprise domain rollout | governed fixture가 validator에 걸리고 pack 미활성 시 core flow가 그대로 pass | starter/reset source, runtime contracts, validators, `TASK_LIST.md` | pack 미활성 상태까지 fail시키면 Planner/User로 올린다 |
| DEV-03 | `Project Monitor Web`에 hybrid visibility와 rollout readiness summary를 추가한다 | In: read-only UI, artifact-aware project overview, project selector, local project registry add/delete, source-aware header, compact signal rail, `Project History` view, decision packet view, left navigation, summary cards/content pane, launcher icon, stop icon, top-bar `Exit`, approved mockup 반영. Out: artifact truth write action, live polling, orchestration control plane, artifact mutation outside `project-registry.json` | local preview smoke pass, root/snapshot/file contract 유지, `DSG-03` / `DSG-06` approval 완료, neutral mid-tone palette와 workspace IA 반영, decision packet이 recommendation / impact / source link를 first view에 제공한다, multi-project context가 섞이지 않음, project registry update가 self-hosting local scope에 머문다, launcher/stop affordance가 local shell 범위에 머문다 | monitor source, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT_PLAN.md`, `UI_DESIGN.md` | UI change가 approved baseline을 벗어나거나 registry write가 artifact/governance truth mutation으로 확장되면 Planner로 올린다 |
| DEV-04 | operating-project mutation 없는 rollout-ready dry-run/reporting을 만든다 | In: dry-run, reporting, evidence capture. Out: actual downstream mutation | dry-run output이 completion gate 판단 근거가 되고 actual rollout은 수행하지 않는다 | deploy/plan artifacts, sync/reporting paths | 실제 rollout 실행이 필요해지면 User/Planner로 올린다 |
| DEV-06 | reinforcement contract를 shared template, runtime contract, PMW signal에 반영한다 | In: task packet context contract, shared skill mirror, optional governance guardrail field, PMW risk signal. Out: write/control plane, new top-level truth, mandatory enterprise burden | requirements/architecture/plan/starter/reset/runtime/PMW/test sync pass, recurrence review가 existing artifact에만 라우팅되고, PMW가 `context miss`, `review reopen`, `evidence stale`, `repeat issue`, `guardrail gap`을 read-only로 보여준다 | live/starter artifacts, live/starter skills, live/starter runtime contract, PMW source/tests, `TASK_LIST.md` | starter default가 무거워지거나 PMW가 control plane처럼 확장되면 Planner/User로 올린다 |
| DEV-07 | `CR-08` operating capability baseline을 shared live/starter source에 구현한다 | In: non-trivial change taxonomy, mandatory self-review, `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`, lightweight/full impact contract, related workflow/skill/template sync. Out: debt register, incident/hotfix/postmortem lane, SLO/observability baseline | live/starter source가 같은 change-governance contract를 가지며, context/decision artifact가 current truth를 대체하지 않고, full impact contract가 `architecture-change`/qualifying `refactor`에만 강하게 걸리며, starter default가 과도하게 무거워지지 않는다 | live/starter artifacts, workflows, skills, template/reset source, `TASK_LIST.md` | unconditional burden, duplicate truth, reset/source mismatch가 생기면 Planner/User로 올린다 |
| TST-01 | governed fixture와 validator regression을 검증한다 | In: root/starter validator, fixture coverage, pack activation rules. Out: operating-project rollout | validator pass, governed fixture required fields/path rules 확인 | validators, `CURRENT_STATE.md`, `TASK_LIST.md` | existing generic starter까지 깨지면 Planner로 올린다 |
| TST-02 | local preview와 dry-run evidence를 검증한다 | In: preview smoke, monitor regression, dry-run outputs. Out: non-local deployment | preview smoke pass, browser-facing web scope면 browser-rendered smoke 또는 user browser raw report 확보, `/api/projects` / project registry add-delete / decision packet / history view / launcher-stop affordance regression 통과, header source trace와 project-wide description source 확인, dry-run evidence captured, no downstream mutation except local `project-registry.json` update | deploy/review/current-state artifacts | preview가 non-loopback or write path로 바뀌거나 web UI scope인데 browser evidence가 없으면 DevOps/Reviewer로 올린다 |
| TST-03 | reinforcement contract와 PMW risk signal 회귀를 검증한다 | In: root/starter validator, PMW snapshot/render test, mojibake guard, governance contract regression. Out: actual rollout | root/starter validator pass, PMW test가 new governance/risk signal을 읽고, Korean artifact mojibake check가 통과하며, recurrence gate contract가 root/starter에서 동일하다 | validator/test artifacts, `CURRENT_STATE.md`, `TASK_LIST.md` | guardrail field가 parser를 깨거나 recurrence contract가 root/starter에서 어긋나면 Planner/Developer로 올린다 |
| TST-04 | `CR-08` operating capability baseline regression을 검증한다 | In: root/starter validator, context/decision artifact scaffold, change-type / self-review / impact-tier trace, mojibake guard. Out: debt register, incident lane | root/starter validator pass, context/decision artifact가 current-state mandatory source로 오인되지 않고, self-review / impact trigger가 requirements/architecture/plan/task에서 일관되며, conditional decision-log gate가 `architecture-change`/qualifying `refactor`에만 걸린다 | validator/test artifacts, `CURRENT_STATE.md`, `TASK_LIST.md` | validator/schema mismatch, source duplication, starter heavy default가 생기면 Planner/Developer로 올린다 |
| VAL-01 | requirement drift가 섞인 Daily English Spark feature expansion 시나리오에서 planning/design/real-device/change-governance baseline이 같이 작동하는지 검증한다 | In: `requirements_deep_interview`, approved scope vs future idea 분리, mockup-first gate, Expo real-device rebuild 판단, primary type / self-review / impact tier, context artifact trigger. Out: 실제 앱 기능 구현, publish execution | approved scope와 deferred idea가 분리되고, mockup 승인 뒤 implementation 가능 상태가 유지되며, native rebuild 필요 여부와 self-review / impact tier / context artifact update or N/A reason이 evidence로 남는다 | `CURRENT_STATE.md`, `TASK_LIST.md`, 필요 시 `REVIEW_REPORT.md`, validation evidence notes | 승인 전 planning sync 주장, mockup bypass, native rebuild 판단 누락, context trigger ambiguity가 생기면 Planner/User로 올린다 |
| VAL-03 | 운영 프로젝트 common change uplift와 sibling rollout 시나리오에서 canonical source / boundary / decision-log 판단이 안전하게 작동하는지 검증한다 | In: `operating-common-rollout` 절차, layer classification, project-specific 제거, skill-folder completeness, dry-run before rollout, primary type / impact tier / decision-log trigger, `SYSTEM_CONTEXT.md` update. Out: 실제 downstream mutation 강행 | common change가 project-specific 값 없이 canonical source로 일반화되고, live/starter/reset/downstream 경계가 유지되며, boundary-changing delta에 decision-log rationale과 system-context update or explicit N/A가 남는다 | `CURRENT_STATE.md`, `TASK_LIST.md`, validation evidence notes, 필요 시 `DECISION_LOG.md` | local customization overwrite 위험, skill folder partial sync, boundary ambiguity, decision-log trigger conflict가 생기면 Planner/User로 올린다 |
| VAL-07 | Windows Korean artifact maintenance 시나리오에서 UTF-8 guard와 scaffold hygiene가 실제 오염 패턴을 막는지 검증한다 | In: `korean-artifact-utf8-guard`, explicit UTF-8 path, mojibake scan, scaffold/reset hygiene, live URL/date/handoff leakage check. Out: template source에 live state를 남긴 채 close | changed-file mojibake scan이 clean이고 validator가 pass하며, starter/reset scaffold에 live URL/date/handoff 원문이 없고 support artifact가 current-state truth로 승격되지 않는다 | `CURRENT_STATE.md`, `TASK_LIST.md`, validation evidence notes, preventive-memory/rule reference | scanner suspect line, BOM 재유입, scaffold contamination, support-vs-truth boundary 혼선이 생기면 Planner/Documenter로 올린다 |
| VAL-08 | dry-run warning이 있는 rollout preflight 시나리오에서 defer discipline과 full impact contract가 지켜지는지 검증한다 | In: dry-run report, target risk explanation, no-mutation confirmation, reopen criteria, rollout mechanism primary type / full impact / compatibility / rollback / decision-log trigger. Out: actual rollout execution | dry-run warning을 근거로 actual rollout을 defer하고, blocker가 state/deploy artifact에 남으며, rollout mechanism change면 full impact contract와 decision-log rationale 또는 explicit N/A가 남는다 | `CURRENT_STATE.md`, `TASK_LIST.md`, `DEPLOYMENT_PLAN.md`, validation evidence notes, 필요 시 `DECISION_LOG.md` | dry-run warning을 무시한 mutation 요구, blocker 은폐, lightweight 축소, rollback 기준 누락이 생기면 Planner/User로 올린다 |
| REV-01 | hybrid harness completion 범위를 release-scope review로 심사한다 | In: `CR-03`, `CR-04`, PMW read-only boundary, governed/runtime boundary, rollout defer gate. Out: actual rollout approval | review findings가 `REVIEW_REPORT.md`에 기록되고 `FR-16`, `FR-17`, `FR-24`, `NFR-11`, `NFR-15` trace가 확인된다 | `REVIEW_REPORT.md`, `CURRENT_STATE.md`, `TASK_LIST.md` | write/control plane drift, truth boundary 혼선, critical regression 발견 시 Planner/User로 올린다 |
| REV-02 | review findings를 닫고 completion gate 재확인 결과를 기록한다 | In: `REV-01` closure, gate confirmation. Out: rollout execution | open finding이 없거나 명시적으로 defer reason이 기록되고 completion gate 판단이 재확인된다 | `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md` | blocker finding이 남으면 `REL-01` 이후로 넘어가지 않고 User/Planner로 올린다 |
| REL-01 | self-hosting preview를 현재 구현 기준으로 재검증한다 | In: developer PC local preview, loopback bind, read-only smoke, launcher/stop path 확인. Out: public exposure, operating-project rollout | `127.0.0.1` bind 확인, browser-facing web scope면 browser-rendered smoke 또는 user browser raw report 확보, `/`, `/api/snapshot`, `/api/projects`, allowed `/api/file` 2xx, blocked path rejection, decision packet/history view smoke가 기록된다 | `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md` | non-loopback exposure, write path, stale preview binary, shell affordance confusion, browser evidence 누락이 있으면 DevOps/Developer로 올린다 |
| REL-02 | operating-project mutation 없는 rollout-ready dry-run/reporting evidence를 기록한다 | In: dry-run, reporting, evidence capture. Out: actual downstream mutation | dry-run/report output이 저장되고 rollout decision input으로 충분한지 설명되며, downstream mutation이 없다는 점이 문서에 남는다 | `DEPLOYMENT_PLAN.md`, `REVIEW_REPORT.md`, `CURRENT_STATE.md` | dry-run이 실제 mutation을 유발하거나 evidence가 불충분하면 Planner/User로 올린다 |
| REL-03 | completion gate가 닫힌 뒤 rollout decision을 별도 기록한다 | In: defer/enter decision, rationale, next step. Out: automatic rollout | `REL-01`, `REV-01` / `REV-02`, `REL-02` 상태를 근거로 rollout defer 또는 진입 결정이 문서화된다 | `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, `PROJECT_HISTORY.md` | user decision 없이는 actual rollout path를 열 수 없으면 User로 올린다 |

## Stage Plan

| Stage | Goal | Primary Owner | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| Planning and Architecture | `CR-03` / `CR-04` draft와 completion gate 확정 | Planner | `v0.3` closeout complete | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` draft sync |
| Design Gate | current PMW usability feedback과 decision-packet gate를 확정 | Designer / Planner / User | Architecture draft ready, current PMW baseline approved | `UI_DESIGN.md`에 decision packet wireframe이 있고 revised requirement draft가 user 승인 상태다 |
| Development and Test Loop | completion implementation과 regression | Developer / Tester | Ready for Execution | runtime/governed/monitor/dry-run tasks pass |
| Review Gate | completion scope 구조 / 보안 / 품질 심사 | Reviewer | release-scope tests passed | `REVIEW_REPORT.md` 승인 |
| Deployment | self-hosting revalidation과 rollout decision | DevOps | Review approved | `DEPLOYMENT_PLAN.md`에 dry-run/reporting 결과 기록 |
| Documentation and Closeout | current version 정리 | Documenter | Deployment decision recorded | 다음 세션 시작점 정리 |

## Iteration Plan

### Iteration 1
- Scope: approved PMW workspace baseline 위에 decision packet draft를 닫았다.
- Main Task IDs: `PLN-07`, `DSG-05`, `DSG-06`
- Requirement IDs: `FR-24`, `NFR-15`
- Validation focus: decision packet 정보 압축, read-only boundary, source link completeness

### Iteration 2
- Scope: self-hosting runtime/governed/monitor 구현과 rollout-ready dry-run/reporting을 정리한다. 현재 PMW workspace / decision packet / local shell assets 구현, `PLN-04` completion gate sync, `TST-02` preview regression은 완료됐고, 이번 delta는 `CR-06`, `CR-07` 위에 `CR-08` operating capability baseline을 추가해 change taxonomy / self-review / context artifact / decision log / impact contract를 묶은 뒤 남은 completion path를 이어간다.
- Main Task IDs: `PLN-11`, `DEV-01`, `DEV-02`, `DEV-03`, `DEV-04`, `DEV-06`, `DEV-07`, `TST-01`, `TST-02`, `TST-03`, `TST-04`, `VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Requirement IDs: `FR-16`, `FR-17`, `FR-18`, `FR-24`, `FR-25`~`FR-38`, `NFR-10`, `NFR-11`, `NFR-12`, `NFR-15`, `NFR-16`~`NFR-21`
- Validation focus: task packet context contract, change taxonomy/self-review/impact tier, context/decision artifact boundary, recurrence gate routing, governance guardrail contract, PMW risk signal quality, browser-rendered local preview smoke, read-only monitor regression, approved mockup 반영, lighter palette/workspace IA, artifact-aware overview summary, decision packet context quality, project selector context separation, shell affordance boundary, dry-run/reporting evidence, rollout defer gate

## Environment Matrix

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | root self-hosting runtime reference, validator, monitor 변경 개발 |
| Staging / Preview | Pre-release verification | developer PC local preview와 dry-run/reporting evidence |
| Production | Final release | current version에서는 operating-project rollout 전 단계까지만 다룬다 |

## Validation Gates
- green level ladder: `Targeted / Package / Workspace / Merge Ready`
- 정적 검증 gate: root/starter validator, runtime/profile/governed fixture checks, monitor tests
- 수동 / 실환경 gate: local preview smoke, 웹앱 / browser-facing UI scope의 browser-rendered smoke 또는 user browser raw report, monitor read-only regression, dry-run/report output review
- 보안 / dependency / compliance gate: no new write path, optional runtime remains local-first, dependency additions 발생 시 재감사
- optional self-hosting tool / starter boundary gate: `.omx/*`와 monitor delta는 root only, starter default unchanged
- enterprise-governed / critical-domain gate: protected path, HITL, critical domain, skeptical evaluator trace 유지
- branch freshness gate: archive 기준선 이후 draft/implementation only
- 요구사항 변경 동기화 gate: 승인된 `CR-03`, `CR-04`, `CR-05`, `CR-06`, `CR-07`, `CR-08` baseline과 `PLN-04` completion gate 문구가 requirements/architecture/plan/task/deploy/current-state/history/workflow/template source에 동기화돼야 한다
- recurrence gate: day wrap up은 세 issue class를 항상 점검하되, issue 또는 preventive action이 있을 때만 artifact를 갱신한다
- task packet contract gate: `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 required context / invariant / trap / do-not-break / close evidence를 기본 계약으로 유지한다
- change governance gate: 모든 non-trivial change는 primary type, self-review, impact tier를 명시하고, `architecture-change` 또는 qualifying `refactor`는 `DECISION_LOG.md`와 full impact contract를 남긴다
- release-ready 판단 기준: `REL-01`, `REV-01` / `REV-02`, `REL-02`가 모두 닫히고, 그 뒤 `REL-03`에서 actual rollout defer 또는 진입 결정이 문서화된다

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| completion scope가 다시 문서-only 수준에 머묾 | rollout 기준 불명확 | runtime reference, governed fixture, monitor visibility, dry-run/report를 모두 completion gate에 묶는다 | Planner |
| approved baseline을 구현 중 다시 흐리게 해석함 | 재작업과 scope drift | `DSG-03` 승인본과 `UI_DESIGN.md` wireframe을 `DEV-03`의 기준으로 고정한다 | Planner / Developer |
| PMW가 artifact summary를 충분히 활용하지 못함 | overview 가치 부족 | `Product Goal`, `Open Questions`, requirements / plan / history summary를 projection contract에 포함한다 | Planner / Developer |
| decision packet이 결국 다시 문서 탐색을 강요함 | 사용자 의사결정 효율 저하 | recommendation, impact, why-now, source link를 first view에서 모두 보이게 강제한다 | Planner / Designer |
| AI가 local optimum으로 구조를 다시 흐트러뜨림 | 재작업과 architecture drift | task packet context contract와 AI-specific review checklist를 기본 계약으로 묶는다 | Planner / Reviewer |
| recurrence review가 새 문서 잡음을 과하게 만듦 | maintenance 비용 증가 | issue 또는 preventive action이 있을 때만 current-state/handoff/follow-up으로 남기고 별도 회고 문서는 만들지 않는다 | Planner / Documenter |
| optional guardrail field가 core/starter 기본값을 무겁게 만듦 | 채택 저하 | optional governance layer에만 강한 의미를 두고 core path는 dormant placeholder로 유지한다 | Planner / Developer |
| multi-project selector가 current repo truth 경계를 흐림 | 잘못된 컨텍스트 판단 | selector는 self-hosting local preset만 읽고, 각 project projection을 명시적으로 분리한다 | Planner / Developer |
| starter가 optional runtime 때문에 무거워짐 | generic template 채택 저하 | root self-hosting only와 starter shared source를 계속 분리한다 | Planner / Developer |
| rollout defer policy가 흐려짐 | 운영 프로젝트 premature mutation | `FR-17`과 `REL-02`에서 dry-run only를 명시하고 actual rollout을 backlog로 분리한다 | Planner / DevOps |
| monitor 확장 중 read-only 경계가 무너짐 | 보안 / 구조 리스크 | write path 금지, preview smoke, reviewer focus로 차단한다 | Developer / Reviewer |
| deep-interview가 raw note 축적으로만 남음 | requirements truth 오염 | shared skill은 structure만 제공하고 최종 합의는 artifact에만 남긴다 | Planner |
| change type 분류가 애매해 lightweight gate만 남음 | 고위험 변경의 review/test 누락 | ambiguous case는 상향 분류하고 full impact contract를 기본값으로 적용한다 | Planner / Reviewer |
| context artifact가 current-state copy로 변질됨 | duplicate truth와 stale docs 증가 | context/decision artifact는 stable reference와 append-only history로만 유지하고 현재 상태는 기존 truth artifact에 남긴다 | Planner / Documenter |
| mandatory self-review가 형식적 체크박스로 흐름 | review 가치 저하 | self-review에 changed path, invariant impact, verification result, open risk를 강제하고 reviewer가 빈 항목을 반려한다 | Reviewer / Developer |

## Handoff Notes
- Designer required: TBD by `DSG-01`
- Reviewer focus: `.omx` truth boundary, governed fixture correctness, monitor read-only 유지, rollout defer gate, mandatory discovery skill이 raw truth를 만들지 않는지 확인
- Reviewer focus: change taxonomy, self-review quality, context/decision artifact가 current truth를 대체하지 않는지, full impact contract trigger가 정확한지 확인
- Reviewer focus: task packet context contract, recurrence gate routing, duplication/abstraction debt, evidence gap, guardrail field가 optional boundary를 깨지 않는지 확인
- DevOps preflight notes: current version의 completion gate는 `REL-01 + REV-01/REV-02 + REL-02`이고, actual rollout path는 `REL-03` 기록 전까지 열지 않는다
- Build artifact reuse / rebuild note: current monitor는 plain Node server 기반이며 next version에서도 local-first 전제를 유지한다
