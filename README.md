# Repo-Level Governance Harness Template

이 저장소는 원본 `repo-level governance harness` 템플릿입니다.

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
- `PROJECT_WORKFLOW_MANUAL.md`: 템플릿 사용자를 위한 인간용 설명서

위 두 문서는 운영 프로세스 입력 문서가 아니며, live state나 gate 판단 근거로 사용하지 않습니다.

## 저장소 구성 빠른 지도
- [`.agents/`](.agents): 운영 정본. rules, workflows, artifacts, skills, scripts가 모두 여기에 있음
- [`backup/remote_approval/`](backup/remote_approval/README.md): 기본 템플릿에서 제외한 원격 승인 확장 기능 보관소
- [`docs/`](docs): 현재 기본 템플릿에서는 비어 있을 수 있는 사용자용 보조 문서 영역
- [`tools/`](tools): 현재 기본 템플릿에서는 비어 있을 수 있는 repo-specific 도구 영역
- [`PROJECT_WORKFLOW_MANUAL.md`](PROJECT_WORKFLOW_MANUAL.md): 초보자용 설명서. 선택적으로만 읽음

## 열기 기준
- `repo_harness_template` 폴더 자체를 workspace root로 엽니다.
- 상위 폴더에서 하위 폴더로만 접근하면 상대 경로 기준이 흔들릴 수 있습니다.

## 템플릿 개선 환류 기준
실제 프로젝트 운영 중 process/document 문제가 드러나면 아래 순서로 템플릿에 반영합니다.

1. `CURRENT_STATE.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, 최신 handoff에서 근거를 수집합니다.
2. 제품 고유 사실을 제거하고 재사용 가능한 운영 규칙만 일반화합니다.
3. 반영 대상을 `.agents/artifacts/*.md`, `.agents/workflows/*.md`, `.agents/skills/*`, `.agents/rules/*.md` 중에서 고릅니다.
4. 요구사항 변경 sync, reviewed scope, release-ready gate 같은 운영 경계를 템플릿 규칙으로 환류합니다.

Windows에서 한국어 문서를 수정할 때는 `apply_patch` 또는 explicit UTF-8 read/write 경로를 사용합니다.
