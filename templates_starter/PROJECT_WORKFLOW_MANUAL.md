# Universal Agents Template Project Workflow Manual

> 이 매뉴얼의 상대 경로는 현재 프로젝트 root를 작업 루트로 열었을 때를 기준으로 작성되어 있습니다.  
> 이 프로젝트는 `repo-level governance harness` 템플릿 구조를 전제로 하므로, 프로젝트 root를 그대로 workspace root로 열어야 합니다.

## 이 문서는 무엇이고, 무엇이 아닌가
이 문서는 **처음 개발을 해 보는 문과생도 이 저장소를 따라가며 작업할 수 있게 도와주는 튜토리얼 매뉴얼**입니다.

이 문서가 하는 일:
- AI 개발이 무엇인지 쉽게 설명합니다.
- 이 저장소에서 `Codex`, `Antigravity`, 여러 Agent가 어떻게 함께 일하는지 설명합니다.
- `rule`, `workflow`, `skill`, `artifact`가 각각 무슨 역할을 하는지 알려 줍니다.
- 실제로 작업을 시작할 때 무엇부터 읽고, 어떤 순서로 다음 단계로 넘어가야 하는지 보여 줍니다.

이 문서가 하지 않는 일:
- 새 운영 규칙을 만들지 않습니다.
- `workspace.md`보다 더 강한 지시를 내리지 않습니다.
- 기본 진입 문서 역할을 하지 않습니다.
- 운영 프로세스의 입력 문서로 사용되지 않습니다.
- `README.md`를 운영 정본처럼 해석하게 만들지 않습니다.

가장 중요한 원칙:
- **운영 규칙의 정본은 [`workspace.md`](.agents/rules/workspace.md)입니다.**
- **실제 작업 상태의 정본은 [`.agents/artifacts/`](.agents/artifacts/) 아래 문서들입니다.**
- 이 매뉴얼은 그 규칙과 문서를 **쉽게 이해하게 풀어 쓴 안내서**입니다.

현재 기본 템플릿 범위에 대한 추가 메모:
- 사용자 승인과 짧은 결정은 기본적으로 **현재 세션의 로컬 대화**에서 처리합니다.
- 원격 승인 watcher / scheduler / registry / mobile routing 같은 확장 자산은 기본 템플릿에서 제외되었습니다.
- 관련 자산은 [`backup/remote_approval/`](backup/remote_approval/README.md)에 보관되어 있으며, 기본 workflow와 artifact는 이를 전제로 하지 않습니다.

---

## 이 파일이 프로젝트에 들어오는 방식
이 매뉴얼은 보통 self-hosting 템플릿 저장소인 `repo_harness_template`의 `templates_starter/`에서 프로젝트 root로 복사되어 들어옵니다.

대표적인 사용 순서는 아래와 같습니다.

1. 템플릿 저장소를 받아둘 workspace를 만들고, 보통 이름을 `repo_harness_template`로 둡니다.
2. 그 폴더에 템플릿 저장소를 clone 또는 pull합니다.
3. 완전히 새 프로젝트를 시작할 때는 `templates_starter/` 하위 내용을 새 프로젝트 root에 그대로 복사합니다.
4. 기존 운영 프로젝트에 표준 템플릿을 적용할 때는 `repo_harness_template` 저장소를 Codex에서 열고 대상 프로젝트 경로를 알려 준 뒤 표준 템플릿 적용을 요청합니다.

빠른 구분:
- self-hosting 템플릿 저장소 root: `.agents/`, `backup/`, `templates/`, `templates_starter/`, `AGENTS.md`, `README.md`
- 실제 운영 프로젝트 root: `.agents/`, `templates/`, `AGENTS.md`, `PROJECT_WORKFLOW_MANUAL.md` 등 starter 내용이 직접 놓인 구조

주의:
- `.agents`는 점이 포함된 실제 폴더명입니다.
- `templates_starter/`는 self-hosting 템플릿 저장소 안에서만 쓰는 assembled starter root 이름입니다.
- 실제 운영 프로젝트로 복사된 뒤에는 `templates_starter/` 폴더가 남는 것이 아니라, 그 내부 내용이 프로젝트 root로 들어갑니다.

---

## 1. AI 개발이란 무엇인가
많은 초보자는 “AI 개발”을 “AI가 알아서 코드를 다 만들어 주는 일”이라고 생각합니다.  
하지만 이 템플릿에서 말하는 AI 개발은 조금 다릅니다.

이 저장소에서의 AI 개발은:
- 사람이 목표를 정합니다.
- AI가 문서를 읽고 자기 역할에 맞는 일을 합니다.
- 다음 AI가 이어받을 수 있게 문서에 상태를 남깁니다.
- 사람이 중간중간 승인하고 방향을 잡습니다.

즉, **AI는 혼자 뛰는 개발자라기보다, 문서를 기준으로 움직이는 역할 담당자**에 가깝습니다.

### “AI와 대화하기”와 “AI로 개발하기”의 차이
둘은 비슷해 보여도 실제로는 다릅니다.

**1. AI와 대화하기**
- 그냥 질문하고 답을 받는 방식입니다.
- 예: “로그인 기능은 어떻게 만들면 돼?”
- 장점: 빠르고 편합니다.
- 한계: 다음 세션이나 다른 AI가 이어받기 어렵습니다.

**2. AI로 개발하기**
- AI가 문서를 읽고, 문서 기준으로 작업하고, 문서에 결과를 남기는 방식입니다.
- 예: Planner가 요구사항 문서를 만들고, Developer가 그 문서를 기준으로 구현하고, Tester가 검증 결과를 남깁니다.
- 장점: 여러 AI와 여러 IDE가 같은 프로젝트를 이어받아도 흐름이 유지됩니다.
- 한계: 문서를 성실하게 읽고 갱신해야 합니다.

이 템플릿은 두 번째 방식을 위한 구조입니다.

---

## 2. 멀티 IDE, 멀티 모델, 멀티 에이전트 개발이란 무엇인가
이 부분은 초보자가 가장 자주 헷갈리는 부분입니다.  
`IDE`, `AI 모델`, `에이전트`는 같은 말이 아닙니다.

### 2.1 IDE란 무엇인가
IDE는 **AI와 함께 작업하는 창, 도구, 작업 환경**입니다.

이 저장소에서 예로 드는 IDE:
- `Codex` 앱
- `Antigravity`

쉽게 말하면:
- IDE는 “어디서 작업하느냐”입니다.
- 같은 프로젝트라도 서로 다른 IDE에서 열 수 있습니다.

### 2.2 AI 모델이란 무엇인가
AI 모델은 **실제로 추론하고 답을 만드는 엔진**입니다.

