---
name: Day Wrap Up
description: 같은 버전 작업을 마감할 때 현재 상태 요약, lock 정리, handoff compaction까지 포함해 다음 세션 진입 비용을 낮추는 스킬
---

# Day Wrap Up Skill

이 스킬은 **같은 버전 작업을 계속하는 중간 단계에서** 하루의 개발 사이클을 종료하기 전에 실행합니다. 목표는 다음 세션이 긴 문서를 다시 다 읽지 않아도 되게 만드는 것입니다.

> 이 스킬은 버전 아카이빙을 하지 않습니다. 리뷰와 배포가 끝난 버전을 정리할 때는 `version_closeout`을 사용합니다.

## 사전 조건
- 오늘 진행한 작업 내역이 존재해야 합니다.
- `TASK_LIST.md`와 `CURRENT_STATE.md`가 실제 상태를 어느 정도 반영하고 있어야 합니다.

## 마무리 절차

### 1단계: 오늘 작업과 문서 차이 확인
- `git status`, `git diff`, 관련 아티팩트 변경점을 확인합니다.
- `CURRENT_STATE.md`의 요약이 실제 코드/문서 상태와 어긋나면 먼저 맞춥니다.

### 2단계: Lock과 stale 항목 정리
- `TASK_LIST.md > ## Active Locks`를 확인합니다.
- 오늘 종료하는 작업의 lock은 해제합니다.
- 12시간 이상 갱신되지 않았고 최신 relevant handoff와 파일 변경이 없는 lock은 stale 후보로 봅니다.
- stale 후보를 정리하기 전에는 해당 Scope의 `git status` 흔적, 최근 touched 파일, `HANDOFF_ARCHIVE.md`의 relevant handoff 존재 여부를 확인합니다.
- 하나라도 모호하면 자동 정리하지 말고 `CURRENT_STATE.md > Open Decisions / Blockers`와 `TASK_LIST.md > ## Blockers`에 `Needs User Decision`으로 올립니다.

### 3단계: Handoff compaction
- 오래된 handoff를 archive로 옮기기 전에, 열린 사용자 질문 / 기술 블로커 / 다음 Agent가 꼭 알아야 할 제약을 `CURRENT_STATE.md > Open Decisions / Blockers`와 `TASK_LIST.md > ## Blockers`로 승격합니다.
- `TASK_LIST.md > ## Handoff Log`가 8개를 넘기거나 파일이 너무 길어졌으면 오래된 항목을 `HANDOFF_ARCHIVE.md`로 이동합니다.
- 이동한 내용은 `CURRENT_STATE.md > Recent History Summary`에 3~5줄로 압축합니다.

### 4단계: Tomorrow's Start 정리
- `CURRENT_STATE.md`의 `Snapshot`, `Next Recommended Agent`, `Must Read Next`, `Active Scope`, `Task Pointers`, `Open Decisions / Blockers`, `Latest Handoff Summary`를 갱신합니다.
- `TASK_LIST.md` 하단의 `## Handoff Log`에 표준 양식으로 Day Wrap Up entry를 남깁니다.
