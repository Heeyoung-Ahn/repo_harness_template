# Remote Approval Setup

이 문서는 하네스 템플릿에서 `로컬 승인 대기`를 줄이고, 사용자가 자리를 비운 동안에도 짧은 승인 흐름이 이어지도록 설정하는 방법을 설명합니다.

## 1. 목표

구성 요소는 아래와 같습니다.

- `.agents/scripts/open_user_gate.ps1`
  - canonical gate router
  - present/away mode에 따라 로컬 또는 모바일로 라우팅
- `.agents/scripts/watch_user_gates.ps1`
  - grace 이후 fallback 재실행
  - Telegram 응답 polling / state 반영
- `.agents/scripts/set_user_presence.ps1`
  - 사용자의 present / away 상태 설정
- `.agents/scripts/register_repo_for_approval_watch.ps1`
  - watcher 대상 repo registry 관리
- `.agents/scripts/install_approval_watcher_task.ps1`
  - Windows Task Scheduler 등록
- `.agents/scripts/invoke_user_gate.ps1`
  - low-level delivery primitive

## 2. approval 분류

### `safe-auto`

- `LF` 정규화
- `CURRENT_STATE.md` compact
- live handoff reorder
- validator 실행
- non-destructive sync
- read-only verification

이 범위는 사용자 승인 질문으로 만들지 않고 바로 적용합니다.

### `remote-choice`

- 2~4개의 짧은 선택지로 표현 가능한 사용자 결정
- present mode면 `local-first`
- away mode면 즉시 모바일 전송

### `hard-block`

- secret, token, 민감 URL
- destructive filesystem / git action
- 장문의 설명이나 토론이 필요한 질문

이 범위는 모바일로 보내지 않고 blocker로 유지합니다.

## 3. 환경 변수

비밀값은 repo에 commit하지 말고 로컬 환경 변수에 둡니다.

| Variable | Required | Description |
|---|---|---|
| `HARNESS_RUNTIME_HOME` | optional | presence / repo registry / global Telegram offset 저장 위치. 기본값 `%USERPROFILE%\.harness-runtime` |
| `HARNESS_LOCAL_RESPONSE_GRACE_MINUTES` | optional | present mode에서 모바일 fallback까지 기다릴 분 수. 기본값 `10` |
| `HARNESS_NTFY_SERVER` | optional | 기본값 `https://ntfy.sh` |
| `HARNESS_NTFY_TOPIC` | optional | `ntfy.sh` 구독 topic |
| `HARNESS_TELEGRAM_BOT_TOKEN` | required for actionable unattended flow | Telegram BotFather가 발급한 bot token |
| `HARNESS_TELEGRAM_CHAT_ID` | required for actionable unattended flow | 모바일에서 승인 받을 개인 chat id |

`ntfy`는 optional mirror이고, 실제 unattended 승인 응답 경로는 Telegram을 기준으로 둡니다.

## 4. 초기 1회 설정

### A. Telegram Bot

```powershell
[Environment]::SetEnvironmentVariable('HARNESS_TELEGRAM_BOT_TOKEN', '여기에_발급받은_토큰_붙여넣기', 'User')
[Environment]::SetEnvironmentVariable('HARNESS_TELEGRAM_CHAT_ID', '123456789', 'User')
```

chat id 확인:

```powershell
$token = [Environment]::GetEnvironmentVariable('HARNESS_TELEGRAM_BOT_TOKEN', 'User')
Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getUpdates"
```

### B. optional `ntfy`

```powershell
[Environment]::SetEnvironmentVariable('HARNESS_NTFY_TOPIC', 'ag-7c3b0d0e-user-gate', 'User')
```

### C. repo 등록

각 repo root에서 1회 실행:

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/register_repo_for_approval_watch.ps1" `
  -Action add
```

### D. watcher Task Scheduler 설치

아무 repo에서나 1회 실행:

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/install_approval_watcher_task.ps1" `
  -Force
```

기본 등록은 `-WindowStyle Hidden`으로 실행되어 1분 주기 실행 시 콘솔 창이 뜨지 않습니다.
디버깅이 필요하면 `-VisibleWindow`를 추가합니다.

## 5. 운영 사용 순서

### A. 자리를 비우기 전 away mode 전환

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/set_user_presence.ps1" `
  -Mode away `
  -DurationMinutes 120
```

복귀 시:

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/set_user_presence.ps1" `
  -Mode present
```

### B. artifact에 gate 기록

항상 `CURRENT_STATE.md` 또는 `TASK_LIST.md`에 먼저 `Needs User Decision` / `manual gate pending`을 남깁니다.

### C. short decision 열기

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/open_user_gate.ps1" `
  -TaskId "REL-01" `
  -DecisionClass remote-choice `
  -DecisionId "rel01-go-no-go" `
  -Prompt "Preflight checks are complete. Approve production deploy?" `
  -Context "present mode면 local-first, away mode면 즉시 모바일 승인으로 전환합니다." `
  -Options approve reject hold `
  -LocalResponseGraceMinutes 10
```

### D. watcher 확인

수동 1회 점검:

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/watch_user_gates.ps1"
```

정상이라면 Task Scheduler가 이후 1분 주기로 같은 작업을 자동 수행합니다.

## 6. 상태 파일

repo별 state는 `.agents/runtime/approvals/<decision-id>.json`에 기록됩니다.

추가로 user-level runtime에는 아래가 생깁니다.

- `presence.json`
- `repo_registry.json`
- `telegram_offset.txt`

주요 상태:

- `auto_apply`
- `blocked_local`
- `local_wait`
- `pending`
- `resolved`
- `timeout`
- `send_failed`

## 7. 주의사항

- `open_user_gate.ps1`가 canonical entrypoint입니다.
- `invoke_user_gate.ps1`를 직접 쓰는 경우는 low-level debugging 또는 예외 상황으로 제한합니다.
- Telegram polling은 bot/session당 하나의 consumer만 허용합니다.
- watcher는 registered repo만 감시합니다.
- `hard-block`은 모바일로 보내지 않습니다.
- secret이나 민감 URL은 어떤 경우에도 모바일 본문에 넣지 않습니다.
- timeout 또는 send failure가 나면 artifact의 blocker 상태를 나중에 꼭 정리해야 합니다.
