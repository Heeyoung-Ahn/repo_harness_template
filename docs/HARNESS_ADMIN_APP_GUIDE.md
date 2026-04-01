# Harness Admin App Guide

이 문서는 `repo-local template` 바깥의 운영 작업을 **Harness Admin App**으로 처리하는 표준 방법을 설명합니다.

핵심 원칙:

- 프로젝트 폴더에는 템플릿만 이식합니다.
- 사용자별 설정, monitored project 목록, away mode, Windows 작업 스케줄러, Telegram / ntfy 설정은 앱이 담당합니다.
- repo 안의 canonical gate contract는 그대로 유지합니다.

## 1. 앱이 담당하는 것

- watcher 설치 / 재설치 / 제거
- monitored project 폴더 등록 / 제거
- present / away mode 전환
- Telegram Bot token / chat id 저장
- ntfy server / topic 저장
- `telegram-only` 또는 `telegram-and-ntfy` 채널 모드 저장
- repo별 approval state 요약 모니터링

앱이 직접 바꾸지 않는 것:

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`
- `.agents/runtime/approvals/*.json`

즉, 앱은 **운영 제어판**이고, repo 안의 gate contract는 그대로 둡니다.

## 2. 소스 실행과 EXE 빌드

소스 실행:

```powershell
Set-Location tools/harness_admin
python -m harness_admin
```

headless watcher 1회 실행:

```powershell
Set-Location tools/harness_admin
python -m harness_admin --watch-once
```

단일 EXE 빌드:

```powershell
Set-Location tools/harness_admin
python -m pip install .[build]
powershell -ExecutionPolicy Bypass -File .\build_exe.ps1
```

빌드 결과:

- `tools/harness_admin/dist/harness-admin.exe`

## 3. 첫 실행 체크리스트

앱을 처음 열면 아래 순서로 진행합니다.

### Step 1. Settings에서 기본값 저장

입력 항목:

- `HARNESS_RUNTIME_HOME`
- `HARNESS_LOCAL_RESPONSE_GRACE_MINUTES`
- `HARNESS_NOTIFICATION_CHANNEL_MODE`

채널 모드:

- `telegram-only`
  - 기본값
  - 실제 승인 채널은 Telegram만 사용
  - `ntfy` 값이 있어도 알림 발송은 하지 않음
- `telegram-and-ntfy`
  - Telegram 승인 + ntfy mirror 알림

### Step 2. Telegram Wizard

순서:

1. `Open BotFather`
2. Telegram에서 `/newbot`
3. 발급받은 bot token 입력
4. `Open your bot chat`
5. bot과 대화창에서 `/start`
6. `Fetch Chat IDs`
7. 후보 목록에서 chat id 선택
8. `Send Test Message`

필수 입력:

- `HARNESS_TELEGRAM_BOT_TOKEN`
- `HARNESS_TELEGRAM_CHAT_ID`

### Step 3. ntfy Wizard

`telegram-and-ntfy`를 쓸 경우 설정합니다.

순서:

1. server 확인
   - 기본값 `https://ntfy.sh`
2. topic 입력 또는 `Random Topic`
3. `Open Topic`
4. 모바일 ntfy 앱 또는 웹에서 topic 구독
5. `Send Test Notification`

필수 입력:

- `HARNESS_NTFY_SERVER`
- `HARNESS_NTFY_TOPIC`

## 4. monitored project 등록

`Projects` 탭에서 watcher 대상 프로젝트 폴더를 추가합니다.

앱은 등록 전에 아래 marker를 검사합니다.

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`

이 marker가 없으면 invalid template repo로 간주하고 등록하지 않습니다.

## 5. watcher 설치와 실행

`Install Watcher`를 누르면 Windows 작업 스케줄러에 `HarnessRemoteApprovalWatcher`가 설치됩니다.

기본 동작:

- 1분 주기 실행
- hidden 기본값
- headless app watcher 실행

`Run Watcher Once`는 스케줄러를 기다리지 않고 현재 프로세스에서 즉시 1회 실행합니다.

`Remove Watcher`는 스케줄러 작업만 제거하고, repo나 runtime state는 지우지 않습니다.

## 6. Away mode 사용

`Presence` 탭에서 아래 중 하나를 선택합니다.

- `Present`
- `Away 30 min`
- `Away 60 min`
- `Away 120 min`
- custom away minutes

away mode 중에는 `remote-choice` gate가 즉시 모바일 전송으로 이어집니다.
present mode에서는 `local-first` 후 grace 경과 시 watcher가 fallback합니다.

## 7. 상태 읽는 법

앱은 monitored project별로 아래 상태 수를 보여줍니다.

- `local_wait`
- `pending`
- `timeout`
- `send_failed`

실제 state 파일 위치:

- `<repo>/.agents/runtime/approvals/<decision-id>.json`

앱 바깥의 user-level runtime:

- `%USERPROFILE%\.harness-runtime\presence.json`
- `%USERPROFILE%\.harness-runtime\repo_registry.json`
- `%USERPROFILE%\.harness-runtime\telegram_offset.txt`

## 8. 운영 주의사항

- 앱은 operator layer이고, artifact 기록 자체를 대신하지 않습니다.
- gate를 열기 전에는 여전히 artifact에 blocker / user decision을 먼저 남겨야 합니다.
- secret, token, 민감 URL은 mobile approval 본문에 넣지 않습니다.
- `hard-block`은 앱이 있어도 자동 처리하지 않습니다.
- `ntfy`는 mirror channel입니다. 승인 응답은 계속 Telegram을 기준으로 둡니다.

## 9. Template Boundary

repo 안에는 아래 contract만 남깁니다.

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`
- `.agents/runtime/approvals/*.json`

presence, repo registry, watcher, Windows 작업 스케줄러, Telegram / ntfy 설정은 모두 앱이 담당합니다.
즉, operator-only PowerShell fallback은 템플릿에 두지 않습니다.
