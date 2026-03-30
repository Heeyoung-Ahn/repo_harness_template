---
trigger: always_on
---

# AI Agent Guide (Shared Multi-AI Entry Guide)

## 1. Entry Load Policy (CRITICAL)
당신은 작업 시작 전 아래 순서만 읽습니다.

1. `AGENTS.md`
2. `CURRENT_STATE.md` (`.agents/artifacts/CURRENT_STATE.md`)
3. `TASK_LIST.md > ## Active Locks`와 본인 관련 Task row
4. `CURRENT_STATE.md > Must Read Next`에 적힌 문서와 섹션만 추가로 읽기

추가 규칙:
- 이 저장소는 원본 `repo-level governance harness` 템플릿입니다.
- `README.md`와 `PROJECT_WORKFLOW_MANUAL.md`는 사람용 설명 문서이며 운영 프로세스 입력 문서가 아닙니다.
- `README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`는 기본 진입 문서가 아닙니다.
- `CURRENT_STATE.md`는 replace-in-place snapshot이며, 실제 상태와 점유는 `TASK_LIST.md`가 우선합니다.
- 요약층과 상세 문서가 충돌하면 상세 문서가 우선이며, 즉시 `CURRENT_STATE.md`를 정정합니다.
- tracked 파일 수정, lock 변경, handoff 기록 전에는 `CURRENT_STATE.md`, `TASK_LIST.md`, 수정 대상 파일을 다시 확인합니다.

## 2. Runtime Priorities
- 운영 규칙의 최상위 정본은 이 `workspace.md`입니다.
- 이 템플릿은 repo 안의 요구사항, 구조, 계획, 상태, review/deploy gate를 문서와 validator로 관리하는 `repo-level governance harness`입니다.
- 실제 프로젝트 상태의 단일 진실 공급원은 `.agents/artifacts/` 아래 문서입니다.
- 역할 문서는 기본적으로 `Quick Read`, `Current Iteration`, `Latest Result`, `Approval Status`, `Must Read Next`에 적힌 범위만 읽습니다.
- `README.md`와 `PROJECT_WORKFLOW_MANUAL.md`는 설명용 문서이며, 운영 규칙과 live state 문서의 정본이 아닙니다.

## 3. Context Budget
- 기본 전략은 `CURRENT_STATE -> TASK_LIST relevant scope -> Must Read Next`입니다.
- `CURRENT_STATE.md`는 가능하면 120줄 이하, 800단어 이하로 유지합니다.
- `TASK_LIST.md > ## Handoff Log`는 최신 live item 5개 이내를 기본값으로 둡니다.
- 오래된 handoff는 `HANDOFF_ARCHIVE.md`로 옮기고, 필요한 요약만 `CURRENT_STATE.md`에 남깁니다.
- 작업 중 turn-by-turn 상태 기록은 `CURRENT_STATE.md`에만 남기고, `TASK_LIST.md` handoff는 역할 전환이나 세션 종료 때만 추가합니다.
- `REVIEW_REPORT.md`는 리뷰가 끝났을 때 1회 갱신하고, `DEPLOYMENT_PLAN.md`는 배포 직전/직후 1회 갱신합니다.

## 4. Requirement and Release Gates
- 필수 3문서 sync 기준: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`
- 요구사항이나 완료 기준이 바뀌면 Planner가 먼저 `REQUIREMENTS.md`를 갱신하고, 같은 턴에 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 기준선으로 맞춥니다.
- `IMPLEMENTATION_PLAN.md > Requirement Trace`는 승인된 `FR-*`, `NFR-*`와 active task를 연결합니다.
- 위 동기화가 끝나기 전에는 review gate와 deployment gate를 닫지 않습니다.
- release 가능 여부와 문서 체계 완성도는 같은 gate가 아닙니다. harness debt는 별도 maintenance follow-up으로 분리합니다.

## 5. Multi-AI Safety
- 개발, 테스트, 리뷰 태스크는 모두 안정적인 `Task ID`와 `Scope`를 가져야 합니다.
- 다른 Agent가 lock 중인 Task ID나 겹치는 Scope는 사용자 지시 없이 건드리지 않습니다.
- 코드 충돌 가능성이 있으면 `git worktree add`를 기본 대안으로 검토합니다.
- stale lock 회수가 조금이라도 모호하면 자동 정리하지 말고 `Needs User Decision`으로 올립니다.
- stale 판단 중 `manual gate pending`, `user decision pending` 같은 표식이 남아 있으면 자동 회수를 멈춥니다.

## 6. Pre-Write Refresh
repo-tracked 파일을 수정하기 직전 아래를 다시 확인합니다.
- 수정 대상 파일
- `CURRENT_STATE.md`
- `TASK_LIST.md`의 관련 Scope
- 필요 시 `git status`, `git diff`, 최근 touched 파일

위 문서가 마지막 확인 이후 바뀌었으면:
1. 수정을 멈춥니다.
2. 최신 상태를 다시 읽습니다.
3. 기존 계획이 여전히 안전한지 재판단합니다.
4. 충돌이면 사용자 판단을 요청합니다.

## 7. Handoff and Validation
- 작업 시작 시 관련 태스크를 `[-]`로 바꾸고 `## Active Locks`에 점유 정보를 추가합니다.
- 작업 종료 시 태스크 상태를 갱신하고 lock을 제거합니다.
- 다음 Agent가 꼭 알아야 할 blocker, user decision, manual gate만 `CURRENT_STATE.md`와 필요한 handoff에 남깁니다.
- artifact harness 오류는 별도 정비 작업으로 분리하고, release blocker인지 아닌지를 명시합니다.
- `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md`, `.agents/artifacts/*.md`를 수정했다면 handoff 전에 아래 validator를 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## 8. Security and Language
- API Key, Secret, Token, 개인정보를 코드와 문서에 하드코딩하지 않습니다.
- 민감값과 사용자 데이터는 로그, 디버그 출력, 문서에 평문으로 남기지 않습니다.
- `.agents/artifacts/*.md`, `.agents/rules/*.md`, `AGENTS.md`, `README.md`, `docs/*.md`는 UTF-8 without BOM으로 유지합니다.
- 위 문서를 shell로 다룰 때는 explicit UTF-8 read/write를 사용합니다.
- artifact 본문 설명, 요약, blocker, handoff는 기본적으로 한국어로 작성합니다.
- 코드 식별자, 파일명, 경로, 명령어, 고정 상태 라벨은 영어를 유지할 수 있습니다.
