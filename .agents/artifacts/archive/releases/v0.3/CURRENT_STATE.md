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
- Current Stage: Documentation and Closeout
- Current Focus: developer PC preview bring-up과 `CR-02` follow-up review를 완료했다. downstream rollout은 완성본 이후로 미뤘고, 현재 버전은 closeout 후 Hybrid Harness completion planning으로 넘어간다
- Current Release Goal: 장기 비용이 큰 운영 계약을 먼저 고정한 뒤 self-hosting 웹앱으로 프로젝트 모니터링을 구현한다
- Requirements Status: Approved
- Requirement Baseline: Scalable Governance Profiles v0.3
- Requirements Sync Check: In Sync
- Architecture Status: Approved
- Plan Status: Ready for Closeout
- Review Gate: Closed
- Manual / Environment Gate: Closed
- Dependency / Compliance Gate: Closed
- Current Green Level: Workspace
- Branch Freshness: Current on `Scalable Governance Profiles v0.3`
- Last Synced From Task / Handoff: 2026-04-07 DOC-05 closeout kickoff
- Sync Checked At: 2026-04-07
- Task List Sync Check: In Sync
- Document Health: `v0.3` planning/review/deploy sync 유지, preview evidence 기록 완료, downstream rollout deferred, version closeout ready
- Last Updated By / At: Codex / 2026-04-07 14:41

## Next Recommended Agent
- Recommended role: Planner
- Reason: current preview gate와 `CR-02` follow-up review는 닫혔고, 다음 단계는 version closeout 이후 Hybrid Harness completion draft를 여는 것이다.
- Trigger to switch: closeout reset이 끝나고 새 버전 planning artifact를 채우기 시작할 때

## Must Read Next
- 1. `.agents/artifacts/DEPLOYMENT_PLAN.md > Release Status + Deployment History`
- 2. `.agents/artifacts/REVIEW_REPORT.md > Approval Status + Evidence Used`
- 3. `.agents/artifacts/TASK_LIST.md > Current Release Target + Next Version Backlog`
- Optional follow-up: `.agents/rules/template_repo.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/artifacts/{DEPLOYMENT_PLAN.md,REVIEW_REPORT.md,CURRENT_STATE.md,TASK_LIST.md}`, `tools/project-monitor-web/{server.js,src/presentation/app.js}`, `.agents/runtime/{team.json,governance_controls.json}`, `.agents/workflows/*`
- Current locks to respect: none
- Worktree recommendation: preview는 현재 local-only로 실행 중이므로, downstream rollout이나 노출 범위 변경은 별도 turn으로 분리한다

## Task Pointers
- DEV-11~15 / TST-03~04 / REV-04: profile schema, parser contract, `Project Monitor Web` Phase 1, review closure를 완료했다.
- REL-04~05: deploy workflow/skill hardening과 downstream rollout 검증을 완료했다.
- REL-06: `package-lock.json`, audit 0 vulnerabilities, `node --test` 6 pass, loopback default bind hardening까지 완료했다.
- PLN-09 / DEV-16 / TST-05: `CR-02 Enterprise Hybrid Harness`를 planning/runtime/workflow/validator/source에 반영했다.
- REV-05 / REL-07: developer PC local-only preview와 `CR-02` follow-up review를 `v0.3` 기준으로 닫았다.

## Open Decisions / Blockers
- Release blocker: none for current self-hosting preview
- Manual / environment-specific blocker: none. first preview host는 developer PC local-only로 고정했고 smoke를 통과했다
- Dependency / compliance gate: closed. `package-lock.json`, empty npm dependency set, audit 0 vulnerabilities, loopback default bind를 확인했다
- 사용자 답변 / 확인 대기: none. downstream rollout은 완성본 이후로 미루기로 결정했다
- 기술 블로커: none
- Document / harness maintenance: current preview evidence와 review 문서는 반영했고, 다음은 archive/reset과 next-version kickoff다
- Stale lock watch: none
- Needs User Decision: none for current version

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-07 14:41
- Completed: current preview gate를 닫은 뒤 downstream rollout을 defer하기로 결정했고, `Scalable Governance Profiles v0.3`를 archive/reset 기반으로 closeout할 준비를 마쳤다.
- Next: current artifact를 archive한 뒤 reset source로 새 버전을 열고 `Hybrid Harness Completion` draft를 채운다.
- First Next Action: `.agents/artifacts/archive/releases/v0.3/` snapshot 생성 후 `.agents/scripts/reset_version_artifacts.ps1`를 실행한다.
- Notes: developer PC local preview는 closeout 시점 기준으로 종료된 상태다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.2` 승인본으로 profile/schema/parser/UI baseline과 `Project Monitor Web` Phase 1을 고정했다.
- 2026-04-06: 이후 review closure, deploy hardening, downstream rollout, dependency/compliance gate closure(`REL-06`)까지 진행했다.
- 2026-04-07: `v0.3` 기준 enterprise-governed pack, `governance_controls.json`, optional `.omx` compatibility를 template source에 반영했다.
- 2026-04-07: developer PC local-only preview bring-up과 `CR-02` follow-up review를 완료했다.
