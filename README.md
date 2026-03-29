# Repo Harness Backup Guide

이 폴더는 `repo-level harness`를 독립 템플릿처럼 바로 복제해서 쓰기 위한 최소 운영 세트입니다

## 어떻게 열어야 하나
- `repo_harness` 폴더 자체를 workspace root로 엽니다.
- 상위 폴더에서 하위 폴더로만 접근하면, 문서 안 상대 경로를 사람이 해석할 때 헷갈릴 수 있습니다.
- 내부 링크는 이 폴더를 루트로 봤을 때 맞게 정리되어 있습니다.

## 다시 사용할 때 기준
1. 이 폴더를 그대로 열거나, 통째로 복제한 뒤 복제본을 엽니다.
2. 시작 순서는 `AGENTS.md -> .agents/rules/workspace.md -> .agents/artifacts/CURRENT_STATE.md -> .agents/artifacts/TASK_LIST.md > ## Active Locks`입니다.
3. 그다음 필요한 문서만 `CURRENT_STATE.md > Must Read Next`에 따라 추가로 읽습니다.

## 주의할 점
- 이 폴더는 `full_harness`처럼 validator 스크립트와 CI 구성이 포함된 full harness 패키지가 아닙니다.
- 백업본 안의 `.git`은 당시 상태를 보존하기 위한 것이므로, 새 프로젝트에 그대로 가져갈지 여부는 별도로 판단해야 합니다.
- 작업 중 turn-by-turn 상태 갱신은 `CURRENT_STATE.md` 위주로 처리하고, `TASK_LIST.md` handoff는 역할 전환이나 세션 종료 때만 추가하는 편이 가볍습니다.
- 리뷰 결과는 `REVIEW_REPORT.md`에서 1회 정리하고, 배포 판단은 `DEPLOYMENT_PLAN.md`에서 직전에 1회 정리합니다.
- artifact harness 정비는 가능하면 별도 maintenance 작업으로 분리하고, release blocker 여부만 명확히 남깁니다.
- 운영 설명이 필요할 때만 `PROJECT_WORKFLOW_MANUAL.md`를 읽습니다.

## 운영 중 발견한 개선점 되돌리기
실제 프로젝트에서 이 템플릿을 운영하다가 process/document 문제가 드러나면, 아래 순서로 템플릿에 환류합니다.

1. 근거 수집:
   `CURRENT_STATE.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, 최신 handoff에서 실제로 발생한 문제와 대응 결과를 먼저 확인합니다.
2. 일반화:
   제품 고유 copy, URL, feature name, 버전 메모는 제외하고 재사용 가능한 운영 규칙만 추립니다.
3. 반영 대상 선택:
   아티팩트 템플릿인지(`.agents/artifacts/*.md`), 워크플로우인지(`.agents/workflows/*.md`), 스킬인지(`.agents/skills/*`)를 먼저 구분합니다.
4. 운영 현실 우선:
   정적 검증과 실환경 검증, 코드 승인과 release-ready 승인, 기존 빌드 재사용과 새 빌드 필요 판단처럼 실제 운영에서 헷갈렸던 경계를 문서 구조로 분리합니다.
5. 요구사항 변경 환류:
   승인 후 중간에 요구사항이나 완료 기준이 바뀌면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`가 같은 기준선으로 같이 갱신되도록 템플릿 규칙과 validator를 반영합니다.
6. 기록 방식:
   템플릿에는 project-specific 사실을 넣지 말고, 필요하면 commit / handoff / changelog에만 source thread ID와 절대 날짜를 남깁니다.

Windows에서 한국어 문서를 수정할 때는 `apply_patch` 또는 explicit UTF-8 경로를 사용해 mojibake를 방지합니다.
