---
name: Code Review Checklist
description: Reviewer Agent가 코드 리뷰 시 빠짐없이 확인해야 할 표준 체크리스트. 아키텍처 준수, 보안, 코드 품질, 성능을 체계적으로 검증한다. 리뷰를 수행하거나 REVIEW_REPORT.md를 작성할 때 이 스킬을 참고한다.
---

# Code Review Checklist Skill

Reviewer Agent가 코드 리뷰를 수행할 때 빠짐없이 확인해야 할 항목을 체계적으로 정리한 체크리스트입니다. `REVIEW_REPORT.md` 작성 시 이 체크리스트를 기반으로 검증 결과를 기록합니다.

## 사용 시점
- `/review` 워크플로우 수행 시
- Tester에서 Reviewer로 handoff 받은 직후
- 릴리즈 전 최종 코드 품질 점검 시

## 체크리스트

### 1. 아키텍처 준수 검증
- [ ] `ARCHITECTURE_GUIDE.md`에 정의된 도메인 경계를 침범하지 않는가?
- [ ] 계층 책임(domain → application → infrastructure → presentation)이 올바르게 지켜지는가?
- [ ] 의존성 방향이 올바른가? (domain이 infrastructure를 직접 참조하지 않는가?)
- [ ] 승인되지 않은 새로운 폴더 패턴이나 구조 변경이 없는가?
- [ ] 공통 유틸리티가 특정 도메인에 강하게 결합되어 있지는 않은가?

### 2. 요구사항 정합성
- [ ] `REQUIREMENTS.md`에 명시된 기능 요구사항이 모두 구현되었는가?
- [ ] 비기능 요구사항(성능, 접근성 등)이 충족되었는가?
- [ ] 요구사항에 없는 기능이 임의로 추가되지는 않았는가?
- [ ] UI가 있다면 `UI_DESIGN.md`의 화면 구조와 interaction 규칙을 따르는가?

### 3. 보안 검증
- [ ] API Key, Secret, Token이 코드에 하드코딩되지 않았는가?
- [ ] 환경 변수(.env) 또는 비밀 관리 서비스를 올바르게 사용하는가?
- [ ] `console.log`나 디버그 출력에 민감 정보(비밀번호, 토큰, 개인정보)가 노출되지 않는가?
- [ ] 사용자 입력에 대한 검증(validation)과 살균(sanitization)이 적절한가?
- [ ] 인증/인가 로직에 우회 가능한 취약점이 없는가?
- [ ] `.gitignore`에 비밀 파일(.env, 인증서 등)이 포함되어 있는가?

### 4. 코드 품질
- [ ] 함수/클래스가 단일 책임 원칙을 따르는가?
- [ ] 중복 코드(Copy-Paste)가 없는가?
- [ ] 순환 참조(circular dependency)가 없는가?
- [ ] 네이밍이 `ARCHITECTURE_GUIDE.md`의 네이밍 컨벤션을 따르는가?
- [ ] 적정 수준의 에러 처리가 되어 있는가?
- [ ] TODO나 FIXME 등 미완성 마커가 프로덕션 코드에 남아 있지 않은가?

### 5. 성능 및 안정성
- [ ] 불필요한 리렌더링이나 메모리 누수 가능성이 없는가?
- [ ] N+1 쿼리, 대량 데이터 로드 등 성능 병목 가능성이 없는가?
- [ ] 비동기 처리에서 에러 핸들링이 누락되지 않았는가?
- [ ] 네트워크 요청에 적절한 타임아웃과 재시도 로직이 있는가?

### 6. 테스트 커버리지
- [ ] 핵심 비즈니스 로직에 대한 테스트가 존재하는가?
- [ ] edge case와 error case에 대한 테스트가 있는가?
- [ ] 테스트가 `WALKTHROUGH.md`에 기록된 검증 결과와 일치하는가?

## 리뷰 결과 기록
위 체크리스트 결과를 `REVIEW_REPORT.md`의 `## Findings` 테이블에 기록합니다. 각 발견 항목에 대해 심각도(High/Medium/Low), 카테고리(Architecture/Security/Quality/Performance), 설명, 권장 담당자를 명시합니다.
