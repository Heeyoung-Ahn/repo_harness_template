# Architecture Guide

> 이 문서는 DDD-first 구조 계약서입니다.  
> Developer, Tester, Reviewer, DevOps는 이 문서를 기준으로 작업하며, 임의 구조 변경은 금지됩니다.

## Quick Read
- 현재 승인된 아키텍처 스타일: document-centric governance core + profile contract + separate `Project Monitor Web`
- 현재 반영된 Requirement Baseline / 변경 영향: `Scalable Governance Profiles v0.2` 승인본에 맞춰 `team.json`, parser contract, web product boundary를 고정했다.
- 핵심 도메인 경계: Governance Core / Profile Contract / Parser & Projection / Project Monitor Web / Integration Adapters
- 이번 범위에서 건드리는 폴더/모듈: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/runtime/team.json`, `tools/project-monitor-web/*`, starter profile/schema source
- 상태와 데이터의 주인: artifact와 `team.json`이 truth를 유지하고, monitor는 파생 projection만 가진다.
- 다음 역할이 꼭 지켜야 할 구조 규칙: web app은 read-only이며 Phase 1에서 validator 실행기나 write surface를 갖지 않는다.
- 이번 문서의 리뷰 포인트: parser contract의 안정성, reserved hook name, optional health snapshot contract, product boundary, starter 반영 범위

## Status
- Document Status: Approved
- Owner: Planner
- Requirement Baseline: Scalable Governance Profiles v0.2
- Change Sync Check: Synced
- Last Requirement Sync At: 2026-04-06 18:06
- Last Updated At: 2026-04-06 22:44
- Last Approved By: User
- Last Approved At: 2026-04-06 18:06

## Approved Boundaries
- 도메인 경계:
  Governance Core는 artifact truth와 운영 규칙을 담당한다.
  Profile Contract는 `solo`, `team`, `large/governed` required field와 `team.json` contract를 담당한다.
  Parser & Projection은 artifact와 `team.json`을 읽어 read model을 만든다.
  Project Monitor Web은 parser/projection 결과를 웹 UI로 보여주는 self-hosting only 도구다.
  Integration Adapters는 future Git/PR/CI/health snapshot/event hook을 optional로 연결한다.
- 계층 책임 경계:
  Governance Core가 task/lock/gate/handoff truth를 소유한다.
  `team.json`은 팀 디렉터리 truth를 소유한다.
  Parser & Projection은 truth를 읽어 파생 state만 계산한다.
  Project Monitor Web은 UI와 수동 새로고침만 제공한다.
- 승인된 예외:
  `Project Monitor Web`은 root self-hosting 전용으로 둘 수 있다.
  starter/downstream에는 팀 구성 계약과 parser-friendly schema만 승격할 수 있다.

## Forbidden Changes
- 승인 없이 추가하면 안 되는 폴더/레이어:
  starter 기본 source에 `Project Monitor Web`, watcher, scheduler, registry, agent control plane을 추가하지 않는다.
- 금지된 직접 참조:
  web UI가 artifact truth를 직접 수정하는 write path
  Phase 1 web app이 validator를 직접 실행하고 그 결과를 truth처럼 저장하는 경로
  profile-specific field를 core schema와 별도 비공식 파일에 분산 저장하는 구조
- 금지된 구조 우회:
  source of truth를 markdown artifact 밖의 임의 DB나 UI state로 이전하는 구조
  self-hosting 전용 tool을 starter/downstream 기본 동작으로 몰래 확장하는 구조

## Changelog
- [2026-04-06] Developer: reserved future hook contract, optional `health_snapshot.json` contract, self-hosting/downstream promotion boundary를 아키텍처 정본에 추가했다.
- [2026-04-06] Planner: `Scalable Governance Profiles v0.1` 기준으로 core/profile/observability/integration 경계를 초안 작성
- [2026-04-06] Planner: `v0.2` 승인에 따라 `team.json`, parser contract, `Project Monitor Web` product boundary를 아키텍처 정본으로 고정

## Requirement Change Sync

| Change ID | Architecture Impact | Updated Sections | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | Boundary Update | Approved Boundaries / Domain Map / Folder Structure / Artifact Parser Contract / Team Registry Contract | Synced | web app 분리, team registry 경로, parser mandatory source를 고정 |

## Architecture Summary
- 아키텍처 스타일: truth layer와 projection layer를 분리한 local-first layered architecture
- 주요 도메인: Governance Core, Profile Contract, Parser & Projection, Project Monitor Web, Integration Adapters
- 핵심 설계 원칙:
  source of truth는 artifact와 `team.json`이 유지한다.
  change-expensive contract는 초기 단계에서 명시적으로 고정한다.
  monitor는 read-only 정적 뷰어로 시작한다.
  human approval과 manual gate는 agent activity와 동등한 운영 개념이다.

## Domain Map

| Domain | Responsibility | Key Entities / Use Cases | Notes |
|---|---|---|---|
| Governance Core | 문서 기반 운영 truth 유지 | Task, Lock, Handoff, Gate, Requirement Baseline, Stage | `.agents/artifacts/*`, `.agents/rules/*` 중심 |
| Profile Contract | 프로필별 의무 필드와 팀 계약 유지 | Solo profile, Team profile, Large/Governed profile, Team Registry | `team.json`과 profile required field를 고정 |
| Parser & Projection | mandatory source를 읽어 read model 생성 | Task projection, Blocker queue, Recent activity, Health projection, Team directory projection | UI와 분리된 shared library |
| Project Monitor Web | read-only 웹 UI 제공 | Dashboard panels, manual refresh, filter, detail drill-down | `tools/project-monitor-web/*` |
| Integration Adapters | optional 주변 정보 연결 | Git, PR, CI, future health snapshot, future event hook | Phase 1에서는 optional/reserved only |

## Folder Structure
```text
.agents/
  artifacts/
  rules/
  runtime/
    team.json
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
    rules/
    runtime/
  templates/
    version_reset/
```

## Layer Responsibilities
- `domain/`: `task`, `lock`, `handoff`, `gate`, `profile`, `team member`, `health snapshot` 개념과 불변식
- `application/`: artifact parsing, projection assembly, profile validation, health aggregation, manual refresh orchestration
- `infrastructure/`: file system read, JSON parse, optional health snapshot read, local HTTP server
- `presentation/`: single-screen dashboard UI, filters, panel layout, artifact link-out

## Dependency Rules
- domain은 application/presentation/infrastructure를 모른다.
- application은 domain을 사용하며 parser/projection use case를 조합한다.
- infrastructure는 파일 읽기, JSON 읽기, 로컬 HTTP 제공을 구현한다.
- presentation은 application이 만든 projection을 렌더링하고 직접 비즈니스 규칙을 가지지 않는다.
- Governance Core와 Team Registry truth는 parser/projection보다 상위다.
- UI layer는 parser contract를 우회해서 직접 markdown을 해석하지 않는다.

## Artifact Parser Contract

| File | Phase 1 Role | Required Sections / Fields | Notes |
|---|---|---|---|
| `CURRENT_STATE.md` | Mandatory | `Snapshot`, `Open Decisions / Blockers`, `Latest Handoff Summary` | health/status와 blocker source |
| `TASK_LIST.md` | Mandatory | `Current Release Target`, `Active Locks`, workflow task rows, `Handoff Log` | board / activity / lock source |
| `REQUIREMENTS.md` | Mandatory | `Status`, `Operational Profiles`, `Functional Requirements`, `Non-Functional Requirements` | profile contract source |
| `ARCHITECTURE_GUIDE.md` | Mandatory | `Status`, `Domain Map`, `Artifact Parser Contract`, `Team Registry Contract`, `Future Hook Contract`, `Promotion Boundary` | architecture and parser contract reference |
| `IMPLEMENTATION_PLAN.md` | Mandatory | `Status`, `Current Iteration`, `Requirement Trace`, `Iteration Plan`, `Validation Gates` | execution context source |
| `REVIEW_REPORT.md` | Optional | review gate summary | release-stage optional source |
| `DEPLOYMENT_PLAN.md` | Optional | deployment gate summary | release-stage optional source |

## Team Registry Contract

| Field | Required In | Meaning |
|---|---|---|
| `id` | all rows | stable owner identifier |
| `display_name` | all rows | 화면 표시용 이름 |
| `kind` | all rows | `human` 또는 `ai` |
| `primary_role` | all rows | 기본 역할 |
| `ownership_scopes` | all rows | 책임 범위 목록 |
| `handoff_targets` | all rows | 기본 handoff 대상 목록 |
| `default_model` | optional | 기본 AI 모델 메타데이터 |
| `approval_authority` | optional | 승인 권한 범위 |

## Optional Runtime Contract

| File | Required In | Meaning | Phase 1 Behavior |
|---|---|---|---|
| `health_snapshot.json` | optional in root/starter runtime | validator, adapter, CI가 남기는 read-only health summary | placeholder 허용, monitor는 읽을 수 있지만 truth를 대체하지 않는다 |

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
| `Project Monitor Web` runtime | root self-hosting only | No | `REV-03` 이후 optional package로 추출 검토 가능 | starter 기본 동작으로 넣지 않는다 |
| `team.json` contract | root + starter | Yes | 이미 shared schema로 유지 | runtime watcher를 암시하지 않는다 |
| `health_snapshot.json` contract | root + starter | Optional | validator/adapter/CI가 실제 snapshot을 emit할 때 사용 | placeholder file만 허용한다 |
| event hook transport | root experiment 또는 adapter package | No | event producer shape가 안정화된 뒤 별도 설계 | Phase 1은 이름 예약만 수행한다 |

## State and Data Ownership
- 전역 상태: `.agents/artifacts/*.md`와 `.agents/rules/*`가 운영 truth를 가진다.
- 팀 구성 상태: `.agents/runtime/team.json`이 team/large 프로필의 team truth를 가진다.
- 로컬 UI 상태: 필터, 선택된 패널, 정렬, 검색, 마지막 수동 새로고침 시각만 가진다.
- 영속 저장소: Phase 1은 추가 DB를 요구하지 않는다. future health snapshot 또는 event store는 별도 저장소로 분리한다.
- 캐시 전략: projection cache는 재생성 가능해야 하고 truth보다 우선할 수 없다.

## Integration Boundaries
- 외부 API/서비스: 선택적 GitHub/CI/PM adapter, future enterprise system adapter
- 인증 경계: Phase 1은 로컬 self-hosting 사용을 전제로 하며 특정 auth provider를 강제하지 않는다.
- 파일/스토리지 경계: Phase 1 web app은 artifact와 `team.json`, optional `health_snapshot.json`을 읽을 수 있지만 validator나 write action은 실행하지 않는다.
- 이벤트 경계: Phase 1은 reserved hook name만 고정하고, queue/websocket/registry/presence transport는 추가하지 않는다.

## Naming Conventions
- 폴더: `core`, `profiles`, `projection`, `adapters`, `presentation`처럼 책임이 드러나는 이름 사용
- 파일: parser contract와 team registry 계약은 목적이 드러나는 명명 사용
- 클래스/함수: `parseCurrentState`, `buildBoardProjection`, `loadTeamRegistry`, `buildHealthPanelProjection`처럼 동작을 드러내는 이름 사용
- 상태/액션: future hook name은 `task.claimed`, `task.blocked`, `handoff.recorded`, `gate.awaiting_human`, `task.completed`처럼 일관되게 사용

## Change Control
- 구조 변경이 필요하면 Planner가 이유와 영향 범위를 기록한다.
- 사용자 승인 후에만 이 문서를 수정한다.
- 승인 후 요구사항이 바뀌면 `REQUIREMENTS.md`와 같은 기준선으로 이 문서를 다시 확인하고, 변경이 없더라도 `Requirement Baseline`과 `Change Sync Check`를 갱신한다.
