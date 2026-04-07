# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이번 문서의 핵심 목표: current `v0.3` contract와 preview evidence를 바탕으로 hybrid harness를 `준운영 수준`의 rollout-ready 완성본까지 self-hosting 템플릿 안에서 마무리한다.
- 이번 버전의 꼭 필요한 결과: ① root self-hosting hybrid runtime reference / HUD / runbook 정리 ② `enterprise_governed` activation guide + governed fixture + validator regression baseline ③ `Project Monitor Web` hybrid visibility, artifact-aware project overview, rollout readiness summary, multi-project selector 구현 ④ local preview 재검증 + review closure + actual rollout 없는 dry-run/reporting evidence ⑤ starter generic / `.omx` optional / truth boundary 유지 ⑥ mandatory deep-interview requirements discovery + mockup-first PMW intake ⑦ append-only `PROJECT_HISTORY.md` artifact 추가 ⑧ self-hosting convenience shell 관점의 icon / exit affordance 정리 ⑨ `Approval Queue -> 상세 결정 패킷` read-only view 추가
- 이번 버전에서 하지 않을 것: operating-project actual rollout, OMX truth 승격, starter 기본 orchestration 의존, write action monitor, default container/read-only sandbox, public exposure 확대, PMW usability delta를 mockup 승인 없이 바로 구현
- 사용자가 현재 턴에서 확정한 방향: completion 기준은 `local preview 재검증 + review closure + dry-run/reporting evidence`, governed 범위는 `activation guide + fixture + validator regression`, monitor 범위는 `밝은 색감 + 상단 프로젝트 요약 + 프로젝트 선택 + 좌측 메뉴 + 우측 상단 대시보드 + 우측 하단 콘텐츠 영역`을 기본으로 한다. `Project History`는 전용 조회 대상으로 두고, `tools/project-monitor-web` 아래에 launcher icon과 server stop icon을 제공하는 방향으로 승인했다. `Approval Queue -> 상세 결정 패킷`은 승인된 read-only 기준선으로 구현됐고, Planner는 요구사항 작성 전에 internalized deep-interview skill을 반드시 수행한다.
- 현재 draft 기준선과 변경 요약: `Hybrid Harness Completion v0.1` 유지. `CR-03` 승인 baseline 위에 `CR-04` decision-packet view를 승인했고, 현재 self-hosting PMW 구현까지 반영됐다.
- 현재 남아 있는 큰 질문: PMW information architecture 기준선은 닫혔고, 열린 requirement question은 없다. 다음 execution focus는 `TST-02` preview regression, `REV-01` / `REV-02` review closure, `REL-01` / `REL-02` evidence capture다.
- 다음 역할이 꼭 읽어야 할 포인트: `.agents/*`와 runtime contract가 계속 truth이며, `.omx/*`는 self-hosting optional sidecar일 뿐이다. PMW는 read-only operator workspace이고 decision packet도 여전히 Codex 밖에서 승인 action을 수행하지 않는다.

## Status
- Document Status: Approved
- Owner: Planner
- Current Requirement Baseline: Hybrid Harness Completion v0.1
- Requirements Sync Status: In Sync
- Last Requirement Change At: 2026-04-08 01:24
- Last Updated At: 2026-04-08 01:35
- Last Approved By: User (`CR-04 decision packet + PMW implementation entry`)
- Last Approved At: 2026-04-08 01:24

## Open Questions
- 현재 PMW workspace / decision packet IA 기준선에서 열린 질문 없음.

## Change Control Rules
- 승인 후에도 범위, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있으며, 이 경우 Planner가 먼저 이 문서를 갱신합니다.
- 중간 변경이 승인되면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 턴에 같은 기준선으로 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 `In Scope`, `Out of Scope`, `Functional Requirements`, `Non-Functional Requirements`, 관련 제약과 acceptance criteria를 같은 턴에 함께 갱신합니다.
- downstream 문서(`ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`)가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 handoff에 남깁니다.
- 사용자가 아직 변경을 승인하지 않았으면 `Requirements Sync Status`를 `Needs Re-Approval`로 두고 review / deploy gate를 닫지 않습니다.
- Reviewer와 DevOps는 이 문서의 최신 기준선을 먼저 확인하고, 문서 sync 누락을 코드 결함과 같은 종류의 blocker로 섞어 기록하지 않습니다.

