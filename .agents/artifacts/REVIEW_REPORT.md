# Review Report

> Reviewer가 구조, 보안, 품질, 릴리즈 리스크를 판단하는 문서입니다.

## Quick Read
- 정적 코드 리뷰 상태 / 릴리즈 준비 상태:
- 이번 리뷰 대상 범위:
- 이번 리뷰 기준 Requirement Baseline / sync 결과:
- 가장 큰 리스크:
- 즉시 재작업이 필요한 항목:
- 남아 있는 release gate (manual / runtime / dependency):
- 다음 역할이 꼭 확인할 포인트:

## Approval Status
- Static Review Status: Approved / Rework Required / Architecture Rework Required
- Release Readiness: Ready / Blocked / Partial
- Requirement Baseline Reviewed:
- Requirements Sync Check: Pass / Fail / Planner Update Needed
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
- Reviewed change requests:
- Inputs used:

## Findings

| ID | Severity | Category | Description | Recommended Owner |
|---|---|---|---|---|
| REV-01 | High | Architecture / Security / Quality | [설명] | Developer / Planner |

## Residual Release Risks
- Manual / environment-specific verification:
- Dependency / compliance gate:
- Requirement / artifact sync gate:
- Deferred product decisions:

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

## Evidence Used
- 정적 검증:
- 수동 / 실환경 검증:
- dependency / compliance 근거:

## Handoff Recommendation
- Next Agent: Developer / Planner / DevOps
- Reason:
