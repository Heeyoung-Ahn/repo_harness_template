---
name: General Publish
description: 웹 앱, Node.js 서버, Cloud Run, Firebase 호스팅 등을 위한 범용 배포 파이프라인 가이드 스킬
---

# General Publish Skill

Expo와 같은 특정 모바일 프레임워크에 종속되지 않는 범용적인 배포 환경(예: Vercel, Firebase Hosting, Cloud Run, AWS 등)을 위한 기본 절차입니다.

> 이 스킬의 예시 명령은 참고용입니다. **실제 실행 전에 반드시 프로젝트의 `DEPLOYMENT_PLAN.md`에 배포 대상, 검증 명령, 롤백 방법, 승인 경로를 구체적으로 적어두어야 합니다.**

## 사전 조건
- `DEPLOYMENT_PLAN.md`에 프로덕션 환경의 변수 및 명령어 셋업이 완료되어 있어야 합니다.
- 배포 대상 버전, 배포 대상 환경, 승인 경로가 확정되어 있어야 합니다.
- 현재 worktree 상태, 원격 동기화 상태, 비밀값 주입 상태를 점검해야 합니다.

## 범용 배포 절차

### 1단계: 배포 전 사전 점검 (Preflight)
- 현재 브랜치, 커밋, 배포 대상 버전을 확인합니다.
- `git status`를 확인하여 의도하지 않은 변경 파일이 없는지 점검합니다.
- 프로덕션용 환경 변수와 비밀값이 저장소 밖의 안전한 위치에 설정되어 있는지 확인합니다.
- 실패 시 롤백 절차가 `DEPLOYMENT_PLAN.md`에 기록되어 있는지 확인합니다.

### 2단계: 프로젝트 정의 검증 명령 실행
프로젝트에 정의된 검증 명령을 실행합니다. 아래는 예시이며, 실제 명령은 프로젝트별로 다를 수 있습니다.
```bash
# 예시
npm run lint
npm run test
npm run build
```

### 3단계: 프로덕션 빌드
- 프레임워크에 맞는 **프로젝트 승인 빌드 명령**만 실행합니다.
- 아래는 예시일 뿐이며 그대로 기본값처럼 사용하지 않습니다.
```bash
# 예시: React / Vue / Next.js
npm run build
```

### 4단계: 클라우드 배포 실행
빌드된 아티팩트를 목적지에 배포합니다. 아래 명령은 플랫폼별 예시입니다.
```bash
# 옵션 A: Firebase Hosting 배포
firebase deploy --only hosting

# 옵션 B: Vercel CLI 배포
vercel --prod

# 옵션 C: Docker 기반 Cloud Run 배포
docker build -t gcr.io/PROJECT_ID/IMAGE_NAME .
docker push gcr.io/PROJECT_ID/IMAGE_NAME
gcloud run deploy SERVICE_NAME --image gcr.io/PROJECT_ID/IMAGE_NAME
```

### 완료 후
- 사용자에게 배포 URL 또는 배포 링크를 전달합니다.
- `DEPLOYMENT_PLAN.md`에 버전, 날짜, 배포 대상, 커밋 기준점, 결과, URL, 롤백 여부를 기록합니다.
