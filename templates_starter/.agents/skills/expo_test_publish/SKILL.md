---
name: Expo Test Publish
description: Expo 앱을 내부 테스트 또는 preview 목적으로 배포하는 표준 스킬
---

# Expo Test Publish Skill

> Optional skill. Use this only when the project's `ARCHITECTURE_GUIDE.md` or `DEPLOYMENT_PLAN.md` says the project uses Expo / React Native.

정식 스토어 릴리즈 전, 내부 테스트나 데모 용도로 Expo 앱을 배포하거나 OTA 업데이트를 올릴 때 사용하는 절차입니다.

## 사전 조건
- `eas-cli`가 설치되어 있어야 합니다.
- `eas.json`에 `preview` 프로파일과 채널이 구성되어 있어야 합니다.

## 절차

### 1단계: 변경 사항 정리
- 테스트 사용자에게 전달할 변경 내용을 간단히 정리합니다.

### 2단계: OTA 업데이트
JavaScript / asset 변경만 있을 때 사용합니다.

```bash
eas update --branch preview --message "Fixed preview bugs"
```

### 3단계: Preview Build
Native dependency나 SDK 변경이 있을 때 사용합니다.

```bash
eas build --platform android --profile preview
```

### 4단계: 전달 및 기록
- 설치 링크나 QR 코드를 전달합니다.
- 결과를 `WALKTHROUGH.md` 또는 `DEPLOYMENT_PLAN.md`에 기록합니다.
