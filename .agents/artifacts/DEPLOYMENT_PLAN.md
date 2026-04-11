# Deployment Plan

> DevOps가 실제 배포를 준비하고 결과를 기록하는 문서입니다.  
> 실제 비밀값은 이 문서에 쓰지 않고, 설정 위치와 절차만 기록합니다.  
> 이 문서는 배포 직전 gate 판단과 배포 직후 결과 기록만 담당합니다.

## Update Policy
- 작업 중간 상태나 handoff 메모는 `CURRENT_STATE.md`와 `TASK_LIST.md`에서 관리합니다.
- 이 문서는 `REL-*` 판단, preview 재검증, dry-run/reporting evidence, rollout decision 기록만 담당합니다.
- harness 정비나 artifact schema debt는 현재 배포를 막는 경우에만 release blocker로 올리고, 아니면 별도 follow-up으로 분리합니다.

## Quick Read
- 이번 배포 대상: `Hybrid Harness Completion v0.1`의 self-hosting completion evidence와 local preview 재검증 결과
- 현재 배포 상태: `TST-02` local preview smoke 1차 검증은 끝났지만 user PMW browser feedback이 아직 없어 최종 closure는 보류 중이다. actual rollout은 계속 defer 상태다
- 배포 기준 Requirement Baseline / sync gate: `Hybrid Harness Completion v0.1` / Closed
- current green level / branch freshness / GitHub release gate: `Targeted` / Start of `Hybrid Harness Completion v0.1` / Open
- GitHub release path / source -> target: current version에서는 GitHub release path를 열지 않는다. `REL-03` 전까지 target branch도 고정하지 않는다
- deployment provider / selected skill: developer PC local self-hosting preview / explicit deploy skill 없음
- 배포 전 꼭 확인할 것: `127.0.0.1` loopback bind, browser-rendered preview smoke, `/api/projects` 포함 preview smoke, decision packet/history view regression, write path 부재, dry-run/reporting output
- 남아 있는 release gate (manual / dependency / compliance): manual/environment `Open`, dependency/compliance `Open`, reviewer `Open`
- 실패 시 롤백 핵심 경로: local preview 프로세스를 중지하고 downstream mutation을 전혀 만들지 않는다
- 사용자 공지 핵심 변경 / 다음 역할 포인트: current version은 rollout-ready evidence까지만 닫고 operating-project rollout은 별도 사용자 결정으로 분리한다

## Release Status
- Release type: Preview
- Release owner: Planner / DevOps
- Ready to Deploy: No
- Requirement Baseline for Release: Hybrid Harness Completion v0.1
- Requirements Sync Gate: Closed
- Reviewer Gate: Open
- GitHub Release Gate: Open
- Manual / Environment Gate: Open
- Dependency / Compliance Gate: Open
- Current Green Level: Targeted
- Branch Freshness for Release: Start of `Hybrid Harness Completion v0.1`
- Source Branch for Release: Current working branch (no release branch selected yet)
- Target Branch for Release: Not selected; rollout decision deferred until `REL-03`
- Deployment Provider: Developer PC local self-hosting preview
- Selected Deployment Skill: N/A (local preview + dry-run evidence)
- Last Updated At: 2026-04-08 13:39

## Rollback Snapshot
- 롤백 조건: preview smoke 실패, non-loopback exposure, write path 감지, dry-run이 downstream mutation을 유발하는 경우
- 롤백 담당자: current operator / DevOps
- 롤백 첫 단계: local preview 프로세스를 중지하고 evidence만 남긴 채 operating-project rollout path를 계속 닫아 둔다

