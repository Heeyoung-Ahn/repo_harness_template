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
- Current Stage: Development and Test Loop
- Current Focus: `Project Monitor Web` Phase 1 contract/구현과 회귀 검증을 닫았고 다음은 future hook reservation, health snapshot contract, self-hosting/downstream promotion boundary를 정리한다
- Current Release Goal: 장기 비용이 큰 운영 계약을 먼저 고정한 뒤 self-hosting 별도 웹앱으로 프로젝트 모니터링을 구현한다
- Requirements Status: Approved
- Requirement Baseline: Scalable Governance Profiles v0.2
- Requirements Sync Check: In Sync
- Architecture Status: Approved
- Plan Status: Ready for Execution
- Review Gate: Pending
- Manual / Environment Gate: Pending
- Dependency / Compliance Gate: Pending
- Last Synced From Task / Handoff: 2026-04-06 DEV-11 + DEV-12 + TST-03 + TST-04 completed
- Sync Checked At: 2026-04-06
- Task List Sync Check: In Sync
- Document Health: `v0.2` planning artifact sync 유지, monitor parser/unit/http smoke 통과, root validator 통과, mojibake 없음
- Last Updated By / At: Developer Agent / 2026-04-06 19:05

## Next Recommended Agent
- Recommended role: Developer
- Reason: `DEV-11`, `DEV-12`, `TST-03`, `TST-04`가 닫혔고 다음 묶음은 future hook reservation과 promotion boundary 정리다.
- Trigger to switch: `DEV-13`, `DEV-14`, `REV-03` 착수, self-hosting only 승격 규칙과 reserved hook contract 문서화

## Must Read Next
- 1. `TASK_LIST.md > Current Release Target + Iteration 3 task row`
- 2. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration`, `.agents/rules/template_repo.md`
- 3. `.agents/scripts/check_harness_docs.ps1`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/runtime/team.json`, `templates_starter/.agents/runtime/team.json`, `tools/project-monitor-web/*`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`
- Current locks to respect: none
- Worktree recommendation: `Project Monitor Web`은 root self-hosting worktree에서 구현하고 starter/downstream source sync 작업과 섞지 않는다

## Task Pointers
- DEV-11 / DEV-12: `.agents/runtime/team.json`, starter defaults, parser/projection, `Project Monitor Web` Phase 1 MVP, read-only HTTP 경계를 구현 완료했다.
- TST-03 / TST-04: parser/team registry/read-only regression과 로컬 HTTP smoke를 통과했다.
- DEV-13 / DEV-14 / REV-03: 다음 묶음은 future hook, health snapshot, promotion boundary, source-of-truth review다.

## Open Decisions / Blockers
- Release blocker: none
- Manual / environment-specific blocker: none
- Dependency / compliance gate: none
- 사용자 답변 / 확인 대기: none
- 기술 블로커: none
- Document / harness maintenance: `Project Monitor Web`은 downstream 공통 기능으로 승격되기 전까지 root self-hosting 도구로 유지한다
- Stale lock watch: none
- Needs User Decision: none

## Latest Handoff Summary
- Handoff source: Developer Agent / 2026-04-06 18:55
- Completed: `.agents/runtime/team.json`과 starter 기본값, mandatory source parser/projection, `Project Monitor Web` Phase 1 MVP, read-only HTTP 경계, 회귀 테스트를 구현했다.
- Next: `DEV-13`, `DEV-14`, `REV-03`에서 reserved hook contract, health snapshot, self-hosting/downstream promotion boundary, source-of-truth 리뷰를 진행한다.
- Notes: monitor는 여전히 read-only 정적 뷰어이며, owner filtering은 `team.json` member id 기준으로 정규화된다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.1` planning baseline을 작성하고 `solo/team/large` 프로필과 read-only dashboard MVP 로드맵을 정의했다.
- 2026-04-06: `Scalable Governance Profiles v0.2` 승인본으로 `Project Monitor Web`, `team.json`, parser contract, UI 설계를 고정했다.
- 2026-04-06: `DEV-11`, `DEV-12`, `TST-03`, `TST-04`를 완료하고 `Project Monitor Web` Phase 1 MVP, team registry, parser contract, read-only server/test 경계를 구현했다.
