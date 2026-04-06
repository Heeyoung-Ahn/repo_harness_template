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
- `README.md`와 `templates_starter/PROJECT_WORKFLOW_MANUAL.md`는 사람용 설명 문서이며 운영 프로세스 입력 문서가 아닙니다.
- `README.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`, `HANDOFF_ARCHIVE.md`는 기본 진입 문서가 아닙니다.
- `CURRENT_STATE.md`는 replace-in-place snapshot이며, 실제 상태와 점유는 `TASK_LIST.md`가 우선합니다.
- 요약층과 상세 문서가 충돌하면 상세 문서가 우선이며, 즉시 `CURRENT_STATE.md`를 정정합니다.
- tracked 파일 수정, lock 변경, handoff 기록 전에는 `CURRENT_STATE.md`, `TASK_LIST.md`, 수정 대상 파일을 다시 확인합니다.

## 2. Runtime Priorities
- 운영 규칙의 최상위 정본은 이 `workspace.md`입니다.
- 이 root 경로의 문서와 스크립트는 `repo_harness_template` 저장소 자체를 운영하는 live 기준입니다.
- downstream 프로젝트에 배포되는 표준 source는 `templates_starter/*`와 root `templates/version_reset/artifacts/*`에서 따로 관리합니다.
- 이 저장소는 repo 안의 요구사항, 구조, 계획, 상태, review/deploy gate를 문서와 validator로 관리하는 `repo-level governance harness`의 self-hosting 원본입니다.
- 실제 프로젝트 상태의 단일 진실 공급원은 `.agents/artifacts/` 아래 문서입니다.
- `CURRENT_STATE.md`는 day-start용 resume router, `TASK_LIST.md`는 task / lock truth, `TASK_LIST.md > ## Handoff Log`는 최신 delta, `HANDOFF_ARCHIVE.md`는 오래된 원문 보관입니다.
- 역할 문서는 기본적으로 `Quick Read`, `Current Iteration`, `Latest Result`, `Approval Status`, `Must Read Next`에 적힌 범위만 읽습니다.
- `README.md`와 `templates_starter/PROJECT_WORKFLOW_MANUAL.md`는 설명용 문서이며, 운영 규칙과 live state 문서의 정본이 아닙니다.
- downstream 기본 동작을 바꾸는 변경이면 대응하는 `templates_starter/*` source와 필요 시 `templates/version_reset/artifacts/*`를 같은 턴에 갱신하고, root live 문서를 그대로 downstream으로 복사하지 않습니다.
- downstream 프로젝트 반영은 `.agents/scripts/sync_template_docs.ps1`를 통해 수행하고, 기본 동작은 대상 repo의 live `.agents/artifacts/*` 보존입니다.

