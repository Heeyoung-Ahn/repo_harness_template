# Harness Admin App Guide

이 문서는 `repo-level governance harness` 템플릿을 여러 repo에 이식해 쓰는 운영자가, repo 바깥의 사용자별 설정과 unattended approval 운영을 **Harness Admin App**으로 관리하는 방법을 상세히 설명합니다.

핵심 요약:

- repo 안에는 gate contract와 상태 파일 schema만 둡니다.
- 사용자별 설정, presence, monitored repo 목록, Windows 작업 스케줄러, Telegram / ntfy 채널 관리는 앱이 맡습니다.
- 앱은 템플릿 계약을 새로 정의하지 않습니다. 대신 그 계약을 읽고, watcher를 통해 approval state를 계속 전진시킵니다.

## 1. 왜 이 앱이 필요한가

템플릿 repo는 여러 프로젝트에 그대로 복제될 수 있어야 합니다.
그래서 아래 항목은 repo 안에 하드코딩하면 안 됩니다.

- 개인 Telegram bot token / chat id
- 개인 ntfy topic
- 사용자의 현재 presence 상태 (`present` / `away`)
- 어떤 repo를 unattended watcher가 감시할지에 대한 목록
- Windows 작업 스케줄러 설치/제거 상태

이런 값들은 **repo-tracked 문서가 아니라 사용자별 runtime**에 있어야 합니다.
Harness Admin App은 바로 그 operator layer를 담당합니다.

## 2. 경계와 책임

### 2.1 앱이 담당하는 것

- 사용자 환경 변수 저장
- user-level runtime home 관리
- monitored project 등록 / 비활성화
- `present` / `away` 전환
- Windows 작업 스케줄러 watcher 설치 / 제거
- watcher 즉시 1회 실행
- Telegram / ntfy 설정과 테스트
- registered repo들의 approval state 요약 모니터링
- watcher를 통해 `.agents/runtime/approvals/*.json` 상태를 `local_wait -> pending -> resolved/timeout` 등으로 갱신

### 2.2 앱이 새로 만들지 않는 것

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`
- approval state file의 기본 contract
- artifact 문서에 남겨야 하는 blocker / user decision 기록 규칙

즉, 앱은 **operator console**이고, repo 안의 canonical gate entrypoint는 계속 `open_user_gate.ps1`입니다.

### 2.3 repo 안에 남겨지는 canonical contract

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`
- `.agents/runtime/approvals/<decision-id>.json`

앱은 이 contract를 읽고 실행할 뿐, 별도의 operator-only PowerShell 체계를 repo 안에 다시 추가하지 않습니다.

## 3. 전체 구조 한눈에 보기

| 레이어 | 실제 위치 | 담당 내용 |
|---|---|---|
| repo-tracked layer | `<repo>/.agents/scripts/*`, `<repo>/.agents/runtime/approvals/*.json` | gate router, delivery primitive, decision state |
| user-level runtime | `%USERPROFILE%\\.harness-runtime` 기본값 | presence, repo registry, Telegram offset, watcher log, watcher summary |
| user env | `HKCU\\Environment` + 현재 프로세스 env | Telegram / ntfy / runtime 관련 설정 |
| operator controls | Harness Admin App + Windows 작업 스케줄러 | watcher 설치/실행, dashboard, wizard |
| external channels | Telegram Bot API, ntfy server | 모바일 승인 응답, mirror 알림 |

이 구조 덕분에 repo 템플릿은 portable하게 유지되고, 운영자 개인 설정은 사용자 프로필 아래에만 남습니다.

## 4. 전제 조건과 제한

### 4.1 운영 환경

- Windows 전용 앱입니다.
- 소스 실행 기준 Python `>=3.12`가 필요합니다.
- Telegram / ntfy를 쓰려면 외부 네트워크 접근이 가능해야 합니다.

### 4.2 monitored project 조건

프로젝트를 등록하려면 최소한 아래 marker가 있어야 합니다.

- `.agents/scripts/open_user_gate.ps1`
- `.agents/scripts/invoke_user_gate.ps1`

이 두 파일이 없으면 앱은 그 폴더를 valid template repo로 간주하지 않습니다.

### 4.3 approval directory에 대한 이해

