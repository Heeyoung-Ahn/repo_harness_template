# Repo-Level Governance Harness Template

이 저장소는 원본 `repo-level governance harness`의 self-hosting 템플릿 저장소입니다.

기본 템플릿 범위는 **repo 안에서 요구사항, 계획, task, 검증, review, deploy gate를 문서와 validator로 운영하는 구조**입니다.  
선택형 원격 승인 확장 기능은 기본 흐름에서 제외되었고, 관련 자산은 [`backup/remote_approval/`](backup/remote_approval/README.md) 아래로 이관되어 있습니다.

## 이 README의 역할
- 이 문서는 GitHub 저장소 소개용 문서입니다.
- 운영 프로세스의 정본이 아닙니다.
- 실제 작업 중 라우팅, 상태, gate 판단, handoff 근거로 사용하지 않습니다.

## 이 템플릿의 정의
- 목적: repo 안에서 요구사항, 아키텍처, 구현 계획, Task, 검증, 리뷰, 배포 gate를 문서와 validator로 관리합니다.
- 성격: `full harness`처럼 CI, custom lint, runtime execution harness까지 모두 포함한 패키지는 아닙니다.
- 범위: `repo-level governance`를 먼저 닫는 템플릿입니다.

## 이 템플릿 사용법
이 저장소는 보통 아래 순서로 사용합니다.

1. 템플릿 저장소를 받아둘 별도 workspace를 만들고, 폴더 이름을 `repo_harness_template`로 둡니다.
2. 그 폴더에 이 GitHub 저장소를 clone 또는 pull합니다.
3. 이 self-hosting 템플릿 저장소의 현재 root 구조는 대략 아래와 같습니다.
   - `.agents/`
   - `backup/`
   - `templates/`
   - `templates_starter/`
   - `AGENTS.md`
   - `README.md`
4. 완전히 새 프로젝트를 이 템플릿으로 시작할 때는 `templates_starter/` 하위 내용을 새 프로젝트의 root에 그대로 복사해 사용합니다.
5. 이미 운영 중인 프로젝트에 표준 템플릿을 적용할 때는 이 `repo_harness_template` 저장소를 Codex에서 열고, 대상 프로젝트 경로를 알려 준 뒤 표준 템플릿 적용을 요청합니다.

주의:
- `.agents`는 점이 포함된 실제 폴더명입니다.
- `repo_harness_template`는 템플릿 저장소를 관리하는 workspace 이름으로 이해하는 편이 정확합니다.
- 실제 제품 프로젝트의 이름은 별도로 정하고, 그 프로젝트 root에 `templates_starter` 내용을 복사해 시작합니다.

## 이 저장소의 3계층 구조
- root live 문서: 이 저장소 자체를 운영하는 self-hosting 문서와 스크립트
- reset source: version closeout reset canonical source인 [`templates/version_reset/artifacts/`](templates/version_reset/artifacts)
- starter template: 새 프로젝트 루트로 그대로 복사해 시작할 assembled starter source인 [`templates_starter/`](templates_starter)

즉, root의 `.agents/*`는 이 저장소 운영용이고, downstream 프로젝트에 배포할 표준 source는 `templates_starter/*`와 `templates/version_reset/artifacts/*`에서 관리합니다.

## 현재 기본 템플릿 범위
- 포함: `.agents/rules`, `.agents/workflows`, `.agents/artifacts`, `.agents/skills`, validator / reset 스크립트
- 기본 전제: 사용자 승인과 짧은 결정은 현재 세션의 로컬 대화에서 처리
- 제외: watcher, scheduler, registry, mobile routing, 별도 원격 승인 runtime
- 보관 위치: 원격 승인 관련 자산은 [`backup/remote_approval/`](backup/remote_approval/README.md)에만 남아 있으며 기본 workflow에서는 참조하지 않음

## 시작 경로 요약
IDE가 `AGENTS.md`를 이미 진입 안내로 노출했는지에 따라 첫 단계만 다릅니다.

