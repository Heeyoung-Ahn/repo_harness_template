# Task List

> 프로젝트의 공식 진행 상태 문서입니다.  
> 이 문서는 task / lock truth이며, `CURRENT_STATE.md`는 resume router, `## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관용입니다.

## Changelog
- [2026-04-12] Documenter: user review 결과 markdown cleanup 후보는 모두 유지하기로 했고 `DOC-05`를 no-op close 처리했다.
- [2026-04-12] Documenter: whole-repo markdown inventory를 스캔해 `MARKDOWN_DOCUMENT_CATALOG.md`를 생성했고, 9개 delete-review 후보를 분류한 뒤 day-wrap state에 반영했다.
- [2026-04-07] Documenter / Planner: `Scalable Governance Profiles v0.3` snapshot을 `.agents/artifacts/archive/releases/v0.3/`에 보관했고 reset source로 version artifact를 초기화한 뒤 `Hybrid Harness Completion v0.1` draft를 시작했다.
- [2026-04-07] Planner: `CR-03` 요구사항 초안을 `준운영 수준` completion bar로 강화하고 architecture / implementation baseline을 같은 턴에 동기화했다.
- [2026-04-07] Planner: `CR-03` draft를 PMW usability feedback 대기 상태로 다시 열고, mandatory deep-interview skill과 `PROJECT_HISTORY.md` artifact를 planning baseline에 반영했다.
- [2026-04-08] Planner / Designer: user feedback을 `DSG-01` 입력으로 반영하고, PMW lighter palette, project selector, artifact-aware overview, workspace wireframe 기준안을 `CR-03` draft에 동기화했다.
- [2026-04-08] Planner: user가 revised PMW workspace baseline을 승인했고, `Project History` 전용 조회와 launcher/stop affordance를 구현 입력으로 고정했다.
- [2026-04-08] Planner / Designer: user 지시에 따라 `CR-04` decision-packet draft를 열고, approval queue의 상세 결정 패킷 IA / wireframe을 planning artifacts에 반영했다.
- [2026-04-08] Planner / Developer: user가 `CR-05 Hybrid Harness Reinforcement + Day Wrap Up Recurrence Gate` 구현을 승인했고, requirements/architecture/plan baseline sync, shared skill/rule 강화, governance contract 보강, PMW signal 추가를 같은 턴에 반영한다.
- [2026-04-08] Planner / Developer / Tester: `CR-05` reinforcement contract를 live/starter/runtime/PMW에 반영했고, root/starter validator, PMW test, Korean mojibake check로 회귀를 검증했다.
- [2026-04-08] Planner: user 지시에 따라 `CR-06 Web Browser-Based Test Contract`를 승인하고, 웹앱 / browser-facing UI scope의 브라우저 기반 테스트 규칙을 live/starter/reset baseline에 반영한다.
- [2026-04-08] Documenter: starter/reset artifact hygiene를 초기화하고 `PREVENTIVE_MEMORY.md`와 template hygiene guardrail을 live/starter/reset/validator/skill에 반영했다.
- [2026-04-09] Developer: user 지시로 `BACKLOG-01` rollout 안전성 검토를 시작했고, dry-run 결과 current `sync_template_docs.ps1`로는 이번 delta를 안전하게 부분 rollout할 수 없어서 actual downstream mutation은 defer했다.
- [2026-04-09] Planner: user 요청에 따라 Daily English Spark, PMW, template hygiene incident를 기준으로 표준 템플릿 전주기 validation test case를 정의하고 `VALIDATION_TEST_CASES.md`를 추가했다.
- [2026-04-11] Planner / Developer: user PMW feedback을 `CR-07`로 승인 처리하고, project registry add/delete, compact signal rail, source-aware header, local server stop convenience를 same-turn sync와 PMW code에 반영했다.
- [2026-04-11] Planner: user 승인에 따라 `CR-08 Operating Capability Baseline`을 live/starter planning artifacts에 동기화하고, `DEV-07` / `TST-04` execution lane을 열었다.
- [2026-04-11] Developer / Tester: `DEV-07` / `TST-04`를 완료하고 change taxonomy, mandatory self-review, `SYSTEM_CONTEXT.md` / `DOMAIN_CONTEXT.md` / `DECISION_LOG.md`, workflow/skill wiring, root/starter validator, mojibake guard를 같은 턴에 닫았다.
- [2026-04-11] Planner: user 지시에 따라 `VALIDATION_TEST_CASES.md`에 `CR-08` coverage map을 추가하고 `VAL-01/02/03/05/08/09/10`에 change-governance 검증 포인트를 흡수했다.
- [2026-04-11] Planner: user 지시에 따라 first validation batch execution task(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`)를 실제 task packet으로 열고 state/plan baseline을 같은 턴에 갱신했다.
- [2026-04-11] Tester: first validation batch(`VAL-01`, `VAL-03`, `VAL-07`, `VAL-08`)를 실행했고, requirement/mockup/native gate, common-rollout boundary, UTF-8/scaffold hygiene, rollout defer discipline이 current baseline에서 통과함을 확인했다. 단, actual rollout execution은 계속 `BACKLOG-01` 범위 밖이다.
- [2026-04-11] Developer: `DEV-01`을 완료했다. `.omx/README.md`, `.omx/RUNTIME_REFERENCE.md`에 root self-hosting runtime surface / HUD / local runbook을 정리했고, `.omx` optional boundary를 baseline 문서에 연결했다.

