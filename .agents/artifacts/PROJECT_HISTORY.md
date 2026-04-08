# Project History

> 프로젝트 전 기간의 주요 결정, 구현 마일스톤, 범위 변경을 append-only로 남기는 장기 이력 문서입니다.
> 현재 상태 truth는 계속 `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 artifact에 있습니다.

## Quick Read
- 목적: 프로젝트의 큰 방향 전환, 승인, 구현 마일스톤, review/deploy/closeout 결과를 시간순으로 추적한다.
- 이 문서가 다루는 것: 주요 의사결정, 기준선 변경, 구현 완료, gate closure, 다음 버전으로 넘긴 핵심 이유.
- 이 문서가 대체하지 않는 것: current task/lock truth, raw handoff, turn-by-turn 작업 메모, 세부 diff log.
- 기본 update trigger: major `CR-*` 승인/변경, day wrap up, version closeout, review/deploy closure.
- future use: `Project Monitor Web` timeline 또는 recent history source 후보로 활용할 수 있다.

## Usage Rules
- append-only로 유지한다. 기존 항목을 지우지 말고, 정정이 필요하면 새 항목으로 남긴다.
- 사소한 편집 로그 대신 사건 중심으로 기록한다.
- 각 항목은 `무슨 결정/진척이 있었는지`, `왜 중요한지`, `무엇이 바뀌는지`를 짧게 남긴다.
- 현재 상태 판단은 항상 관련 live artifact에서 다시 확인한다.
- raw handoff 원문은 복사하지 않는다. 필요하면 핵심 의미만 요약한다.
- 권장 항목 형식은 `Summary`, `Why`, `Impact`, `Related` 4줄이다.

## Timeline
### 2026-04-06

#### HIST-20260406-01 Decision
- Summary: `CR-01` 기준으로 `Scalable Governance Profiles v0.2` baseline을 승인했다.
- Why: `solo/team/large(governed)` 운영 프로필, `Project Monitor Web`, `team.json`, parser contract를 core template에 고정하기 위해.
- Impact: requirements / architecture / implementation / starter baseline이 `one core, multiple profiles` 구조로 정렬됐다.
- Related: `CR-01`, `FR-01`~`FR-09`

### 2026-04-07

#### HIST-20260407-01 Decision
- Summary: `CR-02 Enterprise Hybrid Harness`를 반영해 `enterprise_governed` pack과 `governance_controls.json` contract를 추가했다.
- Why: core template를 포크하지 않고 large/governed enterprise 운영을 opt-in overlay로 지원하기 위해.
- Impact: starter/reset source, workflow, validator, runtime contract가 enterprise-governed baseline을 이해하도록 확장됐다.
- Related: `CR-02`, `FR-10`~`FR-13`

#### HIST-20260407-02 Verification
- Summary: `Project Monitor Web` first local preview를 developer PC에서 실행하고 smoke를 확인했다.
- Why: self-hosting only read-only monitor가 실제로 뜨는지 먼저 검증해야 했기 때문이다.
- Impact: preview evidence가 `DEPLOYMENT_PLAN.md`에 기록됐고, 이후 `v0.3` closeout의 근거로 사용됐다.
- Related: `REL-07`, `REV-05`

#### HIST-20260407-03 Version
- Summary: `Scalable Governance Profiles v0.3`를 closeout하고 `Hybrid Harness Completion v0.1` draft를 시작했다.
- Why: 운영중인 프로젝트 rollout은 defer하고, self-hosting repo 안에서 hybrid harness 완성본 범위를 먼저 닫기로 결정했기 때문이다.
- Impact: `v0.3` snapshot이 archive로 이동했고, next-version planning artifact가 reset source에서 다시 열렸다.
- Related: `DOC-05`, `CR-03`

#### HIST-20260407-04 Decision
- Summary: `CR-03` completion 기준을 `local preview 재검증 + review closure + dry-run/reporting evidence`로 강화했다.
- Why: 문서-only 상태가 아니라 준운영 수준의 근거를 completion gate로 삼기 위해.
- Impact: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`가 같은 completion bar로 동기화됐다.
- Related: `PLN-01`, `FR-14`~`FR-17`, `NFR-10`, `NFR-11`

#### HIST-20260407-05 Decision
- Summary: Planner requirements 작성 전에 mandatory deep-interview를 수행하고, PMW 개선은 `feedback -> mockup -> implementation` 순서로 닫기로 방향을 바꿨다.
- Why: 요구사항 누락과 UI 재작업 낭비를 줄이기 위해 OMX `deep-interview` 아이디어와 mockup-first 절차를 내부화하기로 했기 때문이다.
- Impact: revised `CR-03` draft는 user approval-only 상태에서 PMW usability feedback 대기 상태로 다시 열렸고, shared planner workflow/skill 반영이 필요해졌다.
- Related: `FR-18`, `FR-19`, `NFR-12`, `NFR-13`, `DSG-01`

