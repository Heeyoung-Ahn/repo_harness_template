---
name: Dependency Audit
description: 프로젝트 의존성(npm, pip, gradle 등)의 보안 취약점 스캔, 라이선스 점검, 버전 호환성 확인을 수행하는 표준 절차. 배포 전이나 정기 점검 시 이 스킬을 사용한다.
---

# Dependency Audit Skill

프로젝트에서 사용하는 외부 패키지/라이브러리의 보안 취약점, 라이선스 위반, 버전 호환성 문제를 점검하기 위한 표준 절차입니다.

## 사용 시점
- 배포 전 최종 점검 단계
- 새로운 패키지를 추가한 후
- 정기적인 보안 점검 시 (월 1회 등)
- Reviewer 또는 DevOps가 보안 감사를 수행할 때

## 점검 절차

### 1단계: 의존성 목록 확인
프로젝트의 패키지 매니저에 따라 현재 의존성 목록을 확인합니다.

```bash
# Node.js / npm
npm ls --all --depth=0

# Python / pip
pip list --format=columns

# Gradle (Android/Java)
./gradlew dependencies
```

### 2단계: 보안 취약점 스캔
내장 또는 표준 도구를 사용하여 알려진 취약점(CVE)을 스캔합니다.

```bash
# Node.js
npm audit

# Python
pip-audit    # 설치: pip install pip-audit

# 범용
# Snyk, OWASP Dependency-Check 등 프로젝트에 맞는 도구 사용
```

### 3단계: 취약점 심각도 분류

| 심각도 | 대응 |
|---|---|
| **Critical / High** | 즉시 패치 또는 대체 패키지로 교체. 배포 차단 사유 |
| **Medium** | 이번 릴리즈 내 해결 권장. 기한 설정 후 백로그 등록 |
| **Low** | 다음 정기 점검까지 모니터링. 백로그에 기록 |

### 4단계: 라이선스 점검
- 사용 중인 패키지의 라이선스가 프로젝트 정책과 호환되는지 확인합니다.
- GPL 등 copyleft 라이선스가 상용 프로젝트에 혼입되지 않았는지 확인합니다.

```bash
# Node.js
npx license-checker --summary

# Python
pip-licenses --format=table
```

### 5단계: 버전 호환성 확인
- 주요 의존성의 메이저 버전 업데이트 여부를 확인합니다.
- breaking change가 포함된 업데이트는 별도 Task ID로 관리합니다.

```bash
# Node.js
npm outdated

# Python
pip list --outdated
```

### 6단계: 결과 기록
점검 결과를 `REVIEW_REPORT.md` 또는 `DEPLOYMENT_PLAN.md`에 기록합니다.

```markdown
## Dependency Audit Results
- 점검 일시: [YYYY-MM-DD]
- 점검 도구: [npm audit / pip-audit 등]
- Critical/High 취약점: [건수] → [대응 상태]
- 라이선스 위반: [유/무]
- 오래된 주요 패키지: [목록]
```

## 완료 후
- 취약점이 0건이면 배포 진행 가능합니다.
- Critical/High가 있으면 해결 후 재점검합니다.
- 결과를 Handoff Log에 요약하여 다음 Agent에게 인계합니다.
