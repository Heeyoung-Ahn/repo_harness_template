---
trigger: always_on
---

# AI Agent Guide (Shared Multi-AI Entry Guide)

## 1. Entry Load Policy (CRITICAL)
당신은 사용자의 질문에 답하거나 작업을 시작하기 전에 아래 순서로 읽습니다.

1. `AGENTS.md`
2. `CURRENT_STATE.md` (위치: `.agents/artifacts/CURRENT_STATE.md`)
3. `TASK_LIST.md > ## Active Locks`와 본인 관련 Task row
4. `CURRENT_STATE.md > Must Read Next`에 적힌 문서만 추가로 읽기

추가 규칙:
- `PROJECT_WORKFLOW_MANUAL.md`는 사람 설명이 필요할 때만 선택적으로 읽습니다.
- `HANDOFF_ARCHIVE.md`는 충돌 복구, version closeout, 회고가 필요할 때만 읽습니다.
- `Must Read Next`는 `TASK_LIST.md > ## Active Locks` 확인을 대체하지 않습니다.
- `CURRENT_STATE.md`, `TASK_LIST.md`, 대상 파일을 다시 확인하기 전에는 파일 수정, lock 변경, handoff 기록을 시작하지 않습니다.
- 요약층과 상세 문서가 충돌하면 상세 문서가 우선이며, 즉시 `CURRENT_STATE.md`를 정정합니다.

## 2. Workspace Single Authority
- 이 파일 `workspace.md`가 운영 규칙의 최상위 정본입니다.
- 실제 프로젝트 상태의 단일 진실 공급원은 `.agents/artifacts/` 아래 물리 문서입니다.
- `CURRENT_STATE.md`는 기본 진입 요약이지만 계약 문서 자체를 대체하지 않습니다.
- 역할별 workflow, skill, manual은 이 파일을 보조 설명하거나 적용하는 문서입니다. 새 규칙을 독립적으로 만들면 안 됩니다.

## 3. Context Cap Rules
- 기본 전략은 `작은 요약층 -> 역할별 필수 문서 -> 필요 시 상세 확장`입니다.
- 모든 아티팩트 상단에는 1-screen 요약 블록을 유지합니다.
- 요약 블록 기본값:
  - 6개 bullet 이하
  - 180단어 이하
- `CURRENT_STATE.md` 기본 유지 기준:
  - 120줄 이하
  - 800단어 이하
- `CURRENT_STATE.md`는 **replace-in-place snapshot**입니다. dated `Update` 블록을 누적하지 말고 항상 최신 상태 1개만 유지합니다.
- `TASK_LIST.md > ## Handoff Log`에는 기본적으로 최신 실제 항목 8개만 유지합니다.
- 다만 활성 manual test / review / blocker triage 루프가 진행 중이면, 현재 작업과 직접 연결된 relevant entry는 임시로 더 남길 수 있습니다.
- 이 경우에도 오래된 항목은 가능한 한 `HANDOFF_ARCHIVE.md`로 옮기고, 3~5줄 요약을 `CURRENT_STATE.md > Recent History Summary`에 반영합니다.
- relevant entry 기본 예시는 최신 실패 handoff, 최신 reviewer 반려, 최신 user confirmation request, 현재 manual gate를 연 원문입니다.

### CURRENT_STATE 운영 규칙
- `CURRENT_STATE.md`에는 `## Snapshot`, `## Next Recommended Agent`, `## Must Read Next`, `## Required Skills`, `## Active Scope`, `## Task Pointers`, `## Open Decisions / Blockers`, `## Latest Handoff Summary`, `## Recent History Summary`의 live snapshot 1세트만 둡니다.
- 진행 경과를 시간순으로 남기고 싶으면 `TASK_LIST.md > ## Handoff Log`, 상단 status update 블록, 또는 `HANDOFF_ARCHIVE.md`로 보냅니다.
- `CURRENT_STATE.md > Last Synced From Task / Handoff`는 최신 relevant handoff와 맞아야 합니다.
- `CURRENT_STATE.md > Last Updated By / At`는 실제 마지막 갱신 주체와 시각을 즉시 덮어씁니다.
- `CURRENT_STATE.md > Must Read Next`에는 다음 Agent가 지금 바로 읽어야 할 항목만 남깁니다.