`.agents/runtime/approvals/` 폴더는 optional marker입니다.

- 아직 decision을 한 번도 열지 않았다면 비어 있거나 없을 수 있습니다.
- 실제 approval이 열리면 state JSON이 이 위치에 생성됩니다.
- 앱과 watcher는 이 폴더 안의 `*.json`을 읽고 상태를 집계합니다.

## 5. 실행 방법

### 5.1 소스에서 바로 실행

```powershell
Set-Location tools/harness_admin
python -m harness_admin
```

GUI가 열리고, 기본적으로 15초마다 dashboard를 자동 새로고침합니다.

### 5.2 headless watcher를 1회만 실행

```powershell
Set-Location tools/harness_admin
python -m harness_admin --watch-once
```

이 모드는 UI 없이 다음 작업만 한 번 수행하고 종료합니다.

- registered repo scan
- expired state timeout 처리
- `local_wait`의 escalation 필요 여부 판단
- Telegram pending decision polling
- watcher summary 기록

요약 JSON을 stdout으로 보고 싶으면:

```powershell
Set-Location tools/harness_admin
python -m harness_admin --watch-once --print-summary
```

다른 runtime home을 시험적으로 쓰고 싶으면:

```powershell
Set-Location tools/harness_admin
python -m harness_admin --watch-once --runtime-home C:\Temp\harness-runtime
```

### 5.3 EXE 빌드

```powershell
Set-Location tools/harness_admin
python -m pip install .[build]
powershell -ExecutionPolicy Bypass -File .\build_exe.ps1
```

빌드 결과:

- `tools/harness_admin/dist/harness-admin.exe`

### 5.4 source 실행과 EXE 실행의 차이

source 기준 watcher 설치 시 앱은 가능한 경우 `pythonw.exe`를 사용해 숨김 실행을 구성합니다.

- 기본: hidden source watcher
- `Visible debug install` 체크: console가 보이는 source watcher

EXE 빌드에서는 기본이 hidden EXE 실행입니다.
패키징된 EXE에는 visible debug install이 지원되지 않으므로 그 상태로 설치를 시도하면 에러가 납니다.

## 6. 첫 실행 체크리스트

앱을 처음 열면 아래 순서를 권장합니다.

1. `Settings`에서 기본 runtime 값을 저장
2. `Setup Wizard > Telegram Wizard`에서 bot token / chat id 설정 및 테스트
3. 필요 시 `Setup Wizard > ntfy Wizard` 설정 및 테스트
4. `Projects`에서 monitored repo 등록
5. `Install Watcher`로 Windows 작업 스케줄러 watcher 설치
6. `Overview`에서 watcher state와 counts 확인

## 7. Settings 탭 상세 설명

`Save Settings`를 누르면 앱은 값을 **Windows 사용자 환경 변수**로 저장합니다.

- 저장 위치: `HKCU\Environment`
- 현재 프로세스에도 즉시 반영
- `WM_SETTINGCHANGE` broadcast로 다른 프로세스에도 변경 알림

즉, 여기서 저장한 값은 repo 안이 아니라 **사용자 계정 단위 설정**입니다.

### 7.1 저장되는 주요 값

| UI 항목 | 환경 변수 | 기본값 | 의미 |
|---|---|---|---|
| Telegram bot token | `HARNESS_TELEGRAM_BOT_TOKEN` | 없음 | Telegram Bot API 호출용 token |
| Telegram chat id | `HARNESS_TELEGRAM_CHAT_ID` | 없음 | 승인 응답을 받을 chat id |
| ntfy server | `HARNESS_NTFY_SERVER` | `https://ntfy.sh` | ntfy base URL |
| ntfy topic | `HARNESS_NTFY_TOPIC` | 없음 | mirror 알림 topic |
| Grace minutes | `HARNESS_LOCAL_RESPONSE_GRACE_MINUTES` | `10` | present mode에서 로컬 응답을 먼저 기다릴 시간 |
| Runtime home | `HARNESS_RUNTIME_HOME` | `%USERPROFILE%\\.harness-runtime` | user-level runtime 저장 위치 |
| Notification mode | `HARNESS_NOTIFICATION_CHANNEL_MODE` | `telegram-only` | `telegram-only` 또는 `telegram-and-ntfy` |

