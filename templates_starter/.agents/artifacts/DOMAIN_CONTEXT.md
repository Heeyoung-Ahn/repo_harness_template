# Domain Context

> 핵심 도메인 용어, invariant, lifecycle, exception rule, maintenance hotspot을 정리하는 stable reference입니다.
> current task 상태와 release gate truth는 계속 기존 artifact가 소유합니다.

## Quick Read
- 목적: [프로젝트의 도메인 용어와 invariant를 빠르게 복원하는 목적 작성]
- 현재 도메인 요약: [프로젝트가 해결하는 문제와 운영 도메인 요약]
- 이 문서가 다루는 것: 용어, lifecycle, invariant, exception rule, domain hotspot.
- 이 문서가 대체하지 않는 것: current stage, active lock, blocker, release gate, raw handoff, diff log.
- 기본 update trigger: [용어/규칙/lifecycle/invariant가 바뀌는 change type]

## Usage Rules
- stable domain rule만 남긴다. current snapshot이나 task 진행 메모를 복사하지 않는다.
- 시스템 구조와 경계는 `SYSTEM_CONTEXT.md`와 `ARCHITECTURE_GUIDE.md`를 우선한다.
- decision rationale이나 대안 비교는 `DECISION_LOG.md`에 append-only로 남긴다.
- trivial mechanical edit는 여기에 기록하지 않는다.

## Domain Terms
| Term | Meaning | Notes |
|---|---|---|
| [용어] | [의미] | [비고] |

## Lifecycle and Invariants
- [핵심 workflow 또는 lifecycle]
- [깨지면 안 되는 invariant]
- [change type / review / impact / decision trigger 관련 rule]

## Exception Rules and Maintenance Hotspots
- [예외 규칙]
- [유지보수 hotspot]
