# AI Agent Guide (Shared Multi-AI Entry Guide)

**[CRITICAL WARNING FOR ALL AI AGENTS]**
- 이 저장소는 원본 `repo-level governance harness` 템플릿입니다.
- 이 폴더(`repo_harness_template`) 자체를 workspace root로 열어야 합니다. 상위 폴더에서 하위 폴더로만 접근하면 상대 경로 기준이 달라질 수 있습니다.
- 시작할 때 가장 먼저 [`.agents/rules/workspace.md`](.agents/rules/workspace.md)를 읽습니다.
- 그다음 바로 [`.agents/artifacts/CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md)를 읽습니다.
- 실제 점유 상태와 현재 Task 범위는 [`.agents/artifacts/TASK_LIST.md > ## Active Locks`](.agents/artifacts/TASK_LIST.md)에서 직접 확인합니다.
- 추가 문서는 `CURRENT_STATE.md > Must Read Next`에 적힌 것만 읽습니다.
- 요약 문서와 상세 문서가 충돌하면 상세 문서가 우선이며, 즉시 `CURRENT_STATE.md`를 정정해야 합니다.
- 이 템플릿의 운영 프로세스 정본은 `.agents/rules/workspace.md`, `.agents/artifacts/*.md`, `.agents/workflows/*.md`, `.agents/skills/*`입니다.

`README.md`는 GitHub 표시용 문서이고, `PROJECT_WORKFLOW_MANUAL.md`는 사람용 튜토리얼 매뉴얼입니다. 둘 다 운영 프로세스 입력 문서가 아닙니다.

`README.md`, `PROJECT_WORKFLOW_MANUAL.md`, `.agents/artifacts/HANDOFF_ARCHIVE.md`는 기본 진입 문서가 아닙니다. 사람 설명이 필요하거나, 충돌 복구 / closeout / 회고가 필요할 때만 선택적으로 읽습니다.
