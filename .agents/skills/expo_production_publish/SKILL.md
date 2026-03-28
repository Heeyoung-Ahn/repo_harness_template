---
name: Expo Production Publish
description: Expo 애플리케이션을 production 환경으로 배포하는 표준 스킬
---

# Expo Production Publish Skill

> Optional skill. Use this only when the project's `ARCHITECTURE_GUIDE.md` or `DEPLOYMENT_PLAN.md` says the project is an Expo / React Native app.

Expo 애플리케이션을 완성하여 안드로이드 실제 운영 환경(Production)으로 배포할 때 사용하는 절차입니다. EAS Build 및 구글 플레이스토어 릴리즈를 포함합니다.

## 사전 조건
- 로컬 환경에 `eas-cli`가 설치되고 로그인(`eas login`)되어 있어야 합니다.
- 프로젝트에 `eas.json` 프로파일이 정상적으로 설정되어 있어야 합니다. 예: `production`
- 구글 플레이스토어 자격 증명과 서비스 계정이 준비되어 있어야 합니다.

## 배포 절차

### 1단계: 버전 업데이트
- `app.json` 또는 `app.config.js`의 `version`, `android.versionCode`를 올립니다.
- `package.json` 버전과 일치시키는지 확인합니다.

### 2단계: 최신 코드 확인
- `git status`로 불필요한 변경이 없는지 확인합니다.
- 필요한 파일만 명시적으로 staging / commit / push 합니다.

### 3단계: EAS Production 빌드

```bash
eas build --platform android --profile production
```

### 4단계: 필요 시 제출

```bash
eas submit --platform android --latest
```

## 완료 후
- 빌드 및 제출 결과를 확인합니다.
- `DEPLOYMENT_PLAN.md`에 배포 이력을 남깁니다.
