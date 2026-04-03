# Task List

> 프로젝트의 공식 진행 상태 문서입니다.  
> 이 문서는 task / lock truth이며, `CURRENT_STATE.md`는 resume router, `## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관용입니다.

## Changelog
- [YYYY-MM-DD] Planner: initial draft
- [2026-04-03] Codex: removed optional approval extension features from the default template and archived related assets under `backup/remote_approval`
- [2026-04-04] Codex: synced README and tutorial docs with the current local-approval template scope

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
- Version / Milestone: `template-maintenance`
- Current Stage: `Documentation and Closeout`
- Current Focus: `로컬 승인 기준 기본 템플릿 설명 유지`
- Current Release Goal: `원격 승인 자산을 backup으로 격리한 기본 템플릿 설명을 최신 상태로 유지`

## Next Version Backlog
- [ ] BACKLOG-01 [다음 버전 후보 작업] — Scope: [제품/문서/기술 부채]

## Active Locks

| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|

## Workflow Stage: Planning and Architecture
- [ ] PLN-01 요구사항 초안 정리 — Scope: `REQUIREMENTS.md`
- [ ] PLN-02 요구사항 승인 / 변경 반영 — Scope: `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`
- [ ] PLN-03 아키텍처 초안 정리 — Scope: `ARCHITECTURE_GUIDE.md`
- [ ] PLN-04 구현 계획 및 작업 목록 작성 — Scope: `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`

## Workflow Stage: Design Gate
- [ ] DSG-01 UI/UX 필요 여부 결정 — Scope: `UI_DESIGN.md` 필요성 판정
- [ ] DSG-02 UI scope일 경우 화면 구조 및 사용자 동선 정의 — Scope: `UI_DESIGN.md`
- [ ] DSG-03 UI scope일 경우 디자인 토큰 및 interaction 규칙 정리 — Scope: `UI_DESIGN.md`
- [ ] DSG-04 비UI scope일 경우 `UI_DESIGN.md not required for this scope` 기록 및 design gate 종료 — Scope: `UI_DESIGN.md`, `CURRENT_STATE.md`

## Workflow Stage: Development and Test Loop

### Iteration 1
- [ ] DEV-01 [개발 작업] — Scope: [폴더/모듈/문서]
- [ ] DEV-02 [개발 작업] — Scope: [폴더/모듈/문서]
- [ ] TST-01 [검증 작업] — Scope: [대상 Task ID / 경로 / 요구사항]

### Iteration 2
- [ ] DEV-03 [개발 작업] — Scope: [폴더/모듈/문서]
- [ ] DEV-04 [개발 작업] — Scope: [폴더/모듈/문서]
- [ ] TST-02 [검증 작업] — Scope: [대상 Task ID / 경로 / 요구사항]

## Workflow Stage: Review Gate
- [ ] REV-01 구조 / 보안 / 품질 리뷰 — Scope: [릴리즈 범위 / 대상 Task ID]
- [ ] REV-02 리뷰 반영 확인 — Scope: [릴리즈 범위 / 대상 Task ID]

## Workflow Stage: Deployment
- [ ] REL-01 배포 전 사전 점검 — Scope: [환경 / 버전 / 커밋 범위]
- [ ] REL-02 배포 실행 — Scope: [환경 / 명령 / 배포 대상]
- [ ] REL-03 배포 결과 기록 — Scope: `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`

## Workflow Stage: Documentation and Closeout
- [ ] DOC-01 day_wrap_up 또는 같은 버전 내 문서 정리 준비 — Scope: `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 아티팩트
- [ ] DOC-02 version_closeout / Documenter 정리 — Scope: archive, `CURRENT_STATE.md`, `HANDOFF_ARCHIVE.md`
- [x] DOC-03 운영 가이드 / 튜토리얼 동기화 — Scope: `PROJECT_WORKFLOW_MANUAL.md`
- [x] DOC-04 원격 승인 기능 backup 이관 및 템플릿 제외 — Scope: `backup/remote_approval`, `.agents/rules`, `.agents/workflows`, `.agents/artifacts`, `PROJECT_WORKFLOW_MANUAL.md`
- [x] DOC-05 README / 튜토리얼 현재 범위 동기화 — Scope: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`

## Blockers
- [없으면 비워둠]
- [승격된 blocker / 사용자 결정 대기 / stale lock 판단 보류]

## Handoff Log
- [2026-04-03] Codex — Task: `DOC-04`
  - Completed: 제외 대상 승인 확장 자산을 `backup/remote_approval`로 이관하고 기본 템플릿의 관련 참조를 제거함.
  - Next: 추가 지시가 없으면 기본 템플릿은 로컬 사용자 승인 전제만 유지함.
  - Notes: `tools/harness_admin`의 기존 미커밋 변경은 보존된 채 backup 위치로 함께 이동됨.
- [2026-04-04] Codex — Task: `DOC-05`
  - Completed: `README.md`와 `PROJECT_WORKFLOW_MANUAL.md`를 현재 기본 템플릿 범위, 로컬 사용자 승인 기준, `backup/remote_approval` 보관 구조에 맞게 동기화함.
  - Next: 추가 범위 변경이 없으면 현재 설명 문구를 유지하고, 새 진입 규칙이 생기면 README와 튜토리얼을 함께 갱신함.
  - Notes: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`는 설명 문서이며 운영 정본은 계속 `.agents/rules`와 `.agents/artifacts`에 남겨 둠.
