# Implementation Plan

> 요구사항과 아키텍처를 실제 작업 순서로 변환한 실행 계획서입니다.  
> Developer, Tester, DevOps는 이 문서를 기준으로 현재 단계와 검증 기준을 확인합니다.

## Quick Read
- 이번 버전의 목표: current `v0.3` contract와 preview evidence를 기반으로 hybrid harness를 `준운영 수준`의 rollout-ready 완성본까지 self-hosting 템플릿 안에서 마무리한다
- 현재 stage: Development and Test Loop
- 현재 iteration: `Iteration 2` Completion Gate and Preview Evidence
- 이번 iteration의 주요 Task ID: `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- 이번 iteration의 Requirement IDs: `FR-16`, `FR-17`, `FR-24`, `NFR-11`, `NFR-15`
- 현재 구현 기준 Requirement Baseline: Hybrid Harness Completion v0.1
- 지금 바로 필요한 검증: local preview regression, `/api/projects`와 decision packet projection, launcher/stop shell affordance boundary, dry-run/reporting output, review closure readiness
- 남아 있는 release gate (manual / dependency / compliance): `manual/environment`, `dependency/compliance` 모두 open
- optional self-hosting tool boundary check: `.omx/*`와 monitor delta는 root self-hosting only로 유지한다
- enterprise-governed pack / governance control check: pack은 optional overlay를 유지하되 governed fixture와 activation guide는 rollout-ready 수준으로 끌어올린다
- 현재 green level target: `Targeted`
- branch freshness precheck: 새 버전 draft는 `v0.3` archive 이후 clean baseline에서 시작한다
- user-captured manual test expected: optional local browser smoke during `TST-02`
- 다음 역할이 꼭 알아야 할 위험: operating-project rollout은 current version 범위 밖이며 `preview revalidation + review closure + dry-run/reporting` completion gate 전에는 열지 않는다. PMW delta는 current 화면 feedback과 mockup 승인 없이 구현으로 넘어가면 안 된다.

## Status
- Document Status: Active (`PLN-04` synced)
- Owner: Planner
- Based On: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`
- Requirement Baseline: Hybrid Harness Completion v0.1
- Change Sync Check: Synced
- Last Updated At: 2026-04-08 01:35

## Current Iteration
- Iteration name: `Iteration 2` Completion Gate and Preview Evidence
- Scope: approved `CR-03` + `CR-04` baseline 구현은 끝났고, 이제 completion gate를 `DEPLOYMENT_PLAN.md`까지 고정한 상태에서 `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`로 self-hosting evidence를 닫는다
- Main Task IDs: `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Change requests in scope: `CR-03`, `CR-04`
- Exit criteria: `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`가 completion gate를 닫고, `REL-03`에서 operating-project rollout defer 또는 진입 결정을 문서화한다
- Green level target: `Targeted`
- Branch freshness precheck: archive path `.agents/artifacts/archive/releases/v0.3/`가 존재하고 version reset이 완료된 상태를 확인한다
- User-captured manual test expected: optional local browser smoke during `TST-02`
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
- [2026-04-08] Planner: user feedback을 반영해 PMW workspace IA, lighter palette, artifact-aware overview, project selector, icon/exit shell affordance를 design-gate acceptance와 `DEV-03` 입력 기준에 추가했다.
- [2026-04-08] Planner: user 승인에 따라 `DSG-03`를 닫고 `DEV-03` 입력 기준을 approved PMW workspace, `Project History` view, launcher/stop icon까지 구체화했다.
- [2026-04-08] Planner: user 지시에 따라 `CR-04` decision packet draft를 열고, approval context compression과 PMW decision packet wireframe을 plan 범위에 추가했다.
- [2026-04-08] Developer: approved PMW workspace / decision packet / project selector / history view / launcher-stop assets를 구현하고 test suite를 통과시켰다.
- [2026-04-08] Planner: `PLN-04`를 마감하며 completion gate와 post-completion rollout entry criteria를 `DEPLOYMENT_PLAN.md`까지 같은 문장으로 고정했다.

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
| FR-17 | `PLN-04`, `DEV-04`, `TST-02`, `REL-02`, `REL-03` | rollout-ready dry-run/reporting and defer gate |
| FR-18 | `PLN-03`, `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03` | PMW 같은 UI delta는 mockup 승인 뒤 implementation으로 진행 |
| FR-19 | `PLN-02`, `PLN-05`, `REV-01` | shared deep-interview skill을 requirements capture 선행 절차로 고정 |
| FR-20 | `PLN-06`, `DOC-01`, `DOC-02` | `PROJECT_HISTORY.md` artifact와 closeout/day-wrap-up integration |
| FR-21 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | PMW workspace IA와 card-to-content navigation |
| FR-22 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | local multi-project selector와 context separation |
| FR-23 | `DSG-02`, `DSG-03`, `DEV-03`, `TST-02` | launcher/stop icon과 top-bar exit 같은 self-hosting shell affordance |
| FR-24 | `PLN-07`, `DSG-05`, `DSG-06`, `DEV-03`, `TST-02` | approval queue의 decision packet projection과 read-only decision context |
| NFR-08 | `PLN-01`, `DEV-02`, `REV-01` | core generic / pack opt-in 유지 |
| NFR-09 | `PLN-02`, `DEV-01`, `REV-01` | `.omx/*` never becomes truth |
| NFR-10 | `PLN-01`, `DEV-01`, `DEV-02`, `TST-01` | starter generic / no rollout before completion |
| NFR-11 | `PLN-04`, `DEV-03`, `DEV-04`, `TST-02`, `REL-02` | local reproducibility and dry-run evidence |
| NFR-12 | `DSG-01`, `DSG-02`, `DSG-03`, `DEV-03`, `REV-01` | mockup-first validation으로 PMW 재작업 비용 축소 |
| NFR-13 | `PLN-02`, `PLN-05`, `REV-01` | discovery notes are advisory, artifacts remain truth |
| NFR-14 | `DSG-01`, `DSG-02`, `DEV-03`, `TST-02` | PMW default palette는 밝고 읽기 쉬운 operator workspace를 유지 |
| NFR-15 | `PLN-07`, `DSG-05`, `DEV-03`, `TST-02` | decision packet first view만으로도 결정 맥락을 이해할 수 있어야 함 |

## Requirement Change Impact

| Change ID | Updated Task IDs | Validation Updates | Sync Status | Notes |
|---|---|---|---|---|
| CR-03 | `PLN-01`, `PLN-02`, `PLN-03`, `PLN-04`, `PLN-05`, `PLN-06`, `DSG-01`, `DSG-02`, `DSG-03` | requirement/architecture/plan/task sync, validator rerun, closeout archive check, workflow/skill/source update | In Sync | revised wireframe and approval were captured; implementation can start |
| CR-04 | `PLN-07`, `DSG-05`, `DSG-06`, `DEV-03`, `TST-02` | decision packet requirement/ui sync, PMW implementation, test rerun | In Sync | approval queue의 상세 결정 패킷 view를 승인/구현 상태로 반영했다 |

## Task Packet Ledger

> 릴리즈 범위 또는 cross-role handoff가 있는 `DEV-*`, `TST-*`, `REV-*`, `REL-*` task는 여기서 실행 계약을 고정합니다.

| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | root self-hosting hybrid runtime reference / HUD / runbook을 정리한다 | In: `.omx/*`, root docs/runtime visibility, self-hosting boundary. Out: starter default runtime, operating-project rollout | root/starter validator pass, truth boundary 유지, `.omx` not-truth rule 유지 | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, root self-hosting docs | starter 기본 동작이 OMX 의존적으로 바뀌면 Planner/User로 올린다 |
| DEV-02 | `enterprise_governed` activation guide와 governed fixture baseline을 완성한다 | In: starter/reset governed docs, runtime contract examples, validator fixtures. Out: real enterprise domain rollout | governed fixture가 validator에 걸리고 pack 미활성 시 core flow가 그대로 pass | starter/reset source, runtime contracts, validators, `TASK_LIST.md` | pack 미활성 상태까지 fail시키면 Planner/User로 올린다 |
| DEV-03 | `Project Monitor Web`에 hybrid visibility와 rollout readiness summary를 추가한다 | In: read-only UI, artifact-aware project overview, project selector, `Project History` view, decision packet view, left navigation, summary cards/content pane, launcher icon, stop icon, top-bar `Exit`, approved mockup 반영. Out: write action, live polling, orchestration control plane, artifact mutation | local preview smoke pass, root/snapshot/file contract 유지, `DSG-03` / `DSG-06` approval 완료, lighter palette와 workspace IA 반영, decision packet이 recommendation / impact / source link를 first view에 제공한다, multi-project context가 섞이지 않음, launcher/stop affordance가 local shell 범위에 머문다 | monitor source, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT_PLAN.md`, `UI_DESIGN.md` | UI change가 approved baseline을 벗어나거나 decision packet이 approval submit control처럼 확장되면 Planner로 올린다 |
| DEV-04 | operating-project mutation 없는 rollout-ready dry-run/reporting을 만든다 | In: dry-run, reporting, evidence capture. Out: actual downstream mutation | dry-run output이 completion gate 판단 근거가 되고 actual rollout은 수행하지 않는다 | deploy/plan artifacts, sync/reporting paths | 실제 rollout 실행이 필요해지면 User/Planner로 올린다 |
| TST-01 | governed fixture와 validator regression을 검증한다 | In: root/starter validator, fixture coverage, pack activation rules. Out: operating-project rollout | validator pass, governed fixture required fields/path rules 확인 | validators, `CURRENT_STATE.md`, `TASK_LIST.md` | existing generic starter까지 깨지면 Planner로 올린다 |
| TST-02 | local preview와 dry-run evidence를 검증한다 | In: preview smoke, monitor regression, dry-run outputs. Out: non-local deployment | preview smoke pass, `/api/projects` / decision packet / history view / launcher-stop affordance regression 통과, dry-run evidence captured, no downstream mutation | deploy/review/current-state artifacts | preview가 non-loopback or write path로 바뀌면 DevOps/Reviewer로 올린다 |
| REV-01 | hybrid harness completion 범위를 release-scope review로 심사한다 | In: `CR-03`, `CR-04`, PMW read-only boundary, governed/runtime boundary, rollout defer gate. Out: actual rollout approval | review findings가 `REVIEW_REPORT.md`에 기록되고 `FR-16`, `FR-17`, `FR-24`, `NFR-11`, `NFR-15` trace가 확인된다 | `REVIEW_REPORT.md`, `CURRENT_STATE.md`, `TASK_LIST.md` | write/control plane drift, truth boundary 혼선, critical regression 발견 시 Planner/User로 올린다 |
| REV-02 | review findings를 닫고 completion gate 재확인 결과를 기록한다 | In: `REV-01` closure, gate confirmation. Out: rollout execution | open finding이 없거나 명시적으로 defer reason이 기록되고 completion gate 판단이 재확인된다 | `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md` | blocker finding이 남으면 `REL-01` 이후로 넘어가지 않고 User/Planner로 올린다 |
| REL-01 | self-hosting preview를 현재 구현 기준으로 재검증한다 | In: developer PC local preview, loopback bind, read-only smoke, launcher/stop path 확인. Out: public exposure, operating-project rollout | `127.0.0.1` bind 확인, `/`, `/api/snapshot`, `/api/projects`, allowed `/api/file` 2xx, blocked path rejection, decision packet/history view smoke가 기록된다 | `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md` | non-loopback exposure, write path, stale preview binary, shell affordance confusion이 있으면 DevOps/Developer로 올린다 |
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
- Scope: self-hosting runtime/governed/monitor 구현과 rollout-ready dry-run/reporting을 정리한다. 현재 PMW workspace / decision packet / local shell assets 구현과 `PLN-04` completion gate sync는 완료됐고, 남은 immediate follow-up은 evidence capture와 review/deploy gate execution이다.
- Main Task IDs: `DEV-01`, `DEV-02`, `DEV-03`, `DEV-04`, `TST-01`, `TST-02`, `REV-01`, `REV-02`, `REL-01`, `REL-02`, `REL-03`
- Requirement IDs: `FR-16`, `FR-17`, `FR-18`, `FR-24`, `NFR-10`, `NFR-11`, `NFR-12`, `NFR-15`
- Validation focus: local preview smoke, read-only monitor regression, approved mockup 반영, lighter palette/workspace IA, artifact-aware overview summary, decision packet context quality, project selector context separation, shell affordance boundary, dry-run/reporting evidence, rollout defer gate

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
- 요구사항 변경 동기화 gate: 승인된 `CR-03`, `CR-04` baseline과 `PLN-04` completion gate 문구가 requirements/architecture/plan/task/deploy에 동기화돼야 한다
- release-ready 판단 기준: `REL-01`, `REV-01` / `REV-02`, `REL-02`가 모두 닫히고, 그 뒤 `REL-03`에서 actual rollout defer 또는 진입 결정이 문서화된다

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| completion scope가 다시 문서-only 수준에 머묾 | rollout 기준 불명확 | runtime reference, governed fixture, monitor visibility, dry-run/report를 모두 completion gate에 묶는다 | Planner |
| approved baseline을 구현 중 다시 흐리게 해석함 | 재작업과 scope drift | `DSG-03` 승인본과 `UI_DESIGN.md` wireframe을 `DEV-03`의 기준으로 고정한다 | Planner / Developer |
| PMW가 artifact summary를 충분히 활용하지 못함 | overview 가치 부족 | `Product Goal`, `Open Questions`, requirements / plan / history summary를 projection contract에 포함한다 | Planner / Developer |
| decision packet이 결국 다시 문서 탐색을 강요함 | 사용자 의사결정 효율 저하 | recommendation, impact, why-now, source link를 first view에서 모두 보이게 강제한다 | Planner / Designer |
| multi-project selector가 current repo truth 경계를 흐림 | 잘못된 컨텍스트 판단 | selector는 self-hosting local preset만 읽고, 각 project projection을 명시적으로 분리한다 | Planner / Developer |
| starter가 optional runtime 때문에 무거워짐 | generic template 채택 저하 | root self-hosting only와 starter shared source를 계속 분리한다 | Planner / Developer |
| rollout defer policy가 흐려짐 | 운영 프로젝트 premature mutation | `FR-17`과 `REL-02`에서 dry-run only를 명시하고 actual rollout을 backlog로 분리한다 | Planner / DevOps |
| monitor 확장 중 read-only 경계가 무너짐 | 보안 / 구조 리스크 | write path 금지, preview smoke, reviewer focus로 차단한다 | Developer / Reviewer |
| deep-interview가 raw note 축적으로만 남음 | requirements truth 오염 | shared skill은 structure만 제공하고 최종 합의는 artifact에만 남긴다 | Planner |

## Handoff Notes
- Designer required: TBD by `DSG-01`
- Reviewer focus: `.omx` truth boundary, governed fixture correctness, monitor read-only 유지, rollout defer gate
- Reviewer focus: `.omx` truth boundary, governed fixture correctness, monitor read-only 유지, rollout defer gate, mandatory discovery skill이 raw truth를 만들지 않는지 확인
- DevOps preflight notes: current version의 completion gate는 `REL-01 + REV-01/REV-02 + REL-02`이고, actual rollout path는 `REL-03` 기록 전까지 열지 않는다
- Build artifact reuse / rebuild note: current monitor는 plain Node server 기반이며 next version에서도 local-first 전제를 유지한다
