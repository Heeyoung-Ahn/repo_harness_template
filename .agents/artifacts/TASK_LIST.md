# Task List

> 프로젝트의 공식 진행 상태 문서입니다.  
> 이 문서는 task / lock truth이며, `CURRENT_STATE.md`는 resume router, `## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관용입니다.

## Changelog
- [2026-04-07] Documenter / Planner: `Scalable Governance Profiles v0.3` snapshot을 `.agents/artifacts/archive/releases/v0.3/`에 보관했고 reset source로 version artifact를 초기화한 뒤 `Hybrid Harness Completion v0.1` draft를 시작했다.
- [2026-04-07] Planner: `CR-03` 요구사항 초안을 `준운영 수준` completion bar로 강화하고 architecture / implementation baseline을 같은 턴에 동기화했다.
- [2026-04-07] Planner: `CR-03` draft를 PMW usability feedback 대기 상태로 다시 열고, mandatory deep-interview skill과 `PROJECT_HISTORY.md` artifact를 planning baseline에 반영했다.

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
- Current Stage: Planning and Architecture
- Current Focus: revised `CR-03 Hybrid Harness Completion` draft에 mandatory deep-interview와 PMW feedback/mockup gate를 반영하고, user가 current `Project Monitor Web`를 테스트한 뒤 usability feedback을 주도록 준비한다
- Current Release Goal: self-hosting 템플릿 안에서 hybrid harness를 완성하고, rollout은 completion gate가 닫힌 뒤에만 연다
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`

## Next Version Backlog
- [ ] BACKLOG-01 operating-project rollout execution — Scope: `.agents/scripts/sync_template_docs.ps1`, target preset mutation, rollout evidence
- [ ] BACKLOG-02 internal VM / NAS hosting expansion — Scope: non-loopback preview, internal host runbook, exposure review
- [ ] BACKLOG-03 optional Git/PR/CI adapter integration — Scope: future integration adapters, governed observability
- [ ] BACKLOG-04 enterprise domain pack example hardening — Scope: governed preset examples, migration notes
- [ ] BACKLOG-05 Phase 2 sandbox experiment — Scope: self-hosting only container / read-only FS validation

## Active Locks

| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|

