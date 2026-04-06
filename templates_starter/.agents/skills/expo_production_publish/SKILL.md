---
name: Expo Production Publish
description: Expo 애플리케이션을 production 환경으로 배포하는 표준 스킬
---

# Expo Production Publish Skill

> Optional skill. Use this only when the project's `ARCHITECTURE_GUIDE.md` or `DEPLOYMENT_PLAN.md` says the project is an Expo / React Native app.
> 이 스킬은 Expo/EAS 타깃 배포만 담당합니다. GitHub release finalization은 반드시 `github_deploy`가 먼저 처리해야 합니다.

Expo 애플리케이션을 완성하여 안드로이드 실제 운영 환경(Production)으로 배포할 때 사용하는 절차입니다. EAS Build 및 구글 플레이스토어 릴리즈를 포함합니다.

## 사전 조건
- 로컬 환경에 `eas-cli`가 설치되고 로그인(`eas login`)되어 있어야 합니다.
- 프로젝트에 `eas.json` 프로파일이 정상적으로 설정되어 있어야 합니다. 예: `production`
- 구글 플레이스토어 자격 증명과 서비스 계정이 준비되어 있어야 합니다.
- `DEPLOYMENT_PLAN.md`의 `GitHub Release Gate`가 `Closed`여야 합니다. `Open`이면 먼저 `github_deploy`를 사용합니다.
- `DEPLOYMENT_PLAN.md`의 `Deployment Provider`와 `Preferred Deployment Skill`가 Expo production 경로와 일치해야 합니다.

## 사용자 오더 준수
- 사용자가 production build 명령어만 요청했다면 명령어만 제공하고 실제 `eas build`, `eas submit`, 백그라운드 실행을 하지 않습니다.
- 실제 실행 범위는 `build only`, `submit only`, `build + submit` 중 무엇인지 먼저 짧게 고정합니다. 그 범위를 임의로 넓히지 않습니다.
- `build only` 오더에서는 submit을 추가하지 않고, `submit only` 오더에서는 새 build를 추가하지 않습니다.

## 배포 절차

### 1단계: GitHub release gate와 버전 게이트 확인
- 이 스킬을 시작하기 전에 `github_deploy`가 완료되어 GitHub release gate가 닫혔는지 확인합니다.
- 버전 브랜치 release였다면 release commit이 target branch에 merge/push되었고 branch cleanup이 끝났는지 확인합니다.
- `app.json` 또는 `app.config.js`의 `version`, `android.versionCode`를 올립니다.
- Android production build는 `android.versionCode`가 직전 Google Play / 내부 제출값보다 증가했다고 확인되기 전에는 시작하지 않습니다.
- 직전 제출값을 확인할 수 없으면 build를 시작하지 말고 현재 값과 확인 포인트를 먼저 사용자와 정리합니다.
- `package.json` 버전과 일치시키는지 확인합니다.

### 2단계: 최신 코드 확인
- `git status`로 불필요한 변경이 없는지 확인합니다.
- GitHub release gate를 닫은 release commit과 현재 빌드 대상 commit이 같은지 확인합니다.
- 필요한 파일만 명시적으로 staging / commit / push 합니다.

### 3단계: EAS Production 빌드
- 이 단계는 사용자가 실제 `build` 실행을 지시했을 때만 수행합니다.

```bash
eas build --platform android --profile production
```

### 4단계: 필요 시 제출
- 이 단계는 사용자가 `submit`까지 명시했을 때만 수행합니다.

```bash
eas submit --platform android --latest
```

## 완료 후
- 빌드 및 제출 결과를 확인합니다.
- `DEPLOYMENT_PLAN.md`에 GitHub release path, 사용한 Expo production 명령, 배포 이력을 함께 남깁니다.