쉽게 말하면:
- IDE가 “작업 공간”이라면
- 모델은 “생각하는 두뇌”입니다.

초보자에게 중요한 점:
- 모델이 다르면 말투, 추론 방식, 실수 패턴이 달라질 수 있습니다.
- 그래서 이 템플릿은 모델이 달라도 같은 문서를 기준으로 움직이게 설계되어 있습니다.

### 2.3 에이전트란 무엇인가
에이전트는 **AI가 맡는 역할**입니다.

이 저장소의 대표 역할:
- Planner
- Designer
- Developer
- Tester
- Reviewer
- DevOps
- Documenter

쉽게 말하면:
- IDE는 작업 창
- 모델은 두뇌
- 에이전트는 “지금 맡은 직무”

예:
- 같은 Codex라도 어떤 순간에는 Planner 역할을 하고
- 다른 순간에는 Developer 역할을 할 수 있습니다.

### 왜 셋을 구분해야 하는가
이 셋을 섞어서 생각하면 아래 문제가 생깁니다.
- “Codex가 Planner 역할도 하고 Developer 역할도 했으니 같은 흐름이겠지”라고 착각
- “Antigravity가 했던 작업이니 Codex가 그대로 이해하겠지”라고 착각
- “다 같은 AI인데 굳이 문서가 왜 필요하지?”라고 착각

하지만 실제 병렬 작업에서는:
- IDE가 달라질 수 있고
- 모델이 달라질 수 있고
- 맡은 역할도 달라질 수 있습니다.

그래서 **사람이 기억으로 연결하는 대신, 문서가 연결해 주는 구조**가 필요합니다.

---

## 3. Codex와 Antigravity의 차이
이 매뉴얼에서는 **이 프로젝트 안에서 어떻게 운영하느냐** 기준으로만 설명합니다.  
“누가 더 좋다”, “누가 더 똑똑하다” 같은 비교는 하지 않습니다.

### 공통점
이 템플릿 안에서는 둘 다:
- 같은 정본 규칙인 [`workspace.md`](.agents/rules/workspace.md)를 따라야 합니다.
- 같은 상태 문서인 [`.agents/artifacts/`](.agents/artifacts/) 아래 문서를 읽어야 합니다.
- 같은 `workflow`, `skill`, `artifact`를 공유합니다.

즉, **모델이 달라도 같은 문서 체계를 따르면 작업 품질을 맞출 수 있다**는 것이 이 템플릿의 핵심입니다.

### 운영 기준에서의 차이
이 저장소 기준으로 가장 중요한 차이는 **진입 방식**입니다.

**Codex 쪽**
- 보통 [`AGENTS.md`](AGENTS.md)를 입구 안내판처럼 먼저 봅니다.
- 그 다음 [`workspace.md`](.agents/rules/workspace.md), [`CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md) 순서로 들어갑니다.

**Antigravity 쪽**
- 시작 방식이 달라도 결국 같은 정본 규칙인 [`workspace.md`](.agents/rules/workspace.md)를 따라야 합니다.
- 즉, 입구가 조금 달라도 실제 규칙과 상태 문서는 같아야 합니다.

### 초보자가 이해해야 할 핵심
중요한 것은 “Codex냐 Antigravity냐”보다 아래입니다.
- 지금 어떤 역할로 들어왔는가
- 현재 상태 문서가 무엇을 말하는가
- lock과 handoff가 어떻게 기록되어 있는가

이 저장소에서는 **도구보다 문서가 더 중요합니다.**

---

## 4. AI 개발의 4요소: rule, workflow, skill, artifact
이 저장소는 네 가지 요소가 함께 돌아가야 안정적으로 작동합니다.

| 요소 | 이 저장소의 실제 위치 | 쉬운 설명 | 언제 읽는가 | 왜 필요한가 | 없으면 생기는 문제 |
|---|---|---|---|---|---|
| `rule` | [`.agents/rules/workspace.md`](.agents/rules/workspace.md) | 가장 강한 운영 규칙 | 시작할 때, 충돌 판단할 때 | 모두가 같은 기준으로 움직이게 함 | AI마다 제멋대로 일함 |
| `workflow` | [`.agents/workflows/`](.agents/workflows/) | 역할별 행동 절차서 | 역할이 정해졌을 때 | Planner, Developer, Tester 등이 무엇을 해야 하는지 알려 줌 | 역할마다 빠뜨리는 일이 많아짐 |
| `skill` | [`.agents/skills/`](.agents/skills/) | 자주 하는 일을 위한 전문 가이드 | 특정 상황에서만 | day start, day wrap up, conflict 해결 같은 반복 작업을 표준화 | 같은 일을 매번 다르게 처리함 |
| `artifact` | [`.agents/artifacts/`](.agents/artifacts/) | 실제 상태가 저장되는 문서 | 항상 | 프로젝트의 현재 상태를 다음 AI가 이어받게 함 | 세션이 바뀌면 맥락이 끊김 |

### 네 요소를 아주 쉽게 비유하면
- `rule` = 헌법
- `workflow` = 역할별 업무 매뉴얼
- `skill` = 자주 쓰는 전문 노하우 모음
- `artifact` = 실제 기록 장부

---

## 5. 이 저장소에서 가장 먼저 따라 하는 시작 절차
처음 작업을 시작할 때는 아래 순서를 **거의 그대로** 따라가면 됩니다.

### Step 1. `AGENTS.md` 진입 안내 확인
어떤 IDE는 [`AGENTS.md`](AGENTS.md) 내용을 세션 시작 전에 이미 보여 줍니다.  
이 저장소에서는 이 차이를 먼저 이해하면 헷갈림이 크게 줄어듭니다.

여기서 알 수 있는 것:
- 첫 repo 파일로 무엇을 열어야 하는지
- 무엇을 기본 진입 문서로 보지 말아야 하는지
- 기본 템플릿이 어떤 범위까지 포함하는지

실전 기준:
- `AGENTS.md`가 이미 IDE에 노출되었다면 첫 repo 파일로 `workspace.md`를 엽니다.
- `AGENTS.md`가 자동으로 보이지 않는 환경이라면 이 파일을 먼저 한 번 읽고 같은 순서로 들어갑니다.

### Step 2. [`workspace.md`](.agents/rules/workspace.md) 읽기
이 파일이 정본입니다.

여기서 알 수 있는 것:
- 읽기 순서
- lock 규칙
- stale lock 규칙
- Planner gate
- handoff 규칙
- 어떤 문서를 언제 갱신하는지
- release blocker와 문서 정비 이슈를 어떻게 분리하는지

### Step 3. [`CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md) 읽기
이 파일은 지금 시작하기 위한 요약판입니다.

