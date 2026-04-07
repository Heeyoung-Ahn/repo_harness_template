# Task List

> 프로젝트의 공식 진행 상태 문서입니다.  
> 이 문서는 task / lock truth이며, `CURRENT_STATE.md`는 resume router, `## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관용입니다.

## Changelog
- [2026-04-07] Documenter / Planner: `DOC-05`로 `Scalable Governance Profiles v0.3` closeout을 시작했다. downstream rollout은 완성본 이후로 defer하고, archive/reset 후 `Hybrid Harness Completion` draft를 여는 방향으로 정리했다.
- [2026-04-07] Reviewer / DevOps: `REV-05`, `REL-07`을 완료했고 developer PC local-only preview를 `http://127.0.0.1:4173`에 올린 뒤 root/snapshot/file smoke와 blocked path 400을 확인했다. `CR-02` follow-up review를 `v0.3` 기준으로 닫고 preview evidence를 배포 문서에 반영했다.
- [2026-04-07] Planner / Developer / Tester: `PLN-09`, `DEV-16`, `TST-05`를 완료했고 `CR-02 Enterprise Hybrid Harness`를 root planning artifact, starter/reset source, runtime contract, workflow, validator에 반영했다.
- [2026-04-07] Planner: `CR-02 Enterprise Hybrid Harness` 구현을 시작했고 planning artifact, starter/reset source, validator, workflow 정렬 작업을 진행 중이다.
- [2026-04-06] DevOps: `REL-06`을 완료했고 `Project Monitor Web`의 `package-lock.json`, npm dependency/compliance audit evidence, loopback default bind hardening, deployment-prep artifact sync를 반영했다.
- [2026-04-06] DevOps: `REL-05`를 완료했고 `active_operating_projects` 3개 repo에 deploy workflow/skill hardening 변경을 rollout한 뒤 target validator를 확인했다.
- [2026-04-06] DevOps: `REL-05`를 시작했고 `active_operating_projects` preset 대상으로 deploy workflow/skill hardening 변경을 rollout 중이다.
- [2026-04-06] DevOps: `REL-04`를 완료했고 starter deploy workflow, shared deploy skills, `DEPLOYMENT_PLAN` template에 GitHub 선행 배포 게이트와 provider별 skill/fallback 규칙을 반영했다.
- [2026-04-06] Reviewer: `REV-04`를 완료했고 `DEV-15`가 `REV-03-01`, `REV-03-02`를 닫았음을 확인했다. review gate는 reviewed scope 기준 승인으로 전환됐다.
- [2026-04-06] Developer: `DEV-15`를 완료했고 parser required section sync, reset source mirror sync, 회귀 테스트 추가를 반영한 뒤 Reviewer에게 delta 확인을 넘겼다.
- [2026-04-06] Developer: `DEV-15`를 시작했고 `REV-03-01`, `REV-03-02`를 함께 닫기 위해 parser contract 정합성과 reset source mirror sync를 재작업 중이다.
- [2026-04-06] Reviewer: `REV-03`를 완료했고 parser contract drift 1건, reset source drift 1건을 기록했다. review gate는 재작업 전까지 닫지 않는다.
- [2026-04-06] Developer: `DEV-13`, `DEV-14`를 완료했고 reserved future hook contract, optional `health_snapshot.json`, self-hosting/downstream promotion boundary, starter generic boundary template를 반영했다.
- [2026-04-06] Developer: `DEV-11`, `DEV-12`, `TST-03`, `TST-04`를 완료했고 `.agents/runtime/team.json`, starter team defaults, mandatory source parser, `Project Monitor Web` Phase 1 MVP, read-only HTTP 경계, 회귀 테스트를 구현했다.
- [2026-04-06] Planner: `Scalable Governance Profiles v0.2` 승인본을 반영해 `Project Monitor Web`, `.agents/runtime/team.json`, parser contract, UI 설계를 planning artifact에 동기화했다.
- [2026-04-06] Planner: `Scalable Governance Profiles v0.1` 초안을 작성하고 `solo/team/large` 프로필, read-only governance dashboard MVP, event history 후속 단계를 planning artifact에 반영했다.
- [2026-04-06] Developer: 공통 테스트 프로세스에 `Expected User Outcome`, `Feedback Capture Plan`, 비압축 `Developer Feedback Handoff` 기준을 추가하고 active operating projects에 rollout했다.
- [2026-04-06] Developer: self-hosting `AGENTS.md`와 `workspace.md`에 표준 템플릿 운영 지침과 workflow 비의존 원칙을 명문화했다.
- [2026-04-06] Developer: `expo_real_device_test` 최신본을 3개 운영 프로젝트에 재롤아웃했고, root 전용 `operating-common-rollout` 운영 스킬을 추가했다.
- [2026-04-06] Developer: `expo_real_device_test` 스킬에 일반형 `adb_quickstart` reference 문서를 추가하고 root/starter `SKILL.md`에서 참조 연결했다.
- [2026-04-06] Developer: Daily English Spark에서 확장한 `expo_real_device_test`를 표준 source에 반영하고 WATV Auto Login, AI Video Creator에 rollout했다.
- [2026-04-05] Developer: self-hosting live docs와 deployable template source 분리 작업을 완료했다.
- [2026-04-05] Developer: safe downstream rollout과 `templates/version_reset` 반영까지 3개 운영 프로젝트에 완료했다.
- [2026-04-05] Developer: root README를 새 구조 기준으로 갱신했고, root PROJECT_WORKFLOW_MANUAL은 삭제해 starter manual만 starter source 안에 남겼다.
- [2026-04-06] Developer: starter root를 `templates_starter`로 재편했고, empty `docs/`와 `tools/`를 삭제한 뒤 3개 운영 프로젝트에 rollout했다.

