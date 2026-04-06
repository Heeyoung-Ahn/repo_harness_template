# Deployment Plan

> DevOps가 실제 배포를 준비하고 결과를 기록하는 문서입니다.  
> 실제 비밀값은 이 문서에 쓰지 않고, 설정 위치와 절차만 기록합니다.  
> 이 문서는 배포 직전/직후 1회 갱신하는 release 실행 문서이며, turn-by-turn handoff 기록 용도로 쓰지 않습니다.

## Update Policy
- 작업 중간 상태나 handoff 메모는 `CURRENT_STATE.md`와 `TASK_LIST.md`에서 관리합니다.
- 이 문서는 배포 직전 gate 판단과 배포 직후 결과 기록만 담당합니다.
- harness 정비나 artifact schema debt는 현재 배포를 막는 경우에만 release blocker로 올리고, 아니면 별도 follow-up으로 분리합니다.

## Quick Read
- 이번 배포 대상: `Project Monitor Web` self-hosting preview bring-up
- 현재 배포 상태: dependency/compliance gate는 닫혔고, concrete self-hosting target 선택 전 단계다
- 배포 기준 Requirement Baseline / sync gate: `Scalable Governance Profiles v0.2` / Closed
- 배포 전 꼭 확인할 것: 첫 internal host 선택, preview bring-up, `/api/snapshot` 및 allowed source link smoke
- 남아 있는 release gate (manual / dependency / compliance): manual/environment gate만 남아 있다
- 실패 시 롤백 핵심 경로: local Node process stop 또는 service disable 후 이전 운영 상태 유지
- 사용자 공지 핵심 변경 / 다음 역할 포인트: monitor web은 외부 npm dependency 없이 운영되며 기본 bind host가 `127.0.0.1`로 고정됐다

## Release Status
- Release type: Preview
- Release owner: DevOps
- Ready to Deploy: No
- Requirement Baseline for Release: Scalable Governance Profiles v0.2
- Requirements Sync Gate: Closed
- Reviewer Gate: Closed
- Manual / Environment Gate: Open
- Dependency / Compliance Gate: Closed
- Last Updated At: 2026-04-06 23:49

## Rollback Snapshot
- 롤백 조건: preview bring-up 이후 read-only contract 위반, host exposure 오구성, startup failure가 확인될 때
- 롤백 담당자: DevOps
- 롤백 첫 단계: 실행 중인 `node server.js` 프로세스를 중지하고 preview host 연결을 끊는다

## Changelog
- [YYYY-MM-DD] DevOps: initial draft
- [2026-04-06] DevOps: `REL-06` preflight. `package-lock.json` 생성, `npm ls --depth=0` empty, `npm audit --json` 0 vulnerabilities, `node --test` 6 pass, local server loopback default bind 적용

## Release Target
- Version: Scalable Governance Profiles
- Target date: TBD
- Release owner: DevOps

## Deployment Strategy
- Release type: Preview
- Deployment target: internal self-hosting Node host (`developer PC` / `internal VM` / `NAS` 중 최종 선택 전)
- Rollout strategy: single-host manual bring-up 후 browser smoke와 source artifact link-out 확인

## Build Artifact Decision
- Existing build / package reusable: Yes
- New build / package required: No
- Basis: plain Node server + static presentation assets이며 외부 npm runtime dependency가 없다. `package-lock.json`으로 audit 근거만 고정한다.

## Environment Matrix

| Environment | Purpose | URL / Store / Target | Notes |
|---|---|---|---|
| Preview | 첫 self-hosting bring-up 검증 | internal localhost or internal VM | `PROJECT_MONITOR_HOST` 기본값은 `127.0.0.1` |
| Production | 팀 운영용 read-only monitor | internal host TBD | public SaaS 배포는 현재 범위 밖 |

## Preflight Checklist
- [x] `REVIEW_REPORT.md` 승인 완료
- [x] 최신 Requirement Baseline과 test / review 기준선 일치 확인
- [x] 대상 버전과 커밋 범위 확인
- [x] 환경 변수 / 비밀값 설정 확인
- [ ] 수동 / 실환경 검증 상태 확인
- [x] dependency / compliance triage 확인
- [x] 롤백 경로 확인
- [x] 릴리즈 노트 준비

## Build and Deploy Commands
```bash
cd tools/project-monitor-web
npm start

# optional
# set PROJECT_MONITOR_REPO_ROOT=C:\path\to\target\repo
# set PROJECT_MONITOR_HOST=127.0.0.1
# set PORT=4173
```

## Secrets / Config Notes
- 비밀값 저장 위치: none
- 주입 방식: optional env vars (`PROJECT_MONITOR_REPO_ROOT`, `PROJECT_MONITOR_HOST`, `PORT`)
- 금지 사항: repo artifact path를 write target처럼 취급하지 않는다. secret을 문서/쿼리스트링에 넣지 않는다.

## Rollback Plan
- 롤백 조건: startup failure, read-only 경계 위반, unintended non-loopback exposure
- 롤백 방법: preview host에서 process/service stop 후 기존 artifact 운영만 유지
- 담당자: DevOps

## Validation Gate Notes
- 요구사항 변경 반영 상태: `v0.2` baseline과 review-approved scope가 sync되어 있다
- 수동 / 실환경 재검증 계획: 선택된 internal host에서 `/api/snapshot`, `/api/file?path=.agents/artifacts/CURRENT_STATE.md`, static asset load를 확인한다
- 운영 직후 확인할 항목: snapshot refresh, source artifact link-out, blocker queue 표시, bind host 노출 범위
- release-ready 차단 요소: concrete self-hosting target 미선정, preview bring-up 미실행

## Document / Harness Follow-up
- Current release blocker 여부: Yes. dependency/compliance 때문이 아니라 target selection과 manual preview gate 때문이다.
- 분리한 정비 작업 / 후속 action: 선택된 host 기준 runbook 구체화, first preview evidence 기록
- 이번 배포에서 참고만 한 debt: provider-specific hosting skill은 아직 `general_publish` fallback만 유지

## Dependency / Compliance Summary
- 감사 결과 요약: `npm ls --depth=0` 결과 직접 npm dependency는 empty였고, `package-lock.json` 생성 후 `npm audit --json`은 0 vulnerabilities를 반환했다. `npm outdated`는 변경 사항이 없었다. 런타임은 Node built-in만 사용하며 vendored package, `file:` dependency, secret config는 없다.
- 대응 계획: `package-lock.json`을 유지하고, 외부 dependency가 추가되면 동일 명령 세트를 다시 실행한다. local server는 기본적으로 `127.0.0.1`에 bind하고 `/api/file`은 allowed source path만 읽는다.
- closeout 전 남은 조건: 실제 internal host 선택, preview bring-up smoke, deployment history 기록

## Release Notes
- 사용자 공지용 변경 사항: `Project Monitor Web`는 dependency audit 근거(`package-lock.json`)를 갖춘 상태로 정리됐고, 기본 bind host가 loopback으로 고정돼 local/internal self-hosting 기본값이 더 안전해졌다.

## Deployment History

| Date | Version | Commit | Environment | Result | URL / Link | Notes |
|---|---|---|---|---|---|---|
| [YYYY-MM-DD HH:MM] | [vX.X.X] | [commit] | [target] | Success / Fail | [link] | [메모] |
