---
name: Expo Real Device Test
description: Expo Android 앱을 실제 기기에서 테스트하는 표준 스킬. 특히 Dev Build, native module, config plugin, `app.json`/`eas.json`/`package.json` 변경 여부를 보고 새 빌드가 필요한지 먼저 판단해야 할 때, 그리고 사용자를 실제 기기 설치 -> QR 연결 -> 수동 테스트 체크리스트까지 안내해야 할 때 반드시 사용한다.
---

# Expo Real Device Test Skill

> Optional skill. Use this only when the project uses Expo / React Native.

이 스킬의 목적은 단순히 `expo start` 명령만 알려주는 것이 아니라, 아래 6가지를 한 번에 처리하는 것입니다.

1. 새 Dev Build가 필요한지 판단한다.
2. 필요하면 `development` 프로필로 새 Android 빌드를 올린다.
3. 빌드가 백그라운드에서 돌아가더라도 사용자가 진행 상황을 확인할 수 있게 build status 경로를 보여준다.
4. 필요하지 않으면 기존 Development APK 재사용 여부를 분명히 안내한다.
5. 개발 머신에서 Expo dev server를 띄우고, 사용자가 기기에서 QR로 연결하도록 안내한다.
6. 사용자가 실제로 테스트해야 하는 항목과 기대 결과를 체크리스트로 보여준다.

## 기본 원칙

- 이 워크스페이스처럼 native module 또는 config plugin이 있는 Expo 앱은 기본적으로 `Development Build` 기준으로 실기기 테스트한다.
- `Expo Go`는 native module이 걸린 기능 검증에는 기본 선택지가 아니다.
- 서버는 개발 머신에서 띄운다. 사용자는 **실기기에서 설치된 Development Build 앱을 열고 QR을 찍어 연결**한다.
- 테스트 항목은 항상 현재 `TASK_LIST.md`, `WALKTHROUGH.md`, `CURRENT_STATE.md`의 보류 수동 검증 범위를 기준으로 만든다.

## 1. 먼저 새 빌드가 필요한지 판단한다

편집/검증 전에 아래 파일과 최근 변경 범위를 확인한다.

- `git status`
- `git diff --name-only`
- `package.json`
- `package-lock.json`
- `app.json`
- `eas.json`
- `android/`, `ios/`, `plugins/`, `vendor/` 아래 native 관련 파일
- `TASK_LIST.md`, `WALKTHROUGH.md`, `DEPLOYMENT_PLAN.md`

### 새 Development Build가 필요한 경우

아래 중 하나라도 해당하면 **기존 APK 재사용 금지**로 보고 새 Android Development Build를 만든다.

- native module 추가/업데이트/삭제
- `package.json` 또는 lockfile에서 native dependency 변경
- `app.json`의 plugin, permission, scheme, package, deep link, intent filter 관련 변경
- `eas.json`의 build profile 변경
- `android/` 또는 `ios/` 코드/설정 변경
- `vendor/` 아래 네이티브 모듈 코드 변경
- microphone, audio session, push, auth, Firebase 같은 native 동작에 영향 주는 변경

### 기존 Development APK로 충분한 경우

아래처럼 **JS/TS/UI/문서/테스트만 바뀐 상태**라면 기존 Development Build를 재사용하고 Expo dev server만 다시 띄우면 된다.

- `src/**/*.ts`, `src/**/*.tsx`만 변경
- 테스트 파일, 문서, artifact 문서만 변경
- 스타일, copy, 상태 관리, 서비스 로직 수정이지만 native footprint 변경은 없음

### 사용자에게 반드시 알려줄 결정 문구

작업 결과에는 아래 둘 중 하나를 명확히 포함한다.

- `새 Android Development Build가 필요합니다. 근거: ...`
- `기존 Development APK로 실기기 테스트가 가능합니다. 근거: native/config 변경 없음`

## 2. 새 Development Build가 필요한 경우

### 빌드 실행

```bash
eas build --profile development --platform android
```

### 빌드 진행 상황을 사용자에게 보이게 해야 한다