여기서 알 수 있는 것:
- 현재 stage
- 다음 추천 역할
- 꼭 읽어야 할 다음 문서
- 지금 active scope가 무엇인지
- 당장 주의할 blocker가 무엇인지

### Step 4. [`TASK_LIST.md > ## Active Locks`](.agents/artifacts/TASK_LIST.md) 확인
아주 중요합니다.

`CURRENT_STATE.md`만 보면 안 되는 이유:
- 요약은 늦게 갱신될 수 있습니다.
- 실제 점유 상태는 `TASK_LIST.md`에 있습니다.

항상 확인할 것:
- 누가 어떤 Task를 잡고 있는지
- 내가 하려는 Scope와 겹치는 작업이 있는지

### Step 5. `Must Read Next`만 추가로 읽기
여기서부터는 무조건 전체 문서를 다 읽지 않습니다.

예:
- Planner면 `REQUIREMENTS.md`, `TASK_LIST.md`
- Developer면 `REQUIREMENTS.md > Quick Read`, `ARCHITECTURE_GUIDE.md > Quick Read`
- Tester면 `WALKTHROUGH.md > Latest Result` 등을 읽습니다.

### Step 6. 내 역할 결정
지금 내가 해야 할 역할이 무엇인지 정합니다.

예:
- 요구사항을 정리해야 한다 → Planner
- 코드를 구현해야 한다 → Developer
- 구현 결과를 검증해야 한다 → Tester

### Step 7. 그 역할의 workflow 실행
이제 역할에 맞는 문서를 읽습니다.

예:
- Planner → [`.agents/workflows/plan.md`](.agents/workflows/plan.md)
- Developer → [`.agents/workflows/dev.md`](.agents/workflows/dev.md)
- Documenter → [`.agents/workflows/docu.md`](.agents/workflows/docu.md)

### 초보자를 위한 한 줄 요약
처음 시작할 때는:
1. `AGENTS.md` 안내 확인 또는 IDE가 이미 노출한 entry guide 확인
2. `workspace.md`
3. `CURRENT_STATE.md`
4. `TASK_LIST.md > ## Active Locks`
5. `Must Read Next`
6. 내 역할 workflow

그리고 여기서 아주 중요한 사실:
- **`README.md`와 `PROJECT_WORKFLOW_MANUAL.md`는 운영 프로세스 입력 문서가 아닙니다.**
- **`PROJECT_WORKFLOW_MANUAL.md`는 기본적으로 읽지 않아도 됩니다.**
- 이 문서는 이해를 돕는 설명서이지, 시작 절차의 필수 문서는 아닙니다.

---

## 6. 문서별 역할 설명
이 저장소의 핵심은 코드보다 문서 흐름을 이해하는 데 있습니다.

### 6.1 [`CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md)
이 문서는 **지금 시작하기 위한 요약판**입니다.

보면 좋은 항목:
- `Snapshot`
- `Next Recommended Agent`
- `Must Read Next`
- `Active Scope`
- `Open Decisions / Blockers`

이 문서의 역할:
- 다음 AI가 긴 문서를 다시 다 읽지 않게 해 줍니다.
- 현재의 요약 상태를 한눈에 보여 줍니다.
- 작업 중간 메모와 turn-by-turn 상태를 가장 가볍게 남기는 기본 위치입니다.

하지만 주의:
- 이 문서는 요약입니다.
- 실제 lock과 세부 작업 상태는 `TASK_LIST.md`가 더 중요합니다.

### 6.2 [`TASK_LIST.md`](.agents/artifacts/TASK_LIST.md)
이 문서는 **실제 작업 상태 장부**입니다.

여기서 보는 것:
- Task ID
- 상태(`[ ]`, `[-]`, `[x]`, `[!]`)
- `## Active Locks`
- `## Handoff Log`
- `## Blockers`

