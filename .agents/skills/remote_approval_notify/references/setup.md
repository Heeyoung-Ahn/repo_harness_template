# Remote Approval Setup

이 문서는 하네스 템플릿에서 `로컬 질문 -> 무응답 시 모바일 알림` 흐름을 공통으로 설정하는 방법을 설명합니다.

## 1. 목표

구성 역할은 아래와 같습니다.

- `ntfy.sh`: 즉시 푸시 알림
- `Telegram Bot`: 모바일 승인/거절 응답
- `.agents/scripts/invoke_user_gate.ps1`: local-first 정책, 상태 파일 기록, Telegram polling 처리

기본 UX는 `local-first`입니다.

1. 현재 PC 세션에서 먼저 질문
2. 응답이 없으면 grace window 이후 모바일 알림 발송
3. 필요하면 Telegram 응답까지 기다려 다음 단계 재개

이 스크립트는 `실제 사용자가 PC 앞에 있는지 자동 탐지`하지 않습니다.
대신 `정책 모드`로 동작합니다.

- `local-first`: 기본값. 먼저 로컬 질문, 무응답 시 모바일 fallback
- `always`: 바로 모바일 알림 발송
- `never`: 모바일 알림 비활성화

## 2. 환경 변수

비밀값은 repo에 commit하지 말고 로컬 환경 변수에 둡니다.

| Variable | Required | Description |
|---|---|---|
| `HARNESS_REMOTE_APPROVAL_MODE` | optional | `local-first`, `always`, `never`. 기본값 `local-first` |
| `HARNESS_LOCAL_RESPONSE_GRACE_MINUTES` | optional | 로컬 질문 후 모바일 fallback까지 기다릴 분 수. 기본값 `10` |
| `HARNESS_NTFY_SERVER` | optional | 기본값 `https://ntfy.sh` |
| `HARNESS_NTFY_TOPIC` | optional | `ntfy.sh` 구독 topic |
| `HARNESS_TELEGRAM_BOT_TOKEN` | optional | Telegram BotFather가 발급한 bot token |
| `HARNESS_TELEGRAM_CHAT_ID` | optional | 모바일에서 승인 받을 개인 chat id |

모바일 알림 자체는 `HARNESS_NTFY_TOPIC` 또는 Telegram 값 중 하나만 있어도 보낼 수 있습니다.
하지만 `WaitForDecision`으로 응답까지 기다리려면 Telegram 값이 필요합니다.

## 3. ntfy.sh 설정

1. 모바일에 `ntfy` 앱 설치
2. 추측하기 어려운 topic 생성 후 구독
3. topic을 환경 변수에 저장

예시:

```powershell
[Environment]::SetEnvironmentVariable('HARNESS_NTFY_TOPIC', 'ag-7c3b0d0e-user-gate', 'User')
```

주의:

- 공개 `ntfy.sh` 서버에서는 topic 이름 자체가 비밀번호 역할에 가깝습니다.
- 긴 랜덤 topic을 사용합니다.
- 메시지에 비밀값을 넣지 않습니다.

## 4. Telegram Bot 설정

1. Telegram에서 `@BotFather`로 bot 생성
2. token을 `HARNESS_TELEGRAM_BOT_TOKEN`에 저장
3. bot과 개인 채팅을 열고 `/start` 전송
4. 아래 호출로 `message.chat.id` 확인

```powershell
$token = [Environment]::GetEnvironmentVariable('HARNESS_TELEGRAM_BOT_TOKEN', 'User')
Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getUpdates"
```

chat id를 저장:

```powershell
[Environment]::SetEnvironmentVariable('HARNESS_TELEGRAM_CHAT_ID', '123456789', 'User')
```

주의:

- 이 템플릿은 Telegram `getUpdates` long polling을 사용합니다.
- 같은 bot token에는 webhook과 long polling을 동시에 붙이지 않습니다.
- bot/session당 하나의 polling consumer만 허용합니다.
  - 동시에 여러 `-WaitForDecision` 루프를 띄우지 않습니다.

## 5. 표준 사용 순서

### A. 현재 세션에서 먼저 질문

artifact에 blocker / gate를 기록한 뒤, 같은 세션에서 먼저 질문합니다.

### B. 로컬 fallback 예약

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "TST-02" `
  -DecisionId "tst02-preview-access" `
  -Prompt "Preview access 정보를 제공할까요, 아니면 새 preview infra provisioning으로 진행할까요?" `
  -Context "먼저 현재 세션 응답을 기다리고, 무응답이면 모바일 알림으로 전환합니다." `
  -Options existing-access fresh-provisioning hold `
  -DeliveryMode local-first `
  -LocalResponseGraceMinutes 15
```

이 호출은 보통 `local_wait`를 반환합니다.
알림 채널이 아직 없어도 로컬 대기 상태는 기록할 수 있습니다.

### C. grace 후 같은 DecisionId로 다시 실행

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "TST-02" `
  -DecisionId "tst02-preview-access" `
  -Prompt "Preview access 정보를 제공할까요, 아니면 새 preview infra provisioning으로 진행할까요?" `
  -Context "로컬 응답이 없어 모바일 알림으로 전환합니다." `
  -Options existing-access fresh-provisioning hold `
  -DeliveryMode local-first `
  -LocalResponseGraceMinutes 15
```

같은 `DecisionId`를 재사용하면 첫 로컬 질문 시각을 기준으로 `notify_after_at`를 계산합니다.

### D. Telegram 응답까지 대기

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "REL-01" `
  -DecisionId "rel01-go-no-go" `
  -Prompt "Preflight checks are complete. Approve production deploy?" `
  -Context "로컬 질문 무응답 후 Telegram 승인으로 이어집니다." `
  -Options approve reject `
  -DeliveryMode local-first `
  -WaitForDecision `
  -TimeoutMinutes 180
```

자동 재개는 실행 중인 PC 또는 워커 프로세스가 계속 살아 있어야 합니다.

## 6. 상태 파일

상태는 `.agents/runtime/approvals/<decision-id>.json`에 기록됩니다.

중요 필드:

- `status`
- `delivery_mode`
- `local_prompted_at`
- `notify_after_at`
- `delivery.ntfy.*`
- `delivery.telegram.*`
- `expires_at`

주요 상태:

- `local_wait`: 로컬 응답 grace window 안
- `local_only`: 모바일 비활성화
- `pending`: 모바일 알림 발송 완료
- `resolved`: Telegram 응답 반영 완료
- `timeout`: 응답 시간 초과
- `send_failed`: 채널 발송 실패

## 7. artifact 반영 규칙

- 로컬 질문을 던졌다면 artifact에 `Needs User Decision` 또는 `manual gate pending`을 먼저 기록합니다.
- `timeout`이면 timeout 사실과 다음 액션을 artifact에 남깁니다.
- `resolved`이면 선택 결과와 후속 작업을 handoff / blocker에 반영합니다.
- fallback command는 option label이 아니라 정규화된 값입니다.
  - 예: `fresh provisioning` -> `/fresh-provisioning <decision-id>`