이 단계는 중요하다. 빌드를 시작했는데 사용자가 상태를 확인할 수 없으면 안 된다.

빌드를 시작한 직후 사용자에게 최소한 아래 중 하나를 반드시 제공한다.

- EAS build page URL
- build ID
- 현재 빌드가 연결된 백그라운드 터미널/프로세스 정보
- 빌드 상태를 다시 확인할 다음 시점과 방법

가능하면 아래 정보까지 같이 준다.

- `현재 로컬 업로드 완료 / EAS 서버 빌드 진행 중 / 완료 대기` 같은 현재 단계
- `백그라운드에서 실행 중이라 기본 터미널 탭에는 보이지 않는다` 같은 가시성 설명
- 사용자가 직접 확인 가능한 링크 또는 식별자

### 절대 하지 말 것

- `빌드 요청해 두었습니다`만 말하고 끝내기
- 빌드가 백그라운드에서 도는 사실을 숨기기
- 사용자가 어디서 진행 상황을 보는지 설명하지 않기

### 권장 출력 예시

```markdown
새 Android Development Build가 필요합니다.

현재 상태:
- 로컬 프로젝트 압축/업로드 완료
- EAS 서버에서 빌드 진행 중
- 이 빌드는 백그라운드 프로세스에서 실행 중이라 기본 터미널 탭에는 바로 보이지 않을 수 있습니다.

확인 방법:
- EAS build page: [링크]
- Build ID: `...`

빌드가 완료되면 바로 APK 설치 안내를 드리겠습니다.
```

### 사용자 안내 순서

1. 빌드 시작 직후, 사용자가 진행 상황을 확인할 수 있도록 build URL 또는 build ID를 안내한다.
2. 빌드 완료 시점에 다운로드 링크 또는 산출물을 사용자에게 안내한다.
3. 사용자가 Android 기기에 새 Development APK를 설치하도록 안내한다.
4. **설치 완료 확인을 받은 뒤에만** 사용자에게 직접 터미널 창을 열어 아래 명령을 복사/붙여넣기하여 Expo dev server를 띄우도록 안내한다. (주의: 백그라운드 프로세스로 자동 실행하면 사용자가 QR 코드를 보지 못하는 IDE 버그가 있으므로, **절대 에이전트가 직접 백그라운드로 실행하지 말고 사용자가 직접 실행하도록** 지시한다.)

```bash
npx expo start --dev-client -c --tunnel
```

5. 사용자가 기기에서 설치한 Development Build 앱을 연다.
6. 앱 안에서 QR 스캔 진입점을 열고, 개발 머신 터미널/브라우저에 표시된 QR을 찍어 연결한다.
7. 연결 후 테스트 체크리스트를 따라 검증한다.

### 빌드 완료 후 설치 안내 규칙

빌드가 완료되면 사용자에게 아래 순서로 말한다.

1. `빌드가 완료되었습니다.`
2. `이제 Android 기기에 Development APK를 설치해 주세요.`
3. 설치가 끝나면 알려 달라고 요청한다.
4. 설치 확인 후 Expo dev server / QR 연결 단계로 넘어간다.

설치 전에 QR 연결 절차를 먼저 안내하지 않는다.

### 왜 `development` 프로필을 기본으로 쓰는가

- 실기기에서 native 기능을 확인할 수 있다.
- QR로 JS 번들을 갱신해 반복 테스트가 빠르다.
- release-like 최종 점검 전 단계에서 디버깅과 재검증이 쉽다.

## 3. 기존 Development APK로 충분한 경우

사용자에게 아래 순서로 안내한다.

1. 이전에 다운로드한 Development APK가 아직 기기에 없으면 그 APK를 먼저 설치한다.
2. 사용자에게 직접 IDE의 터미널 탭을 열어 Expo dev server를 띄우도록 아래 명령을 안내한다. (주의: 백그라운드 자동 실행 시 QR 코드가 숨겨지는 버그가 있으므로 에이전트가 직접 실행하지 않는다.)

```bash
npx expo start --dev-client -c --tunnel
```