## Usage Rules
- 상태는 `[ ]`, `[-]`, `[x]`, `[!]`만 사용합니다.
- 각 태스크는 가능한 한 안정적인 `Task ID`를 가집니다.
- 각 태스크는 가능한 한 `— Scope: [경로/모듈/문서 범위]`를 함께 적습니다. 특히 개발/테스트/리뷰 태스크는 Scope가 필수입니다.
- 요구사항 승인 후에는 개발/테스트/리뷰 태스크가 어떤 `FR-*`, `NFR-*`를 다루는지 `IMPLEMENTATION_PLAN.md > Requirement Trace`로 역추적 가능해야 합니다.
- 릴리즈 범위 또는 cross-role handoff가 걸린 `DEV-*`, `TST-*`, `REV-*`, `REL-*` 태스크는 `IMPLEMENTATION_PLAN.md > Task Packet Ledger`에서 `Objective`, `Acceptance Checks`, `Artifacts To Update`, `Escalate When`이 추적 가능해야 합니다.
- 승인 후 요구사항이나 완료 기준이 바뀌면 Planner task를 다시 열고, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 먼저 같은 기준선으로 갱신한 뒤 관련 Task Scope와 `Requirement Trace`를 재동기화합니다.
- 중간 요구사항 변경이 문서에 아직 반영되지 않았다면 리뷰/배포 태스크를 완료 처리하지 않고 blocker 또는 planner follow-up으로 남깁니다.
- 작업 시작 시 상태를 `[-]`로 바꾸고 `## Active Locks`에 점유 정보를 추가합니다.
- 작업 종료 시 상태를 갱신하고 lock을 제거합니다.
- overnight lock을 유지할 때는 `## Active Locks`의 `Note`와 최신 relevant handoff에 유지 이유와 다음 세션 첫 액션을 함께 적습니다.
- turn-by-turn 진행 메모는 `CURRENT_STATE.md`에 남기고, `## Handoff Log`는 역할 전환, 세션 종료, lock handoff 때만 추가합니다.
- `## Handoff Log`에는 최신 delta만 남기고 전체 작업일지나 상세 구현 로그를 반복 복사하지 않습니다.
- `## Handoff Log`에는 기본적으로 최근 실제 항목 5개만 유지합니다.
- 장기 의사결정과 버전 간 맥락은 `PROJECT_HISTORY.md`에 남기고, 이 문서에는 current task / lock truth만 유지합니다.
- 작업 시작 전에는 항상 `## Active Locks`와 본인 관련 Task row를 직접 읽습니다. `CURRENT_STATE.md`만 보고 건너뛰면 안 됩니다.
- archive 전에 아직 열린 사용자 질문, 기술 블로커, 다음 Agent가 꼭 알아야 할 제약은 `## Blockers`와 `CURRENT_STATE.md > Open Decisions / Blockers`로 승격합니다.
- `CURRENT_STATE.md`와 `TASK_LIST.md`의 현재 stage, active scope, next owner 정보는 서로 어긋나면 안 됩니다.
- `Current Release Target`의 `Current Stage`, `Current Focus`, `Current Release Goal`은 `CURRENT_STATE.md > Snapshot`과 같은 값으로 유지합니다.
- review / deploy 판단은 `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에서 최종 확정하고, 이 문서에는 같은 gate를 매 턴 복사하지 않습니다.
- artifact harness debt는 release blocker와 분리해 별도 maintenance task 또는 blocker note로 관리합니다.

## Current Release Target
- Version / Milestone: Hybrid Harness Completion
- Current Stage: Development and Test Loop
- Current Focus: 문서 inventory/review는 닫혔고 다음 code lane은 `DEV-02`; `TST-02`는 PMW manual retest다
- Current Release Goal: hybrid harness completion gate를 먼저 닫고, rollout은 selective sync path 준비 뒤 다시 연다
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`

