---
name: GitHub Deploy
description: 운영 배포 전에 GitHub release path를 닫기 위해 브랜치 정리, main merge, push, 태깅을 수행하는 표준 스킬. `README.md`는 비운영 문서이므로 명시적으로 요청된 경우에만 함께 다룬다.
---

# GitHub Deploy Skill

이 스킬은 프로젝트 코드를 GitHub 등 원격 저장소에 안전하게 배포하면서, 운영 배포 전에 반드시 필요한 GitHub release gate를 닫을 때 사용합니다.

## 사전 조건
- 원격 저장소(GitHub 등) 인증이 완료되어 있어야 합니다.
- 민감 정보(API Key 등)가 소스 코드에 하드코딩되지 않았는지 검토합니다.
- 멀티 AI 환경이라면 `TASK_LIST.md`의 `## Active Locks`와 최근 Handoff를 확인합니다.
- `DEPLOYMENT_PLAN.md`에 `GitHub Release Path`, `Source Branch for Release`, `Target Branch for Release`, `Post-Merge Cleanup`가 정리되어 있어야 합니다.

## 배포 절차

### 1단계: 배포 전 점검
- `git status --short`와 `git diff --stat`로 현재 변경 범위를 확인합니다.
- 빌드 산출물, 캐시 파일, 비밀 파일, 의도하지 않은 임시 파일이 포함되지 않았는지 점검합니다.
- 다른 Agent의 미반영 변경이 없는지 Handoff Log와 lock 상태를 확인합니다.
- `git fetch --prune origin` 후 source branch와 target branch의 실제 상태가 `DEPLOYMENT_PLAN.md`와 일치하는지 확인합니다.
- 현재 배포가 `version branch -> target branch merge`인지, 이미 `main`에서 작업한 direct push인지 먼저 고정합니다.

### 2단계: 문서 최신화
코드를 커밋하기 전, 해당 배포에 반영된 내용을 문서화합니다.
- 패키지 버전(`package.json` 등)을 배포 버전에 맞게 수정합니다.
- `CHANGELOG.md` 파일 상단에 최신 버전, 날짜, 변경 사항(구현된 기능, 수정된 버그 등)을 명확하게 업데이트합니다.
- 저장소 소개나 외부 노출 설명까지 함께 바꿔야 한다는 명시적 요청이 있을 때만 `README.md`를 업데이트합니다.

### 3단계: 코드 검증 및 포매팅
- 필요 시 `npm run lint` 등 정적 분석 및 포매팅 스크립트를 실행하여 코드를 정리합니다.
- 빌드 에러가 없는지 최종 터미널 환경에서 점검합니다.
- 프로젝트가 별도 검증 명령을 요구하면 GitHub release gate를 닫기 전에 그 명령을 먼저 통과시킵니다.

### 4단계: GitHub release gate 닫기
전체 스테이징(`git add .`) 대신 **의도한 파일만 명시적으로 스테이징**합니다.

- 경로 A. 버전 브랜치가 있으면 해당 브랜치에 push한 뒤 target branch로 merge하고, target branch push까지 확인한 뒤 release branch를 삭제합니다.
- 경로 B. 버전 브랜치가 없고 이미 `main`에서 운영 중이면 `main`에 직접 push하고 종료합니다.
- 실제 브랜치 이름은 프로젝트의 `DEPLOYMENT_PLAN.md`를 기준으로 결정합니다.
- `DEPLOYMENT_PLAN.md`의 경로와 실제 브랜치 상태가 다르면 merge를 강행하지 말고 문서와 현재 상태를 먼저 맞춥니다.
```bash
# 1. 상태를 확인합니다.
git status --short

# 2. 의도한 파일만 명시적으로 스테이징합니다.
git add path/to/file1 path/to/file2

# 3. 명시적 커밋 메시지로 커밋합니다.
git commit -m "chore: release version X.X.X"

# 4-A. 버전 브랜치 release 예시
git push origin release/x.y.z
git switch main
git merge --no-ff release/x.y.z
git push origin main
git push origin --delete release/x.y.z
git branch -d release/x.y.z

# 4-B. main direct release 예시
git switch main
git push origin main
```

### 5단계: (선택) Release 태깅
버전 릴리즈 태그는 GitHub release gate가 닫힌 뒤, 배포 승인 또는 실제 릴리즈 시점에만 생성합니다.
```bash
git tag -a vX.X.X -m "Release vX.X.X"
git push origin vX.X.X
```

### 완료 후
사용자에게 GitHub release gate가 닫혔는지, 어떤 release path를 사용했는지, branch cleanup이 끝났는지 알려주고 다음 타깃 배포 스킬을 안내합니다.
