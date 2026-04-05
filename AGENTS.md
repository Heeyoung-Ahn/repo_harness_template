# AI Agent Guide (Self-Hosting Template Repo)

**[CRITICAL WARNING FOR ALL AI AGENTS]**
- 이 저장소는 `repo-level governance harness`의 self-hosting 원본 저장소입니다.
- 이 폴더(`repo_harness_template`) 자체를 workspace root로 열어야 합니다. 상위 폴더에서 하위 폴더로만 접근하면 상대 경로 기준이 달라질 수 있습니다.
- 시작할 때 가장 먼저 [`.agents/rules/workspace.md`](.agents/rules/workspace.md)를 읽습니다.
- 그다음 바로 [`.agents/artifacts/CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md)를 읽습니다.
- 실제 점유 상태와 현재 Task 범위는 [`.agents/artifacts/TASK_LIST.md > ## Active Locks`](.agents/artifacts/TASK_LIST.md)에서 직접 확인합니다.
- 추가 문서는 `CURRENT_STATE.md > Must Read Next`에 적힌 것만 읽습니다.
- 요약 문서와 상세 문서가 충돌하면 상세 문서가 우선이며, 즉시 `CURRENT_STATE.md`를 정정해야 합니다.
- root의 `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md`, `.agents/scripts/*.ps1`, `.agents/artifacts/*.md`는 이 저장소 자체를 운영하는 live 문서입니다.
- downstream 프로젝트 시작용 full starter는 `templates/project`에 따로 있습니다.
- downstream repo의 version closeout reset source는 `templates/version_reset/artifacts`에 canonical하게 관리하고, starter 내부에도 같은 경로로 포함합니다.
- downstream 기본 동작을 바꾸는 작업이면 [`.agents/rules/template_repo.md`](.agents/rules/template_repo.md)를 추가로 읽고, 같은 턴에 대응하는 `templates/project/*`와 필요 시 `templates/version_reset/artifacts/*`를 함께 갱신합니다.
- 읽기, 상태 확인, 당연한 사전 검토는 사용자에게 확인 질문 없이 진행합니다.
- 사용자가 명시적으로 오더한 실행은 범위, 대상, 실행 여부를 임의로 바꾸지 말고 그대로 수행합니다.
- 코드/문서 수정, 롤백, 빌드/배포, 백그라운드 프로세스 시작, 장시간 검증처럼 상태를 바꾸는 작업은 사용자 오더 기준의 짧은 실행 계획을 먼저 보여준 뒤 바로 수행합니다.
- 위 계획에서 벗어나야 하거나 오더 자체가 잘못되었으면, 실행 전에 이유와 대안을 설명하고 사용자 방향 확정 전까지 멈춥니다.
- 사용자가 명령어, 설명, 초안만 요청했다면 실제 실행, 백그라운드 실행, 추가 작업을 하지 않습니다.

`README.md`는 GitHub 표시용 문서이고, `templates/project/PROJECT_WORKFLOW_MANUAL.md`는 starter template 사용자를 위한 사람용 튜토리얼 매뉴얼입니다. 둘 다 운영 프로세스 입력 문서가 아닙니다.

`README.md`, `templates/project/PROJECT_WORKFLOW_MANUAL.md`, `.agents/artifacts/HANDOFF_ARCHIVE.md`는 기본 진입 문서가 아닙니다. 사람 설명이 필요하거나, 충돌 복구 / closeout / 회고가 필요할 때만 선택적으로 읽습니다.