초보자가 꼭 기억할 것:
- `CURRENT_STATE.md`는 요약
- `TASK_LIST.md`는 실제 상태
- `## Handoff Log`는 매 턴 쓰는 메모장이 아니라 역할 전환, 세션 종료, lock handoff 때 남기는 기록입니다.
- 리뷰/배포 gate의 최종 판단은 여기서 매번 복사하지 않고 각각 `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에서 확정합니다.

### 6.3 [`REQUIREMENTS.md`](.agents/artifacts/REQUIREMENTS.md)
이 문서는 **무엇을 만들어야 하는지**를 정합니다.

핵심:
- 목표
- 범위
- 기능 요구사항
- 비기능 요구사항
- 승인 상태

이 문서가 덜 닫혀 있으면:
- Developer가 추측해서 구현하게 됩니다.

### 6.4 [`ARCHITECTURE_GUIDE.md`](.agents/artifacts/ARCHITECTURE_GUIDE.md)
이 문서는 **어떤 구조로 만들지**를 정합니다.

쉽게 말하면:
- 코드 폴더 구조
- 레이어 책임
- 금지된 구조 우회
- 승인된 예외

이 문서가 필요한 이유:
- Developer가 제멋대로 구조를 바꾸지 못하게 하기 위해서입니다.

### 6.5 [`IMPLEMENTATION_PLAN.md`](.agents/artifacts/IMPLEMENTATION_PLAN.md)
이 문서는 **어떤 순서로 만들지**를 정합니다.

여기서 보는 것:
- 현재 iteration
- 주요 Task ID
- 검증 명령
- stage별 목표
- `Task Packet Ledger`
- 이번 iteration의 `green level target`
- `branch freshness precheck`
- 사용자 실기기 테스트 결과를 받을 계획이 있는지

### 6.6 [`WALKTHROUGH.md`](.agents/artifacts/WALKTHROUGH.md)
이 문서는 **Tester가 검증 결과를 남기는 곳**입니다.

여기서 보는 것:
- 어떤 환경에서 테스트했는지
- 어떤 명령을 실행했는지
- 어떤 버그가 나왔는지
- 현재 green level이 어디까지 닫혔는지
- 테스트 시점 branch freshness
- 사용자가 직접 수행한 실기기 / 브라우저 테스트 원문과 Tester의 최종 해석

### 6.7 [`REVIEW_REPORT.md`](.agents/artifacts/REVIEW_REPORT.md)
이 문서는 **Reviewer가 승인 또는 반려를 남기는 곳**입니다.

여기서 보는 것:
- 승인 상태
- 구조 문제
- 보안 문제
- 배포 차단 요소
- 현재 release를 막는 문제와 나중에 정비할 document / harness debt의 구분
- 리뷰 시점 green level
- stale branch인지 실제 제품 결함인지 구분한 판단

초보자가 기억할 것:
- 이 문서는 리뷰가 끝났을 때 1회 정리하는 release 판단 문서입니다.
- 작업 중간 메모를 계속 쌓는 곳이 아닙니다.

### 6.8 [`DEPLOYMENT_PLAN.md`](.agents/artifacts/DEPLOYMENT_PLAN.md)
이 문서는 **배포 준비와 결과 기록**입니다.

여기서 보는 것:
- 배포 대상
- 롤백 계획
- 배포 결과
- 현재 배포를 막는 gate와 나중에 분리해서 정비할 follow-up
- 현재 release 기준 green level
- release 직전 branch freshness
- 사용자 실기기 raw report와 Tester 최종 판정이 서로 맞는지

초보자가 기억할 것:
- 이 문서는 배포 직전/직후 1회 갱신하는 release 실행 문서입니다.
- 작업 중간 handoff를 계속 적는 문서가 아닙니다.

### 6.9 [`HANDOFF_ARCHIVE.md`](.agents/artifacts/HANDOFF_ARCHIVE.md)
이 문서는 **오래된 handoff 원문 보관소**입니다.

기본 원칙:
- 평소에는 읽지 않습니다.
- 충돌 복구, 회고, version closeout이 필요할 때만 읽습니다.

### 6.10 새 스키마 핵심 5가지
이번 starter 템플릿에는 `claw_code` 분석을 바탕으로 아래 5가지 개념이 들어갔습니다.

#### 1. Task Packet
이제 큰 task는 단순히 “개발 작업”이라고만 적지 않습니다.

최소한 아래 질문에 답할 수 있어야 합니다.
- 이 task의 목적은 무엇인가
- 어디까지가 범위이고 어디부터는 제외인가
- 어떤 검증이 통과되어야 하는가
- 어떤 artifact를 같이 갱신해야 하는가
- 어느 시점에 Planner / User / Reviewer로 올려야 하는가

이 정보는 주로 [`IMPLEMENTATION_PLAN.md > Task Packet Ledger`](.agents/artifacts/IMPLEMENTATION_PLAN.md)에 적습니다.

#### 2. Green Level
예전에는 “테스트 통과”라고 한 줄로 쓰기 쉬웠지만, 이제는 아래를 구분합니다.
- `Targeted`: 현재 scope에 필요한 검증만 통과
- `Package`: 앱 / 패키지 / 빌드 단위 검증까지 통과
- `Workspace`: 전체 프로젝트 회귀 관점의 검증까지 통과
- `Merge Ready`: review, manual, dependency gate까지 닫힌 상태

초보자도 이 감각만 알면 “부분 통과”와 “릴리즈 가능”을 섞어 쓰지 않게 됩니다.

#### 3. Failure Taxonomy + Recovery
blocker를 그냥 “안 됨”이라고 적지 않고 아래처럼 씁니다.
- 어떤 종류 문제인가: Requirement / Branch / Build / Manual 등
- 영향이 iteration만 막는가, release를 막는가
- 어떤 증상이 있었는가
- 이미 무엇을 시도했는가
- 다음 escalation은 누구에게 가는가

이렇게 하면 다음 AI가 같은 복구를 중복으로 시도하는 일을 줄일 수 있습니다.

#### 4. Branch Freshness
테스트나 리뷰가 크게 깨졌을 때 바로 제품 결함으로 단정하지 않습니다.

먼저 봐야 하는 것:
- base branch 기준으로 최신인가
- 뒤처졌는가
- diverged 상태인가

병렬 작업이 있는 프로젝트에서는 이 확인만으로 불필요한 재작업을 많이 줄일 수 있습니다.

#### 5. Resume Contract
handoff는 길게 쓰는 것이 목적이 아닙니다.

핵심만 남겨야 합니다.
- 무엇을 끝냈는가
- 다음에 무엇을 해야 하는가
- 첫 액션이 무엇인가
- 어떤 gate / green level / branch freshness / blocker category를 기억해야 하는가

즉, 다음 세션이 바로 첫 행동을 시작할 수 있어야 좋은 handoff입니다.

### 6.11 새 스키마 예시 작성본
아래는 실제 프로젝트에서 어떻게 채우는지 보여 주기 위한 샘플입니다.  
예시는 “영어 학습 앱에 오늘의 표현 저장 기능을 추가하는 작업”을 가정합니다.

#### 6.11.1 `IMPLEMENTATION_PLAN.md` 예시
```markdown
## Current Iteration
- Iteration name: Save today's expression
- Scope: `src/features/expression-save/*`, `src/screens/home/*`
- Main Task IDs: `DEV-01`, `TST-01`, `REV-01`
- Change requests in scope: none
- Exit criteria: 저장 버튼, 저장 상태 표시, 저장 목록 반영이 요구사항과 일치
- Green level target: `Targeted`, release 전에는 `Package`
- Branch freshness precheck: `main` 기준 fresh 확인 후 시작
- User-captured manual test expected: Yes, Android 실기기에서 저장/재진입 확인
- Manual / environment validation still open: Android 실기기 저장 유지 확인
- Dependency / compliance gate still open: none

## Task Packet Ledger
| Task ID | Objective | In Scope / Out of Scope | Acceptance Checks | Artifacts To Update | Escalate When |
|---|---|---|---|---|---|
| DEV-01 | 오늘의 표현 저장 기능 구현 | In: 저장 버튼, 저장 상태 표시, 목록 반영 / Out: 서버 동기화 | 단위 테스트, 홈 화면 저장 플로우, 재진입 시 상태 유지 | `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, 필요 시 `CURRENT_STATE.md` | 구조 변경이 필요하면 Planner, 실기기 정책 이슈면 User |
```

#### 6.11.2 `CURRENT_STATE.md` 예시
```markdown
## Snapshot
- Current Stage: Development and Test Loop
- Current Focus: 오늘의 표현 저장 기능 구현과 Android 실기기 검증 준비
- Current Release Goal: 저장 플로우를 요구사항 기준으로 안정화하고 review-ready 상태까지 만든다
- Current Green Level: Targeted
- Branch Freshness: Fresh

## Latest Handoff Summary
- Handoff source: Developer / 2026-04-05 21:30
- Completed: 저장 버튼과 로컬 상태 반영 구현 완료, 단위 테스트 통과
- Next: Android 실기기에서 저장 후 재진입 유지 여부 확인
- First Next Action: `WALKTHROUGH.md > Manual Test Checklist`를 채우고 사용자 실기기 테스트 요청
- Notes: Package green 전이며 manual gate가 아직 열려 있음
```

