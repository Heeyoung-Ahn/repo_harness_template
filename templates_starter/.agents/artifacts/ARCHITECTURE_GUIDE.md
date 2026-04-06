# Architecture Guide

> 이 문서는 DDD-first 구조 계약서입니다.  
> Developer, Tester, Reviewer, DevOps는 이 문서를 기준으로 작업하며, 임의 구조 변경은 금지됩니다.

## Quick Read
- 현재 승인된 아키텍처 스타일:
- 현재 반영된 Requirement Baseline / 변경 영향:
- 핵심 도메인 경계:
- 이번 범위에서 건드리는 폴더/모듈:
- 상태와 데이터의 주인:
- 다음 역할이 꼭 지켜야 할 구조 규칙:
- 이번 문서의 리뷰 포인트:

## Status
- Document Status: Draft / Ready for Approval / Approved
- Owner: Planner
- Requirement Baseline:
- Change Sync Check: Synced / No Architecture Change / Update Needed
- Last Requirement Sync At: [YYYY-MM-DD HH:MM]
- Last Updated At: [YYYY-MM-DD HH:MM]
- Last Approved By: [User]
- Last Approved At: [YYYY-MM-DD HH:MM]

## Approved Boundaries
- 도메인 경계:
- 계층 책임 경계:
- 승인된 예외:
- optional self-hosting tool / starter 공통 계약 경계:

## Forbidden Changes
- 승인 없이 추가하면 안 되는 폴더/레이어:
- 금지된 직접 참조:
- 금지된 구조 우회:

## Changelog
- [YYYY-MM-DD] Planner: initial draft

## Requirement Change Sync

| Change ID | Architecture Impact | Updated Sections | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | None / Boundary Update / Layer Rule Update | [Approved Boundaries / Forbidden Changes / Domain Map] | Synced / No Architecture Change / Update Needed | [메모] |

## Architecture Summary
- 아키텍처 스타일:
- 주요 도메인:
- 핵심 설계 원칙:

## Domain Map

| Domain | Responsibility | Key Entities / Use Cases | Notes |
|---|---|---|---|
| [DomainA] | [책임] | [핵심 개념] | [메모] |
| [DomainB] | [책임] | [핵심 개념] | [메모] |

## Folder Structure
```text
src/
  [domain-a]/
    application/
    domain/
    infrastructure/
    presentation/
  [domain-b]/
    application/
    domain/
    infrastructure/
    presentation/
```

## Layer Responsibilities
- `domain/`: 엔티티, 값 객체, 도메인 규칙
- `application/`: 유스케이스, 오케스트레이션, 서비스 인터페이스
- `infrastructure/`: 외부 API, DB, 파일시스템, 네트워크 구현
- `presentation/`: UI, route, controller, screen, component

## Dependency Rules
- domain은 application/presentation/infrastructure를 모른다.
- application은 domain을 사용하며, 구체 구현보다 추상 계약에 의존한다.
- infrastructure는 application/domain 계약을 구현한다.
- presentation은 application을 호출하고, 직접 비즈니스 규칙을 가지지 않는다.

## State and Data Ownership
- 전역 상태:
- 로컬 UI 상태:
- 영속 저장소:
- 캐시 전략:

## Optional Runtime Contracts

| File | Required In | Meaning | Phase Behavior |
|---|---|---|---|
| [예: `.agents/runtime/health_snapshot.json`] | optional / team / large | [validator 또는 adapter가 남기는 read-only summary] | [placeholder only / emitted by adapter / not used] |

## Integration Boundaries
- 외부 API/서비스:
- 인증 경계:
- 파일/스토리지 경계:
- optional observability / monitor contract:

## Future Hook Contract

| Event | Reserved Emit Point | Phase | Notes |
|---|---|---|---|
| [예: `task.claimed`] | [emit point] | [Phase 2+] | [예약만 / transport 제외] |

## Promotion Boundary

| Capability | Default Home | Starter Default | Promotion Rule | Notes |
|---|---|---|---|---|
| [예: local monitor runtime] | [root self-hosting only / adapter package / starter] | [Yes / No / Optional] | [언제 승격 가능한지] | [메모] |

## Naming Conventions
- 폴더:
- 파일:
- 클래스/함수:
- 상태/액션:

## Change Control
- 구조 변경이 필요하면 Planner가 이유와 영향 범위를 기록한다.
- 사용자 승인 후에만 이 문서를 수정한다.
- 승인 후 요구사항이 바뀌면 `REQUIREMENTS.md`와 같은 기준선으로 이 문서를 다시 확인하고, 변경이 없더라도 `Requirement Baseline`과 `Change Sync Check`를 갱신한다.