## 3. Context Budget
- 기본 전략은 `CURRENT_STATE -> TASK_LIST relevant scope -> Must Read Next`입니다.
- `CURRENT_STATE.md`는 가능하면 120줄 이하, 800단어 이하로 유지합니다.
- `TASK_LIST.md > ## Handoff Log`는 최신 live item 5개 이내를 기본값으로 둡니다.
- 오래된 handoff는 `HANDOFF_ARCHIVE.md`로 옮기고, 필요한 요약만 `CURRENT_STATE.md`에 남깁니다.
- `Latest Handoff Summary`, `Task Pointers`, `Recent History Summary`에는 같은 원문을 반복 복사하지 않고 resume에 필요한 delta만 남깁니다.
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
- low-risk harness maintenance (`LF` 정규화, `CURRENT_STATE.md` compact, live handoff reorder, validator 실행, non-destructive sync, read-only verification)는 사용자 승인 없이 바로 적용한 뒤 결과만 요약합니다.
- If a short user decision is still needed, record the gate in artifacts first and keep it as a local user decision in the active session.
- secret, token, destructive filesystem / git action, 장문 토론이 필요한 질문은 명시적 사용자 응답이 필요한 blocker로 유지합니다.
- `CURRENT_STATE.md > Snapshot`의 `Current Stage`, `Current Focus`, `Current Release Goal`과 `TASK_LIST.md > Current Release Target`은 항상 같은 값으로 유지합니다.
- `version_closeout`으로 새 버전을 시작할 때는 자유서술 새 Draft 문서를 쓰지 말고 `powershell -ExecutionPolicy Bypass -File ".agents/scripts/reset_version_artifacts.ps1"`로 reset 대상 문서를 복원한 뒤 starter content만 채웁니다.
- artifact harness 오류는 별도 정비 작업으로 분리하고, release blocker인지 아닌지를 명시합니다.
- downstream 템플릿 source를 바꿨다면 `templates_starter/*`, `templates/version_reset/artifacts/*`, `.agents/scripts/sync_template_docs.ps1` 기준도 함께 확인합니다.
- `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md`, `.agents/artifacts/*.md`를 수정했다면 handoff 전에 아래 validator를 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/check_harness_docs.ps1"
```

## 8. Security and Language
- API Key, Secret, Token, 개인정보를 코드와 문서에 하드코딩하지 않습니다.
- 민감값과 사용자 데이터는 로그, 디버그 출력, 문서에 평문으로 남기지 않습니다.
- 원격 알림에는 `Task ID`, 짧은 결정 문장, 선택지, 기본 동작만 보내고, 토큰/secret/민감 URL은 보내지 않습니다.
- `.agents/artifacts/*.md`, `.agents/rules/*.md`, `AGENTS.md`, `README.md`, `docs/*.md`는 UTF-8 without BOM으로 유지합니다.
- 위 문서를 shell로 다룰 때는 explicit UTF-8 read/write를 사용합니다.
- artifact 본문 설명, 요약, blocker, handoff는 기본적으로 한국어로 작성합니다.
- 코드 식별자, 파일명, 경로, 명령어, 고정 상태 라벨은 영어를 유지할 수 있습니다.

## 9. Explicit User Orders
- 읽기, 상태 확인, 당연한 사전 검토는 사용자에게 확인 질문 없이 진행합니다.
- 사용자가 명시적으로 오더한 실행은 범위, 대상, 실행 여부를 임의로 축소, 확장, 변경하지 않고 그대로 수행합니다.
- 코드/문서 수정, 롤백, 빌드/배포, 백그라운드 프로세스 시작, 장시간 검증, 기타 repo/product state를 바꾸는 작업을 시작하기 전에는 사용자 오더 기준의 짧은 실행 계획을 먼저 공유합니다.
- 위 계획이 사용자 오더를 그대로 반영한다면 추가 승인 질문 없이 바로 실행합니다.
- 실행 중 목표, 범위, 대상 환경, 실행 종류, 명령어 세트가 달라져야 하면 작업을 멈추고 이유, 대안, 영향을 짧게 설명한 뒤 사용자 확정 전까지 진행하지 않습니다.
- 사용자가 명령어, 설명, 초안만 요청했다면 실제 실행, 백그라운드 실행, 추가 작업을 하지 않습니다.
- 부분 롤백, 부분 배포, 누락된 후속 실행, 무단 백그라운드 작업처럼 사용자 오더에서 벗어나는 동작은 금지합니다.

## 10. User Decision Handling
- 기본 사용자 응답 경로는 현재 세션의 로컬 대화입니다.
- presence, repo registry, 모바일 채널, watcher 같은 사용자별 runtime 구성은 기본 템플릿 범위에 포함하지 않습니다.
- repo template 안에 원격 승인용 watcher / scheduler / registry / mobile routing 스크립트를 다시 추가하지 않습니다.
- 짧은 사용자 결정이 남으면 artifact에 gate 상태를 기록하고 현재 세션 응답 대기로 유지합니다.
- low-risk maintenance는 artifact health를 회복하는 범위에서만 자동 적용합니다. 코드/데이터/배포 상태를 바꾸는 실제 제품 동작은 여기에 포함하지 않습니다.
- secret, token, destructive action, 장문 논의가 필요한 항목은 명시적 사용자 응답 전까지 blocker로 유지합니다.

## 11. Template Source Split
- root live 문서/스크립트와 `templates_starter/*`, `templates/version_reset/artifacts/*` deployable source는 목적이 다르므로 같은 파일로 취급하지 않습니다.
- self-hosting 전용 규칙, validator, handoff, 운영 메모는 root에만 남기고 template source로 되밀지 않습니다.
- downstream 공통 동작 중 starter 문서/workflow/skill/script는 `templates_starter/*` source에서, version close reset template는 root `templates/version_reset/*`에서 canonical하게 관리합니다.
- artifact schema나 starter content를 바꾸면 `templates/version_reset/artifacts/*`, `templates_starter/.agents/artifacts/*`, `templates_starter/templates/version_reset/artifacts/*`, 관련 reset/validator/sync 경로와 필요한 downstream sync 절차를 함께 갱신합니다.

## 12. Self-Hosting Standard Template Operations
- self-hosting 표준 템플릿 운영은 기본적으로 `AGENTS.md`, `workspace.md`, `template_repo.md`, `CURRENT_STATE.md`, `TASK_LIST.md`만으로 재현 가능해야 합니다.
- `.agents/workflows/*.md`는 선택 참고 자료이며, 이 저장소 운영의 필수 입력 문서로 가정하지 않습니다.
- workflow 문서가 없거나 오래되었더라도, rules / artifacts / canonical source 기준만으로 작업을 계속 진행할 수 있어야 합니다.
- 운영 프로젝트에서 가져온 공통 변경은 먼저 `self-hosting only`, `shared starter-bound source`, `shared skill mirrored in root and starter`, `live project artifact only` 중 하나로 분류합니다.
- 분류가 끝나기 전에는 복사나 rollout을 시작하지 않습니다. 모호하면 사용자에게 확인받습니다.
- project-specific 값(앱 이름, package name, task ID, provider 이름, 화면명, 계정/URL/secret)은 canonical source 반영 전에 일반화합니다.
- shared skill은 `SKILL.md` 한 파일이 아니라 스킬 폴더 전체 단위로 취급합니다. 새 `references/`, `scripts/`, `assets/`가 생겼으면 함께 반영합니다.
- 운영 프로젝트에서 검증된 공통 변경을 표준 템플릿과 sibling 운영 프로젝트로 가져올 때는 root `.agents/skills/operating-common-rollout/*` 절차를 기본값으로 사용합니다.
- 표준 순서는 `source project 검증 확인 -> root canonical source 갱신 -> starter 대응 source 갱신 -> sync_template_docs.ps1 rollout -> root/target validator 및 diff 확인`입니다.
- self-hosting 전용 운영 스킬, validator, 메모는 root에만 두고 `templates_starter`나 downstream 운영 프로젝트로 복사하지 않습니다.
