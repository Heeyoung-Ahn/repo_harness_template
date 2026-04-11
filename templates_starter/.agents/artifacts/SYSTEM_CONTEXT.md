# System Context

> 시스템 책임 경계, 통합 seam, shared contract, 유지보수 hotspot을 정리하는 stable reference입니다.
> 현재 상태 truth는 계속 `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 gate artifact에 있습니다.

## Quick Read
- 목적: [프로젝트의 subsystem 책임과 do-not-break path를 빠르게 복원하는 목적 작성]
- 현재 시스템 요약: [프로젝트의 구조 스타일과 주요 subsystem 요약]
- 이 문서가 다루는 것: subsystem responsibility, integration seam, shared contract, hotspot, do-not-break path.
- 이 문서가 대체하지 않는 것: current stage, active lock, blocker, release gate, raw handoff, turn-by-turn 작업 메모.
- 기본 update trigger: [subsystem boundary, shared contract, integration seam, hotspot이 바뀌는 change type]

## Usage Rules
- stable reference로 유지한다. current snapshot이나 handoff 원문을 복사하지 않는다.
- 구조 설명은 `ARCHITECTURE_GUIDE.md`와 모순되면 안 되며, 구조 변경 시 같은 턴에 함께 갱신한다.
- domain rule이나 invariant 상세는 `DOMAIN_CONTEXT.md`에 두고, 여기에는 subsystem과 seam 중심으로만 적는다.
- decision rationale은 `DECISION_LOG.md`에 append-only로 남긴다.

## Subsystem Map
| Subsystem | Responsibility | Key Paths / Contracts | Notes |
|---|---|---|---|
| [서브시스템] | [책임] | [주요 경로/계약] | [주의할 점] |

## Shared Contracts and Integration Seams
- [어떤 artifact/runtime/API 경계가 shared contract인지 작성]
- [어떤 layer 또는 tool 사이 seam이 중요한지 작성]

## Hotspots and Do-Not-Break Paths
- [깨지기 쉬운 경로와 이유]
- [starter/reset split, read-only boundary, shared contract 등 유지해야 하는 경계]