## Changelog
- [2026-04-08] Planner: `PLN-04`를 반영해 completion gate와 post-completion rollout entry criteria를 live deployment 문서로 고정했다.
- [2026-04-08] Tester: `TST-02` local preview smoke를 수행해 `127.0.0.1:4173` loopback bind, static asset, browser-rendered home/workspace smoke, `/api/projects`, `/api/snapshot`, `/api/file` allow/block, decision packet/history/risk signal 노출을 확인했고 `sync_template_docs.ps1 -WhatIf`로 no-mutation dry-run 경로를 점검했다.
- [2026-04-08] Day Wrap Up: user 요청에 따라 `TST-02` 최종 closure를 보류하고 PMW browser feedback pending 상태를 manual/environment gate에 남겼다.
- [2026-04-11] Tester: `VAL-08`을 실행해 current rollout guard를 재검증했다. dry-run warning과 `BACKLOG-01` defer rationale은 계속 유효하고, actual downstream mutation은 열지 않았다.

## Release Target
- Version: Hybrid Harness Completion v0.1
- Target date: completion gate가 닫힌 뒤 `REL-03`에서 결정
- Release owner: Planner / DevOps / User decision

## GitHub Release Plan
- GitHub Release Path: `REL-03` 전까지 deferred. current version에서는 self-hosting evidence만 수집하고 target branch merge는 열지 않는다
- Source Branch for Release: Current working branch
- Target Branch for Release: Not selected
- Post-Merge Cleanup: N/A until rollout decision
- GitHub Release Gate Owner: DevOps / User

## Deployment Strategy
- Release type: Preview
- Deployment target: developer PC local loopback preview + rollout-ready dry-run/reporting evidence
- Deployment provider: local Node server on developer PC
- Preferred deployment skill: N/A (local procedure)
- Fallback When No Dedicated Skill: `tools/project-monitor-web` launcher/stop script와 manual smoke path 사용
- Rollout strategy: `REL-01` preview revalidation -> `REV-01` / `REV-02` review closure -> `REL-02` dry-run/reporting -> `REL-03` defer/enter decision. current version에서는 downstream mutation을 만들지 않는다

## Build Artifact Decision
- Existing build / package reusable: Yes
- New build / package required: No
- Basis: current PMW는 local Node server + static assets이며, current version gate는 publish artifact 생성보다 self-hosting preview 재검증과 dry-run evidence 수집이 중심이다

## Environment Matrix

| Environment | Purpose | URL / Store / Target | Notes |
|---|---|---|---|
| Preview | self-hosting completion evidence, read-only PMW regression, decision packet smoke | `http://127.0.0.1:4173` | loopback only. `PORT` override 가능하지만 public exposure는 current version 범위 밖 |
| Production | operating-project rollout | Deferred | `REL-03` user decision 전까지 열지 않음 |

## Preflight Checklist
- [ ] `REV-01`과 `REV-02`가 닫혔다
- [x] 최신 Requirement Baseline과 completion gate 문구가 requirements / implementation / deployment에 일치한다
- [ ] current green level이 `REL-03` 판단에 필요한 수준에 도달했다
- [x] branch freshness check 기준은 `Hybrid Harness Completion v0.1` draft 시작점으로 고정했다
- [ ] GitHub Release Gate를 닫아야 하는 실제 rollout path가 열렸다
- [ ] source branch merge / target push / branch cleanup가 필요한지 결정했다
- [x] deployment provider와 fallback 경로는 developer PC local preview로 확정했다
- [x] 대상 버전은 `Hybrid Harness Completion v0.1`로 고정했다
- [x] 환경 변수 / 비밀값 요구사항이 없고 allowed runtime env가 `PROJECT_MONITOR_REPO_ROOT`, `PROJECT_MONITOR_HOST`, `PORT`뿐임을 확인했다
- [ ] `TST-02`와 `REL-01` self-hosting preview 재검증을 완료했다
- [ ] browser-facing web scope의 browser-rendered smoke 또는 user browser raw report를 확보했다
- [ ] user/browser smoke와 Tester 판정이 서로 모순되지 않음을 확인했다
- [ ] `REL-02` dry-run/reporting evidence와 dependency/compliance triage를 완료했다
- [x] 롤백 경로는 local preview stop + no downstream mutation으로 고정했다
- [ ] rollout decision 입력으로 쓸 release note / summary를 준비했다