#### 6.11.3 `TASK_LIST.md` 예시
```markdown
## Current Release Target
- Current Stage: Development and Test Loop
- Current Focus: 오늘의 표현 저장 기능 구현과 Android 실기기 검증 준비
- Current Release Goal: 저장 플로우를 요구사항 기준으로 안정화하고 review-ready 상태까지 만든다
- Current Green Level: Targeted
- Branch Freshness: Fresh

## Blockers
| ID | Category | Impact | Observed Symptom | Attempted Recovery | Next Escalation |
|---|---|---|---|---|---|
| BLK-01 | Manual | Iteration | Android 실기기에서 저장 후 앱 재실행 시 상태 유지 여부 미확인 | 로컬 시뮬레이터 검증 완료, 체크리스트 준비 완료 | 사용자 실기기 결과 수집 후 Tester 판정 |
```

#### 6.11.4 `WALKTHROUGH.md` 예시
```markdown
## Latest Result
- Result: Partial
- Iteration Pass: Yes
- Release Pass: No
- Code / Automation Pass: Yes
- Manual / Environment Pass: Pending
- Requirement Baseline Tested: RB-2026-04-05-A
- Requirements Sync Check: Pass
- Green Level Achieved: Targeted
- Branch Freshness at Test Time: Fresh
- User-Captured Manual Test Status: Waiting for User Results

## Manual Test Checklist
| Check Item | Expected Result | Reporter | Actual Result | Tester Assessment | Notes |
|---|---|---|---|---|---|
| 홈 화면에서 오늘의 표현 저장 | 저장 버튼 탭 후 저장 상태가 즉시 보임 | User | [사용자 기록 예정] | Pending | Android 실기기 |
| 앱 종료 후 재진입 | 저장 상태가 유지됨 | User | [사용자 기록 예정] | Pending | 실기기 재실행 필요 |

## User-Captured Manual Test Report
- Checklist prepared by: Tester
- Test reporter: User
- Analysis status: Under Review
- Raw report source: Codex chat 2026-04-05
- Raw feedback preserved: Yes
- Detailed feedback location: `WALKTHROUGH.md > Developer Feedback Handoff`
- Tester synthesis: 저장 버튼 반응은 정상으로 보이나, 재진입 후 유지 여부는 사용자 답변 대기

## Developer Feedback Handoff
- Handoff status: Ready
- Raw feedback source: Codex chat 2026-04-05 + `WALKTHROUGH.md > User-Captured Manual Test Report`
- Detailed feedback by screen / flow: 저장 직후 반응은 괜찮지만, 재진입 시 유지 여부와 저장 성공 피드백의 명확성은 사용자 상세 답변을 그대로 첨부해 개발자가 읽어야 함
- Confirmed mismatches / bugs: 아직 없음
- Improvement ideas from user: 저장 성공 피드백이 더 분명하면 좋다는 의견을 받을 수 있음
- Open product questions: 재진입 후 유지 표시는 어느 수준으로 강조할지
```

#### 6.11.5 사용자가 남기는 실기기 결과 예시
사용자에게는 pass/fail만 아니라 기대와 실제 차이, 거칠게 느껴진 지점, 완성도를 높일 개선점까지 함께 적어 달라고 안내합니다.

```markdown
## User Test Results
- Check Item: 홈 화면에서 오늘의 표현 저장
  - Actual result: 저장 버튼을 누르자 바로 Saved 상태가 보였다.
  - Pass / Fail guess: Pass
  - Notes: 애니메이션은 약간 느렸지만 저장은 됐다. 저장 완료가 좀 더 분명하게 느껴지면 안심될 것 같다.

- Check Item: 앱 종료 후 재진입
  - Actual result: 다시 열었을 때 Saved 표시가 유지됐다.
  - Pass / Fail guess: Pass
  - Notes: 두 번 반복해도 같았다. 다만 처음 저장 직후에는 정말 저장됐는지 확신이 약해서 문구나 모션이 더 분명하면 좋겠다.

## Detailed User Feedback
- Screen / Flow: 홈 화면 저장
  - What matched expectations: 저장 자체는 바로 됐다.
  - What felt confusing or rough: 저장 완료가 충분히 강하게 느껴지지 않았다.
  - What should change to feel complete: 저장 성공 피드백을 더 분명하게 보여주면 좋겠다.
  - Additional notes: 재진입 후 유지되는 건 좋았다.
```

이 원문을 그대로 최종 판정으로 쓰지 않고, Tester가 먼저 `User Report Alignment`로 정리한 뒤 `Manual Test Checklist`, `User-Captured Manual Test Report`, `Developer Feedback Handoff`, `Latest Result`에 반영합니다. 핵심은 사용자 상세 피드백을 한 줄 요약으로 압축하지 않고 개발 handoff까지 보존하는 것입니다.

#### 6.11.6 `REVIEW_REPORT.md` 예시
```markdown
## Approval Status
- Static Review Status: Approved
- Release Readiness: Partial
- Requirement Baseline Reviewed: RB-2026-04-05-A
- Requirements Sync Check: Pass
- Green Level Reviewed: Package
- Branch Freshness Reviewed: Fresh
- Release Blocking Issues: Yes

## Residual Release Risks
- Manual / environment-specific verification: iOS 실기기 저장 유지 검증 미완료
- Dependency / compliance gate: 없음
- Requirement / artifact sync gate: 닫힘
- Deferred product decisions: 서버 동기화는 다음 버전 범위
```

#### 6.11.7 `DEPLOYMENT_PLAN.md` 예시
```markdown
## Release Status
- Ready to Deploy: No
- Requirement Baseline for Release: RB-2026-04-05-A
- Requirements Sync Gate: Closed
- Reviewer Gate: Closed
- Manual / Environment Gate: Open
- Dependency / Compliance Gate: Closed
- Current Green Level: Package
- Branch Freshness for Release: Fresh

## Validation Gate Notes
- branch freshness 판단: `main` 기준 fresh
- 사용자 수동 테스트 / raw report 처리 상태: Android 결과는 반영 완료, iOS 결과 대기
- release-ready 차단 요소: iOS manual gate open
```

#### 6.11.8 초보자가 특히 기억할 것
- `Targeted` green은 “현재 범위는 좋아 보임”이지 “곧바로 배포 가능”이 아닙니다.
- 사용자 실기기 테스트 원문은 증거이지 최종 판정 문장이 아닙니다.
- 사용자 수동 테스트의 핵심은 pass/fail 체크만이 아니라, 문서/대화로 합의한 기대 결과와 실제 제품의 차이를 자세히 수집해 다음 개발 loop로 돌려보내는 것입니다.
- stale branch는 제품 결함과 다른 종류 문제입니다.
- handoff에는 긴 회고보다 `First Action`이 더 중요합니다.