### Artifact Health Check
- `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md`, `.agents/artifacts/*.md`를 수정했다면 handoff 전에 아래 validator를 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

- validator가 실패하면 handoff, lock 변경, closeout을 진행하지 않고 먼저 문서를 고칩니다.
- validator warning은 즉시 release blocker는 아니지만, 이번 턴에 손댄 파일에서 나온 warning은 같은 턴에 함께 정리하는 것을 기본값으로 봅니다.

### 역할별 기본 읽기 상한
- **Planner:** `CURRENT_STATE.md`, `REQUIREMENTS.md`, `TASK_LIST.md`, 필요 시 `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_GUIDE.md`
- **Designer:** `CURRENT_STATE.md`, `REQUIREMENTS.md > Quick Read`, `IMPLEMENTATION_PLAN.md > Current Iteration`, `UI_DESIGN.md`, `TASK_LIST.md`의 관련 Scope
- **Developer:** `CURRENT_STATE.md`, `REQUIREMENTS.md > Quick Read`, `ARCHITECTURE_GUIDE.md > Quick Read`, `TASK_LIST.md`의 본인 Task / Lock 범위, UI 범위면 `UI_DESIGN.md`
- **Tester:** `CURRENT_STATE.md`, `REQUIREMENTS.md > Quick Read`, `TASK_LIST.md`의 테스트 대상 Scope, 필요 시 `IMPLEMENTATION_PLAN.md > Current Iteration`, 기록 시 `WALKTHROUGH.md`
- **Reviewer:** `CURRENT_STATE.md`, `ARCHITECTURE_GUIDE.md > Quick Read`, `REQUIREMENTS.md > Quick Read`, `WALKTHROUGH.md > Latest Result`, `TASK_LIST.md`의 리뷰 대상 범위
- **DevOps:** `CURRENT_STATE.md`, `DEPLOYMENT_PLAN.md > Quick Read`, `REVIEW_REPORT.md > Approval Status`, `TASK_LIST.md`의 배포 범위
- **Documenter:** `CURRENT_STATE.md`, `TASK_LIST.md`, `DEPLOYMENT_PLAN.md`, `REVIEW_REPORT.md`, 필요 시 `HANDOFF_ARCHIVE.md`

## 4. Standard Artifacts
- `CURRENT_STATE.md`: 기본 진입 요약, 다음 추천 역할, 꼭 읽을 문서 목록, 최신 handoff 요약
- `REQUIREMENTS.md`: 제품 요구사항의 최상위 계약
- `ARCHITECTURE_GUIDE.md`: 구조 계약과 금지된 변경 범위
- `IMPLEMENTATION_PLAN.md`: 현재 iteration과 검증 계획
- `TASK_LIST.md`: Task ID, 상태, Scope, Active Locks, Handoff Log
- `UI_DESIGN.md`: UI/UX가 있는 범위의 화면 구조와 interaction 규칙
- `WALKTHROUGH.md`: 테스트 범위와 최근 검증 결과
- `REVIEW_REPORT.md`: 승인 상태와 릴리즈 리스크
- `DEPLOYMENT_PLAN.md`: 배포 상태, 롤백 계획, 배포 기록
- `HANDOFF_ARCHIVE.md`: 오래된 handoff 원문 보관

## 5. Planner Gate and Approval Rules
Planner는 아래 상태 체계를 지킵니다.

- `REQUIREMENTS.md`
  - `Draft`
  - `Needs User Answers`
  - `Ready for Approval`
  - `Approved`
- `ARCHITECTURE_GUIDE.md`
  - `Draft`
  - `Ready for Approval`
  - `Approved`
- `IMPLEMENTATION_PLAN.md`
  - `Draft`
  - `Ready for Execution`