## Build and Deploy Commands
```powershell
cd "C:\Newface\30 Github\repo_harness_template\tools\project-monitor-web"
npm start

# stop local preview
.\stop-project-monitor-web.cmd

# root artifact validation
powershell -ExecutionPolicy Bypass -File ".agents\scripts\check_harness_docs.ps1"
```

## Secrets / Config Notes
- 비밀값 저장 위치: current version gate에는 별도 비밀값 없음
- 주입 방식: optional env only (`PROJECT_MONITOR_REPO_ROOT`, `PROJECT_MONITOR_HOST`, `PORT`)
- 금지 사항: non-loopback bind를 기본값으로 바꾸지 말고, secret/token을 artifact나 launcher script에 기록하지 않는다

## Rollback Plan
- 롤백 조건: preview bind/exposure가 기준을 벗어나거나 read-only boundary가 깨졌을 때, dry-run evidence가 actual mutation을 일으킬 때
- 롤백 방법: local PMW 프로세스를 중지하고, dry-run/report output만 보관한 채 rollout decision을 defer로 유지한다
- 담당자: current operator / DevOps

## Validation Gate Notes
- 요구사항 변경 반영 상태: 승인된 `CR-03`, `CR-04` baseline과 `PLN-04` completion gate 문구가 live requirements / implementation / deployment 문서에 반영됐다
- branch freshness 판단: current version은 `v0.3` archive 이후 draft에서 시작했고, actual rollout branch selection은 아직 열지 않았다
- GitHub release path 확인 결과: current version은 self-hosting evidence only다. GitHub release path는 `REL-03` user decision 전까지 deferred다
- deployment provider / skill routing 판단: current version은 local preview 절차만 사용하며, dedicated publish skill routing은 actual rollout decision 뒤에만 선택한다
- 수동 / 실환경 재검증 계획: `TST-02`는 완료됐고 developer PC loopback preview에서 static asset, `/api/projects`, `/api/snapshot`, `/api/file` allow/block, decision packet/history/risk signal을 확인했다. `REL-01`에서 같은 기준으로 self-hosting preview를 다시 검증한다
- 사용자 수동 테스트 / raw report 처리 상태: current version에서 아직 시작하지 않았다. 필요 시 `TST-02` 결과와 함께 기록한다
- 운영 직후 확인할 항목: current version에서는 actual rollout이 없으므로 N/A. 대신 dry-run/report output completeness와 defer rationale을 확인한다
- release-ready 차단 요소: `REV-01`, `REV-02`, `REL-01`, `REL-02`가 아직 open이며 `REL-03` user decision도 남아 있다
- `VAL-08` validation result: current `sync_template_docs.ps1`는 self-hosting root overwrite를 기본 차단하고 live artifact preserve를 기본값으로 두지만, selective path filter / live artifact allowlist가 아직 없어 actual rollout execution은 계속 `BACKLOG-01`로 defer한다

## Document / Harness Follow-up
- Current release blocker 여부: Yes. actual rollout은 completion gate evidence가 닫힐 때까지 의도적으로 block 상태다
- 분리한 정비 작업 / 후속 action: `TST-02` preview regression, `REV-01` / `REV-02` review closure, `REL-01` self-hosting revalidation, `REL-02` dry-run/reporting
- 이번 배포에서 참고만 한 debt: operating-project rollout execution은 current version 범위 밖이며 backlog로 남는다

## Dependency / Compliance Summary
- 감사 결과 요약: current version에서는 아직 dependency/compliance triage를 시작하지 않았다
- 대응 계획: `REL-02` evidence 단계에서 publish/deploy 영향이 있는 dependency delta가 있는지 다시 확인한다
- closeout 전 남은 조건: dependency/compliance gate를 open으로 유지한 채 `REL-02` 결과와 함께 close 여부를 판단한다

## Release Notes
- 사용자 공지용 변경 사항: current version은 PMW workspace / decision packet / project selector 구현과 self-hosting completion evidence 수집까지가 범위이며, operating-project rollout은 별도 결정으로 분리한다

## Deployment History

| Date | Version | Commit | Environment | Result | URL / Link | Notes |
|---|---|---|---|---|---|---|
