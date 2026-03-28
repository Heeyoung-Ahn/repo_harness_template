# Repo Harness Backup Guide

이 폴더는 사용 중이던 `repo-level harness` 백업본입니다.

## 어떻게 열어야 하나
- `repo_harness` 폴더 자체를 workspace root로 엽니다.
- 상위 폴더에서 하위 폴더로만 접근하면, 문서 안 상대 경로를 사람이 해석할 때 헷갈릴 수 있습니다.
- 내부 링크는 이 폴더를 루트로 봤을 때 맞게 정리되어 있습니다.

## 다시 사용할 때 기준
1. 이 폴더를 그대로 열거나, 통째로 복제한 뒤 복제본을 엽니다.
2. 시작 순서는 `AGENTS.md -> .agents/rules/workspace.md -> .agents/artifacts/CURRENT_STATE.md`입니다.
3. 필요한 문서만 `CURRENT_STATE.md > Must Read Next`에 따라 추가로 읽습니다.

## 주의할 점
- 이 폴더는 `full_harness`처럼 validator 스크립트와 CI 구성이 포함된 full harness 패키지가 아닙니다.
- 백업본 안의 `.git`은 당시 상태를 보존하기 위한 것이므로, 새 프로젝트에 그대로 가져갈지 여부는 별도로 판단해야 합니다.
- 운영 설명이 필요할 때만 `PROJECT_WORKFLOW_MANUAL.md`를 읽습니다.
