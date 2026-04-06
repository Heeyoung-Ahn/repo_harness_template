# Task List

> 프로젝트의 공식 진행 상태 문서입니다.  
> 이 문서는 task / lock truth이며, `CURRENT_STATE.md`는 resume router, `## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관용입니다.

## Changelog
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
- Version / Milestone: Template Repo Separation
- Current Stage: Documentation and Closeout
- Current Focus: `templates_starter/*` assembled starter와 root `templates/version_reset/*` canonical reset source 분리를 유지하고 downstream rollout 기준으로 관리한다
- Current Release Goal: self-hosting 운영 문서와 starter/reset template를 혼동 없이 유지하고 기존 운영 프로젝트에도 안전하게 rollout한다

## Next Version Backlog
- [ ] BACKLOG-01 downstream rollout dry-run/reporting 강화 — Scope: `.agents/scripts/sync_template_docs.ps1`, preset-aware rollout evidence

## Active Locks

| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|

## Workflow Stage: Planning and Architecture
- [x] PLN-01 self-hosting repo와 deployable template source 분리 요구사항 정리 — Scope: `AGENTS.md`, `.agents/rules/*`, starter source, `templates/version_reset/artifacts/*`
- [x] PLN-02 live/root vs deployable/template 경계 확정 — Scope: `.agents/rules/workspace.md`, `.agents/rules/template_repo.md`
- [x] PLN-03 source tree / sync path 구조 정리 — Scope: starter source, `templates/version_reset/artifacts/*`, `.agents/scripts/*`
- [x] PLN-04 작업 목록과 운영 경로 정리 — Scope: `TASK_LIST.md`, `CURRENT_STATE.md`

## Workflow Stage: Design Gate
- [x] DSG-01 이 작업이 비UI governance scope임을 확정 — Scope: `UI_DESIGN.md` 필요성 판정
- [x] DSG-04 `UI_DESIGN.md not required for this scope` 유지 — Scope: `CURRENT_STATE.md`

## Workflow Stage: Development and Test Loop

### Iteration 1
- [x] DEV-01 deployable template source tree 분리 — Scope: starter source, `templates/version_reset/artifacts/*`
- [x] DEV-02 root live 문서 self-hosting 전환 — Scope: `AGENTS.md`, `.agents/rules/*`, `.agents/workflows/*`, `.agents/artifacts/*`
- [x] TST-01 validator / mojibake / source split 검증 — Scope: `.agents/scripts/check_harness_docs.ps1`, `.agents/scripts/sync_template_docs.ps1`, starter source, `templates/version_reset/artifacts/*`

### Iteration 2
- [x] DEV-03 downstream rollout automation 확장 — Scope: `.agents/scripts/sync_template_docs.ps1`, rollout evidence
- [x] DEV-04 rollout target preset 분리 — Scope: `.agents/scripts/sync_template_docs.ps1`, `.agents/runtime/downstream_target_presets.psd1`, live rollout docs
- [ ] DEV-05 template skill/source split 추가 확장 여부 검토 — Scope: `templates_starter/.agents/skills/*`, `.agents/skills/*`
- [x] DEV-06 starter root를 `templates_starter`로 재편 — Scope: `.agents/scripts/*`, `.agents/rules/*`, `.agents/workflows/*`, `templates_starter/*`, `templates/version_reset/*`
- [x] TST-02 sample downstream repo dry-run 및 예외 처리 검증 — Scope: template rollout workflow

## Workflow Stage: Review Gate
- [ ] REV-01 self-hosting / deployable source 경계 리뷰 — Scope: root live docs, `templates_starter/*`, `templates/version_reset/artifacts/*`, sync/validator script
- [ ] REV-02 리뷰 반영 확인 — Scope: `REV-01` findings

## Workflow Stage: Deployment
- [x] REL-01 downstream rollout 대상/범위 점검 — Scope: target repos, `templates_starter/*`, `templates/version_reset/artifacts/*`, sync path
- [x] REL-02 template source downstream rollout — Scope: `.agents/scripts/sync_template_docs.ps1`
- [x] REL-03 rollout 결과 기록 — Scope: `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`

## Workflow Stage: Documentation and Closeout
- [x] DOC-01 self-hosting 현재 상태와 template source 경계 정리 — Scope: `CURRENT_STATE.md`, `TASK_LIST.md`, `.agents/rules/template_repo.md`
- [x] DOC-02 version_closeout / Documenter 정리 — Scope: archive, `CURRENT_STATE.md`, `HANDOFF_ARCHIVE.md`
- [x] DOC-03 root README / manual 정리 — Scope: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`
- [x] DOC-04 root manual 삭제 및 참조 정리 — Scope: `AGENTS.md`, `.agents/rules/workspace.md`, `README.md`, `PROJECT_WORKFLOW_MANUAL.md`

## Blockers
- none

## Handoff Log
- [2026-04-06] DEV-06 completed. self-hosting repo의 starter root를 `templates_starter`로 재편하고 root `templates/version_reset/*`를 canonical reset source로 유지했으며, empty `docs/`와 `tools/`를 삭제한 뒤 3개 운영 프로젝트에 rollout했다.
- [2026-04-05] DEV-02/TST-01 completed. root live 문서와 deployable template source가 분리되었고, downstream rollout은 `.agents/scripts/sync_template_docs.ps1` 기준으로 수행한다.
- [2026-04-05] REL-01~REL-03/TST-02 completed. `sync_template_docs.ps1`는 기존 운영 프로젝트의 live `.agents/artifacts/*`를 보존하도록 보강되었고, 3개 운영 프로젝트에 `templates/version_reset` 포함 구조를 반영했다.
- [2026-04-05] DEV-04 completed. rollout target group은 script hard-code 대신 `.agents/runtime/downstream_target_presets.psd1` preset으로 관리하도록 전환했다.
- [2026-04-05] DOC-03 completed. root README는 self-hosting/starter/reset 구조를 설명하도록 갱신했다.
- [2026-04-05] DOC-04 completed. root `PROJECT_WORKFLOW_MANUAL.md`는 삭제했고, 관련 안내는 starter manual 기준으로 정리했다.