### Requirement Change Control
- 승인 후에도 요구사항, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있습니다. 이 경우 먼저 Planner를 다시 열고 `REQUIREMENTS.md`를 갱신합니다.
- `REQUIREMENTS.md > Current Requirement Baseline`, `Requirements Sync Status`, `Approved Change Log`가 중간 변경의 단일 정본입니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고, 같은 턴에 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 다시 맞춥니다.
- 구조 영향이 없더라도 `ARCHITECTURE_GUIDE.md > Requirement Baseline`, `Change Sync Check`를 갱신해 최신 기준선을 확인한 흔적을 남깁니다.
- 위 3개 문서가 맞춰진 뒤에만 `TASK_LIST.md`, `CURRENT_STATE.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`를 downstream sync 대상으로 진행합니다.
- 릴리즈 범위 변경이면 `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에도 같은 기준선을 반영합니다.
- `Requirements Sync Status`가 `In Sync`가 아니면 Reviewer는 `Requirements Sync Check`를 `Planner Update Needed` 또는 `Fail`로 기록하고, Review Gate와 Deployment Gate를 닫지 않습니다.
- Reviewer는 stale requirement 문서 때문에 생긴 불일치를 코드 결함과 같은 finding으로만 처리하지 말고, 문서 기준선 sync 누락을 별도 blocker로 승격합니다.

Developer로 handoff 가능한 최소 조건:
- `REQUIREMENTS.md > Status`가 `Approved`다.
- `REQUIREMENTS.md > Requirements Sync Status`가 `In Sync`다.
- `ARCHITECTURE_GUIDE.md > Status`가 `Approved`다.
- `ARCHITECTURE_GUIDE.md > Requirement Baseline`이 최신 승인 기준선과 맞고 `Change Sync Check`가 `Synced` 또는 `No Architecture Change`다.
- `IMPLEMENTATION_PLAN.md > Status`가 `Ready for Execution`이다.
- `IMPLEMENTATION_PLAN.md > Requirement Baseline`이 최신 승인 기준선과 맞다.
- `REQUIREMENTS.md`의 `In Scope`, `Out of Scope`가 비어 있지 않다.
- 기능 요구사항별 acceptance criteria가 비어 있지 않다.
- `Open Questions`가 비어 있거나 사용자 승인된 보류로 정리되어 있다.
- 사용자 질문, 확인 요청, 정책 선택지가 답변 완료 또는 승인 대기 상태로 드러나 있다.
- `ARCHITECTURE_GUIDE.md`의 도메인 경계와 승인된 예외가 채워져 있다.
- `IMPLEMENTATION_PLAN.md`의 현재 iteration, 주요 Task ID, 검증 명령이 채워져 있다.
- 승인된 `FR-*`, `NFR-*` ID가 `IMPLEMENTATION_PLAN.md > Requirement Trace` 또는 실행 Task에 연결되어 있다.
- `TASK_LIST.md`의 활성 개발/테스트/리뷰 태스크마다 `Scope`가 적혀 있다.
- 템플릿 placeholder나 기본 안내 문구가 남아 있지 않다.

Planner handoff 금지 예시:
- `[요구사항]`
- `[기능/도메인 범위 작성]`
- `[어떤 상태가 되면 충족인지]`
- `[폴더/모듈/문서]`
- `[개발 작업]`
- `[YYYY-MM-DD HH:MM]`
- `[설명]`

위 조건을 만족하지 못하면 Planner는 handoff하지 않고 사용자와 추가 대화를 계속합니다.

## 6. Multi-AI Concurrency Rules
- 작업 시작 전 반드시 아래를 확인합니다.
  - `CURRENT_STATE.md`
  - `TASK_LIST.md > ## Active Locks`
  - `TASK_LIST.md`의 본인 관련 Task ID와 최신 relevant handoff
  - `git status`, `git diff`, 최근 변경 파일
