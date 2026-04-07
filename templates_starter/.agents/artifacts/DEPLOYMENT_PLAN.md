# Deployment Plan

> DevOps가 실제 배포를 준비하고 결과를 기록하는 문서입니다.  
> 실제 비밀값은 이 문서에 쓰지 않고, 설정 위치와 절차만 기록합니다.  
> 이 문서는 배포 직전/직후 1회 갱신하는 release 실행 문서이며, turn-by-turn handoff 기록 용도로 쓰지 않습니다.

## Update Policy
- 작업 중간 상태나 handoff 메모는 `CURRENT_STATE.md`와 `TASK_LIST.md`에서 관리합니다.
- 이 문서는 배포 직전 gate 판단과 배포 직후 결과 기록만 담당합니다.
- harness 정비나 artifact schema debt는 현재 배포를 막는 경우에만 release blocker로 올리고, 아니면 별도 follow-up으로 분리합니다.
- optional runtime / visibility, `enterprise_governed`, rollout defer 같은 hybrid harness 경계는 배포 직전에 다시 확인합니다.

## Quick Read
- 이번 배포 대상:
- 현재 배포 상태:
- 배포 기준 Requirement Baseline / sync gate:
- current green level / branch freshness / GitHub release gate:
- optional runtime / visibility boundary:
- enterprise-governed / critical-domain gate:
- dry-run / reporting 상태:
- actual rollout mutation decision:
- deployment provider / selected skill:
- 배포 전 꼭 확인할 것:
- 실패 시 롤백 핵심 경로:
- 사용자 공지 핵심 변경 / 다음 역할 포인트:

## Release Status
- Release type: Preview / Staging / Production
- Release owner:
- Ready to Deploy: Yes / No
- Requirement Baseline for Release:
- Requirements Sync Gate: Open / Closed
- Reviewer Gate: Open / Closed
- GitHub Release Gate: Open / Closed
- Manual / Environment Gate: Open / Closed
- Dependency / Compliance Gate: Open / Closed
- Optional Runtime Boundary Gate: Open / Closed / Not Applicable
- Enterprise / Critical-Domain Gate: Open / Closed / Not Applicable
- Dry-Run / Reporting Gate: Open / Closed / Not Applicable
- Actual Rollout Mutation Decision: Deferred / Approved / Not Applicable
- Current Green Level:
- Branch Freshness for Release:
- Source Branch for Release:
- Target Branch for Release:
- Deployment Provider:
- Selected Deployment Skill:
- Last Updated At: [YYYY-MM-DD HH:MM]

## Rollback Snapshot
- 롤백 조건:
- 롤백 담당자:
- 롤백 첫 단계:

## Changelog
- [2026-04-07] Template Maintainer: hybrid / governed / rollout defer deployment gate baseline을 반영했다.

## Release Target
- Version:
- Target date:
- Release owner:

## GitHub Release Plan
- GitHub Release Path: Version branch -> target branch merge -> source branch delete / Main direct push
- Source Branch for Release:
- Target Branch for Release:
- Post-Merge Cleanup:
- GitHub Release Gate Owner:

## Deployment Strategy
- Release type: Preview / Staging / Production
- Deployment target:
- Deployment provider:
- Preferred deployment skill:
- Fallback When No Dedicated Skill:
- Rollout strategy:
- Dry-run / reporting strategy:
- Actual rollout mutation policy: reviewed scope와 dry-run/reporting evidence가 닫히기 전에는 defer

## Build Artifact Decision
- Existing build / package reusable: Yes / No / N/A
- New build / package required: Yes / No / N/A
- Basis:

## Environment Matrix

| Environment | Purpose | URL / Store / Target | Notes |
|---|---|---|---|
| Preview | [목적] | [대상] | optional visibility / dry-run evidence를 확인할 수 있는 환경 |
| Production | [목적] | [대상] | actual rollout mutation은 승인 후에만 수행 |

## Preflight Checklist
- [ ] `REVIEW_REPORT.md` 승인 완료
- [ ] 최신 Requirement Baseline과 test / review 기준선 일치 확인
- [ ] current green level이 release target에 도달했는지 확인
- [ ] branch freshness check를 완료하고 stale / diverged 상태를 해소
- [ ] `github_deploy`를 완료하고 GitHub Release Gate를 `Closed`로 기록
- [ ] 버전 브랜치 release라면 source branch merge / target push / branch cleanup 완료
- [ ] deployment provider와 selected deployment skill 또는 fallback 경로를 확정
- [ ] 대상 버전과 커밋 범위 확인
- [ ] 환경 변수 / 비밀값 설정 확인
- [ ] 수동 / 실환경 검증 상태 확인
- [ ] 사용자 실기기 / 브라우저 raw report와 Tester 최종 판정이 서로 모순되지 않음
- [ ] dependency / compliance triage 확인
- [ ] optional runtime / visibility가 read-only boundary를 유지하고 truth를 대체하지 않음
- [ ] `.omx/*` 또는 sidecar state가 review / test / deploy artifact gate를 대체하지 않음
- [ ] `enterprise_governed` pack이 활성화된 경우 `governance_controls.json`, protected path, HITL, critical-domain verification을 확인
- [ ] 기존 운영 프로젝트 표준화면 dry-run/reporting evidence를 남기고 actual rollout mutation decision을 문서화
- [ ] 롤백 경로 확인
- [ ] 릴리즈 노트 준비

## Build and Deploy Commands
```bash
# GitHub release finalization commands

# target deployment commands
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
- branch freshness 판단:
- GitHub release path 확인 결과:
- optional runtime / visibility boundary:
- enterprise-governed / critical-domain gate:
- deployment provider / skill routing 판단:
- dry-run / reporting status:
- actual rollout mutation decision:
- 수동 / 실환경 재검증 계획:
- 사용자 수동 테스트 / raw report 처리 상태:
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