1. `AGENTS.md`가 이미 노출된 환경이라면 첫 repo 파일로 [`.agents/rules/workspace.md`](.agents/rules/workspace.md)를 엽니다.
2. `AGENTS.md`가 자동으로 보이지 않는 환경이라면 먼저 [`AGENTS.md`](AGENTS.md)를 읽고 같은 경로로 진입합니다.
3. 그다음 [`.agents/artifacts/CURRENT_STATE.md`](.agents/artifacts/CURRENT_STATE.md)를 읽습니다.
4. 반드시 [`.agents/artifacts/TASK_LIST.md > ## Active Locks`](.agents/artifacts/TASK_LIST.md)를 직접 확인합니다.
5. 추가 문서는 `CURRENT_STATE.md > Must Read Next`에 적힌 것만 읽습니다.

## 실제 운영 문서
작업 중에는 아래 문서만 프로세스 입력으로 사용합니다.

1. `AGENTS.md` 또는 IDE가 노출한 동등한 진입 안내
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md > ## Active Locks`
5. `CURRENT_STATE.md > Must Read Next`에 적힌 추가 문서

## 비운영 문서
- `README.md`: GitHub 표시용 문서
- `templates_starter/PROJECT_WORKFLOW_MANUAL.md`: starter template 사용자를 위한 인간용 설명서

위 두 문서는 운영 프로세스 입력 문서가 아니며, live state나 gate 판단 근거로 사용하지 않습니다.

## 저장소 구성 빠른 지도
- [`.agents/`](.agents): 이 저장소 자체를 운영하는 live 문서, skill, script
- [`templates_starter/`](templates_starter): downstream 프로젝트에 배포할 assembled starter root
- [`templates/version_reset/artifacts/`](templates/version_reset/artifacts): version closeout reset canonical source
- [`.agents/scripts/sync_template_docs.ps1`](.agents/scripts/sync_template_docs.ps1): starter template를 운영 프로젝트에 반영하는 rollout 스크립트
- [`.agents/runtime/downstream_target_presets.psd1`](.agents/runtime/downstream_target_presets.psd1): 운영 중인 대상 프로젝트 preset 목록
- [`backup/remote_approval/`](backup/remote_approval/README.md): 기본 템플릿에서 제외한 원격 승인 확장 기능 보관소
- [`templates_starter/PROJECT_WORKFLOW_MANUAL.md`](templates_starter/PROJECT_WORKFLOW_MANUAL.md): 실제 starter template용 사용자 설명서

## 열기 기준
- `repo_harness_template` 폴더 자체를 workspace root로 엽니다.
- 상위 폴더에서 하위 폴더로만 접근하면 상대 경로 기준이 흔들릴 수 있습니다.

## 운영 프로젝트 반영 방식
- 운영 중인 프로젝트 반영은 수동 복사가 아니라 [`.agents/scripts/sync_template_docs.ps1`](.agents/scripts/sync_template_docs.ps1)로 수행합니다.
- 반복적으로 쓰는 대상군은 [`.agents/runtime/downstream_target_presets.psd1`](.agents/runtime/downstream_target_presets.psd1) preset으로 관리합니다.
- 기본 sync는 대상 프로젝트의 live `.agents/artifacts/*`를 덮어쓰지 않습니다.
- 필요하면 `-ListPreset`, `-Preset active_operating_projects`, `-WhatIf`로 대상과 반영 범위를 먼저 확인할 수 있습니다.

## 템플릿 개선 환류 기준
실제 프로젝트 운영 중 process/document 문제가 드러나면 아래 순서로 템플릿에 반영합니다.

1. `CURRENT_STATE.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, 최신 handoff에서 근거를 수집합니다.
2. 제품 고유 사실을 제거하고 재사용 가능한 운영 규칙만 일반화합니다.
3. self-hosting only 변경인지 downstream 공통 동작 변경인지 먼저 분류합니다.
4. downstream 공통 동작이면 `templates_starter/*`, 필요 시 `templates/version_reset/artifacts/*`를 canonical source로 갱신합니다.
5. self-hosting 변경이면 root live 문서와 스크립트에만 반영합니다.
6. rollout이 필요하면 `sync_template_docs.ps1`와 preset 기준으로 운영 프로젝트에 반영합니다.
7. 요구사항 변경 sync, reviewed scope, release-ready gate 같은 운영 경계를 템플릿 규칙으로 환류합니다.

Windows에서 한국어 문서를 수정할 때는 `apply_patch` 또는 explicit UTF-8 read/write 경로를 사용합니다.
