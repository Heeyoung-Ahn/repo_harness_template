---
name: Dependency Audit
description: 프로젝트 의존성(npm, pip, gradle 등)의 보안 취약점 스캔, 라이선스 점검, 버전 호환성 확인을 수행하는 표준 절차. 특히 Expo/React Native 프로젝트에서 vendored package, `file:` dependency, native module, npm registry 기반 `audit/outdated/license` 확인까지 묶어 보고, 결과를 REVIEW_REPORT.md나 DEPLOYMENT_PLAN.md의 release gate로 연결해야 할 때 반드시 사용한다.
---

# Dependency Audit Skill

프로젝트에서 사용하는 외부 패키지/라이브러리의 보안 취약점, 라이선스, 버전 리스크를 점검하기 위한 표준 절차입니다.

이 스킬은 단순히 `npm audit`만 돌리는 것이 아니라, 아래를 구분해서 판단하는 데 목적이 있습니다.

1. runtime 직접 의존성인지
2. dev tool / transitive 의존성인지
3. vendored / `file:` 의존성인지
4. 지금 릴리즈를 막아야 하는지, 아니면 triage 후 추적해도 되는지

## 사용 시점

- 배포 전 최종 점검 단계
- 새로운 패키지 추가 또는 교체 직후
- native module, `vendor/`, `file:` dependency가 있는 프로젝트 점검 시
- Reviewer 또는 DevOps가 release-risk를 정리할 때

## 1단계: 의존성 지형을 먼저 분류한다

감사 전에 현재 의존성을 아래 세 종류로 나눠 본다.

- **직접 runtime 의존성**
- **dev / test / build tool 의존성**
- **vendored 또는 `file:` 의존성**

Node.js 프로젝트라면 최소한 아래를 본다.

```bash
npm ls --depth=0
```

추가로 아래 파일도 같이 확인한다.

- `package.json`
- `package-lock.json`
- `app.json`, `eas.json` (Expo / native footprint 판단용)
- `vendor/*/package.json`

### 반드시 별도 표시할 것

- `file:` dependency
- 직접 포함한 vendored 패키지
- native module
- Expo plugin, Firebase, auth, audio, secure storage처럼 앱 런타임에 직접 닿는 패키지

## 2단계: 취약점 스캔을 실행한다

가능하면 로컬 정보 -> 네트워크 정보 순서로 진행한다.

```bash
# Node.js
npm audit --json
```

### 실행 규칙

- sandbox나 네트워크 제한으로 실패하면, 필요한 경우 권한 상승 후 다시 실행한다.
- 실패 사실도 결과에 남긴다. "감사를 안 했다"와 "시도했지만 환경상 실패했다"는 다르다.

Python / Gradle 프로젝트에서는 프로젝트 맥락에 맞게 아래를 사용한다.

```bash
pip-audit
./gradlew dependencies
```

## 3단계: 취약점은 심각도만 보지 말고 노출 경로도 본다

같은 `high`라도 release gate 의미가 다르다.

### 기본 분류

- **Runtime direct / runtime transitive**
  - 앱 실행 경로에 직접 닿는 의존성
  - 사용자 데이터, 네트워크, 인증, 파일, 오디오, 권한, 렌더링에 영향

- **Build / test / lint / doc tool**
  - 개발 환경에서만 쓰는 도구 체인
  - 릴리즈 바이너리에 직접 포함되지 않을 수 있음

- **Vendored / file dependency**
  - 외부 레지스트리만 믿을 수 없고, 저장소에 들어온 코드 자체를 검토해야 함

### 대응 원칙

| 유형 | 대응 |
|---|---|
| Runtime direct의 Critical / High | 기본적으로 release-blocking으로 본다. 즉시 패치/대체/보류 판단 필요 |
| Runtime transitive의 Critical / High | 영향 경로를 확인하고, 불명확하면 보수적으로 release risk로 기록 |
| Build / test tool의 Critical / High | 즉시 배포 차단으로 단정하지 말고 triage한다. 다만 CI/개발 머신 보안 리스크로 기록 |
| Vendored dependency 취약점 | upstream 버전, 로컬 코드, native 영향 범위를 같이 검토한다 |
| Medium / Low | 이번 릴리즈 내 처리 또는 후속 백로그 등록 여부를 명시 |

## 4단계: 라이선스를 점검한다

요약은 아래로 확인한다.

```bash
npx license-checker --summary
```

필요하면 개별 패키지 `package.json`도 읽는다.

### 라이선스 체크 포인트

- GPL 등 copyleft가 정책상 허용되는지
- `UNLICENSED`, 애매한 표기, 복수 라이선스 조건이 있는지
- vendored 패키지의 라이선스 파일과 `package.json` 표기가 일치하는지
- 저장소에 직접 포함한 코드가 attribution 요구사항을 갖는지

## 5단계: 버전 리스크를 점검한다

```bash
npm outdated
```

### 판단 규칙

- patch / minor 업데이트는 비교적 빠른 후속 반영 후보로 본다.
- Expo / React Native / Firebase / Navigation 같은 기반 패키지는 **메이저 업그레이드나 canary를 즉시 권장하지 않는다**.
- canary가 latest로 보이더라도, 안정 채널인지 먼저 확인한다.
- breaking change가 예상되면 별도 Task ID로 분리한다.

## 6단계: Vendored / Native 패키지는 별도 검토한다

이 프로젝트처럼 `vendor/` 아래 패키지를 들고 있는 경우, 다음을 추가로 본다.

- `vendor/<pkg>/package.json`
- 라이선스
- upstream repository / bugs / homepage
- Android / iOS 소스 포함 여부
- 앱 런타임 핵심 경로와의 연결 여부

### Vendored 패키지에서 반드시 적을 것

- 현재 로컬에 고정된 버전
- 유지보수 주체
- 라이선스
- native 코드 포함 여부
- 실제 앱 기능에서 차지하는 중요도

## 7단계: 결과를 문서와 게이트에 연결한다

결과는 `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, 필요 시 `CURRENT_STATE.md`에 남긴다.

최소한 아래를 기록한다.

```markdown
## Dependency Audit Results
- 점검 일시: [YYYY-MM-DD HH:MM]
- 점검 명령: [npm audit --json / npm outdated / license-checker ...]
- 취약점 요약: [critical/high/moderate/low]
- 런타임 차단 여부: [차단 / triage 후 추적 / 정보성]
- 라이선스 요약: [주요 분포 + 예외]
- 오래된 주요 패키지: [patch/minor vs major/canary 구분]
- Vendored 패키지: [이름 / 버전 / 라이선스 / 비고]
```

## 8단계: 최종 판단 문구

출력에는 아래 셋을 분리해서 적는다.

1. **사실**
   - 몇 건인지, 어떤 도구로 봤는지

2. **판단**
   - release-blocking인지
   - triage 후 추적 가능한지

3. **다음 조치**
   - 즉시 수정
   - Task ID 생성
   - closeout 전 재검토

단순히 "취약점 있음"으로 끝내지 않는다.