## Next Version Backlog
- [ ] BACKLOG-01 operating-project rollout execution — Scope: `.agents/scripts/sync_template_docs.ps1` selective path filter / live artifact allowlist, target preset mutation, rollout evidence
- [ ] BACKLOG-02 internal VM / NAS hosting expansion — Scope: non-loopback preview, internal host runbook, exposure review
- [ ] BACKLOG-03 optional Git/PR/CI adapter integration — Scope: future integration adapters, governed observability
- [ ] BACKLOG-04 enterprise domain pack example hardening — Scope: governed preset examples, migration notes
- [ ] BACKLOG-05 Phase 2 sandbox experiment — Scope: self-hosting only container / read-only FS validation
- [ ] BACKLOG-06 write/control 성격 follow-up 검토 — Scope: 이번 승인 범위 밖 기능을 별도 change request로 분리 검토
- [ ] BACKLOG-07 maintenance / debt register baseline (`CR-09`) — Scope: debt classification, prioritization, refactor backlog link

## Active Locks

| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|
| (none) | - | - | - | - | - |

## Workflow Stage: Planning and Architecture
- [x] PLN-01 `CR-03 Hybrid Harness Completion` 요구사항 초안과 rollout defer policy 정리 — Scope: `REQUIREMENTS.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-02 mandatory deep-interview / PMW mockup-first gate를 architecture와 workflow source에 동기화 — Scope: `ARCHITECTURE_GUIDE.md`, `.agents/workflows/plan.md`, `templates_starter/.agents/workflows/plan.md`
- [x] PLN-03 rollout-ready completion task packet과 acceptance gate 정리 — Scope: `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `UI_DESIGN.md`
- [x] PLN-04 completion gate와 post-completion rollout entry criteria 고정 — Scope: `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT_PLAN.md`
- [x] PLN-05 shared `requirements_deep_interview` skill draft와 starter mirror 추가 — Scope: `.agents/skills/requirements_deep_interview/*`, `templates_starter/.agents/skills/requirements_deep_interview/*`
- [x] PLN-06 `PROJECT_HISTORY.md` artifact contract과 live/starter/reset source 추가 — Scope: `.agents/artifacts/PROJECT_HISTORY.md`, `templates_starter/.agents/artifacts/PROJECT_HISTORY.md`, `templates/version_reset/artifacts/PROJECT_HISTORY.md`
- [x] PLN-07 `CR-04` decision-packet view requirement / architecture / plan sync — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-08 `CR-05` reinforcement contract sync — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, starter mirror artifacts
- [x] PLN-09 `CR-06` web browser-based test contract sync — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `.agents/workflows/test.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, starter/reset mirror artifacts
- [x] PLN-10 표준 템플릿 전주기 validation test case 정의 — Scope: `.agents/artifacts/VALIDATION_TEST_CASES.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-11 `CR-08` operating capability baseline sync — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, starter mirror artifacts
- [x] PLN-12 validation case에 `CR-08` change-governance coverage 반영 — Scope: `.agents/artifacts/VALIDATION_TEST_CASES.md`, `CURRENT_STATE.md`, `TASK_LIST.md`

