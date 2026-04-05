---
name: Conflict Resolver
description: 멀티 Agent 환경에서 문서와 코드 충돌이 났을 때 현재 상태 요약, 활성 lock, archive된 handoff 기록을 기준으로 non-interactive하게 해결하는 표준 절차
---

# Conflict Resolver Skill

멀티 IDE, 멀티 Agent 환경에서 충돌이 발생했을 때, 불필요한 전체 문서 재로드 없이 현재 상태와 관련 범위만 확인해 안전하게 복구하기 위한 절차입니다.

> 이 스킬은 충돌을 "해결"하는 절차이며, 예방 규칙은 `workspace.md`의 `Pre-Write Refresh`, `Active Locks`, `Stale Lock Recovery`를 따릅니다.

## 충돌 유형

### 유형 1: 코드 파일 충돌
- 두 Agent가 같은 파일 또는 같은 디렉터리 Scope를 수정
- worktree 없이 병렬 작업해 실제 내용이 엇갈림

### 유형 2: 아티팩트 문서 충돌
- `TASK_LIST.md`, `CURRENT_STATE.md`, `WALKTHROUGH.md` 등을 거의 동시에 수정
- 오래된 문서를 읽고 덮어쓴 경우

## 해결 절차

### 1단계: 즉시 중단과 범위 고정
- 충돌을 감지한 즉시 현재 작업을 중단합니다.
- 어떤 파일, 어떤 Task ID, 어떤 Scope가 충돌했는지 적습니다.

### 2단계: 현재 기준 문서 재확인
- `CURRENT_STATE.md`
- `TASK_LIST.md > ## Active Locks`
- 최신 relevant `## Handoff Log`
- 필요 시 `HANDOFF_ARCHIVE.md`

이 순서로 읽고, 현재 어느 쪽이 최신 의도인지 판단합니다.

### 3단계: 사용자 판단 요청
- 사용자에게 충돌 상황을 짧게 보고합니다.
- 선택지는 아래 셋 중 하나로 정리합니다.
  - 현재 Agent 변경 우선
  - 상대 Agent 변경 우선
  - 양쪽을 수동 병합

### 4단계: 비대화형 수동 병합
- `git pull`이나 interactive `git mergetool`을 기본 해결책으로 쓰지 않습니다.
- 충돌 파일을 직접 다시 읽고, 현재 승인된 요구사항/아키텍처/Task Scope 기준으로 필요한 내용만 합칩니다.
- 문서 충돌이면 오래된 history는 `HANDOFF_ARCHIVE.md`로 보내고, 현재 필요한 상태만 `CURRENT_STATE.md`와 `TASK_LIST.md`에 남깁니다.

### 5단계: 해결 기록과 복구 handoff
- 정상 상태를 확인한 뒤 `CURRENT_STATE.md`, `TASK_LIST.md`, 필요 시 `HANDOFF_ARCHIVE.md`를 갱신합니다.
- `## Handoff Log`에는 `[RECOVERY / 현재 플랫폼/Agent]` 또는 `[CONFLICT / 현재 플랫폼/Agent]` 태그를 포함해 해결 결과를 기록합니다.
