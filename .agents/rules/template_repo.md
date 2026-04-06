# Template Repo Rule

이 문서는 `repo_harness_template` 저장소에서 live 운영 문서와 downstream 배포용 template source를 어떻게 분리하는지 정의합니다.

## 1. 역할 구분
- root의 `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md`, `.agents/scripts/*.ps1`, `.agents/artifacts/*.md`는 이 저장소 자체를 운영하는 live 문서와 스크립트입니다.
- downstream 프로젝트에 배포할 표준 source는 `templates_starter/*`와 root `templates/version_reset/artifacts/*`에서 canonical하게 관리합니다.
- root live 문서를 그대로 downstream에 복사하지 않습니다.

## 2. Template Source Tree
- 새 프로젝트 시작용 assembled starter root: `templates_starter/`
- starter root 문서: `templates_starter/AGENTS.md`, `templates_starter/PROJECT_WORKFLOW_MANUAL.md`
- starter `.agents` 문서: `templates_starter/.agents/rules/*`, `templates_starter/.agents/workflows/*`, `templates_starter/.agents/scripts/*`, `templates_starter/.agents/skills/*`, `templates_starter/.agents/artifacts/*`
- version closeout canonical reset template: root `templates/version_reset/artifacts/*.md`
- downstream repo의 실제 reset path는 rollout 후 `templates/version_reset/artifacts/*.md`입니다.
- starter 내부 deployable mirror: `templates_starter/templates/version_reset/artifacts/*.md`

## 3. 언제 둘 다 수정해야 하는가
- downstream 기본 동작이 바뀌면 root live 문서와 별개로 대응하는 `templates_starter/*` source와 필요 시 root `templates/version_reset/artifacts/*`를 같은 턴에 갱신합니다.
- self-hosting 전용 운영 메모, validator 로직, local handoff 규칙처럼 이 저장소에서만 의미가 있는 변경은 root live 문서/스크립트에만 반영합니다.
- artifact schema, reset starter content, validator 기대 구조가 바뀌면 `templates/version_reset/artifacts/*`, `templates_starter/.agents/artifacts/*`, `templates_starter/templates/version_reset/artifacts/*`, 관련 script/validator/sync 경로를 함께 갱신합니다.

## 4. Sync Rules
- downstream 프로젝트 반영은 `.agents/scripts/sync_template_docs.ps1`로 수행합니다.
- sync 대상은 root live 문서가 아니라 `templates_starter/*` source와 root `templates/version_reset/*`입니다.
- self-hosting 저장소의 rollout preset은 `.agents/runtime/downstream_target_presets.psd1`에서 관리합니다.
- 운영 프로젝트 집합이 바뀌면 script를 수정하는 대신 preset 파일의 target 목록을 먼저 갱신합니다.
- 기존 운영 프로젝트에 rollout할 때 `sync_template_docs.ps1`는 기본적으로 대상 repo의 live `.agents/artifacts/*`를 보존합니다.
- live artifact까지 template starter로 덮어써야 하는 특수 migration이 아니면 `.agents/artifacts/*`는 별도 판단 없이 overwrite하지 않습니다.
- sync 후에는 가능하면 대상 repo에서 `check_harness_docs.ps1`를 다시 실행합니다.

## 5. Stop Conditions
- 어떤 변경이 self-hosting only인지 downstream 공통 동작인지 모호하면 추측하지 말고 사용자에게 분류를 확인받습니다.
- target repo에 local customization이 있어 template source를 그대로 덮어쓰면 위험하다면 먼저 범위를 분리하고 사용자 판단을 요청합니다.
