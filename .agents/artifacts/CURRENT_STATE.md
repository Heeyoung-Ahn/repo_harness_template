# Current State

> 모든 Agent의 기본 진입 라우터입니다.  
> `day_start`는 이 문서를 resume router로 사용하고, task / lock의 실제 기준은 항상 `TASK_LIST.md`에서 다시 확인합니다.

## Maintenance Rules
- 이 문서는 가능하면 120줄 이하, 800단어 이하로 유지합니다.
- dated `Update` 블록을 누적하지 말고, 항상 최신 snapshot 1개만 replace-in-place로 유지합니다.
- 작업 중 turn-by-turn 상태 갱신은 이 문서에서만 관리합니다.
- `TASK_LIST.md > ## Handoff Log`는 역할 전환, 세션 종료, lock handoff 때만 추가합니다.
- `REVIEW_REPORT.md`는 리뷰가 끝났을 때 1회, `DEPLOYMENT_PLAN.md`는 배포 직전/직후 1회만 갱신합니다.
- artifact harness 오류와 release blocker는 같은 것으로 취급하지 않고, 필요한 경우 별도 maintenance follow-up으로 올립니다.
- `Must Read Next`에는 지금 실제로 필요한 문서와 섹션만 적습니다.
- `Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`은 `TASK_LIST.md > Current Release Target`과 같은 값으로 유지합니다.
- 상세 문서와 요약이 충돌하면 상세 문서가 우선이며, 즉시 이 문서를 고칩니다.
- rules / workflows / artifacts를 수정했다면 handoff 전에 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"`를 실행합니다.
- 오래된 Handoff 원문은 `HANDOFF_ARCHIVE.md`로 이동하고, 여기에는 live summary만 남깁니다.
- `Latest Handoff Summary`는 최신 delta만 남기고, `Task Pointers`와 `Recent History Summary`에 같은 원문을 반복 복사하지 않습니다.
- 이 문서는 진입 라우터이며, 요구사항 / 아키텍처 / 구현 계획 / 테스트 계약 자체를 대체하지 않습니다.
- `Last Updated By / At`는 실제 마지막 갱신 주체와 시각으로 즉시 덮어씁니다.

## Snapshot
- Version / Milestone: Scalable Governance Profiles
- Current Stage: Deployment
- Current Focus: `REL-06`을 완료했고 dependency/compliance gate를 닫았다. 다음은 첫 self-hosting target을 정하고 preview bring-up을 준비하는 것이다
- Current Release Goal: 장기 비용이 큰 운영 계약을 먼저 고정한 뒤 self-hosting 별도 웹앱으로 프로젝트 모니터링을 구현한다
- Requirements Status: Approved
- Requirement Baseline: Scalable Governance Profiles v0.2
- Requirements Sync Check: In Sync
- Architecture Status: Approved
- Plan Status: Ready for Deployment Decision
- Review Gate: Approved for Reviewed Scope
- Manual / Environment Gate: Pending
- Dependency / Compliance Gate: Closed
- Last Synced From Task / Handoff: 2026-04-06 REL-06 completed
- Sync Checked At: 2026-04-06
- Task List Sync Check: In Sync
- Document Health: `v0.2` planning artifact sync 유지, `node --test` 6 pass, `npm audit --json` 0 vulnerabilities, root validator 통과, deployment prep sync 완료, mojibake 없음
- Last Updated By / At: Codex / 2026-04-06 23:49

## Next Recommended Agent
- Recommended role: DevOps
- Reason: dependency/compliance gate는 닫혔고 다음 남은 일은 concrete self-hosting target 선택과 preview bring-up이다.
- Trigger to switch: 첫 internal host 또는 preview target이 정해졌을 때

## Must Read Next
- 1. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + Validation Gates`
- 2. `.agents/artifacts/REVIEW_REPORT.md > Approval Status + Residual Release Risks`
- 3. `.agents/scripts/check_harness_docs.ps1`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/artifacts/{DEPLOYMENT_PLAN.md,IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md}`, `tools/project-monitor-web/{package.json,package-lock.json,server.js}`
- Current locks to respect: none
- Worktree recommendation: `Project Monitor Web` 구현과 starter/downstream source sync는 분리한다

## Task Pointers
- DEV-11~15 / TST-03~04 / REV-04: profile schema, parser contract, `Project Monitor Web` Phase 1, future hook reservation, reset/source sync, review closure까지 완료했다.
- REL-04: starter deploy workflow, shared deploy skill mirror, `DEPLOYMENT_PLAN` template를 GitHub release gate와 provider fallback 기준으로 보강했다.
- REL-05: `active_operating_projects` preset 대상 3개 운영 프로젝트에 동일 변경을 rollout했고 downstream validator와 file hash를 확인했다.
- REL-06: `package-lock.json`, empty npm dependency set, `npm audit --json` 0 vulnerabilities, `node --test` 6 pass, loopback default bind hardening까지 완료했다.

## Open Decisions / Blockers
- Release blocker: 첫 self-hosting target 선택과 preview bring-up evidence가 남아 있다
- Manual / environment-specific blocker: developer PC / internal VM / NAS 중 첫 preview host가 아직 고정되지 않았다
- Dependency / compliance gate: closed. `package-lock.json`, empty npm dependency set, audit 0 vulnerabilities, loopback default bind를 확인했다
- 사용자 답변 / 확인 대기: 첫 preview deployment target 선택
- 기술 블로커: none
- Document / harness maintenance: Vercel/Supabase/Oracle Cloud 전용 스킬은 실제 배포 구조 검증 전까지 만들지 않고, 그 전에는 `general_publish` fallback 계약만 유지한다
- Stale lock watch: none
- Needs User Decision: first preview deployment target (`developer PC`, `internal VM`, `NAS` 등)

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-06 23:49
- Completed: `REL-06`에서 `package-lock.json`, empty npm dependency set, audit 0 vulnerabilities, test pass, loopback default bind hardening, deployment-prep artifact sync를 완료했다.
- Next: DevOps가 첫 self-hosting target을 정하고 preview bring-up evidence를 쌓는다.
- Notes: dependency/compliance gate는 닫혔지만 실제 deployment target 결정 전까지 `Ready to Deploy`는 열지 않는다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.2` 승인본으로 profile/schema/parser/UI baseline과 `Project Monitor Web` Phase 1을 고정했다.
- 2026-04-06: 이후 review closure, deploy workflow hardening, downstream rollout, dependency/compliance gate closure(`REL-06`)까지 진행했다.