## Usage Rules
- 상태는 `[ ]`, `[-]`, `[x]`, `[!]`만 사용합니다.
- 각 태스크는 가능한 한 안정적인 `Task ID`를 가집니다.
- 각 태스크는 가능한 한 `— Scope: [경로/모듈/문서 범위]`를 함께 적습니다. 특히 개발/테스트/리뷰 태스크는 Scope가 필수입니다.
- 요구사항 승인 후에는 개발/테스트/리뷰 태스크가 어떤 `FR-*`, `NFR-*`를 다루는지 `IMPLEMENTATION_PLAN.md > Requirement Trace`로 역추적 가능해야 합니다.
- 승인 후 요구사항이나 완료 기준이 바뀌면 Planner task를 다시 열고, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 먼저 같은 기준선으로 갱신한 뒤 관련 Task Scope와 `Requirement Trace`를 재동기화합니다.
- 중간 요구사항 변경이 문서에 아직 반영되지 않았다면 리뷰/배포 태스크를 완료 처리하지 않고 blocker 또는 planner follow-up으로 남깁니다.
- 작업 시작 시 상태를 `[-]`로 바꾸고 `## Active Locks`에 점유 정보를 추가합니다.
- 작업 종료 시 상태를 갱신하고 lock을 제거합니다.
- overnight lock을 유지할 때는 `## Active Locks`의 `Note`와 최신 relevant handoff에 유지 이유와 다음 세션 첫 액션을 함께 적습니다.
- turn-by-turn 진행 메모는 `CURRENT_STATE.md`에 남기고, `## Handoff Log`는 역할 전환, 세션 종료, lock handoff 때만 추가합니다.
- `## Handoff Log`에는 최신 delta만 남기고 전체 작업일지나 상세 구현 로그를 반복 복사하지 않습니다.
- `## Handoff Log`에는 기본적으로 최근 실제 항목 5개만 유지합니다.
- 작업 시작 전에는 항상 `## Active Locks`와 본인 관련 Task row를 직접 읽습니다. `CURRENT_STATE.md`만 보고 건너뛰면 안 됩니다.
- 다만 활성 manual test / review / blocker triage 루프와 직접 연결된 relevant entry는 loop가 닫힐 때까지 임시 유지할 수 있습니다.
- `## Handoff Log`가 기본 유지 범위를 넘기거나 파일이 220줄을 넘으면 오래된 항목을 `HANDOFF_ARCHIVE.md`로 이동하고, 요약을 `CURRENT_STATE.md > Recent History Summary`에 반영합니다.
- archive 전에 아직 열린 사용자 질문, 기술 블로커, 다음 Agent가 꼭 알아야 할 제약은 `## Blockers`와 `CURRENT_STATE.md > Open Decisions / Blockers`로 승격합니다.
- `CURRENT_STATE.md`와 `TASK_LIST.md`의 현재 stage, active scope, next owner 정보는 서로 어긋나면 안 됩니다.
- `Current Release Target`의 `Current Stage`, `Current Focus`, `Current Release Goal`은 `CURRENT_STATE.md > Snapshot`과 같은 값으로 유지합니다.
- `## Active Locks`는 협업용 문서 lock이며 원자적 잠금이 아닙니다. 여러 AI를 동시에 쓸 때는 서로 다른 Task ID와 Scope를 먼저 배정하는 것을 기본 전제로 합니다.
- review / deploy 판단은 `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에서 최종 확정하고, 이 문서에는 같은 gate를 매 턴 복사하지 않습니다.
- artifact harness debt는 release blocker와 분리해 별도 maintenance task 또는 blocker note로 관리합니다.

## Current Release Target
- Version / Milestone: Scalable Governance Profiles
- Current Stage: Documentation and Closeout
- Current Focus: developer PC local-only preview bring-up과 `CR-02` follow-up review를 완료했다. downstream rollout은 defer했고 현재 버전은 archive/reset 기반 closeout으로 마감한다
- Current Release Goal: 장기 비용이 큰 운영 계약을 먼저 고정한 뒤 self-hosting 웹앱으로 프로젝트 모니터링을 구현한다
- Current Green Level: Workspace
- Branch Freshness: Current on `Scalable Governance Profiles v0.3`

## Next Version Backlog
- [ ] BACKLOG-01 downstream rollout dry-run/reporting 강화 — Scope: `.agents/scripts/sync_template_docs.ps1`, preset-aware rollout evidence
- [ ] BACKLOG-02 Git/PR/CI adapter optional integration 설계 — Scope: future integration adapters, governed profile observability
- [ ] BACKLOG-03 OMX compatibility contract 정리 — Scope: `.omx` sidecar rule, workflow compatibility guide, self-hosting/runtime boundary
- [ ] BACKLOG-04 enterprise-governed pack rollout 계획 — Scope: downstream rollout sequencing, preset verification, governed migration notes
- [ ] BACKLOG-05 critical-domain verification profile 고도화 — Scope: mutation/property/edge-case gate, protected path/HITL regression fixtures

## Active Locks

| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|

## Workflow Stage: Planning and Architecture
- [x] PLN-01 self-hosting repo와 deployable template source 분리 요구사항 정리 — Scope: `AGENTS.md`, `.agents/rules/*`, starter source, `templates/version_reset/artifacts/*`
- [x] PLN-02 live/root vs deployable/template 경계 확정 — Scope: `.agents/rules/workspace.md`, `.agents/rules/template_repo.md`
- [x] PLN-03 source tree / sync path 구조 정리 — Scope: starter source, `templates/version_reset/artifacts/*`, `.agents/scripts/*`
- [x] PLN-04 작업 목록과 운영 경로 정리 — Scope: `TASK_LIST.md`, `CURRENT_STATE.md`
- [x] PLN-05 `solo/team/large` 운영 프로필 요구사항 초안 작성 — Scope: `REQUIREMENTS.md`, research synthesis, governance core schema
- [x] PLN-06 core/profile/observability/integration 경계 초안 작성 — Scope: `ARCHITECTURE_GUIDE.md`, `.agents/rules/template_repo.md`
- [x] PLN-07 dashboard MVP와 event history 후속 단계를 포함한 구현 로드맵 작성 — Scope: `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-08 `v0.2` 승인본에 맞춰 product boundary, `team.json`, parser contract, UI design baseline 고정 — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-09 `CR-02 Enterprise Hybrid Harness` 계획/정본 동기화 — Scope: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `TASK_LIST.md`

## Workflow Stage: Design Gate
- [x] DSG-01 이 작업이 비UI governance scope임을 확정 — Scope: `UI_DESIGN.md` 필요성 판정
- [x] DSG-04 `UI_DESIGN.md not required for this scope` 유지 — Scope: `CURRENT_STATE.md`
- [x] DSG-05 `Project Monitor Web` single-screen dashboard와 detail drawer UI 범위 확정 — Scope: `UI_DESIGN.md`, board / blocker queue / recent activity / health / team directory

## Workflow Stage: Development and Test Loop

### Iteration 1
- [x] DEV-01 deployable template source tree 분리 — Scope: starter source, `templates/version_reset/artifacts/*`
- [x] DEV-02 root live 문서 self-hosting 전환 — Scope: `AGENTS.md`, `.agents/rules/*`, `.agents/workflows/*`, `.agents/artifacts/*`
- [x] TST-01 validator / mojibake / source split 검증 — Scope: `.agents/scripts/check_harness_docs.ps1`, `.agents/scripts/sync_template_docs.ps1`, starter source, `templates/version_reset/artifacts/*`

### Iteration 2
- [x] DEV-03 downstream rollout automation 확장 — Scope: `.agents/scripts/sync_template_docs.ps1`, rollout evidence
- [x] DEV-04 rollout target preset 분리 — Scope: `.agents/scripts/sync_template_docs.ps1`, `.agents/runtime/downstream_target_presets.psd1`, live rollout docs
- [x] DEV-05 template skill/source split 추가 확장 여부 검토 — Scope: `templates_starter/.agents/skills/*`, `.agents/skills/*`
- [x] DEV-06 starter root를 `templates_starter`로 재편 — Scope: `.agents/scripts/*`, `.agents/rules/*`, `.agents/workflows/*`, `templates_starter/*`, `templates/version_reset/*`
- [x] DEV-07 `expo_real_device_test` reference 문서 추가 — Scope: `.agents/skills/expo_real_device_test/*`, `templates_starter/.agents/skills/expo_real_device_test/*`
- [x] DEV-08 shared skill rollout 재정비 및 self-hosting 운영 스킬 추가 — Scope: `.agents/skills/*`, `templates_starter/.agents/skills/expo_real_device_test/*`, active operating projects
- [x] DEV-09 self-hosting 표준 템플릿 운영 지침 정리 — Scope: `AGENTS.md`, `.agents/rules/workspace.md`
- [x] DEV-10 공통 수동 테스트에서 상세 사용자 피드백 수집과 Developer handoff 표준화 — Scope: `.agents/workflows/test.md`, `.agents/skills/expo_real_device_test/*`, `WALKTHROUGH.md` templates, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`, active operating projects rollout
- [x] TST-02 sample downstream repo dry-run 및 예외 처리 검증 — Scope: template rollout workflow

### Iteration 3
- [x] DEV-11 profile schema, `.agents/runtime/team.json`, parser contract, template defaults 정규화 — Scope: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/runtime/team.json`, future profile overlay structure
- [x] DEV-12 `tools/project-monitor-web` Phase 1 MVP 구현 — Scope: self-hosting web app, local Node backend, shared parser/projection, dashboard panels
- [x] DEV-13 future hook point와 health snapshot contract 예약 — Scope: future integration adapters, reserved hook schema, non-realtime extension path
- [x] DEV-14 self-hosting only 도구와 downstream optional promotion 전략 정리 — Scope: `templates_starter/*`, `templates/version_reset/*`, monitor promotion boundary
- [x] DEV-15 `REV-03` finding 재작업: parser contract와 reset source mirror sync 수정 — Scope: `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `tools/project-monitor-web/src/application/parse-architecture-guide.js`, `tools/project-monitor-web/test/dashboard-snapshot.test.js`, `templates/version_reset/artifacts/IMPLEMENTATION_PLAN.md`, `templates_starter/templates/version_reset/artifacts/IMPLEMENTATION_PLAN.md`
- [x] TST-03 profile / team registry / parser contract regression 검증 — Scope: validators, fixtures, mandatory source parsing, profile-mode correctness
- [x] TST-04 `Project Monitor Web` Phase 1 read-only regression 검증 — Scope: dashboard panels, manual refresh, blocker queue, health panel, source artifact link-out

### Iteration 4
- [x] DEV-16 enterprise-governed pack, `.agents/runtime/governance_controls.json`, OMX compatibility, starter/reset source 확장 — Scope: `templates_starter/*`, `templates/version_reset/artifacts/*`, `templates_starter/templates/version_reset/artifacts/*`, `.agents/runtime/*`, `.agents/rules/*`, `.agents/workflows/*`, `.agents/scripts/check_harness_docs.ps1`
- [x] TST-05 enterprise pack / profile-aware validator regression — Scope: `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1`, runtime/profile fixtures, reset mirror sync

## Workflow Stage: Review Gate
- [ ] REV-01 self-hosting / deployable source 경계 리뷰 — Scope: root live docs, `templates_starter/*`, `templates/version_reset/artifacts/*`, sync/validator script
- [ ] REV-02 리뷰 반영 확인 — Scope: `REV-01` findings
- [x] REV-03 scalable governance profile와 `Project Monitor Web` source-of-truth 경계 리뷰 — Scope: profile schema, team registry, parser contract, monitor MVP, promotion strategy
- [x] REV-04 `DEV-15` delta review 및 finding closure 확인 — Scope: parser contract required section sync, reset source mirror sync, regression evidence
- [x] REV-05 `CR-02 Enterprise Hybrid Harness` follow-up review와 release gate 재정렬 — Scope: `.agents/runtime/{team.json,governance_controls.json}`, `.agents/workflows/*`, `.agents/scripts/check_harness_docs.ps1`, `.agents/artifacts/{CURRENT_STATE.md,REVIEW_REPORT.md,TASK_LIST.md}`

## Workflow Stage: Deployment
- [x] REL-01 downstream rollout 대상/범위 점검 — Scope: target repos, `templates_starter/*`, `templates/version_reset/artifacts/*`, sync path
- [x] REL-02 template source downstream rollout — Scope: `.agents/scripts/sync_template_docs.ps1`
- [x] REL-03 rollout 결과 기록 — Scope: `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`
- [x] REL-04 starter deploy workflow와 공용 배포 스킬 hardening — Scope: `templates_starter/.agents/workflows/deploy.md`, `templates_starter/.agents/skills/{github_deploy,expo_production_publish,expo_test_publish,general_publish}/*`, mirrored root shared skills, `templates_starter/.agents/artifacts/DEPLOYMENT_PLAN.md`, `templates/version_reset/artifacts/DEPLOYMENT_PLAN.md`, `templates_starter/templates/version_reset/artifacts/DEPLOYMENT_PLAN.md`
- [x] REL-05 active operating projects rollout — Scope: `active_operating_projects` preset, downstream `.agents/workflows/deploy.md`, `.agents/skills/{github_deploy,expo_production_publish,expo_test_publish,general_publish}/*`, `templates/version_reset/artifacts/DEPLOYMENT_PLAN.md`
- [x] REL-06 dependency/compliance gate와 local server surface review — Scope: `tools/project-monitor-web/package.json`, `tools/project-monitor-web/package-lock.json`, `tools/project-monitor-web/server.js`, `.agents/artifacts/{DEPLOYMENT_PLAN.md,IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md}`
- [x] REL-07 `Project Monitor Web` first preview bring-up과 evidence 기록 — Scope: `tools/project-monitor-web/*`, `.agents/artifacts/{DEPLOYMENT_PLAN.md,CURRENT_STATE.md,TASK_LIST.md}`

## Workflow Stage: Documentation and Closeout
- [x] DOC-01 self-hosting 현재 상태와 template source 경계 정리 — Scope: `CURRENT_STATE.md`, `TASK_LIST.md`, `.agents/rules/template_repo.md`
- [x] DOC-02 version_closeout / Documenter 정리 — Scope: archive, `CURRENT_STATE.md`, `HANDOFF_ARCHIVE.md`
- [x] DOC-03 root README / manual 정리 — Scope: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`
- [x] DOC-04 root manual 삭제 및 참조 정리 — Scope: `AGENTS.md`, `.agents/rules/workspace.md`, `README.md`, `PROJECT_WORKFLOW_MANUAL.md`
- [x] DOC-05 `Scalable Governance Profiles v0.3` version closeout과 next-version kickoff — Scope: `.agents/artifacts/*`, `.agents/scripts/reset_version_artifacts.ps1`, `.agents/artifacts/archive/releases/*`

## Blockers
- none. current self-hosting preview gate는 닫혔고, downstream rollout 여부는 별도 사용자 결정이다.

## Handoff Log
- [2026-04-07] `DOC-05` closeout kickoff. downstream rollout은 완성본 이후로 defer하기로 결정했고, 현재 버전은 `.agents/artifacts/archive/releases/v0.3/` archive와 reset source 기반 next-version kickoff로 마감한다. 다음 agent는 Planner이며 `Hybrid Harness Completion` draft를 연다.
- [2026-04-07] `REV-05`, `REL-07` completed. developer PC local-only preview를 `http://127.0.0.1:4173`에 올렸고 `node` PID `71776`에서 root/snapshot/file smoke `200`, blocked path `400`을 확인했다. `CR-02` follow-up review를 `v0.3` 기준으로 닫았고 현재 preview gate는 닫혔다. 다음 agent는 Planner 또는 DevOps이며 downstream rollout 여부를 결정한다.
- [2026-04-07] `PLN-09`, `DEV-16`, `TST-05` completed. `Scalable Governance Profiles v0.3` baseline으로 enterprise-governed pack, `governance_controls.json`, optional `.omx` sidecar contract, workflow OMX mapping, root/starter validator profile checks를 반영했고 validator pass를 확인했다. 다음 agent는 DevOps이며 first preview deployment target을 정하고 `DEPLOYMENT_PLAN.md`에 bring-up evidence를 남긴다.
- [2026-04-06] REL-06 completed. `Project Monitor Web`에 `package-lock.json`을 추가해 dependency audit 근거를 고정했고, `npm ls --depth=0` empty, `npm audit --json` 0 vulnerabilities, `node --test` 6 pass를 확인했다. `server.js`는 기본 bind host를 `127.0.0.1`로 제한하도록 하드닝했다. 다음 agent는 DevOps이며 첫 preview deployment target 선택과 bring-up evidence를 이어간다.
- [2026-04-06] REL-05 completed. `active_operating_projects` preset으로 WATV Auto Login, AI Video Creator, Daily English Spark에 deploy workflow/skill hardening과 reset `DEPLOYMENT_PLAN` template를 rollout했다. target validator는 Daily English Spark pass, WATV/AI Video Creator는 기존 live artifact migration debt 19 warning만 남았고 errors는 없었다. 핵심 rollout 파일 hash는 3개 repo 모두 template와 일치한다.
- [2026-04-06] REL-04 completed. starter deploy workflow에 GitHub release gate 선행 규칙과 Expo/provider skill routing을 추가했고, shared deploy skill mirror 4종과 `DEPLOYMENT_PLAN` template 3곳에 GitHub release path, provider/skill, fallback 필드를 반영했다. `check_harness_docs.ps1` pass, mojibake scanner pass. 다음 agent는 DevOps이며 dependency/compliance gate와 deployment preflight를 이어간다.