---

## 7. 실전 개발 흐름 따라하기
이제 아주 짧은 예시로 전체 흐름을 따라가 보겠습니다.

### 예시 상황
문과생 사용자가 말합니다.

“영어 학습 앱에 오늘의 표현 하나를 저장하는 기능을 추가하고 싶어요.”

이때 흐름은 보통 아래처럼 갑니다.

### 7.1 Planner 단계
Planner가 해야 할 일:
- 요구사항을 정리합니다.
- 이번 기능이 어디까지 필요한지 묻습니다.
- `REQUIREMENTS.md`를 채웁니다.
- 사용자의 승인 전에는 다음 단계로 넘기지 않습니다.

Planner가 사용자에게 물어봐야 할 것 예시:
- 이 기능은 누가 쓰나요?
- 저장은 로컬인가요, 서버인가요?
- 저장만 필요한가요, 목록 보기와 삭제도 필요한가요?
- 이번 버전에 꼭 필요한 범위는 어디까지인가요?

Planner가 갱신할 문서:
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `IMPLEMENTATION_PLAN.md`
- `TASK_LIST.md`
- `CURRENT_STATE.md`

Planner가 다음 역할에게 넘겨야 할 것:
- 승인된 요구사항
- 아키텍처 경계
- 현재 iteration
- Task ID와 Scope

### 7.2 Developer 단계
Developer가 해야 할 일:
- Quick Read 위주로 필요한 문서만 읽습니다.
- `TASK_LIST.md > ## Active Locks`를 확인합니다.
- 내가 맡은 Task를 점유합니다.
- 승인된 구조 안에서 구현합니다.

Developer가 스스로 점검할 것:
- 내가 건드리는 Scope가 다른 Agent와 겹치지 않는가
- 구조를 바꾸는 일이 생기지 않는가
- 문서 사실관계가 바뀌었는가

Developer가 갱신할 문서:
- 코드 파일
- 작업 중에는 필요 시 `CURRENT_STATE.md`
- lock을 잡거나 풀 때 `TASK_LIST.md`
- 역할 전환, 세션 종료, lock handoff가 있을 때만 handoff 기록

### 7.3 Tester 단계
Tester가 해야 할 일:
- 현재 구현이 요구사항과 맞는지 확인합니다.
- 성공했다고 추측하지 않습니다.
- 실행 결과를 `WALKTHROUGH.md`에 남깁니다.
- 진행 중 주의점이나 다음 확인 포인트는 먼저 `CURRENT_STATE.md`에 남깁니다.

Tester가 확인할 것:
- 실제 저장이 되는가
- 실패 상황이 있는가
- 요구사항에 없는 기능이 멋대로 들어갔는가

### 7.4 Reviewer 단계
Reviewer가 해야 할 일:
- 구조를 어기지 않았는지 봅니다.
- 민감 정보 노출이 없는지 봅니다.
- 배포 가능한 상태인지 판단합니다.
- 리뷰가 끝났을 때 `REVIEW_REPORT.md`를 1회 갱신합니다.
- 현재 release를 막는 문제와 문서 체계 정비 문제를 섞지 않습니다.

### 7.5 DevOps 또는 Documenter 단계
상황에 따라 두 갈래로 갑니다.

**배포가 필요한 경우**
- DevOps가 `DEPLOYMENT_PLAN.md`를 기준으로 배포합니다.
- 배포 직전 gate 판단과 배포 직후 결과를 1회씩 정리합니다.
- 문서 체계 정비가 필요하더라도 현재 배포를 막지 않으면 별도 follow-up으로 분리합니다.

**하루만 마감하는 경우**
- Documenter 또는 `day_wrap_up` 흐름으로 문서 정리를 합니다.

**버전을 닫는 경우**
- `version_closeout`을 사용해 archive를 정리합니다.

---

## 8. 왜 Planner가 가장 중요하고 가장 엄격해야 하는가
초보자가 가장 놓치기 쉬운 부분이 여기입니다.

많은 사람은 “일단 구현부터 해 보고 나중에 정리하면 되지 않을까?”라고 생각합니다.  
하지만 멀티-AI 협업에서는 이 방식이 특히 위험합니다.

### 왜 위험한가
Planner 문서가 덜 닫힌 상태에서 Developer로 넘기면:
- Developer가 빈칸을 자기 판단으로 채웁니다.
- Tester가 무엇을 기준으로 검증해야 하는지 애매해집니다.
- Reviewer가 뒤늦게 구조나 범위 문제가 있다고 말하게 됩니다.

즉, 뒤로 갈수록 비용이 더 커집니다.

### 이 저장소가 Planner에게 엄격한 이유
이 템플릿은 아래가 되기 전에는 handoff하면 안 되게 설계되어 있습니다.
- `REQUIREMENTS.md` 승인
- `ARCHITECTURE_GUIDE.md` 승인
- `IMPLEMENTATION_PLAN.md` 실행 가능 상태
- `TASK_LIST.md`의 Scope 작성
- placeholder 제거

### placeholder가 남은 문서를 넘기면 안 되는 이유
예를 들어 이런 문구가 남아 있다고 가정해 봅시다.
- `[요구사항]`
- `[개발 작업]`
- `[어떤 상태가 되면 충족인지]`

이 문구는 사람 눈에는 “아직 안 썼다”는 뜻이지만,  
AI 입장에서는 **형식상 텍스트가 들어 있는 칸**처럼 보일 수 있습니다.

그래서 이 템플릿은 placeholder가 남은 상태를 매우 위험하게 봅니다.

---

## 9. 병렬 작업에서 꼭 지켜야 할 것
여러 IDE, 여러 AI, 여러 역할이 동시에 움직일 때는 아래를 꼭 지켜야 합니다.

### 9.1 `## Active Locks`는 항상 직접 읽기
중요:
- `CURRENT_STATE.md`만 읽고 시작하면 안 됩니다.
- 항상 `TASK_LIST.md > ## Active Locks`를 직접 읽어야 합니다.

왜냐하면:
- 요약 문서는 조금 늦게 갱신될 수 있기 때문입니다.

### 9.2 Scope를 보고 충돌 판단하기
Task ID가 다르더라도 안전하지 않을 수 있습니다.

예:
- 내가 `DEV-01`
- 다른 AI가 `DEV-02`

겉으로는 달라 보여도:
- 둘 다 `src/auth/*`를 건드리면 충돌 가능성이 큽니다.

그래서 이 템플릿은 Task ID뿐 아니라 `Scope`를 같이 봅니다.