- 다른 Agent가 lock 중인 Task ID는 잠금 해제 또는 사용자 지시 없이 건드리지 않습니다.
- 태스크 상태와 점유권을 분리해 기록합니다.
- `## Active Locks`는 협업용 문서 lock이며 atomic lock이 아닙니다.
- 서로 다른 Task ID라도 Scope가 디렉터리 단위로 겹치면 충돌 가능성이 있는 것으로 봅니다.

### Worktree 권장 기준
- 동시에 2개 이상 Agent가 코드 파일을 수정한다.
- Scope가 같은 디렉터리나 같은 모듈로 겹친다.
- 문서가 아니라 코드 충돌이 예상된다.

위 조건 중 하나라도 맞으면 `git worktree add`를 활용한 물리적 격리를 권장 기본값으로 봅니다.

### Pre-Write Refresh
repo-tracked 파일을 수정하기 직전 아래를 다시 읽습니다.
- 수정 대상 파일
- `CURRENT_STATE.md`
- `TASK_LIST.md`의 관련 범위

자신이 마지막으로 읽은 뒤 위 문서가 바뀌었으면:
1. 수정을 중단한다.
2. 최신 상태를 다시 읽는다.
3. 기존 계획이 여전히 안전한지 재판단한다.
4. 충돌이면 사용자 판단을 요청한다.

### Stale Lock Recovery
기본 stale 판단 조건:
- lock의 마지막 업데이트 후 12시간 초과
- 최신 relevant handoff가 없음
- 관련 파일에 최근 변경이 없음
- `manual gate pending`, `user decision pending`, `Needs Clarification`, `user real-device confirmation pending`이 notes / blockers에 남아 있지 않음

stale lock 회수 절차:
1. `CURRENT_STATE.md`와 `TASK_LIST.md`를 다시 읽어 실제 중단 여부를 확인한다.
2. 해당 Scope의 `git status` 흔적, 최근 touched 파일, `HANDOFF_ARCHIVE.md`의 relevant entry 존재 여부를 확인한다.
3. 하나라도 모호하면 자동 회수를 멈추고 `CURRENT_STATE.md > Open Decisions / Blockers`와 `TASK_LIST.md > ## Blockers`에 `Needs User Decision`으로 올린다.
4. 자동 회수가 안전한 경우에만 `CURRENT_STATE.md`의 `Open Decisions / Blockers`, `Active Scope`, `Task Pointers`를 갱신한다.
5. `TASK_LIST.md > ## Active Locks`에서 stale row를 정리한다.
6. `## Handoff Log`에 `### [YYYY-MM-DD HH:MM] [STALE-LOCK / 현재 플랫폼/Agent] -> [다음 Agent]` 형식으로 기록한다.
7. 사용자에게 stale lock 회수 사실과 근거를 알린다.

## 7. Security and Language Rules
- API Key, Secret, Token, 개인정보를 코드와 문서에 하드코딩하지 않습니다.
- 민감한 값과 사용자 데이터는 로그, 디버그 출력, 문서에 평문으로 남기지 않습니다.
- `.agents/artifacts/*.md`, `.agents/rules/*.md`, `AGENTS.md`, `README.md`, `docs/*.md`는 기본적으로 UTF-8 (BOM 없음) 인코딩으로 유지합니다.
- PowerShell, 스크립트, bulk sync로 위 문서를 다시 쓸 때는 명시적 UTF-8 읽기/쓰기를 사용하고 BOM이 생기지 않게 합니다.
- 모든 아티팩트 문서는 한국어로 작성합니다.
- 아티팩트 본문 설명, 요약, blocker, handoff 내용은 한국어를 기본으로 씁니다.
- 아래 항목만 영어 유지 예외로 허용합니다.
  - 코드 식별자, 파일명, 명령어, 경로, 모델명
  - 표준 라벨 `Completed`, `Next`, `Notes`
  - 요구사항/문서가 이미 고정한 section 이름과 상태값
- 비개발자도 이해할 수 있는 평이한 일상 언어를 우선합니다.
- 코드 식별자, 파일명, 명령어, 기술 용어는 영어를 유지할 수 있습니다.