## Workflow Stage: Planning and Architecture
- [x] PLN-01 `CR-03 Hybrid Harness Completion` 요구사항 초안과 rollout defer policy 정리 — Scope: `REQUIREMENTS.md`, `CURRENT_STATE.md`, `TASK_LIST.md`
- [x] PLN-02 mandatory deep-interview / PMW mockup-first gate를 architecture와 workflow source에 동기화 — Scope: `ARCHITECTURE_GUIDE.md`, `.agents/workflows/plan.md`, `templates_starter/.agents/workflows/plan.md`
- [ ] PLN-03 rollout-ready completion task packet과 acceptance gate 정리 — Scope: `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `UI_DESIGN.md`
- [ ] PLN-04 completion gate와 post-completion rollout entry criteria 고정 — Scope: `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT_PLAN.md`
- [x] PLN-05 shared `requirements_deep_interview` skill draft와 starter mirror 추가 — Scope: `.agents/skills/requirements_deep_interview/*`, `templates_starter/.agents/skills/requirements_deep_interview/*`
- [x] PLN-06 `PROJECT_HISTORY.md` artifact contract과 live/starter/reset source 추가 — Scope: `.agents/artifacts/PROJECT_HISTORY.md`, `templates_starter/.agents/artifacts/PROJECT_HISTORY.md`, `templates/version_reset/artifacts/PROJECT_HISTORY.md`

## Workflow Stage: Design Gate
- [ ] DSG-01 current `Project Monitor Web` usability feedback intake — Scope: user test feedback, `REQUIREMENTS.md`, `UI_DESIGN.md`
- [ ] DSG-02 UI delta mockup / wireframe 작성 — Scope: `UI_DESIGN.md`, mockup artifact, `tools/project-monitor-web/*`
- [ ] DSG-03 mockup approval과 implementation freeze — Scope: `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`
- [ ] DSG-04 비UI delta면 `UI_DESIGN.md not required for this delta` 기록 — Scope: `CURRENT_STATE.md`

## Workflow Stage: Development and Test Loop

### Iteration 1
- [ ] DEV-01 self-hosting hybrid runtime reference / HUD / runbook 정리 — Scope: `.omx/*`, root self-hosting docs, optional runtime boundary
- [ ] DEV-02 `enterprise_governed` activation guide와 governed fixture baseline 구현 — Scope: `.agents/runtime/*`, `templates_starter/*`, `templates/version_reset/artifacts/*`
- [ ] TST-01 root/starter validator와 governed fixture regression — Scope: `.agents/scripts/check_harness_docs.ps1`, `templates_starter/.agents/scripts/check_harness_docs.ps1`, fixture coverage

### Iteration 2
- [ ] DEV-03 `Project Monitor Web` hybrid visibility와 rollout readiness summary 구현 — Scope: `tools/project-monitor-web/*`
- [ ] DEV-04 rollout-ready dry-run/reporting hardening without downstream mutation — Scope: `.agents/scripts/sync_template_docs.ps1`, deployment/defer evidence
- [ ] TST-02 local preview revalidation과 dry-run evidence 검증 — Scope: preview smoke, monitor regression, dry-run/report outputs
- [x] DEV-05 shared standard template reflection and docs alignment — Scope: `templates_starter/*`, `templates/version_reset/artifacts/*`, `README.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`

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

## Blockers

| ID | Category | Impact | Observed Symptom | Attempted Recovery | Next Escalation |
|---|---|---|---|---|---|
| BLK-01 | Requirement | Iteration | revised `CR-03` draft는 PMW usability feedback과 mockup-first gate를 반영해 다시 열렸고, current PMW 테스트에 대한 사용자 답변이 아직 없다 | `준운영 수준` completion bar 위에 mandatory deep-interview, PMW feedback intake, mockup-first gate, `PROJECT_HISTORY.md` artifact를 `REQUIREMENTS.md` / `ARCHITECTURE_GUIDE.md` / `IMPLEMENTATION_PLAN.md` / workflow source에 동기화했다 | user가 current PMW를 테스트하고 usability feedback을 주면 Planner가 `DSG-01`과 revised draft approval을 이어간다 |

## Handoff Log
- [2026-04-07] `PLN-02`, `PLN-05`, `PLN-06` completed. mandatory deep-interview planner skill과 PMW mockup-first gate를 root/starter workflow source에 반영했고, `PROJECT_HISTORY.md`를 live/starter/reset source에 추가했다. 다음 agent는 User이며 current `Project Monitor Web`를 테스트한 뒤 usability feedback을 제공한다.
- [2026-04-07] `PLN-01` completed. `CR-03` 요구사항 초안을 `준운영 수준` completion bar로 강화했고, completion evidence를 `local preview 재검증 + review closure + dry-run/reporting`으로 고정했다. governed 범위는 activation guide + fixture + validator regression, runtime deliverable은 visibility-first HUD로 정리했다. 다음 agent는 User approval 또는 Planner이며, 승인 후 `PLN-02`~`PLN-04`를 이어간다.
- [2026-04-07] `DEV-05` completed. starter assembled source, reset canonical source, README, `PROJECT_WORKFLOW_MANUAL.md`에 hybrid/governed baseline, optional `.omx/*` not-truth rule, dry-run/reporting-first rollout policy를 반영했다. 다음 agent는 Planner이며 `PLN-01`로 `CR-03 Hybrid Harness Completion` approval-ready draft를 다듬는다.
- [2026-04-07] `DOC-05` completed. `Scalable Governance Profiles v0.3` snapshot을 `.agents/artifacts/archive/releases/v0.3/`에 보관했고 local preview는 closeout 전에 정리했다. reset source로 새 버전 artifact를 초기화한 뒤 `Hybrid Harness Completion v0.1` draft를 시작했다. 다음 agent는 Planner이며 `PLN-01`로 `CR-03` requirement draft를 approval-ready 수준까지 정리한다.