### 9.3 `pre-write refresh`는 “쓰기 직전 마지막 확인”
문서를 읽고 한참 생각한 뒤에 바로 쓰면 위험합니다.

중간에 다른 AI가 바꿨을 수 있기 때문입니다.

그래서 파일을 수정하기 직전에:
- 대상 파일
- `CURRENT_STATE.md`
- `TASK_LIST.md` 관련 범위
를 다시 읽습니다.

특히 문서 작업에서는:
- 작업 중 메모는 `CURRENT_STATE.md`
- 역할 전환 기록은 `TASK_LIST.md > ## Handoff Log`
- 리뷰 판단은 `REVIEW_REPORT.md`
- 배포 판단은 `DEPLOYMENT_PLAN.md`
처럼 문서 역할을 섞지 않는 것이 중요합니다.

### 9.4 언제 `CURRENT_STATE.md`를 그대로 믿지 말아야 하는가
아래 중 하나면 stale(오래되어 신뢰하기 어려운 상태)로 봅니다.
- `Sync Checked At`이 최신 handoff보다 과거
- `Task List Sync Check`가 `Needs Review`
- `Current locks to respect`와 실제 lock이 다름

이때는:
- `TASK_LIST.md`
- 최신 relevant handoff
- 필요 시 `HANDOFF_ARCHIVE.md`
를 다시 읽어야 합니다.

### 9.5 언제 사용자 판단을 받아야 하는가
아래 상황은 자동으로 넘기지 말고 사용자 판단을 받아야 합니다.
- 같은 Scope를 두 AI가 동시에 건드렸을 때
- stale lock인지 확신이 안 설 때
- 아키텍처를 바꿔야 할 때
- blocker를 어떻게 처리할지 애매할 때

### 9.6 언제 worktree를 쓰는가
worktree는 **작업 공간을 물리적으로 분리하는 방식**입니다.

이 저장소 기준으로 권장되는 상황:
- 동시에 2개 이상 Agent가 코드 파일을 수정할 때
- Scope가 같은 디렉터리로 겹칠 때
- 문서가 아니라 코드 충돌이 예상될 때

초보자는 이렇게 이해하면 됩니다.
- “서로 부딪힐 가능성이 높으면 아예 작업 책상을 나눠 쓰자”

---

## 10. 사용자 승인 처리는 어떻게 하는가
가끔은 AI가 계속 진행하기 전에 사용자의 짧은 확인이 필요한 경우가 있습니다.

예:
- 실기기 테스트를 지금 시작해도 되는지
- preview 접근 정보를 직접 제공할지
- production deploy를 진행해도 되는지

이 기본 템플릿은 이런 결정을 **현재 세션의 로컬 대화**로 처리합니다.

핵심 원칙:
- 먼저 artifact에 왜 멈췄는지 기록합니다.
- `LF` 정규화, `CURRENT_STATE.md` compact, validator 실행 같은 저위험 문서 건강 회복 작업은 묻지 않고 진행합니다.
- 짧은 사용자 결정이 필요하면 현재 세션에서 바로 확인하고 답을 기다립니다.
- secret, token, destructive action, 긴 설명이 필요한 논의는 blocker로 남기고 명시적 사용자 응답을 기다립니다.
- 모바일 전달과 별도 운영 계층은 기본 템플릿 범위에 포함하지 않습니다.
- 과거 원격 승인 확장 자산은 [`backup/remote_approval/`](backup/remote_approval/README.md)에만 보관되며 현재 기본 workflow에서는 사용하지 않습니다.

### 10.1 언제 artifact에 기록하는가
- `Needs User Decision`
- `manual gate pending`
- release 진행 전에 go/no-go 확인이 필요한 경우

기록 이유:
- 다음 AI가 들어와도 지금 왜 멈춰 있는지 알아야 하기 때문입니다.

### 10.2 기본 처리 순서
1. artifact에 gate나 blocker를 기록합니다.
2. 저위험 maintenance인지 판단합니다.
   - 맞으면 바로 적용하고 결과만 요약합니다.
3. 사용자 결정이 필요하면 현재 세션에서 로컬로 확인합니다.
4. 민감하거나 파괴적인 항목은 blocker로 유지합니다.

### 10.3 꼭 지켜야 할 주의점
- artifact 기록 없이 사용자 결정만 먼저 묻지 않습니다.
- secret, token, 민감 URL은 문서와 로그에 남기지 않습니다.
- 응답이 필요한 상태를 방치하지 않고 `CURRENT_STATE.md`와 `TASK_LIST.md`에 남깁니다.

---

## 11. 자주 하는 실수와 방지법
초보자가 자주 하는 실수를 먼저 알고 있으면 실수를 크게 줄일 수 있습니다.

### 실수 1. `CURRENT_STATE`만 보고 `TASK_LIST`를 안 읽음
문제:
- 실제 lock을 놓칠 수 있습니다.

방지:
- 시작할 때는 항상 `TASK_LIST.md > ## Active Locks`를 직접 봅니다.

### 실수 2. Planner 문서가 덜 닫혔는데 Developer를 부름
문제:
- Developer가 추측을 시작합니다.

방지:
- `Approved`, `Ready for Execution` 상태와 placeholder 제거를 확인합니다.

### 실수 3. handoff를 남기지 않음
문제:
- 다음 AI가 무엇을 이어받아야 하는지 모릅니다.

방지:
- 역할 전환, 세션 종료, lock handoff가 있을 때는 handoff 기록을 남깁니다.
- 단순 중간 진행 메모는 `CURRENT_STATE.md`에 남기고, 모든 턴마다 `TASK_LIST.md` handoff를 쓰지는 않습니다.

### 실수 4. blocker를 archive로 보내 버림
문제:
- 아직 해결되지 않은 위험이 과거 기록 속에 묻힙니다.

방지:
- archive 전에 `CURRENT_STATE.md > Open Decisions / Blockers`와 `TASK_LIST.md > ## Blockers`로 승격합니다.

### 실수 5. `day_wrap_up`과 `version_closeout`을 헷갈림
문제:
- 아직 진행 중인 버전을 너무 일찍 닫아 버릴 수 있습니다.

방지:
- 하루 마감이면 `day_wrap_up`
- 리뷰와 배포까지 끝나서 버전을 닫을 때만 `version_closeout`

### 실수 6. Scope를 안 적고 Task ID만 봄
문제:
- 서로 다른 Task처럼 보이지만 실제로는 같은 파일을 건드릴 수 있습니다.

방지:
- 개발, 테스트, 리뷰 Task에는 Scope를 반드시 적습니다.