#### HIST-20260407-06 Implementation
- Summary: `PROJECT_HISTORY.md` artifact를 추가해 장기 의사결정과 주요 진척을 append-only로 관리하기 시작했다.
- Why: `CURRENT_STATE.md`, `TASK_LIST.md`, `HANDOFF_ARCHIVE.md`만으로는 장기 맥락 복원이 어려웠기 때문이다.
- Impact: live/starter/reset source와 closeout/day-wrap-up skill에 history maintenance 규칙을 연결한다.
- Related: `PLN-06`, `DOC-01`, `DOC-02`

### 2026-04-08

#### HIST-20260408-01 Design
- Summary: user feedback에 따라 `Project Monitor Web`를 밝은 operator workspace로 재정의하고 low-fi wireframe을 작성했다.
- Why: 기존 dark, long-scroll dashboard는 실제 사용성과 정보 구조 면에서 불편하다는 피드백이 들어왔기 때문이다.
- Impact: `CR-03` draft에 artifact-aware overview, project selector, `PROJECT_HISTORY.md` view, icon/exit shell affordance, left-nav workspace IA가 추가됐다.
- Related: `DSG-01`, `DSG-02`, `FR-16`, `FR-21`, `FR-22`, `FR-23`

#### HIST-20260408-02 Approval
- Summary: user가 revised PMW workspace baseline을 승인했다.
- Why: `Project History` 전용 조회, project selector, launcher/stop icon, top-bar `Exit`, artifact-aware overview 방향이 구현 시작 기준으로 충분하다고 판단했기 때문이다.
- Impact: `DSG-03`가 닫혔고, 다음 단계는 `DEV-03`과 `PLN-04`다. 별도 follow-up 후보로 `Approval Queue -> 상세 결정 패킷` 뷰가 backlog에 남았다.
- Related: `CR-03`, `DSG-03`, `DEV-03`, `BACKLOG-06`

#### HIST-20260408-03 Planning
- Summary: user 지시에 따라 `CR-04`로 `Approval Queue -> 상세 결정 패킷` view를 먼저 열었다.
- Why: Codex 대화창의 짧은 승인 질문만으로는 의사결정에 필요한 맥락이 부족하고, 사용자가 여러 문서를 직접 찾아다니는 비용이 크기 때문이다.
- Impact: PMW는 단순 approval queue가 아니라 recommendation, impact, source link, recent context를 압축한 decision packet을 보여주는 방향으로 확장 검토에 들어갔다.
- Related: `CR-04`, `PLN-07`, `DSG-05`, `FR-24`, `NFR-15`

#### HIST-20260408-04 Implementation
- Summary: approved `CR-04` baseline에 따라 PMW workspace, decision packet, project selector, history view, launcher/stop assets를 실제 구현했다.
- Why: design gate를 닫은 뒤 실제 operator workspace와 read-only decision context가 code path에서도 동작해야 했기 때문이다.
- Impact: `DEV-03`이 완료됐고, PMW는 `/api/projects`, project-aware `/api/snapshot` / `/api/file`, artifact-aware overview, history timeline, decision packet content pane을 제공한다.
- Related: `CR-04`, `DSG-06`, `DEV-03`, `TST-02`

#### HIST-20260408-05 Planning
- Summary: `PLN-04`를 마감하며 completion gate와 post-completion rollout entry criteria를 release-stage 문서까지 고정했다.
- Why: 승인된 `FR-17` 기준이 deployment 문서에는 placeholder로 남아 있어 actual rollout defer 조건이 충분히 명시되지 않았기 때문이다.
- Impact: `DEPLOYMENT_PLAN.md`가 live completion gate 문서가 됐고, `BLK-02`가 제거됐다. 다음 작업은 `TST-02`, `REV-01` / `REV-02`, `REL-01` / `REL-02` evidence capture다.
- Related: `PLN-04`, `FR-17`, `TST-02`, `REL-01`, `REL-02`, `REL-03`

#### HIST-20260408-06 Reinforcement
- Summary: `CR-05 Hybrid Harness Reinforcement + Day Wrap Up Recurrence Gate`를 live/starter/runtime/PMW에 반영하고 회귀 검증까지 완료했다.
- Why: AI 코딩 비판에서 반복적으로 지적되는 전역 맥락 상실, 중복/추상화 부채, 검증·보안 가드레일 부재를 하네스 공통 기본값에서 줄이기 위해서다.
- Impact: task packet context contract, deep-interview 확장, recurrence review, AI-specific review checklist, optional governance guardrail field, PMW risk signal이 shared baseline이 됐다. root/starter validator와 PMW test, Korean mojibake check도 통과했다.
- Related: `CR-05`, `PLN-08`, `DEV-06`, `TST-03`, `FR-25`~`FR-29`, `NFR-16`~`NFR-18`
