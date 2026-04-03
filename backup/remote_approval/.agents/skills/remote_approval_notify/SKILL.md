---
name: Remote Approval Notify
description: Use this skill when a task enters `Needs User Decision`, `manual gate pending`, device-test approval wait, or release go/no-go wait and the user may step away from the PC. The canonical flow is `open_user_gate.ps1` plus the unattended watcher, with low-risk maintenance auto-applied and only short user decisions sent to mobile.
---

# Remote Approval Notify

이 스킬은 하네스 템플릿에서 `사용자 확인이 필요한 짧은 gate`를 unattended-friendly 방식으로 다룰 때 사용합니다.

표준 운영 경로는 `Harness Admin App`입니다.

- repo 안에는 `open_user_gate.ps1`, `invoke_user_gate.ps1`, approval state 같은 canonical contract만 둡니다.
- 사용자별 설정, monitored repo 목록, away mode, Windows Task Scheduler watcher 설치는 앱이 담당합니다.
- repo template 안에 operator-only watcher / scheduler / presence / registry 스크립트를 다시 만들지 않습니다.

핵심 정책은 아래 세 가지입니다.

1. `safe-auto`
   - `LF` 정규화, `CURRENT_STATE.md` compact, live handoff reorder, validator 실행, non-destructive sync, read-only verification
   - 사용자 승인 질문으로 만들지 않고 바로 적용
2. `remote-choice`
   - 2~4개의 짧은 선택지로 정리 가능한 사용자 결정
   - `open_user_gate.ps1`를 통해 present/away 상태에 맞춰 로컬 또는 모바일로 라우팅
3. `hard-block`
   - secret, token, destructive action, 민감 URL, 장문 토론
   - 모바일로 보내지 않고 blocker 상태로 유지

## 기본 흐름

1. 먼저 artifact에 blocker / gate 상태를 기록합니다.
2. `safe-auto`인지 확인합니다.
   - 맞으면 바로 적용하고 결과만 요약합니다.
3. `remote-choice`면 `.agents/scripts/open_user_gate.ps1`를 실행합니다.
4. present mode에서는 `local-first`, away mode에서는 즉시 모바일 전송으로 처리됩니다.
5. `Harness Admin App` watcher가 미응답 gate를 재확인하고 grace 이후 자동 fallback 및 Telegram 응답 반영을 담당합니다.

## 언제 쓰는가

- `CURRENT_STATE.md` 또는 `TASK_LIST.md`에 `Needs User Decision`이 열린 상태
- `manual gate pending`이지만 사용자가 곧바로 답하지 않을 수 있는 상태
- 실기기 테스트 승인, preview smoke 재개, production deploy go/no-go처럼 짧은 선택지 기반 결정

## 언제 쓰지 않는가

- secret, token, 민감 URL을 보내야 하는 경우
- 장문의 설명이나 토론이 필요한 경우
- 2~4개의 짧은 선택지로 줄일 수 없는 결정

## canonical 명령

### 0. 표준 운영 경로

- `docs/HARNESS_ADMIN_APP_GUIDE.md`를 먼저 따릅니다.
- 앱에서 Telegram / ntfy 설정, repo 등록, watcher 설치, away mode 전환을 수행합니다.
- repo-local command surface는 `open_user_gate.ps1`와 `invoke_user_gate.ps1`만 유지합니다.

### 1. short decision 열기

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/open_user_gate.ps1" `
  -TaskId "TST-02" `
  -DecisionClass remote-choice `
  -DecisionId "tst02-preview-access" `
  -Prompt "Preview access 정보를 제공할까요, 아니면 새 preview infra provisioning으로 진행할까요?" `
  -Context "현재 세션 응답이 없거나 away mode이면 모바일 승인으로 전환합니다." `
  -Options existing-access fresh-provisioning hold `
  -LocalResponseGraceMinutes 15
```

## 상태 의미

- `auto_apply`: `safe-auto`, 사용자 승인 없이 바로 적용 대상
- `blocked_local`: `hard-block`, 로컬 사용자 응답이 필요한 상태
- `local_wait`: present mode에서 현재 세션 응답을 먼저 기다리는 중
- `pending`: 모바일 알림 발송 완료, 응답 대기 중
- `resolved`: Telegram 응답 수집 완료
- `timeout`: 응답 시간 초과
- `send_failed`: 모바일 알림 발송 시도는 했지만 채널이 모두 실패했음

모든 runtime 상태는 `.agents/runtime/approvals/<decision-id>.json`에 남습니다.

## 운영 규칙

- `open_user_gate.ps1`가 canonical entrypoint입니다. `invoke_user_gate.ps1`는 low-level delivery primitive입니다.
- 표준 운영은 앱이 담당하고, repo에는 operator-specific secret이나 scheduler 상태를 남기지 않습니다.
- away mode면 `remote-choice` gate를 즉시 모바일로 보냅니다.
- watcher는 앱에 등록된 저장소만 감시합니다.
- Telegram polling은 bot/session당 하나의 consumer만 허용합니다.
- timeout이 나면 artifact의 `Needs User Decision` 또는 `manual gate pending` 상태를 그대로 방치하지 말고, timeout 사실과 다음 액션을 갱신합니다.
- 모바일 메시지에는 `Task ID`, 짧은 질문, 선택지, 기본 동작만 넣고 secret이나 민감정보는 넣지 않습니다.

## 마무리 보고

이 스킬을 사용했다면 아래를 짧게 남깁니다.

- 어떤 task가 어떤 `DecisionId`로 gate에 들어갔는지
- 현재 상태가 `auto_apply`, `blocked_local`, `local_wait`, `pending`, `resolved`, `timeout`, `send_failed` 중 무엇인지
- present/away mode와 실제 모바일 fallback 여부
- 다음 액션이 자동 적용 완료인지, 모바일 응답 대기인지, blocker 유지인지
