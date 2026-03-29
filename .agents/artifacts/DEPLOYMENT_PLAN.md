# Deployment Plan

> DevOps가 실제 배포를 준비하고 결과를 기록하는 문서입니다.  
> 실제 비밀값은 이 문서에 쓰지 않고, 설정 위치와 절차만 기록합니다.  
> 이 문서는 배포 직전/직후 1회 갱신하는 release 실행 문서이며, turn-by-turn handoff 기록 용도로 쓰지 않습니다.

## Update Policy
- 작업 중간 상태나 handoff 메모는 `CURRENT_STATE.md`와 `TASK_LIST.md`에서 관리합니다.
- 이 문서는 배포 직전 gate 판단과 배포 직후 결과 기록만 담당합니다.
- harness 정비나 artifact schema debt는 현재 배포를 막는 경우에만 release blocker로 올리고, 아니면 별도 follow-up으로 분리합니다.

## Quick Read
- 이번 배포 대상:
- 현재 배포 상태:
- 배포 기준 Requirement Baseline / sync gate:
- 배포 전 꼭 확인할 것:
- 남아 있는 release gate (manual / dependency / compliance):
- 실패 시 롤백 핵심 경로:
- 사용자 공지 핵심 변경 / 다음 역할 포인트:

## Release Status
- Release type: Preview / Staging / Production
- Release owner:
- Ready to Deploy: Yes / No
- Requirement Baseline for Release:
- Requirements Sync Gate: Open / Closed
- Reviewer Gate: Open / Closed
- Manual / Environment Gate: Open / Closed
- Dependency / Compliance Gate: Open / Closed
- Last Updated At: [YYYY-MM-DD HH:MM]

## Rollback Snapshot
- 롤백 조건:
- 롤백 담당자:
- 롤백 첫 단계:

## Changelog
- [YYYY-MM-DD] DevOps: initial draft

## Release Target
- Version:
- Target date:
- Release owner:

## Deployment Strategy
- Release type: Preview / Staging / Production
- Deployment target:
- Rollout strategy:

## Build Artifact Decision
- Existing build / package reusable: Yes / No / N/A
- New build / package required: Yes / No / N/A
- Basis:

## Environment Matrix

| Environment | Purpose | URL / Store / Target | Notes |
|---|---|---|---|
| Preview | [목적] | [대상] | [메모] |
| Production | [목적] | [대상] | [메모] |

## Preflight Checklist
- [ ] `REVIEW_REPORT.md` 승인 완료
- [ ] 최신 Requirement Baseline과 test / review 기준선 일치 확인
- [ ] 대상 버전과 커밋 범위 확인
- [ ] 환경 변수 / 비밀값 설정 확인
- [ ] 수동 / 실환경 검증 상태 확인
- [ ] dependency / compliance triage 확인
- [ ] 롤백 경로 확인
- [ ] 릴리즈 노트 준비

## Build and Deploy Commands
```bash
# 프로젝트 승인 배포 명령 기록
```

## Secrets / Config Notes
- 비밀값 저장 위치:
- 주입 방식:
- 금지 사항:

## Rollback Plan
- 롤백 조건:
- 롤백 방법:
- 담당자:

## Validation Gate Notes
- 요구사항 변경 반영 상태:
- 수동 / 실환경 재검증 계획:
- 운영 직후 확인할 항목:
- release-ready 차단 요소:

## Document / Harness Follow-up
- Current release blocker 여부:
- 분리한 정비 작업 / 후속 action:
- 이번 배포에서 참고만 한 debt:

## Dependency / Compliance Summary
- 감사 결과 요약:
- 대응 계획:
- closeout 전 남은 조건:

## Release Notes
- 사용자 공지용 변경 사항:

## Deployment History

| Date | Version | Commit | Environment | Result | URL / Link | Notes |
|---|---|---|---|---|---|---|
| [YYYY-MM-DD HH:MM] | [vX.X.X] | [commit] | [target] | Success / Fail | [link] | [메모] |