## Changelog
- [2026-04-06] Planner: `solo/team/large` 운영 프로필과 read-only governance dashboard MVP 기준선을 `Scalable Governance Profiles v0.1`로 초안 작성
- [2026-04-06] Planner: 사용자 승인에 따라 `v0.2`에서 `Project Monitor Web`, `team.json`, parser contract, testable AC를 고정하고 open question을 모두 닫음
- [2026-04-07] Planner: `CR-02 Enterprise Hybrid Harness` 승인에 따라 `enterprise_governed` pack, `governance_controls.json`, optional `.omx` sidecar compatibility, critical-domain verification gate를 `v0.3` 기준선으로 반영
- [2026-04-07] Planner: current version closeout 후 `Hybrid Harness Completion v0.1` 초안을 열고 completion gate, governed fixture, monitor visibility, rollout defer policy를 draft 범위에 추가
- [2026-04-07] Planner: `CR-03` draft를 `준운영 수준` completion 기준으로 강화하고 `preview revalidation + review closure + dry-run/reporting evidence`를 completion evidence로 고정했다.
- [2026-04-07] Planner: `CR-03` draft를 PMW usability feedback 대기 상태로 다시 열고, mandatory deep-interview / mockup-first gate / `PROJECT_HISTORY.md` artifact를 기준선에 추가했다.
- [2026-04-08] Planner: user feedback에 따라 PMW를 `artifact-aware operator workspace`로 재정의하고, 밝은 팔레트, 상단 요약, 프로젝트 선택, 좌측 메뉴, 우측 대시보드/콘텐츠 구조를 requirements baseline에 추가했다.
- [2026-04-08] Planner: user 승인에 따라 `Project History` 전용 조회, launcher/stop icon, top-bar `Exit`, approved PMW workspace baseline을 `CR-03` 요구사항으로 확정했다.
- [2026-04-08] Planner: user 지시에 따라 `Approval Queue -> 상세 결정 패킷` view를 `CR-04` draft로 열고, monitor 안에서 의사결정 맥락을 먼저 읽는 흐름을 requirements에 추가했다.
- [2026-04-08] Developer: `CR-04` 승인 반영 후 PMW workspace, decision packet, project selector, history view, launcher/stop assets를 실제 구현에 반영했다.

## Product Goal
- 이 프로젝트가 해결하려는 문제:
  1. solo 중심 governance harness가 팀 단위 개발, 승인 체계가 강한 대규모 운영, 감사/예산/결재 같은 고위험 도메인까지 확장될 때 생기는 ownership, approval, audit trace, handoff, 동시 작업 관리 공백을 줄인다.
  2. 프로젝트 현황이 여러 markdown artifact에 분산되어 있어 전체 상태를 머릿속에서 조합해야 하는 비용을 줄인다.
  3. optional orchestration runtime을 붙이더라도 repo artifact truth와 review/test gate를 흔들리지 않게 유지한다.
- 최종 사용자: maintainer, planner, developer, tester, reviewer, devops, 팀 리드, 프로젝트 운영자, governance-heavy enterprise domain owner
- 성공 기준:
  1. 하나의 template에서 solo 경량 운영과 team/large 통제 운영을 모두 지원한다.
  2. enterprise 규율이 필요한 프로젝트는 core template를 깨지 않고 `enterprise_governed` pack만 opt-in 한다.
  3. orchestration compatibility를 도입해도 source of truth는 계속 artifact와 runtime contract에 남는다.
  4. 운영자는 `Project Monitor Web` 또는 root self-hosting HUD read-only surface에서 프로젝트명, 목표, open question, 현재 상태, 현재 작업, blocker, readiness, next action을 30초 안에 파악할 수 있다.
  5. operating-project rollout 전에 self-hosting repo 안에서 local preview 재검증, review closure, dry-run/reporting completion evidence를 재현할 수 있다.
  6. Planner는 같은 질문 체계를 반복 적용하는 discovery skill을 통해 요구사항 누락과 UI 재작업을 줄일 수 있다.
  7. 사용자 또는 운영자는 승인 요청이 생기면 PMW의 decision packet에서 이유, 추천안, 영향, 근거 문서를 먼저 읽고 Codex로 돌아와 결정을 내릴 수 있다.

## Operational Profiles

| Profile | Typical Scale | Required Operational Fields | Team Registry | Approval / Handoff Rules |
|---|---|---|---|---|
| `solo` | 1명 + AI | 추가 필수 필드 없음 | Optional | 기본 task/lock/handoff 규칙만 사용 |
| `team` | 2~8명 + AI | `owner`, `role`, `updated_at` | Required | owner 기반 handoff와 블로커/승인 큐 사용 |
| `large/governed` | 9명+ 또는 승인 체계 강한 조직 | `owner`, `role`, `updated_at`, `approval_chain`, `gate_state`, `handoff_reason` | Required | 승인 체인, gate 상태, handoff 이유를 모두 기록 |

## Optional Packs

| Pack | Eligible Profile | Required Contracts | Required Documents | Default Behavior |
|---|---|---|---|---|
| `enterprise_governed` | `large/governed` only | `team.json > active_packs`, member `approval_authority`, `.agents/runtime/governance_controls.json` | `enterprise_governed/{APPROVAL_RULE_MATRIX,AUDIT_EVENT_SPEC,BUDGET_CONTROL_RULES,ORG_ROLE_PERMISSION_MATRIX,MONTH_END_CLOSE_CHECKLIST}.md` | starter에 placeholder는 존재할 수 있지만 pack이 활성화되기 전까지 core path는 generic하게 유지 |

## Usage Scenarios