### 7.2 권장 최소 구성

#### Telegram만 쓸 경우

- `HARNESS_TELEGRAM_BOT_TOKEN`
- `HARNESS_TELEGRAM_CHAT_ID`
- 선택: `HARNESS_LOCAL_RESPONSE_GRACE_MINUTES`
- 선택: `HARNESS_RUNTIME_HOME`

#### Telegram + ntfy를 같이 쓸 경우

- 위 Telegram 설정 전체
- `HARNESS_NTFY_TOPIC`
- 선택: `HARNESS_NTFY_SERVER`
- `HARNESS_NOTIFICATION_CHANNEL_MODE=telegram-and-ntfy`

### 7.3 유효성 규칙

- Grace minutes는 정수여야 합니다.
- Grace minutes는 `0` 이상이어야 합니다.
- Channel mode는 `telegram-only`, `telegram-and-ntfy` 둘 중 하나여야 합니다.
- `telegram-only`에서는 ntfy 값이 저장되어 있어도 실제 발송은 하지 않습니다.

## 8. Setup Wizard 상세 설명

### 8.1 Telegram Wizard

앱 UI는 Telegram 설정을 아래 순서로 안내합니다.

### Step 1. `Open BotFather`

- Telegram의 `@BotFather`를 엽니다.
- `/newbot`으로 새 bot을 만듭니다.
- 발급받은 token을 복사합니다.

### Step 2. token 저장

- `Bot token` 입력란에 token을 붙여 넣습니다.
- `Save`를 눌러 환경 변수에 저장합니다.

### Step 3. `Open your bot chat`

앱은 `getMe`를 호출해 bot username을 알아낸 뒤, `https://t.me/<bot-username>`을 엽니다.

이 단계가 실패하면 보통 아래 중 하나입니다.

- token이 잘못됨
- 네트워크 문제
- Telegram API 응답 실패

### Step 4. bot과 실제 대화 시작

- bot chat에서 `/start`를 보냅니다.
- 이 과정을 하지 않으면 `getUpdates`에 chat candidate가 안 잡힐 수 있습니다.

### Step 5. `Fetch Chat IDs`

앱은 `getUpdates`를 호출해 최근 update에서 chat 후보를 수집합니다.

표에 보이는 정보:

- `Chat ID`
- `Type`
- `Label`

여기서 `Use Selected Chat ID`를 누르면 chat id가 Settings 값으로 반영됩니다.

### Step 6. `Send Test Message`

chat id까지 설정된 상태에서 실제 Telegram 메시지를 한 번 발송해 봅니다.

이 메시지가 도착해야 unattended approval도 정상 동작할 가능성이 높습니다.

### 8.1.1 자주 막히는 지점

- `Fetch Chat IDs` 결과가 비어 있음
  - bot에 `/start`를 보내지 않았을 가능성
  - 다른 채팅에서만 상호작용했고 개인 chat에는 아직 update가 없을 가능성
- username이 안 열림
  - 잘못된 token
  - bot profile 조회 실패

### 8.2 ntfy Wizard

ntfy는 승인 응답 채널이 아니라 **mirror 알림 채널**입니다.

### Step 1. server 선택

- 기본값은 `https://ntfy.sh`
- 자체 운영 서버가 있으면 그 URL을 넣습니다.

### Step 2. topic 선택

- 직접 topic을 정할 수 있습니다.
- `Random Topic` 버튼은 `harness-xxxxxxxxxx` 형식의 예측하기 어려운 topic을 생성합니다.

### Step 3. topic 열기

- `Open Server`: 서버 루트 열기
- `Open Topic`: 특정 topic 페이지 열기

모바일 ntfy 앱이나 웹에서 topic을 구독한 뒤 테스트 알림을 보냅니다.

### Step 4. `Send Test Notification`

테스트 알림이 정상 수신되면 mirror path는 준비된 것입니다.

## 9. Toolbar와 탭별 사용법

### 9.1 상단 Toolbar

### `Refresh`

- dashboard를 즉시 새로고침합니다.
- 자동 새로고침은 15초 주기입니다.

### `Install Watcher`

