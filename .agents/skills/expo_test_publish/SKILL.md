---
name: Expo Test Publish
description: Expo 앱을 내부 테스트 또는 preview 목적으로 배포하는 표준 스킬
---

# Expo Test Publish Skill

> Optional skill. Use this only when the project's `ARCHITECTURE_GUIDE.md` or `DEPLOYMENT_PLAN.md` says the project uses Expo / React Native.
> 정식 버전 배포의 일부로 실행하는 preview/internal publish라면 GitHub release finalization을 먼저 닫고 시작합니다.

정식 스토어 릴리즈 전, 내부 테스트나 데모 용도로 Expo 앱을 배포하거나 OTA 업데이트를 올릴 때 사용하는 절차입니다.

## 사전 조건
- `eas-cli`가 설치되어 있어야 합니다.
- `eas.json`에 `preview` 프로파일과 채널이 구성되어 있어야 합니다.
- formal version deployment라면 `DEPLOYMENT_PLAN.md`의 `GitHub Release Gate`가 `Closed`여야 합니다.

## 사용자 오더 준수
- 사용자가 preview build 또는 OTA 명령어만 요청했다면 명령어만 제공하고 실제 실행은 하지 않습니다.
- 사용자가 ad-hoc QA 목적의 preview publish만 요청했다면 GitHub release path를 임의로 추가하지 않습니다.
- formal version deployment인지 ad-hoc QA publish인지 먼저 짧게 고정하고, 그 범위를 임의로 넓히지 않습니다.

## 절차

### 1단계: 배포 성격 분류
- 이번 publish가 정식 버전 배포의 일부인지, 단순 QA/데모용 preview인지 먼저 고정합니다.
- 정식 버전 배포의 일부라면 `github_deploy`로 GitHub release gate를 먼저 닫습니다.

### 2단계: 변경 사항 정리
- 테스트 사용자에게 전달할 변경 내용을 간단히 정리합니다.

### 3단계: OTA 업데이트
JavaScript / asset 변경만 있을 때 사용합니다.

```bash
eas update --branch preview --message "Fixed preview bugs"
```

### 4단계: Preview Build
Native dependency나 SDK 변경이 있을 때 사용합니다.

```bash
eas build --platform android --profile preview
```

### 5단계: 전달 및 기록
- 설치 링크나 QR 코드를 전달합니다.
- 결과를 `WALKTHROUGH.md` 또는 `DEPLOYMENT_PLAN.md`에 기록합니다.
- formal version deployment였다면 GitHub release path와 preview publish 결과를 함께 남깁니다.
