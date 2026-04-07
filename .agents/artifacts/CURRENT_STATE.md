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
- Version / Milestone: Hybrid Harness Completion
- Current Stage: Planning and Architecture
- Current Focus: revised `CR-03` draft에 deep-interview와 PMW feedback/mockup gate를 반영했고, 다음 단계로 PMW feedback을 받는다
- Current Release Goal: self-hosting 템플릿 안에서 hybrid harness를 완성하고, rollout은 completion gate가 닫힌 뒤에만 연다
- Requirements Status: Needs User Answers
- Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Check: Needs User Answers
- Architecture Status: Draft (Synced to open `CR-03`)
- Plan Status: Draft (Synced to open `CR-03`)
- Review Gate: Not Started
- Manual / Environment Gate: Not Started
- Dependency / Compliance Gate: Not Started
- Current Green Level: Targeted
- Branch Freshness: Start of `Hybrid Harness Completion v0.1`
- Last Synced From Task / Handoff: 2026-04-07 PLN-02 / PLN-05 / PLN-06 completed
- Sync Checked At: 2026-04-07 21:54
- Task List Sync Check: In Sync
- Document Health: `CR-03` draft를 PMW feedback 대기 상태로 다시 열고, deep-interview / mockup-first gate / `PROJECT_HISTORY.md`를 동기화했다
- Last Updated By / At: Codex / 2026-04-07 21:54

## Next Recommended Agent
- Recommended role: User (feedback)
- Reason: PMW feedback이 있어야 `DSG-01`과 revised `CR-03` draft를 닫을 수 있다.
- Trigger to switch: user가 current PMW feedback을 주면 Planner가 `DSG-01`, `PLN-03`, revised draft approval 정리를 이어간다.

## Must Read Next
- 1. `.agents/artifacts/REQUIREMENTS.md > Quick Read + Open Questions + Pending Change Requests`
- 2. `.agents/artifacts/UI_DESIGN.md > Current UI Scope + Must Preserve Interactions`
- 3. `.agents/artifacts/IMPLEMENTATION_PLAN.md > Current Iteration + Stage Plan`
- Optional follow-up: `.agents/rules/template_repo.md`
- Do not read by default: `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`

## Required Skills
- Rules / workflows / artifact edits: `korean-artifact-utf8-guard`

## Active Scope
- Active Task IDs: none
- Relevant paths / modules: `.agents/artifacts/{REQUIREMENTS.md,ARCHITECTURE_GUIDE.md,IMPLEMENTATION_PLAN.md,CURRENT_STATE.md,TASK_LIST.md,PROJECT_HISTORY.md,UI_DESIGN.md}`, `.agents/skills/requirements_deep_interview/*`, `tools/project-monitor-web/*`, `templates_starter/*`, `templates/version_reset/artifacts/*`
- Current locks to respect: none
- Worktree recommendation: planning sync만 진행하고 actual rollout은 completion gate 전까지 열지 않는다

## Task Pointers
- `PLN-01`: completed. `준운영 수준` completion bar와 rollout defer policy를 요구사항에 고정했다.
- `PLN-02`: completed. mandatory deep-interview와 PMW mockup-first gate를 architecture / workflow source에 동기화했다.
- `PLN-03`: PMW feedback 이후 rollout-ready completion을 위한 task packet과 acceptance gate를 implementation plan에 마저 고정한다.
- `PLN-05/06`: completed. shared `requirements_deep_interview` skill과 append-only `PROJECT_HISTORY.md` artifact를 standard source에 추가했다.

## Open Decisions / Blockers
- Release blocker: none for planning kickoff
- Manual / environment-specific blocker: none
- Dependency / compliance gate: not started for this version
- 사용자 답변 / 확인 대기: current PMW usability feedback, mockup 기대 수준, revised `CR-03` draft 재승인
- 기술 블로커: none
- Document / harness maintenance: `CR-03` sync와 shared planner skill / `PROJECT_HISTORY.md` 반영은 끝났고, 남은 것은 PMW feedback intake 이후 planning continuation이다
- Stale lock watch: none
- Needs User Decision: current PMW feedback 제공 및 revised `Hybrid Harness Completion v0.1` draft 재승인

## Latest Handoff Summary
- Handoff source: Codex / 2026-04-07 21:54
- Completed: revised `CR-03` draft를 PMW feedback 대기 상태로 다시 열고, deep-interview skill / `PROJECT_HISTORY.md` / mockup-first gate를 live artifact와 shared source에 반영했다.
- Next: user가 current PMW를 테스트하고 usability feedback을 주면 Planner가 `DSG-01`, `PLN-03`, revised draft approval을 이어간다.
- First Next Action: user가 PMW를 실행해 current 화면을 확인하고 feedback을 전달한다.
- Notes: operating-project rollout은 현재 버전 범위 밖이며 completion gate 전에는 열지 않는다.

## Recent History Summary
- 2026-04-06: `Scalable Governance Profiles v0.2`에서 profile/schema/parser/monitor Phase 1 baseline을 고정했다.
- 2026-04-07: `v0.3`에서 enterprise-governed pack, `governance_controls.json`, optional `.omx` compatibility를 standard source에 반영했다.
- 2026-04-07: developer PC preview bring-up과 `CR-02` follow-up review를 완료한 뒤 `v0.3`를 archive하고 새 버전 draft를 열었다.
- 2026-04-07: `CR-03` draft에 mandatory deep-interview, PMW feedback/mockup-first 절차, `PROJECT_HISTORY.md` artifact를 추가하고 user feedback 대기로 전환했다.