- 현재 Settings를 먼저 저장합니다.
- 그 뒤 Windows 작업 스케줄러에 `HarnessRemoteApprovalWatcher`를 등록합니다.

### `Remove Watcher`

- 작업 스케줄러 task만 제거합니다.
- runtime home, repo registry, approval state 파일은 지우지 않습니다.

### `Run Watcher Once`

- 현재 프로세스에서 watcher를 1회 실행합니다.
- 완료 후 상태 표시줄에 `repos / pending / resolved / errors` 요약을 보여줍니다.

### `Open Runtime Home`

- 현재 설정된 runtime home 폴더를 엽니다.
- 폴더가 없으면 먼저 생성합니다.

### `Visible debug install`

- source 실행일 때만 유의미합니다.
- 체크하면 watcher를 숨기지 않고 console가 보이는 형태로 task를 설치합니다.
- 스케줄러 문제를 디버깅할 때만 켜는 것이 좋습니다.

### 9.2 Overview 탭

Overview는 operator가 가장 자주 보는 대시보드입니다.

### Watcher Status

- `Installed`: task 설치 여부
- `State`: 작업 스케줄러가 보고하는 현재 상태
- `Command`: 실제 실행 파일과 인자

여기서 확인해야 할 것은 “정말 어떤 명령이 스케줄러에 걸렸는가”입니다.
source 설치인지, EXE 설치인지, `--runtime-home`이 붙었는지 한눈에 확인할 수 있습니다.

### Runtime Status

- `Presence`
- `Channel mode`
- `Telegram`
- `ntfy`
- `Counts`

`Counts`는 모든 active repo를 합산한 값입니다.

- `pending`
- `local_wait`
- `timeout`
- `send_failed`

추가로 `watcher_last_summary.json`에 에러가 남아 있으면 `last watcher errors=<n>` 형태로 같이 보여 줍니다.

### Monitored Projects 표

각 active repo마다 아래를 보여 줍니다.

- Template 유효 여부
- `pending`
- `local_wait`
- `timeout`
- `send_failed`
- `last_updated`

유효하지 않은 repo는 `Invalid (n missing)` 형태로 표시됩니다.

### 9.3 Projects 탭

### `Add Folder`

- 폴더 선택 후 marker 검사
- 유효하면 runtime registry에 active repo로 추가

registry에는 아래 메타데이터가 남습니다.

- `root`
- `active`
- `added_at`
- `updated_at`

### `Remove Selected`

선택한 repo를 registry에서 삭제하는 대신 `active=false`로 비활성화합니다.
즉, 과거 등록 이력은 유지하면서 watcher 대상에서만 제외합니다.

### `Open Folder`

선택된 repo 루트를 탐색기로 엽니다.

### 9.4 Presence 탭

### Current Presence

현재 effective presence를 보여 줍니다.

- `present`
- `away`
- `away (until <timestamp>)`
- `present (expired -> present)` 같은 자동 복귀 상태

`away`에는 만료 시간이 들어갈 수 있고, 만료 시 watcher는 자동으로 `present`처럼 해석합니다.

### Quick Actions

- `Present`
- `Away 30 min`
- `Away 60 min`
- `Away 120 min`
- custom away minutes

custom away는 `0`보다 큰 정수만 허용됩니다.

## 10. watcher 설치와 실제 동작

### 10.1 설치되는 스케줄러 작업

task 이름:

- `HarnessRemoteApprovalWatcher`

기본 특성:

- 최초 시작 시각: 설치 시점 기준 약 1분 뒤
- 반복 간격: 1분
- 반복 기간: 3650일
- 배터리 사용 중에도 실행 허용
- 사용 가능 시 즉시 시작
- multiple instances: `IgnoreNew`

즉, 같은 watcher가 아직 도는 중이면 새 인스턴스를 마구 쌓지 않도록 설계되어 있습니다.

### 10.2 어떤 명령이 등록되는가

### source 설치

보통 다음 둘 중 하나입니다.

- hidden source: `pythonw.exe ... __main__.py --watch-once`
- visible source: `python.exe ... __main__.py --watch-once`

### EXE 설치

- hidden exe: `harness-admin.exe --watch-once`

runtime home override가 있으면 `--runtime-home "<path>"`가 추가됩니다.

### 10.3 watcher가 하는 일

