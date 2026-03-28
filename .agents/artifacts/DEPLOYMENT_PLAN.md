# Deployment Plan

> DevOps가 실제 배포를 준비하고 결과를 기록하는 문서입니다.  
> 실제 비밀값은 이 문서에 쓰지 않고, 설정 위치와 절차만 기록합니다.

## Quick Read
- 이번 배포 대상:
- 현재 배포 상태:
- 배포 전 꼭 확인할 것:
- 실패 시 롤백 핵심 경로:
- 사용자 공지 핵심 변경:
- 다음 역할이 읽어야 할 포인트:

## Release Status
- Release type: Preview / Staging / Production
- Release owner:
- Ready to Deploy: Yes / No
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

## Environment Matrix

| Environment | Purpose | URL / Store / Target | Notes |
|---|---|---|---|
| Preview | [목적] | [대상] | [메모] |
| Production | [목적] | [대상] | [메모] |

## Preflight Checklist
- [ ] `REVIEW_REPORT.md` 승인 완료
- [ ] 대상 버전과 커밋 범위 확인
- [ ] 환경 변수 / 비밀값 설정 확인
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

## Release Notes
- 사용자 공지용 변경 사항:

## Deployment History

| Date | Version | Commit | Environment | Result | URL / Link | Notes |
|---|---|---|---|---|---|---|
| [YYYY-MM-DD HH:MM] | [vX.X.X] | [commit] | [target] | Success / Fail | [link] | [메모] |
