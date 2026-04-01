---
name: Remote Approval Notify
description: Use this skill when a task enters `Needs User Decision`, `manual gate pending`, device-test approval wait, or release go/no-go wait and the user may step away from the PC. The default UX is local-first: ask in the current session first, then escalate to `ntfy.sh` and optional Telegram approval only after there is no local response.
---

# Remote Approval Notify

이 스킬은 하네스 템플릿에서 `사용자 확인이 필요한 짧은 gate`를 공통 방식으로 다룰 때 사용합니다.

기본 정책은 `local-first`입니다.

1. 현재 세션에서 먼저 질문합니다.
2. 응답이 없고 grace window가 지나면 모바일 알림으로 escalte합니다.
3. 모바일 알림은 `ntfy.sh` 푸시와 Telegram Bot 승인으로 처리합니다.

이 스킬은 아래 상황에 맞습니다.

- `CURRENT_STATE.md` 또는 `TASK_LIST.md`에 `Needs User Decision`이 열린 상태
- `manual gate pending`이지만 사용자가 곧바로 답하지 않을 수 있는 상태
- 실기기 테스트 승인, preview smoke 시작 승인, production deploy go/no-go처럼 짧은 선택지 기반 결정

이 스킬은 아래 상황에는 쓰지 않습니다.

- secret, token, 민감 URL을 보내야 하는 경우
- 장문의 설명이나 토론이 필요한 경우
- 2~4개의 짧은 선택지로 줄일 수 없는 결정

## 기본 흐름

1. 먼저 artifact에 blocker / gate 상태를 기록합니다.
2. 현재 세션에서 질문합니다.
3. `invoke_user_gate.ps1`를 `local-first`로 실행해 `local_wait` 상태를 남깁니다.
4. 같은 `DecisionId`로 grace window 이후 다시 실행하면 모바일 알림이 발송됩니다.
5. Telegram 응답을 받으면 artifact와 handoff에 반영합니다.

## 명령 예시

### 1. 로컬 질문 후 fallback만 예약

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "TST-02" `
  -DecisionId "tst02-preview-access" `
  -Prompt "Preview access 정보를 제공할까요, 아니면 새 preview infra provisioning으로 진행할까요?" `
  -Context "현재 세션 응답이 없으면 모바일 알림으로 fallback합니다." `
  -Options existing-access fresh-provisioning hold `
  -DeliveryMode local-first `
  -LocalResponseGraceMinutes 15
```

예상 상태:

- `status = local_wait`
- `local_prompted_at` 기록
- `notify_after_at` 기록

### 2. grace 이후 모바일 알림 발송

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "TST-02" `
  -DecisionId "tst02-preview-access" `
  -Prompt "Preview access 정보를 제공할까요, 아니면 새 preview infra provisioning으로 진행할까요?" `
  -Context "현재 세션 응답이 없어 모바일 알림으로 전환합니다." `
  -Options existing-access fresh-provisioning hold `
  -DeliveryMode local-first `
  -LocalResponseGraceMinutes 15
```

같은 `DecisionId`를 재사용해야 처음 로컬 질문 시각을 기준으로 판단합니다.

### 3. 모바일 승인까지 대기

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/scripts/invoke_user_gate.ps1" `
  -TaskId "REL-01" `
  -DecisionId "rel01-go-no-go" `
  -Prompt "Preflight checks are complete. Approve production deploy?" `
  -Context "로컬 응답이 없으면 Telegram 승인으로 이어집니다." `
  -Options approve reject `
  -DeliveryMode local-first `
  -LocalResponseGraceMinutes 10 `
  -WaitForDecision `
  -TimeoutMinutes 180
```

자동 재개는 프로세스가 계속 살아 있어야 합니다.

## 상태 의미

- `local_wait`: 현재 세션 응답을 먼저 기다리는 중
- `local_only`: `DeliveryMode=never`, 모바일 알림 비활성화
- `pending`: 모바일 알림 발송 완료, 응답 대기 중
- `resolved`: Telegram 버튼 또는 fallback command로 응답 수집 완료
- `timeout`: 대기 시간 내 응답 없음
- `send_failed`: 모바일 알림 발송 시도는 했지만 채널이 모두 실패했음

모든 상태는 `.agents/runtime/approvals/<decision-id>.json`에 남습니다.

## 운영 규칙

- fallback command는 option label이 아니라 정규화된 value를 씁니다.
  - 예: `fresh provisioning` -> `/fresh-provisioning <decision-id>`
- `WaitForDecision`은 Telegram 전송이 실제로 성공했을 때만 사용합니다.
- Telegram polling은 bot/session당 하나의 consumer만 허용합니다.
  - 같은 bot token/chat id로 여러 wait loop를 동시에 열면 안 됩니다.
- timeout이 나면 artifact의 `Needs User Decision` 또는 `manual gate pending` 상태를 그대로 방치하지 말고, timeout 사실과 다음 액션을 갱신합니다.
- 모바일 메시지에는 `Task ID`, 짧은 질문, 선택지, 기본 동작만 넣고 secret이나 민감정보는 넣지 않습니다.

## 마무리 보고

이 스킬을 사용했다면 아래를 짧게 남깁니다.

- 어떤 task가 어떤 `DecisionId`로 gate에 들어갔는지
- 현재 상태가 `local_wait`, `pending`, `resolved`, `timeout`, `send_failed` 중 무엇인지
- grace window와 실제 fallback 여부
- 다음 액션이 로컬 재질문인지, 모바일 응답 대기인지, 후속 구현 재개인지