watcher 1회 실행에서 수행하는 핵심 작업은 아래와 같습니다.

1. active repo 목록 로드
2. 각 repo의 `.agents/runtime/approvals/*.json` scan
3. `resolved`, `timeout`, `send_failed`, `local_only`, `blocked_local`은 건너뜀
4. `expires_at`이 지난 `local_wait` / `pending`은 `timeout`으로 전환
5. `local_wait`는 아래 조건일 때 replay
   - presence가 `away`이고 `decision_class=remote-choice`
   - 또는 `notify_after_at`이 지남
6. `pending`인 `remote-choice`는 Telegram polling 후보로 모음
7. Telegram 응답이 오면 해당 state를 `resolved`로 바꾸고 확인 메시지를 다시 보냄
8. 실행 결과를 `watcher_last_summary.json`에 기록

### 10.4 single polling consumer 규칙

Telegram polling은 bot/session당 하나의 consumer만 돌도록 temp lock을 사용합니다.

- lock 파일 위치: `%TEMP%\\harness-telegram-wait-<hash>.lock`

이미 다른 polling consumer가 돌고 있으면, 중복 polling을 피하기 위해 새 consumer는 대기하지 않거나 에러를 남길 수 있습니다.

이 규칙은 아래 문제를 막기 위한 것입니다.

- 같은 update를 두 consumer가 동시에 처리
- Telegram offset이 꼬이는 현상
- approval state를 두 번 resolve하는 현상

## 11. approval lifecycle 상세 설명

### 11.1 decision class별 차이

### `safe-auto`

- 낮은 위험도의 harness maintenance
- 사용자 질문으로 만들지 않음
- `open_user_gate.ps1`는 `auto_apply` 성격의 결과를 반환하고 즉시 적용하도록 유도

### `hard-block`

- secret, token, destructive action, 긴 논의가 필요한 질문
- state file은 `blocked_local`
- 모바일 전송 안 함

### `remote-choice`

- 2~4개 정도의 짧은 선택지로 표현 가능한 승인 질문
- presence에 따라 `local-first` 또는 `always`로 라우팅

### 11.2 present mode에서의 흐름

present mode의 기본 delivery mode는 `local-first`입니다.

흐름:

1. `open_user_gate.ps1` 호출
2. `invoke_user_gate.ps1`가 state file 생성
3. 현재 시각이 grace 이전이면 `status=local_wait`
4. watcher가 `notify_after_at` 이후 다시 보고 replay
5. 그때 채널 발송이 성공하면 `status=pending`
6. Telegram 응답이 오면 `status=resolved`

즉, present mode에서는 사용자에게 먼저 로컬 맥락에서 응답할 시간을 줍니다.

### 11.3 away mode에서의 흐름

away mode에서는 `remote-choice`가 사실상 즉시 모바일 전송됩니다.

흐름:

1. `open_user_gate.ps1`가 presence를 `away`로 확인
2. `invoke_user_gate.ps1`를 `DeliveryMode=always`로 호출
3. 성공 시 곧바로 `status=pending`
4. watcher가 Telegram 응답을 회수
5. `status=resolved`

away mode의 목적은 “자리 비운 동안 local wait를 우회하고 바로 모바일 결정으로 넘기기”입니다.

### 11.4 주요 상태값

| 상태 | 의미 |
|---|---|
| `auto_apply` | safe-auto 성격으로 바로 적용 가능 |
| `blocked_local` | hard-block. 모바일 전송 안 함 |
| `local_only` | delivery mode가 `never`인 로컬 전용 질문 |
| `local_wait` | 아직 로컬 응답 grace를 기다리는 중 |
| `pending` | 채널 전송 완료, 모바일 응답 대기 중 |
| `resolved` | 사용자가 응답했고 state가 반영됨 |
| `timeout` | 만료 시각까지 응답이 없어 종료됨 |
| `send_failed` | Telegram / ntfy 전송이 모두 실패했음 |

Overview와 Projects 탭이 직접 집계하는 카운트는 주로 아래 넷입니다.

- `pending`
- `local_wait`
- `timeout`
- `send_failed`

### 11.5 Telegram 응답 방식

Telegram에서는 두 방식으로 응답할 수 있습니다.

### inline button

