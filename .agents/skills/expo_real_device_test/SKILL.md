---
name: Expo Real Device Test
description: Expo Android 앱을 실제 기기에서 테스트하는 표준 스킬
---

# Expo Real Device Test Skill

> Optional skill. Use this only when the project's `ARCHITECTURE_GUIDE.md` says the project uses Expo / React Native.

이 스킬은 사용자의 실제 안드로이드 기기에서 Expo 애플리케이션을 테스트하는 표준 절차를 제공합니다.

## 1. Dev Client 기반 테스트
기능을 자주 수정하면서 빠르게 확인할 때 사용하는 권장 방식입니다.

1. Dev Client 빌드:

```bash
eas build --profile development --platform android
```

2. 빌드된 앱을 기기에 설치합니다.
3. 개발 서버 실행:

```bash
npx expo start --dev-client
```

4. 기기에서 Dev Client를 열고 연결합니다.

## 2. Preview Build 기반 최종 QA 테스트
릴리즈 직전 환경에 가깝게 테스트할 때 사용합니다.

1. Preview 빌드:

```bash
eas build --profile preview --platform android
```

2. 빌드된 APK / AAB를 기기에 설치합니다.
3. 개발 서버 없이 앱을 단독 실행해 최종 동작을 확인합니다.

## 3. Expo Go
순수 JS 기반의 가벼운 UI 확인에만 사용합니다. Native module이 포함된 프로젝트에서는 충분하지 않을 수 있습니다.

```bash
npx expo start -c
```