### 시나리오 1: PM이 아침에 프로젝트 상태를 확인한다
1. PM이 `Project Monitor Web`을 연다.
2. `프로젝트 보드`에서 task 상태, 담당자, 역할, scope를 한눈에 본다.
3. `블로커/승인 큐`에서 사용자 승인 대기와 manual gate 대기를 확인한다.
4. `최근 활동`에서 어제 handoff와 완료 내역을 확인한다.
5. 필요한 결정을 artifact에서 처리한 뒤 모니터를 새로고침해 반영 상태를 확인한다.

### 시나리오 2: 개발자가 작업 시작 전에 충돌 가능성을 확인한다
1. 개발자가 `팀 디렉터리`와 `프로젝트 보드`에서 자신의 책임 영역을 확인한다.
2. `Active Locks`와 최근 handoff를 보고 충돌 가능성을 판단한다.
3. enterprise pack이 활성화된 경우 `governance_controls.json`의 protected path와 human review required scope를 먼저 확인한다.
4. 충돌이 없으면 작업을 시작하고, 있으면 artifact 경로로 들어가 범위를 조정한다.

### 시나리오 3: 팀 리드가 릴리즈 준비 상태를 점검한다
1. `문서 건강` 패널에서 sync 상태, stale lock, 최신 health snapshot을 확인한다.
2. `블로커/승인 큐`에서 미해결 gate를 확인한다.
3. enterprise pack이 활성화된 승인/예산/감사 도메인에서는 mutation/property/edge-case verification과 HITL closure를 함께 본다.
4. `프로젝트 보드`와 `최근 활동`을 함께 보고 리뷰 gate 진입 가능 여부를 판단한다.

## In Scope
- `solo`, `team`, `large/governed` 운영 프로필 정의와 프로필별 필수 필드 구체화
- 공용 `task`, `lock`, `owner`, `role`, `gate`, `handoff`, `event` 개념 정규화
- `.agents/runtime/team.json` 팀 구성 계약 정의와 `active_packs` 도입
- `.agents/runtime/governance_controls.json` machine-readable governance contract 정의
- parser-friendly artifact schema와 필수 heading / field contract 정의
- 별도 웹앱인 `Project Monitor Web` Phase 1 MVP 정의
- human approval, manual gate, blocked state, handoff failure를 1급 운영 개념으로 반영
- `enterprise_governed` optional pack과 placeholder 문서 정의
- Phase 2 이후 이벤트 확장을 위한 hook point 예약
- optional `.omx/*` sidecar compatibility와 workflow mapping 정의
- generator / reviewer / verifier 분리와 skeptical evaluator gate를 critical domain 계약으로 반영
- core template와 self-hosting only 웹앱 / optional orchestration sidecar 경계 정의
- Planner용 mandatory requirements discovery skill과 artifact truth boundary 정의
- root self-hosting hybrid runtime reference / HUD / runbook 정리
- `enterprise_governed` activation guide와 governed fixture baseline + validator regression 정리
- `Project Monitor Web` hybrid visibility와 rollout readiness summary 정리
- `Project Monitor Web` usability feedback intake와 mockup-first design gate 정리
- `Project Monitor Web`의 artifact-aware project overview, workspace형 정보 구조, 단계별 기본/특성화 summary module 정의
- self-hosting local multi-project selector와 app identity / exit affordance 정의
- `Approval Queue -> 상세 결정 패킷` read-only projection과 decision context summary 정의
- append-only `PROJECT_HISTORY.md` artifact 정의
- self-hosting preview 재검증, review closure, operating-project mutation 없는 rollout-ready dry-run/reporting completion evidence 기준 정의