- 버튼 callback data 형식: `gate:<decision-id>:<choice>`
- watcher가 callback query를 읽어 바로 resolve

### slash command fallback

- 형식: `/<choice> <decision-id>`
- 예: `/approve rel01-go-no-go`

pending decision이 하나뿐일 때는 watcher가 `/approve` 같은 짧은 명령도 받아들일 수 있습니다.

### 11.6 resolve 이후 자동 확인 메시지

watcher가 decision을 resolve하면 Telegram으로 다시 확인 메시지를 보냅니다.

메시지 내용 예:

- project name
- task id
- recorded option
- decision id
- prompt 요약
- `Status: resolved (...)`

원래 Telegram message id를 알고 있으면 reply 형태로 붙여 보냅니다.

### 11.7 timeout 처리

`expires_at`이 지난 `local_wait` 또는 `pending`은 watcher가 다음 실행에서 `timeout`으로 바꿉니다.

주의:

- timeout이 났다고 artifact blocker가 자동으로 정리되지는 않습니다.
- operator는 `CURRENT_STATE.md`나 `TASK_LIST.md`에서 다음 액션을 별도로 정리해야 합니다.

### 11.8 duplicate decision id 주의

watcher는 동시에 pending 상태인 decision을 `decision_id` 기준으로 모읍니다.
서로 다른 repo에서 같은 `decision_id`가 동시에 pending이면 summary error가 생길 수 있습니다.

운영 원칙:

- 동시에 열려 있을 수 있는 gate는 decision id를 겹치지 않게 짓습니다.

## 12. runtime 파일과 저장 위치

### 12.1 user-level runtime home

기본 경로:

- `%USERPROFILE%\\.harness-runtime`

주요 파일:

| 파일 | 의미 |
|---|---|
| `presence.json` | 현재 presence와 만료 시각 |
| `repo_registry.json` | monitored repo 목록과 active 여부 |
| `telegram_offset.txt` | watcher가 마지막으로 소비한 Telegram update offset |
| `harness_admin.log` | watcher 에러/요약 로그 |
| `watcher_last_summary.json` | 최근 watcher 1회 실행 요약 |

### 12.2 repo-local state 파일

경로:

- `<repo>/.agents/runtime/approvals/<decision-id>.json`

자주 보는 필드:

| 필드 | 의미 |
|---|---|
| `project_name` | repo 표기용 이름 |
| `task_id` | 어떤 task와 연결된 승인인지 |
| `decision_id` | 승인 식별자 |
| `prompt` | 사용자에게 보여 줄 핵심 질문 |
| `context` | 추가 설명 |
| `options` | label/value 쌍 |
| `default_action` | 응답 없을 때 기본값 |
| `delivery_mode` | `local-first`, `always`, `never` |
| `notification_channel_mode` | `telegram-only`, `telegram-and-ntfy` |
| `status` | 현재 lifecycle 상태 |
| `delivery` | ntfy / Telegram 전송 세부 상태 |
| `notify_after_at` | local grace가 끝나는 시각 |
| `expires_at` | timeout 시각 |
| `selected_value` / `selected_label` | resolve된 선택 |
| `decision_source` | `callback_query` 또는 `message_command` |
| `telegram_message_id` | 원본 Telegram message id |

### 12.3 watcher summary 파일

`watcher_last_summary.json`에는 대략 아래 값이 남습니다.

- `scanned_repos`
- `scanned_states`
- `escalated`
- `resolved`
- `timed_out`
- `pending_for_resolution`
- `errors`
- `channel_mode`
- `presence_mode`
- `recorded_at`

문제가 생겼을 때 `Overview`만 보지 말고 이 파일과 `harness_admin.log`를 같이 확인하면 원인을 빨리 찾을 수 있습니다.

## 13. 권장 운영 절차

### 13.1 최초 세팅

1. Settings 저장
2. Telegram Wizard 완료
3. 필요 시 ntfy Wizard 완료
4. repo 등록
5. watcher 설치
6. test gate를 한 번 열어 end-to-end 확인

### 13.2 평소 작업 중

1. 앱은 `Present` 상태로 둠
2. `remote-choice`는 local-first로 열림
3. grace 이후에도 응답이 없으면 watcher가 fallback
4. `Overview`에서 `local_wait`, `pending`, `timeout`, `send_failed`를 확인