### 실수 7. 리뷰/배포 문서를 중간 상태 메모장처럼 씀
문제:
- `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`를 자주 다시 맞추느라 토큰과 시간이 많이 듭니다.

방지:
- 작업 중 상태는 `CURRENT_STATE.md`
- 역할 전환 기록은 `TASK_LIST.md`
- 리뷰 종료 판단은 `REVIEW_REPORT.md` 1회
- 배포 직전/직후 판단은 `DEPLOYMENT_PLAN.md` 1회
처럼 문서 역할을 분리합니다.

### 실수 8. release blocker와 문서 정비 이슈를 섞음
문제:
- 지금 배포를 막는 문제인지, 나중에 정리할 harness debt인지 판단이 흐려집니다.

방지:
- 현재 release를 막는 문제는 review / deploy gate에 올립니다.
- schema mismatch, artifact 정리 같은 문서 체계 문제는 별도 maintenance follow-up으로 분리합니다.

---

## 12. 문과생용 용어 사전
이 절은 처음 보는 단어를 빠르게 이해하기 위한 작은 사전입니다.

- `AI 개발`: 사람이 목표를 정하고, AI가 문서를 기준으로 역할별 작업을 수행하는 개발 방식
- `IDE`: AI와 함께 작업하는 창 또는 작업 환경
- `모델`: 답을 만들고 추론하는 AI 엔진
- `에이전트`: 지금 AI가 맡은 역할
- `rule`: 가장 강한 운영 규칙
- `workflow`: 역할별 행동 절차서
- `skill`: 자주 하는 특정 작업을 위한 전문 가이드
- `artifact`: 실제 상태가 기록되는 문서
- `approval`: 사용자가 “이 상태로 다음 단계로 넘어가도 된다”고 승인하는 것
- `사용자 결정 대기`: 다음 단계 전에 사용자의 짧은 확인이 필요해 artifact에 남겨 둔 상태
- `low-risk maintenance`: 사용자 승인 없이 바로 적용하는 저위험 harness maintenance 작업
- `DDD`: 비즈니스 중심으로 구조를 나누는 설계 방식
- `scope`: 내가 지금 건드리는 작업 범위
- `lock`: “이 작업은 지금 누가 잡고 있다”는 점유 표시
- `stale`: 오래되어서 그대로 믿기 어려운 상태
- `handoff`: 다음 역할에게 작업을 넘기는 기록
- `worktree`: 같은 저장소를 충돌이 덜 나게 여러 작업 공간으로 나누는 방식
- `blocker`: 지금 바로 다음 단계로 못 넘어가게 막는 문제

---

## 13. 처음 시작할 때 읽는 최소 순서
이 절만 따로 봐도 시작은 가능합니다.

1. [AGENTS.md](AGENTS.md) 또는 IDE가 이미 노출한 동등한 entry guide
2. [workspace.md](.agents/rules/workspace.md)
3. [CURRENT_STATE.md](.agents/artifacts/CURRENT_STATE.md)
4. [TASK_LIST.md > ## Active Locks](.agents/artifacts/TASK_LIST.md)
5. `CURRENT_STATE.md > Must Read Next`
6. 내 역할의 workflow

기억할 한 줄:
- **매뉴얼보다 먼저 확인하는 것은 `AGENTS.md` entry guide, `workspace.md`, `CURRENT_STATE.md`, `TASK_LIST.md > ## Active Locks`입니다.**

---

## 14. 역할별 빠른 시작 표
처음에는 이 표만 봐도 방향을 잡기 쉽습니다.

| 내가 맡은 역할 | 가장 먼저 볼 것 | 그 다음 볼 것 | 끝날 때 꼭 할 것 |
|---|---|---|---|
| Planner | `CURRENT_STATE.md`, `REQUIREMENTS.md`, `TASK_LIST.md` | 필요 시 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` | 문서 승인 상태 점검, `CURRENT_STATE` 갱신, 필요 시 역할 전환 handoff |
| Designer | `CURRENT_STATE.md`, `REQUIREMENTS.md > Quick Read`, `TASK_LIST.md` | `UI_DESIGN.md`, 필요 시 `ARCHITECTURE_GUIDE.md > Quick Read` | UI 규칙 기록, 다음 역할과 scope 반영 |
| Developer | `CURRENT_STATE.md`, `TASK_LIST.md > ## Active Locks`, `REQUIREMENTS.md > Quick Read` | `ARCHITECTURE_GUIDE.md > Quick Read`, UI면 `UI_DESIGN.md` | lock 정리, `CURRENT_STATE` 갱신, 역할 전환 시 handoff |
| Tester | `CURRENT_STATE.md`, `TASK_LIST.md`, `REQUIREMENTS.md > Quick Read` | 필요 시 `IMPLEMENTATION_PLAN.md > Current Iteration`, `WALKTHROUGH.md` | 검증 결과 기록, blocker 승격, 역할 전환 시 handoff |
| Reviewer | `CURRENT_STATE.md`, `ARCHITECTURE_GUIDE.md > Quick Read`, `WALKTHROUGH.md` | `REQUIREMENTS.md > Quick Read`, `TASK_LIST.md` | `REVIEW_REPORT.md` 1회 정리, release blocker와 harness debt 구분 |
| DevOps | `CURRENT_STATE.md`, `DEPLOYMENT_PLAN.md > Quick Read`, `REVIEW_REPORT.md` | `TASK_LIST.md`, 필요 시 별도 배포 가이드 | `DEPLOYMENT_PLAN.md` 직전/직후 기록, 배포 blocker와 follow-up 구분 |
| Documenter | `CURRENT_STATE.md`, `TASK_LIST.md` | `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, 필요 시 `HANDOFF_ARCHIVE.md` | 하루 정리 또는 버전 종료 정리 |

---

## 15. 마지막 정리
이 템플릿의 핵심은 “AI가 똑똑하니까 알아서 하겠지”가 아닙니다.

핵심은 아래입니다.
- 규칙은 `workspace.md`에 모아 둔다.
- 현재 시작점은 `CURRENT_STATE.md`로 압축한다.
- 실제 점유와 상태는 `TASK_LIST.md`에서 확인한다.
- 역할은 workflow로 나눈다.
- 반복 작업은 skill로 표준화한다.
- 기록은 artifact에 남긴다.

문과생 초보자가 이 저장소에서 가장 먼저 익혀야 할 감각은 하나입니다.

**“AI를 믿기 전에 문서를 먼저 믿는다.”**

이 감각만 익히면:
- 여러 AI가 들어와도
- 세션이 끊겨도
- IDE가 달라도
- 프로젝트 흐름을 다시 이어가기 쉬워집니다.