## Out of Scope
- 실시간 이벤트 스트리밍, WebSocket 기반 live monitor, push 알림
- artifact에 대한 write action, approval action, lock 수정 action
- starter 기본 경로에 멀티 에이전트 orchestration engine이나 agent execution control plane 강제 포함
- enterprise SSO, 완전한 RBAC, 법무 보존 정책, 외부 ITSM 연동
- 특정 AI vendor 강제 종속 구조
- `CLAUDE.md` 같은 새 top-level truth 파일 도입
- container/read-only filesystem sandbox를 starter 기본값으로 강제 적용
- approval / budget / audit 도메인 자동 merge를 human gate 없이 허용하는 정책
- current version 안에서 operating-project actual rollout 실행
- PMW usability feedback을 intake 없이 추측으로 구현하거나 mockup 승인 없이 바로 code path를 여는 것
- 긴 세로 스크롤 나열형 화면을 primary information architecture로 고정하는 것
- monitor 안에서 approval/write action을 직접 수행하게 만드는 것

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | 템플릿은 하나의 canonical source를 유지하면서 `solo`, `team`, `large/governed` 운영 프로필을 정의해야 한다. | High | ① `solo`, `team`, `large/governed`의 required field가 문서에 고정된다. ② `solo`에서는 추가 필드 없이 기존 artifact 운영이 가능하다. ③ `team`에서는 `owner`, `role`, `updated_at`이 필수다. ④ `large/governed`에서는 `approval_chain`, `gate_state`, `handoff_reason`이 추가로 필수다. |
| FR-02 | 모든 프로필은 공용 governance core schema를 공유해야 한다. | High | ① `task`, `lock`, `owner`, `role`, `gate`, `handoff`의 의미가 문서에서 일관되게 정의된다. ② 모든 프로필에서 동일한 parser가 core field를 추출할 수 있다. |
| FR-03 | 팀 구성은 `.agents/runtime/team.json`으로 선언적으로 관리해야 한다. | High | ① 파일 경로가 `.agents/runtime/team.json`으로 고정된다. ② `schema_version`, `active_profile`, `members`가 top-level 필수다. ③ 각 member의 `id`, `display_name`, `kind`, `primary_role`, `ownership_scopes`, `handoff_targets`가 필수다. ④ `active_packs`, `default_model`, `approval_authority`는 optional이지만 `enterprise_governed` pack 활성 시에는 `approval_authority`가 사실상 필수다. |
| FR-04 | `Project Monitor Web` Phase 1은 별도 웹앱으로 artifact를 읽어 다음 정보를 한 화면에 보여줘야 한다. | High | ① `프로젝트 보드` ② `블로커/승인 큐` ③ `최근 활동` ④ `문서 건강` ⑤ `팀 디렉터리`가 포함된다. ② 모든 정보는 artifact와 runtime contract를 읽어서 생성된다. ③ write path는 없다. |
| FR-05 | artifact markdown은 parser가 안정적으로 읽을 수 있는 최소 schema contract를 가져야 한다. | High | ① `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`의 필수 heading/field contract가 문서화된다. ② parser는 이 5개 파일을 Phase 1 mandatory source로 사용한다. ③ `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`는 optional source로 취급된다. |
| FR-06 | human approval과 manual/environment gate는 agent activity와 같은 수준으로 추적되어야 한다. | High | ① `사용자 결정 대기`, `manual test 대기`, `환경 gate 대기`가 artifact에 명시된다. ② 모니터가 이 상태를 별도 블로커 항목으로 표시한다. ③ handoff와 approval 관련 이유가 artifact에 남는다. |
| FR-07 | Phase 1 모니터는 정적 read-only 뷰어로 동작해야 한다. | High | ① 화면 진입 시 artifact를 다시 읽는다. ② 사용자가 수동 새로고침을 수행하면 최신 artifact를 다시 파싱한다. ③ polling, push, WebSocket은 없다. ④ 일반적인 artifact 세트에서 3초 이내에 첫 화면을 구성할 수 있어야 한다. |
| FR-08 | 향후 이벤트 기반 확장을 위한 hook point가 예약되어야 한다. | Medium | ① 구현 계획과 아키텍처에 future hook point가 명시된다. ② Phase 1에서는 event stream을 실제로 수집, 저장, 전송하지 않는다. |
| FR-09 | 구현 경로는 self-hosting only 웹앱과 downstream 공통 템플릿 경계를 보존해야 한다. | High | ① `Project Monitor Web` 코드는 starter에 포함되지 않는다. ② `team.json`, `governance_controls.json`, artifact schema contract는 starter에 반영될 수 있다. ③ 경계가 architecture/plan에 명시된다. |
| FR-10 | `enterprise_governed` optional pack은 `large/governed` 위에만 opt-in overlay로 동작해야 한다. | High | ① pack identifier는 `enterprise_governed`로 고정된다. ② `team.json > active_packs`에 pack이 명시되어야 활성화된다. ③ pack 활성 시 enterprise 문서 5종 위치가 고정된다. ④ core profile을 별도 fork하지 않고 overlay로만 동작한다. |
| FR-11 | 고위험 도메인은 `.agents/runtime/governance_controls.json`으로 protected path와 human gate를 선언해야 한다. | High | ① 파일 경로가 `.agents/runtime/governance_controls.json`으로 고정된다. ② `protected_paths`, `human_review_required_scopes`, `validator_profile`, `critical_domains`, `sandbox_policy` 필드가 문서화된다. ③ `team`에서는 optional, `large/governed + enterprise_governed`에서는 required다. |
| FR-12 | OMX 연동은 workflow compatibility로만 허용되어야 한다. | Medium | ① `Discovery -> $deep-interview`, `Planning -> $ralplan`, `parallel implementation -> $team`, `persistent completion/verification -> $ralph` 매핑이 workflow 문서에 반영된다. ② starter 기본 실행은 OMX가 없어도 동일하게 유지된다. ③ `.omx/*`가 truth로 취급되지 않는다. |
| FR-13 | critical domain에서는 generator와 reviewer/verifier lane이 분리되어야 한다. | High | ① enterprise pack이 활성화된 승인/예산/감사 도메인에서는 skeptical evaluator lane이 필수다. ② mutation/property/edge-case verification gate가 requirement trace와 연결된다. ③ auto-merge보다 HITL escalation이 기본값이다. |
| FR-14 | hybrid harness completion 버전은 root self-hosting용 runtime reference / HUD / runbook을 제공해야 한다. | High | ① `.omx/*`, runtime contract, local preview/runbook, HUD/visibility surface의 역할이 root self-hosting 기준으로 문서화된다. ② 운영자는 read-only operator surface에서 runtime/HUD summary를 바로 보고 completion 판단에 필요한 현재 상태를 확인할 수 있다. ③ optional sidecar visibility는 허용되지만 truth를 대체하지 않는다. ④ starter 기본 동작은 여전히 unchanged다. |
| FR-15 | `enterprise_governed`는 placeholder-only 상태를 넘어 rollout-ready activation guide와 governed fixture baseline을 가져야 한다. | High | ① pack activation prerequisite, `approval_authority`, `governance_controls.json`, human gate 기본값이 문서화된다. ② governed fixture가 validator/테스트에서 재현 가능하다. ③ governed fixture + validator regression이 requirement trace와 연결된다. ④ pack 미활성 상태의 core flow는 그대로 유지된다. |
| FR-16 | `Project Monitor Web`는 hybrid harness completion 판단에 필요한 read-only visibility를 제공해야 한다. | High | ① active pack, governance controls summary, optional runtime/health signal, rollout readiness summary가 read-only로 표시된다. ② 기존 board/blocker/activity/health/team 패널을 유지하고 `PROJECT_HISTORY.md`를 볼 수 있는 history view를 제공한다. ③ project overview에는 `Product Goal`, `Open Questions`, requirements / architecture / implementation summary, task progress, recent history 같은 artifact-derived summary가 포함된다. ④ write action이나 orchestration control은 추가하지 않는다. |
| FR-17 | operating-project rollout은 completion gate와 dry-run/reporting evidence가 닫히기 전까지 실행되면 안 된다. | High | ① completion gate는 `local preview 재검증 + review closure + dry-run/reporting evidence`로 정의된다. ② `IMPLEMENTATION_PLAN.md`와 `DEPLOYMENT_PLAN.md`에 gate open/closed 상태와 actual rollout defer 상태가 같은 문장으로 기록된다. ③ current version에서는 downstream mutation 없이 evidence만 남긴다. ④ rollout decision은 `REL-01`, `REV-01` / `REV-02`, `REL-02`가 모두 닫힌 뒤 `REL-03`에서 별도 결정으로만 열린다. |
| FR-18 | user-facing 또는 operator-facing UI 변경은 `requirements intake -> low-fi mockup -> user feedback -> implementation freeze` 순서를 따라야 한다. | High | ① PMW usability delta는 먼저 요구사항과 open question으로 기록된다. ② DEV implementation scope가 열리기 전에 mockup 또는 wireframe이 존재한다. ③ user feedback으로 mockup이 닫히거나 수정된다. ④ 승인된 mockup이 implementation 기준이 되며 write/control plane은 계속 out-of-scope다. |
| FR-19 | Planner는 `REQUIREMENTS.md`를 새로 쓰거나 수정하기 전에 반드시 internalized deep-interview discovery skill을 먼저 수행해야 한다. | High | ① 새 요구사항이나 change request는 goal, actor, in-scope, out-of-scope, workflow, constraint, evidence, acceptance를 다루는 structured interview로 시작한다. ② 이 skill은 OMX deep-interview 아이디어를 내부화한 shared planner skill이며 raw OMX script/runtime 의존이 아니다. ③ interview 결과는 `REQUIREMENTS.md`의 open questions, in scope, FR/NFR, acceptance로 정리되고 raw notes나 `.omx/*`는 truth가 아니다. ④ UI/operator surface가 포함되면 information hierarchy, pain point, test task를 추가로 수집한다. |
| FR-20 | 템플릿은 project-wide append-only `PROJECT_HISTORY.md` artifact를 제공해야 한다. | Medium | ① live/starter/reset source에 `PROJECT_HISTORY.md`가 존재한다. ② 문서는 현재 상태 truth를 대체하지 않고 major decision / implementation milestone / gate closure만 요약한다. ③ `day_wrap_up`과 `version_closeout`은 이 문서에 append하는 규칙을 가진다. ④ future monitor timeline source로 활용할 수 있지만 Phase 1 parser mandatory source는 아니다. |
| FR-21 | `Project Monitor Web`는 긴 세로 스크롤 대신 operator workspace형 정보 구조를 제공해야 한다. | High | ① 상단에는 프로젝트명과 목표 요약, 현재 상태 한 줄 요약, next action이 배치된다. ② 좌측 메뉴는 `Project Overview`, `Current State`, `Project Board`, `Task Detail`, `Blocker / Approval Queue`, `Recent Activity`, `Project History`, `Document Health`, `Team Registry`를 제공한다. ③ 우측 상단 주요 정보 대시보드 카드는 클릭 시 좌측 메뉴와 연동되어 우측 하단 콘텐츠 영역에 상세 내용을 표시한다. ④ `Current Stage`, `Open Tasks`, `Attention Queue`, `Refresh Snapshot` 같은 핵심 카드가 first view에 보이고, primary navigation은 긴 전체 페이지 스크롤 없이 동작한다. |
| FR-22 | self-hosting `Project Monitor Web`는 여러 로컬 프로젝트 사이를 전환할 수 있는 project selector를 제공해야 한다. | Medium | ① 상단 영역에 현재 보고 있는 프로젝트를 명시하는 selector가 있다. ② selector는 미리 구성된 로컬 프로젝트 집합 안에서 context만 전환하고 artifact를 수정하지 않는다. ③ 각 프로젝트는 동일한 read-only projection contract로 표시된다. ④ current project와 다른 project의 상태가 섞이지 않는다. |
| FR-23 | self-hosting `Project Monitor Web`는 app identity와 종료 affordance를 제공해야 한다. | Medium | ① `tools/project-monitor-web` 아래에 PMW 식별용 icon asset과 launcher entry가 존재한다. ② launcher는 local server 구동과 PMW 열기 경로를 제공한다. ③ UI 상단에는 host mode에 맞는 `Exit` 또는 `Close` affordance가 존재한다. ④ in-app `Exit`가 server process를 닫지 않는다면 `tools/project-monitor-web` 아래에 별도 stop icon/entry를 제공한다. ⑤ 모든 shell affordance는 artifact/governance write action과 혼동되지 않게 분리된다. |
| FR-24 | `Project Monitor Web`는 `Approval Queue`에서 선택한 항목에 대해 read-only `Decision Packet` view를 제공해야 한다. | High | ① packet에는 `무엇을 결정해야 하는지`, `왜 지금 필요한지`, `권장 기본안`, `선택지와 영향`, `관련 blocker/gate`, `관련 artifact/source link`, `recent history context`, `next step`이 포함된다. ② packet은 `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `PROJECT_HISTORY.md`에서 정보를 조합해 만든다. ③ packet은 content pane에서 먼저 읽고 필요 시 drawer/source link로 더 깊게 들어간다. ④ packet은 read-only이며 실제 승인 입력은 Codex 또는 기존 artifact 경로에서 처리된다. |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | Solo 운영 기본 경로는 낮은 오버헤드를 유지해야 한다. | High | ① `solo`에서는 `team.json`이 없어도 된다. ② 대시보드가 없어도 기존 artifact 운영이 유지된다. ③ `solo`에서 추가로 채워야 하는 필수 필드는 0개다. |
| NFR-02 | Team 이상 프로필에서는 추적성과 감사 가능성을 우선한다. | High | ① `team` 이상에서는 owner, role, scope, handoff trace가 누락 없이 남는다. ② `large/governed`에서는 approval chain과 gate state가 누락 없이 남는다. ③ `enterprise_governed` pack에서는 human review scope와 protected path가 누락 없이 선언된다. |
| NFR-03 | 구현은 local-first이며 특정 cloud telemetry에 의존하지 않아야 한다. | High | ① 모니터 MVP는 로컬 파일 읽기만으로 동작한다. ② 네트워크 연결 없이도 핵심 기능이 동작한다. |
| NFR-04 | parser/projection, orchestration compatibility, UI는 분리되어 교체 가능해야 한다. | High | ① shared parser/projection library가 UI layer와 분리된다. ② optional orchestration guidance를 바꿔도 parser contract는 유지된다. ③ UI 구현을 바꿔도 artifact truth는 유지된다. |
| NFR-05 | change-expensive contract는 단기 편의보다 장기 비용 절감을 우선해 초기 단계에서 고정해야 한다. | High | ① product boundary, runtime contract path, profile required fields, pack activation rule, parser source files가 이 문서에서 고정된다. ② 이후 작업은 이 계약을 임의로 우회하지 않는다. |
| NFR-06 | 대시보드는 실제 업무 판단에 필요한 정보만 보여줘야 한다. | High | ① 각 패널이 구체적인 운영 판단과 연결된다. ② 사용 가치가 없는 차트, 장식, raw log는 Phase 1에 포함되지 않는다. |
| NFR-07 | parser는 기존 운영 프로젝트 artifact에서 강건하게 동작해야 한다. | High | ① 현재 active operating projects 3곳의 artifact fixture로 parser regression을 수행한다. ② 예상치 못한 형식을 만나면 전체 중단 대신 경고와 partial parse를 제공한다. |
| NFR-08 | core template는 generic하게 유지되고 enterprise burden은 opt-in pack으로 격리되어야 한다. | High | ① starter default는 `solo` 기준으로 가볍게 유지된다. ② enterprise 문서는 dormant placeholder로 존재해도 pack이 활성화되기 전까지 필수 workflow를 무겁게 만들지 않는다. |
| NFR-09 | `.omx/*`는 auxiliary state일 뿐 repo truth를 대체할 수 없어야 한다. | High | ① `.agents/*`와 runtime contract가 계속 truth다. ② `.omx/state`, `.omx/logs`, `.omx/project-memory.json`은 read-only sidecar로만 허용된다. ③ validator/workflow는 `.omx`를 authoritative state로 다루지 않는다. |
| NFR-10 | completion 버전에서도 starter default는 generic해야 하고 rollout 전까지 operating-project mutation이 없어야 한다. | High | ① starter default는 `solo` 기준으로 유지된다. ② governed fixture와 runtime reference는 root/starter contract를 넘지 않는다. ③ current version release path에는 actual downstream mutation이 없다. ④ completion 기준은 문서-only가 아니라 preview/review/dry-run evidence contract까지 포함한다. |
| NFR-11 | completion evidence는 local-first로 반복 가능해야 한다. | High | ① validator, local preview 재검증, review closure, dry-run/reporting 근거를 네트워크 의존 없이 재현할 수 있다. ② self-hosting evidence만으로 rollout decision을 미룰 수 있다. ③ 다음 agent가 같은 repo에서 같은 근거를 다시 확인할 수 있다. |
| NFR-12 | PMW 같은 operator-facing UI 작업은 mockup-first validation으로 재작업 비용을 줄여야 한다. | High | ① usability delta는 구현 전에 mockup 단계에서 먼저 검토한다. ② user feedback이 들어오기 전에는 layout/flow를 완료처럼 고정하지 않는다. ③ mockup 승인 전에는 DEV-03 범위를 최소화한다. |
| NFR-13 | deep-interview discovery output은 advisory input이며 artifact truth를 대체할 수 없어야 한다. | High | ① discovery notes나 `.omx/*` sidecar는 승인이나 truth artifact로 간주되지 않는다. ② 최종 합의는 항상 `REQUIREMENTS.md`와 downstream synced docs에 남는다. ③ 같은 질문 체계를 반복 적용해도 결과 정리는 artifact schema에 맞춰야 한다. |
| NFR-14 | PMW 기본 시각 언어는 어두운 모니터 톤보다 밝고 읽기 쉬운 operator workspace를 우선해야 한다. | High | ① 기본 화면은 밝은 배경과 높은 가독성 대비를 사용한다. ② 상태 강조는 연한 표면 위의 신호색으로 구분한다. ③ dark-heavy palette에 의존하지 않아도 current stage, warning, blocker를 빠르게 식별할 수 있다. |
| NFR-15 | decision packet은 사용자가 여러 artifact를 직접 찾아다니지 않아도 의사결정에 필요한 핵심 맥락을 first view에서 파악하게 해야 한다. | High | ① packet first view만으로도 결정 제목, urgency, recommendation, impact, 근거 경로를 이해할 수 있다. ② 추가 문서 탐색은 선택 사항이어야 한다. ③ packet은 장식적 요약이 아니라 실제 결정에 필요한 context compression을 제공해야 한다. |

## Constraints
- 기술 제약: source of truth는 markdown artifact와 runtime contract이며, starter/reset source split과 validator 규칙을 깨지 않아야 한다.
- 운영 제약: 기본 템플릿에 watcher / scheduler / registry를 내장하지 않고, state-changing runtime은 명시적 분류 후에만 추가한다.
- 설계 제약: `Project Monitor Web`은 artifact와 runtime contract에 대해 read-only다. 정보 수정은 항상 기존 artifact 편집 경로에서 수행한다.
- shell 제약: project selector, icon, exit 같은 local shell affordance는 허용하되, artifact/governance mutation control로 확장하지 않는다.
- decision 제약: decision packet은 read-only context surface이며 approval submit, lock mutation, direct artifact edit를 포함하지 않는다.
- 설계 원칙: 단기 편의보다 장기 운영 비용 절감을 우선하며, 나중에 바꾸기 비싼 계약은 지금 더 명시적으로 고정한다.
- 일정 제약: Phase 1은 정적 모니터 MVP와 pack/runtime contract까지이며, container/read-only sandbox 실험과 이벤트 기반 확장은 Phase 2 이후로 미룬다.
- 릴리즈 제약: actual operating-project rollout은 local preview 재검증, review closure, self-hosting revalidation, dry-run/reporting gate가 모두 닫힐 때까지 미룬다.
- 프로세스 제약: PMW 같은 UI delta는 mockup 승인 전에 DEV implementation으로 직행하지 않는다.
- 정보구조 제약: PMW는 주요 결정을 위해 필요한 first-view 정보를 상단 요약/대시보드에 우선 배치하고, 상세는 선택형 콘텐츠 영역이나 drawer로 보낸다.
- 법무/보안/플랫폼 제약: 전자결재/회계/예산관리 같은 도메인으로 확장하더라도 audit trail, human approval trace, requirement trace를 손상시키면 안 된다.

## Dependencies
- 외부 서비스: 없음이 기본이며, GitHub/CI/PM 도구 연동은 optional adapter로만 고려한다.
- 내부 시스템: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/scripts/check_harness_docs.ps1`
- parser mandatory source: `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`
- parser optional source: `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`
- runtime contracts: `.agents/runtime/team.json`, `.agents/runtime/governance_controls.json`, optional `.agents/runtime/health_snapshot.json`
- optional sidecar: self-hosting only `.omx/*`
- 인증/배포/인프라 의존성: 로컬 파일 접근, validator 실행 환경, 로컬 Node backend를 가진 `Project Monitor Web`

## Assumptions
- 기본 starter profile은 `solo`로 시작하고, `team`, `large/governed`, `enterprise_governed`는 추가 규약으로 확장한다.
- `Project Monitor Web`은 root self-hosting 환경에서 먼저 검증한다.
- AI 에이전트 협업은 주로 비동기 턴제로 동작하며, Phase 1은 이 패턴을 기준으로 설계한다.
- 이벤트 기반 확장은 기존 정적 모니터를 대체하지 않고 위에 덧붙이는 방식으로 진화한다.
- rollout 전 완성본 기준을 self-hosting repo 안에서 먼저 닫고, operating-project rollout은 그 다음 단계로 연다.
- HUD는 별도 control plane이 아니라 operator visibility surface를 뜻한다.
- critical-domain urgency 표현은 requirement에서 과도하게 세분화하지 않고 review/test/deploy gate에서 구체화한다.
- mandatory deep-interview skill은 shared planner process로 쓰되, 결과 자체는 artifact sync 전까지 초안 입력일 뿐이다.

## Approved Change Log

| Change ID | Approved At | Summary | Affected Requirement IDs | Downstream Sync Needed | Sync Status |
|---|---|---|---|---|---|
| CR-01 | 2026-04-06 18:06 | `v0.2` 승인. `Project Monitor Web`, `.agents/runtime/team.json`, profile required field, parser contract, static read-only Phase 1을 고정 | FR-01~FR-09, NFR-01~NFR-07 | Architecture / Plan / Task / UI Design / Current State | In Sync |
| CR-02 | 2026-04-07 10:33 | enterprise-governed pack, `governance_controls.json`, optional `.omx` sidecar compatibility, critical-domain skeptical evaluator gate를 추가하고 starter/reset source로 확장 | FR-03, FR-09~FR-13, NFR-02, NFR-04, NFR-05, NFR-08, NFR-09 | Architecture / Plan / Task / Current State / Starter / Reset / Validator / Workflow | In Sync |
| CR-03 | 2026-04-08 00:32 | hybrid harness completion의 approved PMW workspace baseline을 확정. `Project History` 전용 조회, project selector, launcher/stop icon, top-bar `Exit`, mockup-first gate를 승인 | FR-14~FR-23, NFR-10~NFR-14 | Architecture / Plan / Task / UI Design / Current State / History | In Sync |
| CR-04 | 2026-04-08 01:24 | `Approval Queue -> 상세 결정 패킷` read-only view를 승인하고, PMW가 recommendation / impact / source link / recent context를 content pane first 구조로 제공하도록 구현 기준선과 live code를 동기화 | FR-24, NFR-15 | Architecture / Plan / Task / UI Design / Current State / History / PMW | In Sync |

## Pending Change Requests
현재 열려 있는 change request 없음.

## Approval History
- 2026-04-06 16:39 User: `one core, multiple profiles` 방향의 구현 로드맵 초안 작성을 요청
- 2026-04-06 18:06 User: product boundary, `Project Monitor Web`, `.agents/runtime/team.json`, parser 범위, profile required field를 승인
- 2026-04-07 10:33 User: `Enterprise Hybrid Harness Baseline` 계획을 승인하고 실제 템플릿 반영을 지시
- 2026-04-07 21:54 User: Planner requirements 작성 전에 internalized deep-interview를 mandatory로 두고, PMW usability 개선은 current 화면 테스트 후 `feedback -> mockup -> implementation` 순서로 닫으며 `PROJECT_HISTORY.md`를 표준 artifact로 추가하기로 했다
- 2026-04-08 00:04 User: PMW는 어두운 톤보다 밝은 operator workspace를 사용하고, 상단 프로젝트 요약 + 좌측 메뉴 + 우측 상단 주요 카드 + 우측 하단 콘텐츠 구조로 재설계하며 `Product Goal`, `Open Questions`, 최근 이력 같은 artifact-derived summary를 더 많이 노출해야 한다고 피드백했다
- 2026-04-08 00:04 User: 여러 프로젝트를 동시에 진행할 수 있으므로 PMW에서 프로젝트 선택이 가능해야 하고, 모니터 앱 아이콘과 앱 내부 종료 affordance도 필요하다고 추가 요구했다
- 2026-04-08 00:32 User: `Project History` 전용 조회, project selector, launcher icon, top-bar `Exit`, 별도 server stop icon 방향과 revised PMW wireframe / requirements 반영본을 일단 승인했다
- 2026-04-08 00:42 User: `CR-04`를 먼저 진행하고, approval 요청의 세부 맥락을 PMW 안에서 보는 `Decision Packet` 뷰를 먼저 설계하라고 지시했다
- 2026-04-08 01:24 User: `CR-04` 승인 이후 바로 진행하라고 했고, 이에 따라 PMW workspace / decision packet / history / launcher-stop 자산 구현을 진행했다