### 13.3 자리를 비우기 직전

1. `Presence`를 `Away`로 전환
2. watcher가 설치돼 있는지 확인
3. Telegram 앱 알림이 실제로 오는지 확인
4. 필요한 gate는 artifact에 먼저 기록하고 `open_user_gate.ps1`로 개시

### 13.4 복귀 후

1. `Present`로 되돌림
2. `timeout` / `send_failed`가 쌓였는지 확인
3. artifact blocker를 정리
4. 필요하면 `Run Watcher Once`로 현재 상태를 한 번 강제로 정리

### 13.5 디버깅할 때

- source 실행 상태에서 `Visible debug install` 사용
- 또는 `python -m harness_admin --watch-once --print-summary`
- `watcher_last_summary.json`, `harness_admin.log` 확인

## 14. 문제 해결 가이드

### 14.1 프로젝트 등록이 거절된다

원인:

- `.agents/scripts/open_user_gate.ps1` 없음
- `.agents/scripts/invoke_user_gate.ps1` 없음

조치:

- 올바른 repo root를 선택했는지 확인
- 템플릿이 완전히 이식된 repo인지 확인

### 14.2 `Fetch Chat IDs`가 빈 목록을 반환한다

원인 후보:

- bot에 `/start`를 보내지 않음
- 잘못된 token
- 네트워크/API 오류

조치:

1. `Open your bot chat`
2. `/start`
3. 다시 `Fetch Chat IDs`

### 14.3 `send_failed`가 뜬다

대표 원인:

- Telegram token/chat id 미설정
- `telegram-and-ntfy`인데 두 채널 모두 실패
- `telegram-only`인데 Telegram 설정이 비어 있음

조치:

- Settings 저장값 점검
- Telegram test / ntfy test 먼저 통과시키기

### 14.4 `local_wait`가 계속 안 넘어간다

원인 후보:

- 아직 grace가 안 지남
- watcher가 설치돼 있지 않음
- repo가 registry에 active로 들어 있지 않음

조치:

- `notify_after_at` 확인
- `Install Watcher`
- 또는 `Run Watcher Once`

### 14.5 Telegram에서 버튼을 눌렀는데 resolve가 안 된다

원인 후보:

- watcher 미실행
- 잘못된 chat id
- 다른 polling consumer가 offset을 소비 중
- stale temp lock 존재

조치:

- `Run Watcher Once`
- `watcher_last_summary.json` 확인
- 필요하면 stale lock 확인: `%TEMP%\\harness-telegram-wait-<hash>.lock`

### 14.6 away로 설정했는데 다시 present처럼 보인다

원인:

- away 만료 시각이 이미 지남

동작:

- 앱은 expired away를 자동으로 `present`처럼 해석합니다.

### 14.7 ntfy 알림이 안 온다

확인할 것:

- channel mode가 `telegram-and-ntfy`인지
- topic이 비어 있지 않은지
- mobile/web에서 해당 topic을 실제 구독했는지

`telegram-only` 모드에서는 ntfy 값이 있어도 전송하지 않는 것이 정상입니다.

## 15. 보안과 운영 원칙

- secret, token, 개인 chat id는 repo에 commit하지 않습니다.
- 모바일 approval 본문에 secret, 민감 URL, 토큰을 넣지 않습니다.
- `hard-block`은 앱이 있어도 자동 해결하지 않습니다.
- artifact 기록 없이 approval만 먼저 보내지 않습니다.
- 앱은 operator layer이지 artifact authoring 도구가 아닙니다.

## 16. Template Boundary 재정리

repo 템플릿에는 아래만 남깁니다.

- canonical gate scripts
- approval state schema와 상태 파일 위치
- artifact 기반 blocker / user decision 기록 규칙

Harness Admin App은 아래를 user-level로 옮깁니다.

- presence
- repo registry
- Telegram offset
- watcher log / summary
- Windows 작업 스케줄러 제어
- Telegram / ntfy credential 관리

이 경계를 지켜야 repo 템플릿이 프로젝트마다 깨끗하게 재사용되고, 운영자 개인 설정도 안전하게 분리됩니다.
