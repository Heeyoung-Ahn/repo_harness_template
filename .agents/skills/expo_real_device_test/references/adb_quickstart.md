# ADB Quick Reference

`expo_real_device_test`를 쓰는 중 사용자가 아래를 바로 물으면 이 문서를 먼저 본다.

- Windows PC에 `adb`만 빠르게 설치하는 법
- `adb`만 있는 최소 환경에서 실기기 테스트를 시작하는 순서
- 문제 발생 시 복붙할 `adb` 명령 모음

## 1. `adb`만 설치하는 가장 짧은 절차

1. Android Developers에서 `platform-tools` zip을 받는다.
2. 예: `C:\Android\platform-tools`에 압축을 푼다.
3. Windows 환경 변수 `Path`에 `C:\Android\platform-tools`를 추가한다.
4. 새 터미널을 열고 `adb version`을 실행한다.
5. 휴대폰에서 개발자 옵션과 USB 디버깅을 켠다.
6. USB로 연결하고 RSA 허용 팝업을 승인한다.
7. `adb devices`를 실행해서 상태가 `device`면 준비 완료다.

## 2. 실기기 테스트 방식과 사용자가 해야 할 일

- 현재 권장 방식은 `기존 Development Build 앱 + QR 연결 + 실기기 테스트 + adb 보조 수집`이다.
- `adb`만 있어도 가능하다. 에뮬레이터, AVD, 로컬 native build는 없어도 된다.
- 테스트 범위는 항상 현재 프로젝트의 `TASK_LIST.md`, `WALKTHROUGH.md`, `CURRENT_STATE.md`를 기준으로 정한다.
- 사용자가 해야 할 일은 보통 다음 순서다.
  - 폰에 기존 Development Build가 설치돼 있는지 확인한다.
  - PC에서 `npx expo start --dev-client -c --tunnel`를 실행한다.
  - 폰에서 앱을 열고 QR로 연결한다.
  - 현재 체크리스트를 따라 눌러보며 결과를 기록한다.
- 문제가 나오면 화면 캡처와 짧은 설명만 받지 말고, 가능하면 `adb` 스크린샷과 `logcat`도 같이 받는다.
- 기존 Development Build가 폰에 없으면 그때만 기존 APK를 다시 설치하거나 새 build 필요 여부를 판단한다.

## 3. 프로젝트별 치환 규칙

- 패키지명은 현재 프로젝트의 `app.json > expo.android.package`에서 읽어 넣는다.
- 테스트 범위 문구는 현재 프로젝트의 active task와 수동 검증 범위를 기준으로 다시 적는다.
- 특정 프로젝트의 패키지명, task ID, 화면명, provider 이름을 기본값처럼 고정하지 않는다.
- 사용자에게 안내할 때는 `<package>`, `현재 체크리스트`, `현재 활성 task`처럼 현재 프로젝트 문맥으로 치환한다.

## 4. 문제 발생 시 바로 쓰는 `adb` 명령 5개

1. 연결 확인
   - `adb devices`
2. 재현 직전 로그 비우기
   - `adb logcat -c`
3. 앱 전경 복귀
   - `adb shell monkey -p <package> 1`
4. 화면 캡처 저장
   - `adb exec-out screencap -p > issue.png`
5. 재현 직후 로그 저장
   - `adb logcat -d > issue-logcat.txt`

## 5. 필요하면 바로 붙이는 짧은 안내문

```markdown
1. Android Developers에서 platform-tools zip을 받습니다.
2. `C:\Android\platform-tools`에 압축을 풉니다.
3. Windows `Path`에 `C:\Android\platform-tools`를 추가합니다.
4. 새 터미널에서 `adb version`을 실행합니다.
5. 휴대폰에서 개발자 옵션과 USB 디버깅을 켭니다.
6. USB 연결 후 RSA 허용 팝업을 승인합니다.
7. `adb devices` 결과가 `device`면 준비 완료입니다.

실기기 테스트는 기존 Development Build 앱 + QR 연결 + adb 보조 수집 기준으로 진행합니다.
- PC에서 `npx expo start --dev-client -c --tunnel`
- 폰에서 앱을 열고 QR 연결
- 현재 체크리스트 수행

문제 발생 시:
- 연결 확인: `adb devices`
- 로그 초기화: `adb logcat -c`
- 앱 전경 복귀: `adb shell monkey -p <package> 1`
- 화면 캡처: `adb exec-out screencap -p > issue.png`
- 로그 저장: `adb logcat -d > issue-logcat.txt`
```
