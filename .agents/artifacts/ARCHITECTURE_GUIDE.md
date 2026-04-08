# Architecture Guide

> 이 문서는 DDD-first 구조 계약서입니다.  
> Developer, Tester, Reviewer, DevOps는 이 문서를 기준으로 작업하며, 임의 구조 변경은 금지됩니다.

## Quick Read
- 현재 아키텍처 스타일: document-centric governance core + optional enterprise-governed pack + separate `Project Monitor Web` + optional OMX sidecar compatibility
- 현재 반영된 Requirement Baseline / 변경 영향: `CR-03` approved baseline 위에 `CR-04` decision packet view, `CR-05` reinforcement contract, `CR-06` browser-based web test contract까지 승인/구현 반영 중이다. root self-hosting runtime reference / HUD / runbook, governed fixture + validator baseline, monitor hybrid visibility, decision-context packet, context/invariant/evidence task contract, recurrence gate, browser-based web test gate, `preview revalidation + review closure + dry-run/reporting` completion evidence를 같은 scope에 둔다.
- 핵심 도메인 경계: Governance Core / Profile Contract / Enterprise Governance Pack / Planner Discovery Skill / Hybrid Runtime Reference / Parser & Projection / Project Monitor Web / Integration Adapters
- 이번 범위에서 건드리는 폴더/모듈: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/runtime/{team.json,governance_controls.json}`, `.agents/skills/requirements_deep_interview/*`, `.omx/*`, `tools/project-monitor-web/*`, starter/reset governed source, rollout dry-run/reporting path
- 상태와 데이터의 주인: artifact와 runtime contract가 truth를 유지하고, monitor와 `.omx/*`는 파생 projection 또는 보조 상태만 가진다.
- 다음 역할이 꼭 지켜야 할 구조 규칙: starter는 OMX나 sandbox runtime에 의존하지 않으며, actual rollout은 completion gate가 닫히기 전까지 실행하지 않는다. Planner discovery skill은 shared process이지만 truth가 아니고, PMW delta는 승인 전 implementation으로 직행하지 않는다.
- 이번 문서의 리뷰 포인트: runtime reference/HUD boundary, pack activation rule, governed fixture + validator path, planner discovery boundary, `.omx` truth boundary, monitor hybrid visibility, decision packet read-only boundary, recurrence gate routing, governance guardrail contract, browser-based web test gate, completion evidence contract, rollout defer gate

## Status
- Document Status: Approved (`CR-06` synced)
- Owner: Planner
- Requirement Baseline: Hybrid Harness Completion v0.1
- Change Sync Check: Synced
- Last Requirement Sync At: 2026-04-08 13:30
- Last Updated At: 2026-04-08 13:30
- Last Approved By: User (`CR-06 web browser-based test contract`)
- Last Approved At: 2026-04-08 13:30

## Approved Boundaries
- 도메인 경계:
  Governance Core는 artifact truth와 운영 규칙을 담당한다.
  Governance Core는 `Task Packet` context/invariant/evidence contract와 recurrence follow-up routing도 함께 담당한다.
  Profile Contract는 `solo`, `team`, `large/governed` required field와 `team.json` contract를 담당한다.
  Enterprise Governance Pack은 `enterprise_governed` overlay, protected path/HITL/critical-domain 문서와 optional guardrail field를 담당한다.
  Hybrid Runtime Reference는 root self-hosting runtime/HUD/runbook과 preview revalidation / rollout defer evidence 기준을 담당한다.
  Parser & Projection은 artifact와 runtime contract를 읽어 read model을 만들고, recurrence/guardrail/evidence risk signal을 파생 계산한다.
  Project Monitor Web은 parser/projection 결과와 runtime/HUD readiness summary를 운영자에게 read-only로 보여주는 self-hosting only 도구다. 상단 요약, 프로젝트 selector, 좌측 메뉴, 우측 카드/콘텐츠 workspace를 통해 artifact-aware summary를 제공한다. `Approval Queue`에서는 decision packet projection을 통해 결정 맥락을 압축해 보여줄 수 있고, document health와 overview에서 `context miss`, `review reopen`, `evidence stale`, `repeat issue`, `guardrail gap`을 read-only로 보여준다.
  Local Monitor Shell은 `tools/project-monitor-web` 아래 launcher icon, stop icon, local open/close entry를 제공한다.
  Integration Adapters는 future Git/PR/CI/health snapshot/event hook/OMX sidecar를 optional로 연결한다.
- 계층 책임 경계:
  Governance Core가 task/lock/gate/handoff truth를 소유한다.
  `IMPLEMENTATION_PLAN.md > Task Packet Ledger`는 `Required Context Inputs`, `Architecture Invariants`, `Known Traps`, `Do-Not-Break Paths`, `Evidence Required Before Close`를 통해 실행 계약을 소유한다.
  `team.json`은 profile/pack activation truth를 소유한다.
  `governance_controls.json`은 protected path, human gate, critical domain 선언 truth와 optional `sensitive_paths`, `tool_allowlist`, `tool_denylist`, `exfiltration_sensitive_input_classes` guardrail truth를 소유한다.
  Hybrid Runtime Reference는 root self-hosting operator visibility surface를 제공할 수 있지만 truth를 소유하지 않는다.
  Parser & Projection은 truth를 읽어 파생 state만 계산한다.
  Project Monitor Web과 `.omx/*`는 read-only projection 또는 보조 상태만 가진다.
- 승인된 예외:
  `Project Monitor Web`은 root self-hosting 전용으로 둘 수 있다.
  starter/downstream에는 팀 구성 계약, governance controls, parser-friendly schema, dormant enterprise pack placeholder만 승격할 수 있다.
  `.omx/*`는 root self-hosting에서만 optional sidecar로 둘 수 있고 downstream 기본 동작으로 강제하지 않는다.
  rollout-ready dry-run/reporting과 local preview 재검증 / review closure evidence는 root self-hosting에서만 먼저 수행할 수 있다.

## Forbidden Changes
- 승인 없이 추가하면 안 되는 폴더/레이어:
  starter 기본 source에 `Project Monitor Web`, watcher, scheduler, registry, container sandbox, agent control plane을 추가하지 않는다.
- 금지된 직접 참조:
  web UI가 artifact truth를 직접 수정하는 write path
  `.omx/*`를 기준으로 task/gate truth를 복원하는 경로
  Phase 1 web app이 validator를 직접 실행하고 그 결과를 truth처럼 저장하는 경로
  profile-specific field를 core schema와 별도 비공식 파일에 분산 저장하는 구조
  completion gate가 닫히기 전 operating-project rollout을 실행하는 경로
- 금지된 구조 우회:
  source of truth를 markdown artifact 밖의 임의 DB나 UI state로 이전하는 구조
  self-hosting 전용 tool을 starter/downstream 기본 동작으로 몰래 확장하는 구조
  `approval`, `budget`, `audit` 도메인에서 HITL 없이 auto-merge를 기본값으로 두는 구조
  pack activation 없이 enterprise 문서를 mandatory truth로 읽게 만드는 구조

## Changelog
- [2026-04-06] Developer: reserved future hook contract, optional `health_snapshot.json` contract, self-hosting/downstream promotion boundary를 아키텍처 정본에 추가했다.
- [2026-04-06] Planner: `Scalable Governance Profiles v0.1` 기준으로 core/profile/observability/integration 경계를 초안 작성
- [2026-04-06] Planner: `v0.2` 승인에 따라 `team.json`, parser contract, `Project Monitor Web` product boundary를 아키텍처 정본으로 고정
- [2026-04-07] Planner: `CR-02 Enterprise Hybrid Harness`에 따라 enterprise-governed pack, `governance_controls.json`, `.omx` sidecar compatibility, critical-domain verification lane을 추가했다.
- [2026-04-07] Planner: current version closeout 후 `CR-03 Hybrid Harness Completion` draft에 맞춰 runtime reference, governed fixture, monitor hybrid visibility, rollout defer gate를 planning 범위에 추가했다.
- [2026-04-07] Planner: `CR-03` requirement revision에 맞춰 visibility-first HUD, governed fixture + validator baseline, completion evidence contract를 아키텍처 정본에 동기화했다.
- [2026-04-07] Planner: mandatory planner deep-interview skill, PMW feedback intake, `PROJECT_HISTORY.md` artifact를 `CR-03` draft 아키텍처 경계에 추가했다.
- [2026-04-08] Planner: PMW를 긴 세로 스크롤 대시보드가 아니라 artifact-aware operator workspace로 재정의하고, 상단 요약 / 좌측 메뉴 / 우측 주요 카드 / 우측 콘텐츠 패턴을 presentation boundary에 추가했다.
- [2026-04-08] Planner: self-hosting local multi-project selector와 icon/exit 같은 shell affordance를 PMW presentation boundary에 추가하되 artifact write control과는 분리하기로 했다.
- [2026-04-08] Planner: user 승인에 맞춰 launcher icon, stop icon, top-bar `Exit`, `Project History` 전용 조회를 approved PMW workspace baseline으로 고정했다.
- [2026-04-08] Planner: `CR-04` draft로 `Approval Queue -> 상세 결정 패킷` projection을 열고, decision context compression을 PMW presentation/application 경계에 추가했다.
- [2026-04-08] Developer: PMW snapshot/application/presentation layer와 local shell assets에 approved `CR-04` baseline을 구현했다.
- [2026-04-08] Planner / Developer: `CR-05` 승인에 따라 task packet context contract, recurrence gate routing, governance guardrail field, PMW risk signal을 architecture baseline과 live code path에 추가한다.
- [2026-04-08] Planner: `CR-06` 승인에 따라 browser-facing web scope는 API-only evidence로 manual gate를 닫지 않고 browser-rendered evidence를 남기도록 validation contract를 architecture baseline에 추가했다.

## Requirement Change Sync

| Change ID | Architecture Impact | Updated Sections | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | Boundary Update | Approved Boundaries / Domain Map / Folder Structure / Artifact Parser Contract / Team Registry Contract | Synced | web app 분리, team registry 경로, parser mandatory source를 고정 |
| CR-02 | Layer Rule Update | Approved Boundaries / Forbidden Changes / Domain Map / Folder Structure / Team Registry Contract / Enterprise Governance Pack Contract / Optional Runtime Contract / OMX Compatibility Map / Promotion Boundary | Synced | enterprise-governed overlay와 `.omx` sidecar를 truth plane 밖에 유지 |
| CR-03 | Approved Baseline | Quick Read / Approved Boundaries / Domain Map / Folder Structure / Promotion Boundary / Integration Boundaries | In Sync | visibility-first HUD와 `preview revalidation + review closure + dry-run/reporting` completion evidence를 정의하고, mandatory deep-interview + project-history artifact + PMW workspace IA + launcher-stop shell affordance를 포함하되 actual rollout은 defer |
| CR-04 | Approved | Quick Read / Approved Boundaries / Domain Map / Layer Responsibilities / Integration Boundaries | In Sync | `Approval Queue -> 상세 결정 패킷` read-only projection과 multi-project workspace 구현을 live PMW code에 반영했다 |
| CR-05 | Approved | Quick Read / Approved Boundaries / Layer Responsibilities / Enterprise Governance Pack Contract / Optional Runtime Contract / Integration Boundaries | In Sync | task packet context contract, recurrence routing, optional guardrail field, PMW risk signal을 read-only truth/projection 경계 안에서 추가했다 |
| CR-06 | Approved | Quick Read / Approved Boundaries / Integration Boundaries | In Sync | 웹앱 / browser-facing scope는 browser-rendered evidence를 manual/environment gate의 기본 입력으로 사용하고 API-only evidence로는 gate를 닫지 않는다 |

## Architecture Summary
- 아키텍처 스타일: truth layer와 projection/orchestration layer를 분리한 local-first layered architecture
- 주요 도메인: Governance Core, Profile Contract, Enterprise Governance Pack, Hybrid Runtime Reference, Parser & Projection, Project Monitor Web, Integration Adapters
- 핵심 설계 원칙:
  source of truth는 artifact와 runtime contract가 유지한다.
  enterprise burden은 optional pack으로만 올린다.
  `.omx/*`는 optional sidecar이지 truth가 아니다.
  monitor는 read-only 정적 뷰어로 시작한다.
  task packet은 로컬 구현 명령이 아니라 전역 맥락 계약까지 포함해야 한다.
  root self-hosting HUD/readiness surface는 operator visibility용이며 control plane이 아니다.
  Planner discovery skill은 requirements 작성 전 mandatory process aid이지만 truth를 소유하지 않는다.
  recurrence review는 새 truth artifact를 만들지 않고 existing handoff/rule/skill/checklist로 preventive action을 되돌린다.
  `PROJECT_HISTORY.md`는 long-term timeline이지 current-state truth가 아니다.
  human approval과 manual gate는 agent activity와 동등한 운영 개념이다.
  browser-facing web scope는 API-only evidence로 manual gate를 닫지 않는다.
  critical domain에서는 generator와 reviewer/verifier lane을 분리한다.
  actual rollout은 `preview revalidation + review closure + dry-run/reporting` completion gate 뒤로 미룬다.

## Domain Map

| Domain | Responsibility | Key Entities / Use Cases | Notes |
|---|---|---|---|
| Governance Core | 문서 기반 운영 truth 유지 | Task, Lock, Handoff, Gate, Requirement Baseline, Stage, Recurrence Follow-up | `.agents/artifacts/*`, `.agents/rules/*` 중심 |
| Profile Contract | 프로필별 의무 필드와 팀 계약 유지 | Solo profile, Team profile, Large/Governed profile, Team Registry, Pack Activation | `team.json`과 profile required field를 고정 |
| Enterprise Governance Pack | 고위험 도메인 통제 규칙 유지 | Governance controls, Protected path, Sensitive path, Tool allow/deny list, HITL escalation, Critical domain docs | `enterprise_governed` overlay only |
| Planner Discovery Skill | requirements 작성 전 구조화된 사용자 인터뷰 수행 | `requirements_deep_interview`, scope clarification, architecture invariant, failure mode, acceptance shaping | shared skill, artifact truth 아님 |
| Hybrid Runtime Reference | root self-hosting completion 기준 유지 | `.omx` guide, runtime/HUD visibility, local runbook, preview revalidation, rollout defer contract | root only, truth 아님 |
| Parser & Projection | mandatory source를 읽어 read model 생성 | Task projection, Blocker queue, Decision packet projection, Recent activity, Health projection, Team directory projection, Recurrence / Guardrail signal | UI와 분리된 shared library |
| Project Monitor Web | read-only 웹 UI 제공 | Project selector, project overview summary, current-state cards, left navigation, dashboard cards, decision packet view, manual refresh, history view, detail drill-down, top-bar `Exit` | `tools/project-monitor-web/*` |
| Local Monitor Shell | self-hosting convenience affordance 제공 | project registry selection, launcher icon, stop icon, local open/close action | self-hosting only, artifact truth 아님 |
| Integration Adapters | optional 주변 정보 연결 | Git, PR, CI, future health snapshot, future event hook, optional OMX sidecar | Phase 1에서는 optional/reserved only |

## Folder Structure
```text
.agents/
  artifacts/
    PROJECT_HISTORY.md
  rules/
  skills/
    requirements_deep_interview/
  runtime/
    team.json
    governance_controls.json
    health_snapshot.json (optional)
tools/
  project-monitor-web/
    src/
      application/
      domain/
      infrastructure/
      presentation/
templates_starter/
  .agents/
    artifacts/
      PROJECT_HISTORY.md
      enterprise_governed/
    skills/
      requirements_deep_interview/
    rules/
    runtime/
      team.json
      governance_controls.json
  templates/
    version_reset/
      artifacts/
        enterprise_governed/
.omx/
  README.md (self-hosting optional sidecar only)
```

## Layer Responsibilities
- `domain/`: `task`, `lock`, `handoff`, `gate`, `profile`, `pack`, `team member`, `governance control`, `health snapshot`, `risk signal` 개념과 불변식
- `application/`: artifact parsing, projection assembly, decision context synthesis, profile validation, pack activation validation, health aggregation, recurrence/guardrail signal derivation, manual refresh orchestration
- `planner-skill/`: structured requirements interview, change-request discovery, architecture invariant / failure-mode capture, UI intake, mockup brief synthesis
- `infrastructure/`: file system read, JSON parse, optional health snapshot read, local HTTP server, optional `.omx` sidecar read
- `presentation/`: workspace UI shell, project selector, left navigation, summary cards, content pane, decision packet panel, detail drawer, history view, artifact link-out, top-bar exit affordance, recurrence/guardrail signal display
- `shell/`: launcher icon, stop icon, local open/close command entry, project preset bootstrapping
- `release-readiness`: dry-run/reporting evidence와 rollout defer state를 artifact로 정리한다
- `closeout-recurrence`: day wrap up에서 repeat issue를 existing artifact/rule/skill/checklist follow-up으로 라우팅한다

## Dependency Rules
- domain은 application/presentation/infrastructure를 모른다.
- application은 domain을 사용하며 parser/projection use case를 조합한다.
- infrastructure는 파일 읽기, JSON 읽기, 로컬 HTTP 제공, optional sidecar read를 구현한다.
- presentation은 application이 만든 projection을 렌더링하고 직접 비즈니스 규칙을 가지지 않는다.
- Governance Core와 runtime contract truth는 parser/projection보다 상위다.
- Planner workflow는 `requirements_deep_interview` skill을 먼저 수행하고 그 결과를 artifact schema에 맞춰 동기화한다.
- UI layer는 parser contract를 우회해서 직접 markdown을 해석하지 않는다.
- optional orchestration mapping은 workflow layer에만 존재하고 truth layer를 바꾸지 않는다.

## Artifact Parser Contract

| File | Phase 1 Role | Required Sections / Fields | Notes |
|---|---|---|---|
| `CURRENT_STATE.md` | Mandatory | `Snapshot`, `Open Decisions / Blockers`, `Latest Handoff Summary` | health/status와 blocker source |
| `TASK_LIST.md` | Mandatory | `Current Release Target`, `Active Locks`, workflow task rows, `Handoff Log` | board / activity / lock source |
| `REQUIREMENTS.md` | Mandatory | `Status`, `Operational Profiles`, `Optional Packs`, `Functional Requirements`, `Non-Functional Requirements` | profile/pack contract source |
| `ARCHITECTURE_GUIDE.md` | Mandatory | `Status`, `Domain Map`, `Artifact Parser Contract`, `Team Registry Contract`, `Enterprise Governance Pack Contract`, `Optional Runtime Contract`, `Promotion Boundary` | architecture and parser contract reference |
| `IMPLEMENTATION_PLAN.md` | Mandatory | `Status`, `Current Iteration`, `Requirement Trace`, `Task Packet Ledger`, `Iteration Plan`, `Validation Gates` | execution context source |
| `REVIEW_REPORT.md` | Optional | review gate summary | release-stage optional source |
| `DEPLOYMENT_PLAN.md` | Optional | deployment gate summary | release-stage optional source |

## Team Registry Contract

| Field | Required In | Meaning |
|---|---|---|
| `schema_version` | top-level | runtime contract schema version |
| `active_profile` | top-level | current operating profile |
| `active_packs` | top-level optional | enabled optional overlays such as `enterprise_governed` |
| `members` | top-level | team registry rows |
| `id` | all rows | stable owner identifier |
| `display_name` | all rows | 화면 표시용 이름 |
| `kind` | all rows | `human` 또는 `ai` |
| `primary_role` | all rows | 기본 역할 |
| `ownership_scopes` | all rows | 책임 범위 목록 |
| `handoff_targets` | all rows | 기본 handoff 대상 목록 |
| `default_model` | optional | 기본 AI 모델 메타데이터 |
| `approval_authority` | optional by default, effectively required in `enterprise_governed` | 승인 권한 범위 |

## Enterprise Governance Pack Contract

| Artifact | Required When | Meaning | Phase 1 Behavior |
|---|---|---|---|
| `.agents/runtime/governance_controls.json` | optional in `team`, required in `large/governed + enterprise_governed` | protected path, human gate, validator profile, critical domain contract, optional sensitive path / tool allow-deny / exfiltration guardrail contract | parser/validator가 읽고 workflow gate를 강화한다 |
| `.agents/artifacts/enterprise_governed/APPROVAL_RULE_MATRIX.md` | `enterprise_governed` active | 승인 authority와 escalation matrix | placeholder 허용, HITL rule은 명시되어야 한다 |
| `.agents/artifacts/enterprise_governed/AUDIT_EVENT_SPEC.md` | `enterprise_governed` active | 감사 event 분류와 required evidence | mutation/property/edge-case verification 기준을 함께 적는다 |
| `.agents/artifacts/enterprise_governed/BUDGET_CONTROL_RULES.md` | `enterprise_governed` active | 예산/재무 관련 protected path와 승인 기준 | auto-merge보다 human gate가 우선이다 |
| `.agents/artifacts/enterprise_governed/ORG_ROLE_PERMISSION_MATRIX.md` | `enterprise_governed` active | 사람/에이전트 역할별 권한 경계 | `approval_authority`와 연결된다 |
| `.agents/artifacts/enterprise_governed/MONTH_END_CLOSE_CHECKLIST.md` | `enterprise_governed` active | month-end / closeout checklist | critical domain closeout contract로 사용한다 |

## Optional Runtime Contract

| File | Required In | Meaning | Phase 1 Behavior |
|---|---|---|---|
| `.agents/runtime/governance_controls.json` | optional in root/starter runtime, required in `large/governed + enterprise_governed` | protected path, human gate, validator profile, critical domains, sandbox policy, optional sensitive path / tool allow-deny / exfiltration guardrail | truth contract이지만 pack activation 전에는 dormant placeholder 허용 |
| `.agents/runtime/health_snapshot.json` | optional in root/starter runtime | validator, adapter, CI가 남기는 read-only health summary | placeholder 허용, monitor는 읽을 수 있지만 truth를 대체하지 않는다 |
| `.omx/state/*`, `.omx/logs/*`, `.omx/project-memory.json` | self-hosting only optional sidecar | orchestration/runtime 보조 상태 | artifact truth를 대체하지 않으며 validator/workflow가 authoritative state로 사용하지 않는다 |

## OMX Compatibility Map

| Workflow Intent | Optional OMX Mapping | Contract |
|---|---|---|
| Discovery | `$deep-interview` | optional acceleration only, requirement truth는 artifact에 남긴다 |
| Requirements capture | internalized `requirements_deep_interview` | mandatory shared planner skill. OMX phrasing/runtime는 참고만 가능하며 최종 truth는 `REQUIREMENTS.md`다 |
| Planning | `$ralplan` | planner 결과는 `REQUIREMENTS.md` / `ARCHITECTURE_GUIDE.md` / `IMPLEMENTATION_PLAN.md`에 동기화돼야 한다 |
| Parallel implementation | `$team` | 병렬 실행은 `TASK_LIST.md` lock/scope truth를 우회하지 않는다 |
| Persistent completion / verification | `$ralph` | 완료 판단은 review/test/deploy artifact gate가 계속 진실이다 |

## Future Hook Contract

| Event | Reserved Emit Point | Phase | Notes |
|---|---|---|---|
| `task.claimed` | task 상태가 `[-]`와 lock 생성으로 전환될 때 | Phase 2+ | claim/lock transition만 예약한다 |
| `task.blocked` | blocker 또는 manual/environment gate가 기록될 때 | Phase 2+ | realtime transport는 추가하지 않는다 |
| `handoff.recorded` | `TASK_LIST.md > Handoff Log` append 시점 | Phase 2+ | handoff 원문은 계속 artifact가 truth다 |
| `gate.awaiting_human` | 사용자 승인 / manual gate / environment gate 대기 진입 시점 | Phase 2+ | human decision 자체는 artifact와 로컬 대화가 truth다 |
| `task.completed` | task가 `[x]`로 닫히는 시점 | Phase 2+ | completion event 저장소는 optional adapter로만 확장한다 |

## Promotion Boundary

| Capability | Default Home | Starter Default | Promotion Rule | Notes |
|---|---|---|---|---|
| `Project Monitor Web` runtime | root self-hosting only | No | optional package로 추출 검토 가능 | starter 기본 동작으로 넣지 않는다 |
| `requirements_deep_interview` skill | root + starter | Yes | shared planner behavior로 유지 | raw discovery notes는 truth가 아니다 |
| root runtime/HUD reference | root self-hosting only | No | local operator surface로 유지 | control plane으로 승격하지 않는다 |
| `team.json` contract | root + starter | Yes | shared schema로 유지 | runtime watcher를 암시하지 않는다 |
| `governance_controls.json` contract | root + starter | Optional | `enterprise_governed` 활성 시 required | team profile에서는 dormant placeholder 가능 |
| enterprise-governed pack docs | starter + reset source | Optional | `active_packs`가 `enterprise_governed`일 때만 활성 truth로 읽는다 | core flow는 pack 미활성 시 무시한다 |
| `.omx/*` sidecar | root self-hosting only | No | compatibility guide만 starter에 남긴다 | truth plane으로 승격하지 않는다 |
| rollout dry-run/reporting | root self-hosting only | No | local preview 재검증과 review closure 뒤에만 실제 rollout을 연다 | current version에서는 evidence만 남긴다 |
| event hook transport | root experiment 또는 adapter package | No | event producer shape가 안정화된 뒤 별도 설계 | Phase 1은 이름 예약만 수행한다 |
| container/read-only sandbox | self-hosting experiment only | No | Phase 2 이후 별도 검토 | starter 기본값으로 넣지 않는다 |

## State and Data Ownership
- 전역 상태: `.agents/artifacts/*.md`와 `.agents/rules/*`가 운영 truth를 가진다.
- profile / pack activation 상태: `.agents/runtime/team.json`이 profile과 enabled pack truth를 가진다.
- governance control 상태: `.agents/runtime/governance_controls.json`이 protected path와 human gate truth를 가진다.
- 장기 이력 상태: `PROJECT_HISTORY.md`가 major decision / milestone timeline을 append-only로 가진다. current task / lock truth는 아니다.
- 로컬 UI 상태: 필터, 선택된 패널, 정렬, 검색, 마지막 수동 새로고침 시각만 가진다.
- 영속 저장소: Phase 1은 추가 DB를 요구하지 않는다. future health snapshot 또는 event store는 별도 저장소로 분리한다.
- sidecar 상태: `.omx/*`는 캐시/로그/보조 memory만 가진다. repo truth보다 우선할 수 없다.

## Integration Boundaries
- 외부 API/서비스: 선택적 GitHub/CI/PM adapter, future enterprise system adapter
- 인증 경계: Phase 1은 로컬 self-hosting 사용을 전제로 하며 특정 auth provider를 강제하지 않는다.
- 파일/스토리지 경계: Phase 1 web app은 artifact와 runtime contract, optional `.omx/*`, optional `health_snapshot.json`을 읽을 수 있지만 validator나 write action은 실행하지 않는다.
- optional observability / monitor contract: `.omx/*`와 health snapshot은 read-only auxiliary input이며 release/review truth를 대체하지 않는다.
- local shell contract: project selector와 exit affordance는 self-hosting local UX에 한정되며 artifact/governance write path로 확장하지 않는다. launcher/stop icon은 local process convenience일 뿐 approval mutation control이 아니다.
- decision packet contract: packet은 artifact truth를 읽어 압축 요약만 제공하며, 승인 submit이나 direct mutation control을 포함하지 않는다. recurrence/guardrail/evidence signal은 read-only context로만 첨부한다.
- browser validation contract: 웹앱 또는 브라우저 렌더 결과가 사용자 가치에 직접 연결되는 scope는 browser-rendered smoke나 user browser raw report를 남겨야 하며, API-only / unit-only evidence만으로 manual/environment gate를 닫지 않는다. backend-only scope는 예외다.
- planning discovery contract: deep-interview skill output은 planner의 구조화 입력일 뿐이며 승인/정본은 항상 artifact에 남긴다.
- wrap-up recurrence contract: `day_wrap_up`은 repeat issue를 `CURRENT_STATE.md`, `TASK_LIST.md`, follow-up task, relevant rule/skill/checklist update target으로만 라우팅하고 별도 top-level retrospective truth를 만들지 않는다.
- rollout 경계: operating-project mutation은 current draft 범위 밖이며 local preview 재검증, review closure, dry-run/reporting evidence가 먼저 필요하다.

## Naming Conventions
- pack identifier: `enterprise_governed`
- runtime files: `team.json`, `governance_controls.json`, `health_snapshot.json`
- folder: `enterprise_governed`, `projection`, `adapters`, `presentation`처럼 책임이 드러나는 이름 사용
- 클래스/함수: `parseCurrentState`, `loadTeamRegistry`, `loadGovernanceControls`, `buildBoardProjection`, `buildCriticalDomainGateSummary`처럼 동작을 드러내는 이름 사용
- 상태/액션: future hook name은 `task.claimed`, `task.blocked`, `handoff.recorded`, `gate.awaiting_human`, `task.completed`처럼 일관되게 사용

## Change Control
- 구조 변경이 필요하면 Planner가 이유와 영향 범위를 기록한다.
- 사용자 승인 후에만 이 문서를 수정한다.
- 승인 후 요구사항이 바뀌면 `REQUIREMENTS.md`와 같은 기준선으로 이 문서를 다시 확인하고, 변경이 없더라도 `Requirement Baseline`과 `Change Sync Check`를 갱신한다.
