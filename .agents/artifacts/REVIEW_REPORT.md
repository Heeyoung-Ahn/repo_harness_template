# Review Report

> Reviewer가 구조, 보안, 품질, 릴리즈 리스크를 판단하는 문서입니다.

## Quick Read
- 가장 최근 승인 상태:
- 이번 리뷰 대상 범위:
- 가장 큰 리스크:
- 즉시 재작업이 필요한 항목:
- 배포 가능 여부:
- 다음 역할이 꼭 확인할 포인트:

## Approval Status
- Status: Approved / Rework Required / Architecture Rework Required
- Reviewer:
- Reviewed At:
- Release Blocking Issues: Yes / No

## Latest Findings Summary
- [핵심 finding 1]
- [핵심 finding 2]
- [핵심 finding 3]

## Changelog
- [YYYY-MM-DD] Reviewer: initial draft

## Review Scope
- Target version / milestone:
- Reviewed Task IDs:
- Inputs used:

## Findings

| ID | Severity | Category | Description | Recommended Owner |
|---|---|---|---|---|
| REV-01 | High | Architecture / Security / Quality | [설명] | Developer / Planner |

## Architecture Checklist
- [ ] `ARCHITECTURE_GUIDE.md`의 도메인 경계를 준수한다.
- [ ] 계층 책임이 무너지지 않았다.
- [ ] 승인되지 않은 구조 예외가 없다.

## Security Checklist
- [ ] 비밀값 하드코딩이 없다.
- [ ] 민감 로그 노출이 없다.
- [ ] 사용자 데이터 처리 규칙을 위반하지 않는다.

## Quality / Release Risk
- 성능 리스크:
- 유지보수 리스크:
- 배포 차단 요소:

## Required Follow-ups
- [재작업이 필요하면 작성]

## Handoff Recommendation
- Next Agent: Developer / Planner / DevOps
- Reason:
