# Architecture Guide

> 이 문서는 DDD-first 구조 계약서입니다.  
> Developer, Tester, Reviewer, DevOps는 이 문서를 기준으로 작업하며, 임의 구조 변경은 금지됩니다.

## Quick Read
- 현재 starter baseline 아키텍처 스타일: document-centric governance core + optional enterprise-governed pack + optional self-hosting visibility / monitor + optional `.omx/*` sidecar compatibility + context/invariant/recurrence contract + browser-based web test gate
- 현재 반영된 baseline: `Hybrid Harness Template v0.1`
- 핵심 도메인 경계: Governance Core / Profile Contract / Enterprise Governance Pack / Hybrid Runtime Reference / Parser & Projection / Optional Visibility / Integration Adapters
- 이번 starter에서 기본으로 포함되는 것: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/runtime/*`, optional `enterprise_governed` docs, validator/reset source
- 상태와 데이터의 주인: artifact와 runtime contract가 truth를 유지하고, visibility tool이나 `.omx/*`는 파생 projection 또는 보조 상태만 가진다.
- 다음 역할이 꼭 지켜야 할 구조 규칙: starter 기본 경로는 generic하게 유지하고, actual rollout은 completion review와 dry-run/reporting gate 전에는 열지 않는다.
- 이번 문서의 리뷰 포인트: pack activation rule, `.omx` truth boundary, optional visibility read-only boundary, task packet context contract, recurrence routing, browser-based web test gate, rollout defer gate

## Status
- Document Status: Draft / Ready for Approval
- Owner: Planner
- Requirement Baseline: Hybrid Harness Template v0.1
- Change Sync Check: Synced
- Last Requirement Sync At: 2026-04-08 13:30
- Last Updated At: 2026-04-08 13:30
- Last Approved By: [Set on project approval]
- Last Approved At: [Set on approval]

## Approved Boundaries
- 도메인 경계:
  Governance Core는 artifact truth와 운영 규칙을 담당한다.
  Governance Core는 task packet context/invariant/evidence contract와 recurrence follow-up routing도 함께 담당한다.
  Profile Contract는 `solo`, `team`, `large/governed` required field와 `team.json` contract를 담당한다.
  Enterprise Governance Pack은 `enterprise_governed` overlay와 protected path/HITL/critical-domain 문서, optional guardrail field를 담당한다.
  Hybrid Runtime Reference는 self-hosting only `.omx/*`, HUD/runbook, rollout defer policy를 다룬다.
  Parser & Projection은 artifact와 runtime contract를 읽어 read model과 optional recurrence/guardrail/evidence signal을 만든다.
  Optional Visibility는 read-only monitor나 summary view를 제공할 수 있지만 truth를 수정하지 않는다.
  Integration Adapters는 future Git/PR/CI/health snapshot/event hook를 optional로 연결한다.
- 계층 책임 경계:
  Governance Core가 task/lock/gate/handoff truth를 소유한다.
  `IMPLEMENTATION_PLAN.md > Task Packet Ledger`는 context / invariant / trap / do-not-break / close evidence 실행 계약을 소유한다.
  `team.json`은 profile/pack activation truth를 소유한다.
  `governance_controls.json`은 protected path, human gate, critical domain 선언 truth와 optional guardrail field truth를 소유한다.
  Parser & Projection은 truth를 읽어 파생 state만 계산한다.
  visibility tool과 `.omx/*`는 read-only projection 또는 보조 상태만 가진다.
- 승인된 예외:
  self-hosting visibility / monitor는 root self-hosting에서만 둘 수 있고 starter 기본 동작으로 강제하지 않는다.
  `.omx/*`는 root self-hosting에서만 optional sidecar로 둘 수 있고 starter 기본 동작으로 강제하지 않는다.
  rollout-ready dry-run/reporting은 self-hosting repo에서 먼저 수행하고, actual rollout은 그 다음 단계에서만 연다.
- optional self-hosting tool / starter 공통 계약 경계:
  runtime contract와 pack docs는 starter에 포함될 수 있지만 runtime process, monitor runtime, orchestration state는 starter 기본값이 아니다.

## Forbidden Changes
- 승인 없이 추가하면 안 되는 폴더/레이어:
  starter 기본 source에 watcher, scheduler, registry, container sandbox, agent control plane, visibility runtime을 기본 포함하지 않는다.
- 금지된 직접 참조:
  visibility UI가 artifact truth를 직접 수정하는 write path
  `.omx/*`를 기준으로 task/gate truth를 복원하는 경로
  optional runtime state를 기준으로 review/deploy gate를 닫는 경로
- 금지된 구조 우회:
  source of truth를 UI state나 임의 DB로 이전하는 구조
  pack activation 없이 enterprise 문서를 mandatory truth로 읽게 하는 구조
  completion review와 dry-run/reporting 전 actual rollout을 실행하는 구조

## Changelog
- [2026-04-06] Template Maintainer: profile/runtime/monitor starter baseline 골격을 추가했다.
- [2026-04-07] Template Maintainer: `enterprise_governed`, optional `.omx/*`, rollout defer / dry-run 기준을 starter baseline에 반영했다.
- [2026-04-08] Template Maintainer: task packet context contract, recurrence review, optional governance guardrail field, read-only risk signal baseline을 starter architecture에 반영했다.
- [2026-04-08] Template Maintainer: browser-facing web scope는 API-only evidence로 manual gate를 닫지 않도록 browser-based test contract를 starter architecture에 반영했다.

## Requirement Change Sync

| Change ID | Architecture Impact | Updated Sections | Sync Status | Notes |
|---|---|---|---|---|
| TEMPLATE-01 | Boundary Update | Approved Boundaries / Domain Map / Team Registry Contract / Promotion Boundary | Synced | profile/runtime/monitor starter baseline |
| TEMPLATE-02 | Layer Rule Update | Quick Read / Approved Boundaries / Forbidden Changes / Optional Runtime Contracts / Promotion Boundary | Synced | enterprise pack, `.omx/*`, rollout defer/dry-run 기준 반영 |
| TEMPLATE-03 | Layer Rule Update | Quick Read / Approved Boundaries / Layer Responsibilities / Optional Runtime Contracts / Integration Boundaries | Synced | context/invariant/recurrence contract과 optional guardrail field를 starter baseline에 반영 |
| TEMPLATE-04 | Validation Contract Update | Quick Read / Architecture Summary / Integration Boundaries | Synced | browser-facing web scope는 browser-rendered evidence를 manual/environment gate에 연결한다 |

## Architecture Summary
- 아키텍처 스타일: truth layer와 projection/orchestration layer를 분리한 local-first layered architecture
- 주요 도메인: Governance Core, Profile Contract, Enterprise Governance Pack, Hybrid Runtime Reference, Parser & Projection, Optional Visibility, Integration Adapters
- 핵심 설계 원칙:
  source of truth는 artifact와 runtime contract가 유지한다.
  enterprise burden은 optional pack으로만 올린다.
  `.omx/*`는 optional sidecar이지 truth가 아니다.
  task packet은 로컬 작업 범위뿐 아니라 전역 맥락과 close evidence를 함께 가져야 한다.
  visibility는 read-only 뷰어로만 붙인다.
  recurrence review는 기존 artifact와 follow-up task로만 환류하고 별도 top-level retrospective truth를 만들지 않는다.
  browser-facing web scope는 API-only evidence로 manual/environment gate를 닫지 않는다.
  actual rollout은 completion review와 dry-run/reporting gate 뒤로 미룬다.

## Domain Map

| Domain | Responsibility | Key Entities / Use Cases | Notes |
|---|---|---|---|
| Governance Core | 문서 기반 운영 truth 유지 | Task, Lock, Handoff, Gate, Requirement Baseline, Stage, Recurrence Follow-up | `.agents/artifacts/*`, `.agents/rules/*` 중심 |
| Profile Contract | 프로필별 의무 필드와 팀 계약 유지 | Solo profile, Team profile, Large/Governed profile, Team Registry, Pack Activation | `team.json`과 profile required field를 고정 |
| Enterprise Governance Pack | 고위험 도메인 통제 규칙 유지 | Governance controls, Protected path, Sensitive path, Tool allow/deny list, HITL escalation, Critical domain docs | `enterprise_governed` overlay only |
| Hybrid Runtime Reference | self-hosting optional runtime visibility와 runbook 유지 | `.omx` guide, HUD, local runbook, rollout defer state | root only, truth 아님 |
| Parser & Projection | artifact와 runtime contract를 읽어 read model 생성 | Task projection, blocker queue, health projection, readiness summary, optional risk signal | UI와 분리된 shared library |
| Optional Visibility | read-only monitor / summary view 제공 | Dashboard, filters, artifact link-out, readiness summary | 기본 starter에는 runtime 미포함 |
| Integration Adapters | optional 주변 정보 연결 | Git, PR, CI, future health snapshot, future event hook | optional only |

## Folder Structure
```text
.agents/
  artifacts/
    enterprise_governed/ (optional pack placeholders)
  rules/
  runtime/
    team.json
    governance_controls.json
    health_snapshot.json (optional)
  scripts/
  workflows/
templates/
  version_reset/
    artifacts/
```

## Layer Responsibilities
- `domain/`: 엔티티, 값 객체, 도메인 규칙
- `application/`: 유스케이스, projection, readiness summary, recurrence/guardrail/evidence signal derivation, orchestration-free validation flow
- `infrastructure/`: 파일시스템, JSON parse, optional `.omx/*` read, optional monitor runtime, dry-run/reporting helpers
- `presentation/`: read-only UI, artifact link-out, filter, summary

## Dependency Rules
- domain은 application/presentation/infrastructure를 모른다.
- application은 domain을 사용하며, 구체 구현보다 추상 계약에 의존한다.
- infrastructure는 application/domain 계약을 구현한다.
- presentation은 application을 호출하고, 직접 비즈니스 규칙을 가지지 않는다.
- `.omx/*` sidecar가 있더라도 truth layer를 대체하지 않는다.
- actual rollout은 completion review와 dry-run/reporting evidence 뒤에서만 열린다.

## Team Registry Contract

| Field | Required In | Meaning |
|---|---|---|
| `schema_version` | top-level | runtime contract schema version |
| `active_profile` | top-level | current operating profile |
| `active_packs` | top-level optional | enabled overlays such as `enterprise_governed` |
| `members` | top-level | team registry rows |
| `id` | all rows | stable owner identifier |
| `display_name` | all rows | 화면 표시용 이름 |
| `kind` | all rows | `human` 또는 `ai` |
| `primary_role` | all rows | 기본 역할 |
| `ownership_scopes` | all rows | 책임 범위 목록 |
| `handoff_targets` | all rows | 기본 handoff 대상 목록 |
| `approval_authority` | optional by default, required when pack needs it | approval scope |

## Optional Runtime Contracts

| File | Required In | Meaning | Phase Behavior |
|---|---|---|---|
| `.agents/runtime/governance_controls.json` | optional / team / required in governed pack | protected path, human review, validator profile, critical domains, optional sensitive path / tool allow-deny / exfiltration guardrail | placeholder allowed, pack active 시 required |
| `.agents/runtime/health_snapshot.json` | optional | validator 또는 adapter가 남기는 read-only summary | placeholder allowed / not truth |
| `.omx/*` | self-hosting optional only | orchestration/runtime sidecar state | starter 기본 동작에서는 truth로 쓰지 않음 |

## Integration Boundaries
- 외부 API/서비스: Git/PR/CI/PM adapter는 optional
- 인증 경계: starter baseline은 특정 auth provider를 강제하지 않는다.
- 파일/스토리지 경계: artifact와 runtime contract가 truth이고 optional sidecar나 visibility cache는 보조 입력만 된다.
- optional observability / monitor contract: read-only only. recurrence/guardrail/evidence signal이 있어도 control plane은 생기지 않는다.
- browser validation contract: 웹앱 또는 브라우저 렌더 결과가 핵심인 scope는 browser-rendered smoke 또는 user browser raw report를 남겨 manual/environment gate를 닫고, API-only / unit-only evidence만으로는 gate를 닫지 않는다. backend-only scope는 예외다.

## Future Hook Contract

| Event | Reserved Emit Point | Phase | Notes |
|---|---|---|---|
| `task.claimed` | task 상태가 `[-]`와 lock 생성으로 전환될 때 | Phase 2+ | 이름만 예약 |
| `task.blocked` | blocker 또는 manual/environment gate가 기록될 때 | Phase 2+ | transport는 별도 |
| `handoff.recorded` | `TASK_LIST.md > Handoff Log` append 시점 | Phase 2+ | artifact truth 유지 |

## Promotion Boundary

| Capability | Default Home | Starter Default | Promotion Rule | Notes |
|---|---|---|---|---|
| optional visibility / monitor runtime | self-hosting only | No | 필요하면 별도 패키지나 root self-hosting tool로 둔다 | starter 기본 동작에 넣지 않는다 |
| `team.json` contract | root + starter | Yes | shared schema로 유지 | runtime watcher를 암시하지 않는다 |
| `governance_controls.json` contract | root + starter | Optional | `enterprise_governed` 활성 시 required | dormant placeholder 허용 |
| `enterprise_governed` pack docs | starter + reset source | Optional | `active_packs`가 켜질 때만 활성 truth로 읽는다 | core template를 무겁게 만들지 않는다 |
| `.omx/*` sidecar | self-hosting only | No | compatibility guide만 유지 | truth plane으로 승격하지 않는다 |
| rollout dry-run/reporting | self-hosting only | No | completion review 뒤 actual rollout을 열기 전 근거로 쓴다 | mutation 없는 evidence 우선 |

## Naming Conventions
- 폴더: 책임이 드러나는 이름 사용 (`enterprise_governed`, `runtime`, `artifacts`, `projection`)
- 파일: truth contract는 명시적 이름 사용 (`team.json`, `governance_controls.json`)
- 클래스/함수: `parse*`, `load*`, `build*`, `summarize*`처럼 역할이 드러나게 작성
- 상태/액션: future hook name은 `task.claimed`, `task.blocked`, `handoff.recorded`처럼 일관되게 사용

## Change Control
- 구조 변경이 필요하면 Planner가 이유와 영향 범위를 기록한다.
- 사용자 승인 후에만 이 문서를 수정한다.
- 승인 후 요구사항이 바뀌면 `REQUIREMENTS.md`와 같은 기준선으로 이 문서를 다시 확인하고, 변경이 없더라도 `Requirement Baseline`과 `Change Sync Check`를 갱신한다.