## 8. Agent Roles
- **Planner Agent:** 요구사항, 아키텍처, 구현 계획, 작업 목록, `CURRENT_STATE.md` 라우팅을 정리한다.
- **Designer Agent:** UI 구조, 사용자 동선, interaction 규칙을 정의한다.
- **Developer Agent:** 확정된 문서를 기준으로 코드를 구현하고 자체 검증한다.
- **Tester Agent:** 요구사항 기준으로 구현을 검증하고 `WALKTHROUGH.md`에 기록한다.
- **Reviewer Agent:** 구조, 보안, 품질, 릴리즈 리스크를 심사한다.
- **DevOps Agent:** 배포와 롤백 준비, 릴리즈 기록을 관리한다.
- **Documenter Agent:** day wrap up 또는 version closeout 시 문서 정리와 archive를 수행한다.

## 9. Macro Workflow Stages
- **Planning and Architecture**
- **Design Gate**
- **Development and Test Loop**
- **Review Gate**
- **Deployment**
- **Documentation and Closeout**

handoff에는 bare phase number보다 `stage name + Task ID`를 우선해서 적습니다.

## 10. Task and Handoff Standard
상태 표기:
- `[ ]` 대기
- `[-]` 진행 중
- `[x]` 완료
- `[!]` 차단 또는 실패

모든 태스크는 가능한 한 안정적인 `Task ID`와 `Scope`를 가집니다.

`## Active Locks` 예시:
```md
## Active Locks
| Task ID | Owner | Role | Started At | Scope | Note |
|---|---|---|---|---|---|
| DEV-01 | Codex | Developer | 2026-03-28 10:30 | src/auth/* | login validation fix |
```

## 11. Handoff Protocol
1. 수정 직전에 `Pre-Write Refresh`를 수행합니다.
2. `TASK_LIST.md` 상태와 본인 lock row를 갱신합니다.
3. `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Required Skills`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`, `Recent History Summary`를 replace-in-place로 갱신합니다.
   - 요구사항 변경이 있었다면 `Requirement Baseline`, `Requirements Sync Check`도 함께 갱신합니다.
4. 오래된 handoff를 archive로 옮기기 전에, 열린 사용자 질문 / 기술 블로커 / 다음 Agent가 꼭 알아야 할 제약을 `CURRENT_STATE.md > Open Decisions / Blockers`와 `TASK_LIST.md > ## Blockers`로 승격합니다.
5. 필요하면 오래된 handoff 항목을 `HANDOFF_ARCHIVE.md`로 옮기고 `Recent History Summary`를 갱신합니다. 다만 활성 manual / review 루프와 직접 연결된 항목은 임시로 유지할 수 있습니다.
6. `TASK_LIST.md > ## Handoff Log`에 아래 형식으로 항목을 추가한 뒤, `CURRENT_STATE.md > Last Synced From Task / Handoff`가 최신 relevant entry와 맞는지 다시 확인합니다.
7. rules / workflows / artifacts를 수정했다면 `.agents/scripts/check_harness_docs.ps1`를 실행해 문서 구조 위반이 없는지 확인합니다.

```markdown
### [YYYY-MM-DD HH:MM] [현재 플랫폼/Agent] -> [다음 Agent]
- **Completed:** [이번 턴에 수행한 내용 요약 — 한국어, 평이한 언어]
- **Next:** [다음 에이전트가 해야 할 구체적인 작업 — 한국어]
- **Notes:** [블로커 유무, 참고 사항 — 한국어]
```

추가 규칙:
- 새 항목은 항상 맨 아래에 추가합니다.
- `- **Completed:**`, `- **Next:**`, `- **Notes:**` 키워드는 절대 번역하거나 변형하지 않습니다.
- 충돌, stale lock, recovery 같은 특수 상황은 `[CONFLICT / ...]`, `[STALE-LOCK / ...]`, `[RECOVERY / ...]` 식으로 현재 플랫폼/Agent 칸에 태그를 포함해 기록할 수 있습니다.
- 완료 후 사용자에게 다음 역할과 필요한 후속 호출을 알립니다.