3. 사용자는 기기에서 Development Build 앱을 연다.
4. QR 스캔으로 현재 워크스페이스 번들에 연결한다.
5. 테스트 체크리스트를 수행한다.

이 경우 핵심은 다음 한 줄이다.

- `이번 변경은 JS/TS 범위라서 새 빌드 없이 기존 Development APK + 새 QR 연결로 검증 가능합니다.`

## 4. Preview Build는 언제 쓰는가

`preview` 프로필은 아래 조건일 때만 쓴다.

- release 직전 최종 QA가 목적
- dev server 없이 설치형 APK 동작을 보고 싶음
- HMR/QR 재연결보다 배포 유사 환경 확인이 더 중요함

```bash
eas build --profile preview --platform android
```

기본 실기기 회귀 테스트는 `development`를 우선한다.

## 5. Expo Go 사용 규칙

이 프로젝트처럼 `@speechmatics/expo-two-way-audio` 같은 native module이 있으면 Expo Go는 전체 기능 검증용으로 적절하지 않다.

Expo Go는 아래처럼 아주 제한된 경우에만 쓴다.

- native 경로를 전혀 타지 않는 가벼운 UI 확인
- 디자이너/카피 검토
- Talk, audio, permission, review playback 같은 native 연동과 무관한 화면 확인

## 6. 테스트 체크리스트를 만든다

체크리스트는 현재 세션의 실제 변경 범위와 보류 수동 검증 항목을 기준으로 만든다.

우선 아래 문서를 읽는다.

- `TASK_LIST.md`
- `WALKTHROUGH.md`
- `CURRENT_STATE.md`

그다음 사용자에게 아래 형식으로 보여준다.

```markdown
## Real Device Test Checklist
- [ ] 항목명: 무엇을 눌러 어디로 들어가는지
  - 기대 결과: 화면/동작/데이터 유지 여부
- [ ] 항목명
  - 기대 결과
```

## 7. 이 워크스페이스 기본 체크리스트

문서에 별도 지시가 없으면 아래 항목을 기본 체크리스트로 사용하고, 현재 활성 Task ID에 맞춰 추가/삭제한다.

- `Clear All Data` 모달 진입
  - 기대 결과: 모달이 열리고 삭제 범위가 이해 가능하게 보인다.
- `DELETE` 확인 입력
  - 기대 결과: 확인 입력 없이는 삭제가 진행되지 않는다.
- 데이터 유지 여부
  - 기대 결과: reset 후 login 상태, API Key, 설정 유지/삭제 정책이 문서와 일치한다.
- `Privacy Policy`, `Update History`, `Recording Notice`
  - 기대 결과: 각 진입점이 열리고 텍스트/링크 흐름이 끊기지 않는다.
- Talk / Audio / VAD 관련 변경점
  - 기대 결과: 최신 handoff에 적힌 latency, VAD, review 흐름 기대치와 실제 동작이 맞는다.
- 현재 활성 기능 Task
  - 예: `P1-V5.1-CARDNAV`, `P1-V5.1-VOICEPICKER`
  - 기대 결과: 해당 기능 acceptance에 맞게 동작한다.

## 8. 테스트 후 결과 기록

실기기 테스트가 끝나면 결과를 바로 문서에 반영한다.

- `WALKTHROUGH.md`: 실제 수행한 항목, Pass/Fail, 사용자 피드백
- `TASK_LIST.md`: 남은 수동 검증 또는 새 blocker
- `CURRENT_STATE.md`: 다음 권장 역할과 blocker 요약
- 필요 시 `REVIEW_REPORT.md`: 리뷰 승인 범위 조정
- 필요 시 `DEPLOYMENT_PLAN.md`: release readiness 상태 반영

문서에는 실제로 수행한 검증만 적는다. 아직 안 한 검증을 완료처럼 쓰지 않는다.

## 9. User Report Alignment Check (사용자 리포트 이해 확인 절차)

사용자가 실기기 테스트 결과를 긴 자유서술 형태로 보내면, 바로 결론을 내리지 않는다. 먼저 아래 순서로 이해를 맞춘다.

