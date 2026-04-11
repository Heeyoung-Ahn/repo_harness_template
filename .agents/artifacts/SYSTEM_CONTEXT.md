# System Context

> 시스템 책임 경계, 통합 seam, shared contract, 유지보수 hotspot을 정리하는 stable reference입니다.
> 현재 상태 truth는 계속 `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 gate artifact에 있습니다.

## Quick Read
- 목적: self-hosting template repo의 subsystem 책임, 통합 seam, shared contract, do-not-break path를 빠르게 복원한다.
- 현재 시스템 요약: document-centric governance core, optional enterprise-governed pack, separate `Project Monitor Web`, optional `.omx/*` sidecar compatibility로 구성된 local-first harness다.
- 이 문서가 다루는 것: subsystem responsibility, integration seam, shared contract, hotspot, do-not-break path.
- 이 문서가 대체하지 않는 것: current stage, active lock, blocker, release gate, raw handoff, turn-by-turn 작업 메모.
- 기본 update trigger: subsystem boundary, shared contract, integration seam, hotspot, do-not-break path가 바뀌는 feature / maintenance / refactor / architecture-change.

## Usage Rules
- stable reference로 유지한다. current snapshot이나 handoff 원문을 복사하지 않는다.
- 구조 설명은 `ARCHITECTURE_GUIDE.md`와 모순되면 안 되며, 구조 변경 시 같은 턴에 함께 갱신한다.
- domain rule이나 invariant 상세는 `DOMAIN_CONTEXT.md`에 두고, 여기에는 subsystem과 seam 중심으로만 적는다.
- decision rationale은 `DECISION_LOG.md`에 append-only로 남긴다.
- 경로 예시는 유지보수 가이드를 위한 reference일 뿐 task/lock truth를 대체하지 않는다.

## Subsystem Map
| Subsystem | Responsibility | Key Paths / Contracts | Notes |
|---|---|---|---|
| Governance Core | task, lock, gate, handoff truth 유지 | `.agents/artifacts/*`, `.agents/rules/*`, `.agents/workflows/*` | current-state truth는 계속 이 계층이 소유한다 |
| Change Governance | non-trivial change taxonomy, self-review, impact tier, decision trigger 유지 | `IMPLEMENTATION_PLAN.md > Task Packet Ledger`, review/test/release gate | `feature / bugfix / maintenance / refactor / architecture-change` baseline |
| Context Knowledge Base | 장기 유지보수 context와 decision rationale 보존 | `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md` | support artifact, current-state truth 아님 |
| Runtime / Pack Contracts | profile, pack activation, protected path, health contract 유지 | `.agents/runtime/team.json`, `.agents/runtime/governance_controls.json`, `.agents/runtime/health_snapshot.json`, `enterprise_governed/*` | optional/governed burden는 pack으로 격리한다 |
| Parser & Projection | artifact/runtime truth를 읽어 read model 생성 | `tools/project-monitor-web/src/{application,domain,infrastructure}/*` | projection은 truth를 대체하지 않는다 |
| Project Monitor Web | read-only operator workspace와 local shell convenience 제공 | `tools/project-monitor-web/*`, `project-registry.json` | `project-registry.json`과 local server stop만 예외적 local convenience다 |
| Template / Reset Source | starter generic source와 version reset source 유지 | `templates_starter/*`, `templates/version_reset/artifacts/*` | live 운영 내용이 starter/reset에 섞이면 안 된다 |

## Shared Contracts and Integration Seams
- Artifact truth seam: `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`가 운영 truth와 baseline contract를 소유한다.
- Change-governance seam: task packet의 `Primary Change Type`, `Self-Review Summary`, `Impact Tier`, `Decision Log Entry`가 implementation, test, review gate를 연결한다.
- Runtime contract seam: `team.json`과 `governance_controls.json`은 workflow/validator/PMW가 공유하는 runtime truth다.
- Template seam: `templates_starter`는 downstream starter source, `templates/version_reset/artifacts`는 version closeout reset source다. long-lived context artifact는 reset source가 아니라 live/starter source에 남긴다.
- PMW seam: parser/projection은 artifact/runtime contract를 읽고, presentation은 read-only surface만 제공한다.

## Hotspots and Do-Not-Break Paths
- `CURRENT_STATE.md`와 `TASK_LIST.md`는 current-state truth다. support artifact가 이 역할을 대체하면 안 된다.
- `REQUIREMENTS.md` / `ARCHITECTURE_GUIDE.md` / `IMPLEMENTATION_PLAN.md` 3문서 sync 계약이 깨지면 review/deploy gate가 흔들린다.
- `templates_starter`와 `templates/version_reset/artifacts`의 역할을 섞으면 starter contamination이나 reset drift가 발생한다.
- `tools/project-monitor-web`는 read-only monitor여야 하며, local convenience 범위를 넘어 artifact/governance mutation control로 확장하면 안 된다.
- validator와 reset script는 long-lived context artifact를 version reset 대상에 넣지 않아야 한다.