## Workflow Stage: Design Gate
- [x] DSG-01 current `Project Monitor Web` usability feedback intake — Scope: user test feedback, `REQUIREMENTS.md`, `UI_DESIGN.md`
- [x] DSG-02 UI delta mockup / wireframe 작성 — Scope: `UI_DESIGN.md`, mockup artifact, `tools/project-monitor-web/*`
- [x] DSG-03 mockup approval과 implementation freeze — Scope: `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`
- [x] DSG-04 비UI delta면 `UI_DESIGN.md not required for this delta` 기록 — Scope: `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] DSG-05 `Approval Queue -> 상세 결정 패킷` IA / wireframe 작성 — Scope: `UI_DESIGN.md`, `REQUIREMENTS.md`
- [x] DSG-06 `CR-04` decision-packet baseline approval — Scope: `REQUIREMENTS.md`, `UI_DESIGN.md`, `IMPLEMENTATION_PLAN.md`

## Workflow Stage: Development and Test Loop

### Iteration 1
- [x] DEV-01 self-hosting hybrid runtime reference / HUD / runbook 정리 — Scope: `.omx/*`, root self-hosting docs, optional runtime boundary
- [ ] DEV-02 `enterprise_governed` activation guide와 governed fixture baseline 구현 — Scope: `.agents/runtime/*`, `templates_starter/*`, `templates/version_reset/artifacts/*`
- [ ] TST-01 root/starter validator와 governed fixture regression — Scope: `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1`, fixture coverage

### Iteration 2
- [x] DEV-03 approved `Project Monitor Web` workspace + pending decision packet view + history view + launcher/stop affordance 구현 — Scope: `tools/project-monitor-web/*`
- [ ] DEV-04 rollout-ready dry-run/reporting hardening without downstream mutation — Scope: `.agents/scripts/sync_template_docs.ps1`, deployment/defer evidence
- [x] DEV-06 reinforcement contract reflection across shared skills / governance contract / PMW signals — Scope: `.agents/skills/{day_wrap_up,requirements_deep_interview,code_review_checklist}/*`, `templates_starter/.agents/skills/*`, `.agents/runtime/governance_controls.json`, `templates_starter/.agents/runtime/governance_controls.json`, `tools/project-monitor-web/*`
- [x] DEV-07 `CR-08` change taxonomy / self-review / context artifact / decision log / impact contract 구현 — Scope: live/starter workflow + artifact + template source
- [!] TST-02 local preview revalidation과 dry-run evidence 검증 — Scope: preview smoke, monitor regression, dry-run/report outputs
- [x] TST-03 reinforcement validator and regression verification — Scope: root/starter harness validator, PMW parser/projection regression, mojibake check
- [x] TST-04 `CR-08` operating capability baseline regression verification — Scope: root/starter validator, contract trace, mojibake check
- [x] DEV-05 shared standard template reflection and docs alignment — Scope: `templates_starter/*`, `templates/version_reset/artifacts/*`, `README.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`

### Validation Batch 1
- [x] VAL-01 requirement drift + mobile/native 판단 validation execution — Scope: Daily English Spark planning/design/real-device/change-governance contract
- [x] VAL-03 operating project common change uplift / rollout validation execution — Scope: common-rollout boundary, live/starter/reset/downstream separation, decision-log trigger
- [x] VAL-07 Korean artifact mojibake / scaffold contamination validation execution — Scope: UTF-8 guard, scaffold hygiene, live/template boundary, PM-001
- [x] VAL-08 rollout preflight / defer discipline validation execution — Scope: dry-run evidence, blocker carry-over, impact contract, rollback/defer decision

## Workflow Stage: Review Gate
- [ ] REV-01 hybrid harness completion release-scope review — Scope: `CR-03` 범위, runtime boundary, governed fixture, monitor visibility, rollout defer gate
- [ ] REV-02 review closure와 completion gate 재확인 — Scope: `REV-01` findings

## Workflow Stage: Deployment
- [ ] REL-01 self-hosting preview 재검증 — Scope: developer PC local preview, monitor smoke, bind/exposure 확인
- [ ] REL-02 rollout-ready dry-run/reporting 수행 — Scope: downstream mutation 없는 dry-run evidence
- [ ] REL-03 rollout decision 기록 — Scope: `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`

## Workflow Stage: Documentation and Closeout
- [ ] DOC-01 implementation/review/deploy sync 정리 — Scope: `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 artifact
- [ ] DOC-02 version_closeout / Documenter 정리 — Scope: archive, `CURRENT_STATE.md`, `HANDOFF_ARCHIVE.md`
- [x] DOC-03 starter/reset artifact hygiene cleanup and prevention — Scope: `templates_starter/.agents/artifacts/*`, `templates/version_reset/artifacts/*`, `templates_starter/templates/version_reset/artifacts/*`, `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1`, `.agents/rules/template_repo.md`
- [x] DOC-04 whole-repo markdown inventory / delete-review triage / root catalog 생성 — Scope: `MARKDOWN_DOCUMENT_CATALOG.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, `PROJECT_HISTORY.md`
- [x] DOC-05 user review capture for one-off markdown cleanup (`no deletions approved`) — Scope: `MARKDOWN_DOCUMENT_CATALOG.md`, `CURRENT_STATE.md`, `TASK_LIST.md`, `PROJECT_HISTORY.md`

## Blockers

| ID | Category | Impact | Observed Symptom | Attempted Recovery | Next Escalation |
|---|---|---|---|---|---|
| BLK-01 | Manual / User Feedback | `TST-02`, `REL-01` final closure 지연 | user PMW feedback은 받았고 `CR-07` refinement를 반영했지만, browser retest로 project registry / compact signal rail / header source trace를 다시 확인해야 한다 | local preview, browser-rendered smoke, API allow/block, decision packet/history/risk signal 검증을 마쳤고 이어서 `CR-07` refinement를 적용했다. PMW server는 `http://127.0.0.1:4173`에서 다시 확인 가능하다 | user가 PMW retest feedback을 주면 Tester가 `TST-02` closure 여부를 재판정하고, 문제 발견 시 Developer로 올린다 |

## Handoff Log
- [2026-04-12 00:39] Day Wrap Up completed. whole-repo markdown inventory와 user review를 문서에 반영했고, delete-review 후보 9개는 모두 유지하기로 결정했다. 실제 삭제는 없었다. 다음 세션 첫 agent는 Developer이며 `DEV-02`를 기본 next lane으로 이어간다. 별도 manual lane으로 user PMW retest가 들어오면 Tester가 `TST-02`를 다시 판정한다. Notes: active lock은 없다.
- [2026-04-09 00:11] Day Wrap Up completed. `BACKLOG-01` rollout dry-run으로 current `sync_template_docs.ps1`가 unrelated starter dirty file을 함께 전파할 수 있고 preserve mode에서는 live `PREVENTIVE_MEMORY.md`를 만들지 못한다는 점을 확인했다. actual downstream mutation은 하지 않았고 rollout은 defer 상태로 되돌렸다. 다음 세션 첫 agent는 User 또는 Tester이며, 먼저 `http://127.0.0.1:4173`에서 PMW를 보고 feedback을 남긴 뒤 `TST-02` closure 또는 follow-up dev delta를 결정한다. 그 다음 Developer가 selective rollout path가 준비됐는지 확인하고 `BACKLOG-01`을 다시 연다. Notes: active lock은 없다. `PM-001` preventive rule은 계속 active다.
- [2026-04-08 13:39] Day Wrap Up completed. user 요청에 따라 `TST-02`는 닫지 않고 `PMW browser feedback pending` 상태로 다시 열었다. local PMW preview는 계속 `http://127.0.0.1:4173`에서 확인 가능하다. 다음 세션 첫 agent는 User 또는 Tester이며, 먼저 PMW를 브라우저에서 검토하고 feedback을 남긴 뒤 `TST-02` closure 또는 follow-up dev delta를 결정한다.
- [2026-04-08 13:30] `PLN-09` completed. user 지시에 따라 `CR-06 Web Browser-Based Test Contract`를 live/starter/reset baseline에 반영했고, 웹앱 / browser-facing UI scope는 API-only evidence로 manual/environment gate를 닫지 않도록 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `test/deploy` artifact/template source를 동기화했다. 다음 agent는 Developer이며 `DEV-01 -> DEV-02 -> TST-01` 순으로 completion path를 이어가고, user는 local PMW를 브라우저에서 보며 후속 UI 코멘트를 줄 수 있다.
- [2026-04-08 10:57] `PLN-08`, `DEV-06`, `TST-03` completed. `CR-05` reinforcement contract를 live/starter/runtime/PMW에 반영했고 root/starter validator, `node --test`, `node --check "src/presentation/app.js"`, Korean mojibake check를 통과했다. 다음 agent는 Tester이며 `DEPLOYMENT_PLAN.md` Quick Read + Preflight Checklist를 다시 읽고 `cd "C:\Newface\30 Github\repo_harness_template\tools\project-monitor-web"; npm start` 후 `http://127.0.0.1:4173`에서 `/api/projects`, decision packet, history, risk signal, launcher/stop affordance까지 포함한 `TST-02` local preview smoke를 수행한다. 그 다음 순서는 `DEV-01 -> DEV-02 -> TST-01 -> REV-01/REV-02 -> REL-01/REL-02`다.