1. 사용자의 원문을 짧게 재구성한다.
2. `Observed Results (관찰된 결과)`, `Requested Follow-up (사용자 요청 / 후속 요청)`, `Needs Clarification (불명확 / 확인 필요)`로 분리한다.
3. 각 항목에 화면명이나 기능명을 붙인다.
4. `Please confirm whether my understanding is correct. (내 이해가 맞는지 확인해 달라)`고 짧게 묻는다.
5. 사용자가 확인하거나 정정한 뒤에만 `WALKTHROUGH.md`, `TASK_LIST.md`, `CURRENT_STATE.md`에 반영한다.
6. 답변이 아직 없으면 `Needs Clarification` 상태로 유지하고, 개발 TODO / blocker / release gate를 확정하지 않는다.

### 목적

- 사용자가 적은 원문과 AI가 이해한 내용을 먼저 맞춘다.
- 실제 실패와 단순 개선 요청을 섞지 않는다.
- 이미 수정된 이슈의 재언급인지, 새 결함인지, 정책 설명 요청인지 분리한다.
- Tester가 구현 지시를 받은 것처럼 오해해 코드 수정으로 넘어가는 일을 막는다.

### 권장 확인 형식

```markdown
## 이해한 내용
- Observed Results (관찰된 결과)
  - `Settings > Update History`: 화면은 열리지만 스크롤이 안 된다고 이해했다.
  - `Clear All Data`: 실제 삭제는 수행했고, 삭제 완료 문구와 설명 문구 개선 요청이 있다고 이해했다.
- Requested Follow-up (사용자 요청 / 후속 요청)
  - Privacy Policy 또는 Recording Notice에 음성, transcript 처리 방식을 더 분명히 설명해 달라는 요청으로 이해했다.
- Needs Clarification (불명확 / 확인 필요)
  - `첫번째 파일`, `두번째 파일` 같은 표현은 첨부 이미지 순서를 뜻하는지 확인이 필요하다.

Please confirm whether my understanding is correct. (내 이해가 맞는지 확인해 달라)
```

### 절대 생략하지 말 것

- 사용자가 길게 적어 준 실기기 리포트를 임의로 구현 TODO로 바꾸기
- 확인 없이 blocker / severity / owner를 확정하기
- 확인 없이 `Developer Agent` 업무로 넘길 수정 목록을 단정하기

## 10. 사용자에게 최종으로 보여줄 출력 형식

이 스킬을 사용한 결과 메시지에는 보통 아래 6개가 포함되어야 한다.

1. `새 빌드 필요` 또는 `기존 APK 재사용 가능` 판단
2. 빌드 진행 상황을 확인할 수 있는 정보(URL / build ID / 상태 설명)
3. 실행한 명령 또는 실행해야 할 명령
4. 설치 안내
5. QR 연결 안내
6. 실기기 테스트 체크리스트

예시:

```markdown
새 Android Development Build가 필요합니다.

현재 상태:
- EAS 서버에서 빌드 진행 중
- 사용자는 아래 링크에서 진행 상황을 확인할 수 있습니다.
- Build URL: [링크]

실행 및 안내 명령:
- `eas build --profile development --platform android`
- 빌드 완료 후 터미널 직접 입력 권장: `npx expo start --dev-client -c --tunnel`

설치:
- 빌드 완료 후 Android 기기에 새 Development APK를 설치한다.
- 설치가 끝나면 그다음 QR 연결 단계로 넘어간다.

또는

이번 변경은 JS/TS 범위라서 기존 Development APK로 테스트 가능합니다.

안내 명령:
- 터미널 직접 입력 권장: `npx expo start --dev-client -c --tunnel`

설치/연결:
- 기기에서 기존 Development Build 앱을 연다.
- QR을 스캔해 현재 번들에 연결한다.

테스트 항목:
- [ ] Clear All Data 모달
- [ ] DELETE 확인 입력
- [ ] Privacy Policy / Update History / Recording Notice
```
