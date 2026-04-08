# Architecture Guide

> 이 문서는 구조 계약서입니다.  
> Developer, Tester, Reviewer, DevOps는 이 문서를 기준으로 작업하며, 임의 구조 변경은 금지됩니다.

## Quick Read
- 현재 아키텍처 스타일: `[예: layered / modular monolith / service-oriented / client-server]`
- 현재 반영된 baseline: `[현재 승인된 기준선]`
- 핵심 도메인 경계: `[도메인 1] / [도메인 2] / [도메인 3]`
- 이번 문서에서 기본으로 포함되는 것: 도메인 경계, 계층 책임, dependency 규칙, 외부 연동 경계
- 상태와 데이터의 주인: `[어떤 문서/모듈/저장소가 truth인지]`
- 다음 역할이 꼭 지켜야 할 구조 규칙: `[지키지 않으면 안 되는 핵심 규칙]`
- 이번 문서의 리뷰 포인트: `[리뷰에서 집중할 구조 리스크]`

## Status
- Document Status: Draft / Ready for Approval / Approved
- Owner: Planner
- Requirement Baseline: `[현재 승인된 기준선]`
- Change Sync Check: Synced / No Architecture Change / Pending Requirement Approval / Planner Update Needed
- Last Requirement Sync At: [YYYY-MM-DD HH:MM]
- Last Updated At: [YYYY-MM-DD HH:MM]
- Last Approved By: [승인자]
- Last Approved At: [YYYY-MM-DD HH:MM]

## Approved Boundaries
- 도메인 경계:
  `[도메인 A]`는 `[책임]`을 담당한다.
  `[도메인 B]`는 `[책임]`을 담당한다.
  `[도메인 C]`는 `[책임]`을 담당한다.
- 계층 책임 경계:
  `[truth layer 또는 core layer]`가 `[핵심 책임]`을 소유한다.
  `[application/service layer]`가 `[유스케이스]`를 담당한다.
  `[presentation/integration layer]`는 `[표현/연동 책임]`만 가진다.
- 승인된 예외:
  `[필요 시 허용하는 예외]`
- 공통 계약 경계:
  `[공통 계약 또는 external contract]`

## Forbidden Changes
- 승인 없이 추가하면 안 되는 폴더/레이어:
  `[금지된 폴더/레이어]`
- 금지된 직접 참조:
  `[금지된 의존 또는 접근 경로]`
- 금지된 구조 우회:
  `[우회하면 안 되는 구조]`

## Changelog
- [YYYY-MM-DD] Planner: initial draft

## Requirement Change Sync

| Change ID | Architecture Impact | Updated Sections | Sync Status | Notes |
|---|---|---|---|---|
| CR-01 | Boundary Update / No Architecture Change | [갱신한 섹션] | Synced / Pending Requirement Approval / Pending | [메모] |

## Architecture Summary
- 아키텍처 스타일: `[요약]`
- 주요 도메인: `[도메인 목록]`
- 핵심 설계 원칙:
  `[원칙 1]`
  `[원칙 2]`
  `[원칙 3]`

## Domain Map

| Domain | Responsibility | Key Entities / Use Cases | Notes |
|---|---|---|---|
| [DomainA] | [책임] | [핵심 엔티티/유스케이스] | [메모] |
| [DomainB] | [책임] | [핵심 엔티티/유스케이스] | [메모] |

## Folder Structure
```text
src/
  domain/
  application/
  infrastructure/
  presentation/
```

## Layer Responsibilities
- `domain/`: [도메인 규칙]
- `application/`: [유스케이스]
- `infrastructure/`: [입출력/연동]
- `presentation/`: [UI/API/CLI 등 표현 계층]

## Dependency Rules
- domain은 상위 계층 세부 구현을 모른다.
- application은 domain을 사용하며, 구체 구현보다 추상 계약에 의존한다.
- infrastructure는 application/domain 계약을 구현한다.
- presentation은 application을 호출하고, 직접 핵심 비즈니스 규칙을 가지지 않는다.

## Integration Boundaries
- 외부 API/서비스: `[연동 범위]`
- 인증 경계: `[인증/권한 경계]`
- 파일/스토리지 경계: `[저장소/파일 경계]`
- 비동기/배치/관측 경계: `[필요 시 적는다]`

## Naming Conventions
- 폴더: 책임이 드러나는 이름 사용
- 파일: contract/adapter/handler 등 역할이 드러나는 이름 사용
- 클래스/함수: `parse*`, `load*`, `build*`, `summarize*`처럼 역할이 드러나게 작성
- 상태/액션: 이벤트/상태 이름은 일관된 규칙으로 유지

## Change Control
- 구조 변경이 필요하면 Planner가 이유와 영향 범위를 기록한다.
- 사용자 승인 후에만 이 문서를 수정한다.
- `REQUIREMENTS.md`가 아직 `Draft`, `Needs User Answers`, `Ready for Approval`이면 이 문서는 새 기준선으로 sync하지 않고 `Change Sync Check`를 `Pending Requirement Approval`로 둔다.
- 승인 후 요구사항이 바뀌면 `REQUIREMENTS.md`와 같은 기준선으로 이 문서를 다시 확인하고, 변경이 없더라도 `Requirement Baseline`과 `Change Sync Check`를 갱신한다.
