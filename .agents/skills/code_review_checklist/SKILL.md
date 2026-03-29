---
name: Code Review Checklist
description: Reviewer Agent가 코드 리뷰 시 빠짐없이 확인해야 할 표준 체크리스트. 아키텍처 준수, 보안, 코드 품질, 성능, 테스트, native/runtime 리스크를 체계적으로 검증한다. 특히 실기기 검증이 남아 있는 Expo/React Native 프로젝트에서 `정적 코드 승인`과 `release-ready 승인`을 분리해서 판단해야 할 때, 또는 REVIEW_REPORT.md를 작성하거나 갱신할 때 반드시 사용한다.
---

# Code Review Checklist Skill

Reviewer Agent가 코드 리뷰를 수행할 때 빠짐없이 확인해야 할 항목과, 리뷰 결과를 어떤 상태값으로 기록해야 하는지를 정리한 체크리스트입니다.

이 스킬의 핵심 목적은 두 가지입니다.

1. 코드 레벨에서 실제 결함을 찾는다.
2. 실기기 검증, dependency audit, active lock 같은 미완료 조건이 남아 있으면 "승인 범위"를 과장하지 않는다.

## 사용 시점

- `/review` 워크플로우 수행 시
- Tester에서 Reviewer로 handoff 받은 직후
- 대형 PR 또는 다중 파일 변경 뒤 구조/보안 점검 시
- 릴리즈 전 최종 코드 품질 점검 시

## 리뷰 시작 전에 먼저 정리할 것

리뷰는 무조건 아래를 먼저 확인하고 시작한다.

- `CURRENT_STATE.md`
- `TASK_LIST.md > ## Active Locks`
- 현재 리뷰 대상 Task ID 또는 PR 범위
- `git status`
- `git diff --stat`
- 필요하면 `WALKTHROUGH.md`, `DEPLOYMENT_PLAN.md`

### 먼저 판단할 3가지

1. **이번 리뷰 범위가 어디까지인지**
   - 이미 완료된 범위만 본다.
   - active lock 상태의 진행 중 작업은 리뷰 승인 범위에서 제외한다.

2. **리뷰 종류가 무엇인지**
   - `정적 코드 리뷰`: 코드 / 테스트 / 문서 정합성 검토
   - `릴리즈 준비 리뷰`: 정적 코드 + 수동 검증 + dependency audit + 배포 게이트까지 포함
   - `후속 델타 리뷰`: 이전 승인 이후 변경분만 추가 검토

3. **승인 문구를 어떤 수준으로 쓸지**
   - 실기기 검증, 수동 QA, dependency triage가 남아 있으면 `승인 (Approved)`만 쓰지 말고 범위를 제한한다.
   - 예: `Approved for reviewed scope`, `릴리즈 준비 상태는 보류`

## 체크리스트

### 1. 범위와 게이트 설정
- [ ] 리뷰 대상 Task ID, 파일 범위, handoff 범위를 먼저 적었는가?
- [ ] active lock 상태의 진행 중 작업을 승인 범위에 섞지 않았는가?
- [ ] `정적 코드 승인`과 `release-ready 승인`을 구분해서 판단했는가?
- [ ] 미완료 수동 검증, dependency triage, 배포 조건이 남아 있으면 리뷰 상태에 반영했는가?

### 2. 아키텍처 준수 검증
- [ ] `ARCHITECTURE_GUIDE.md`에 정의된 도메인 경계를 침범하지 않는가?
- [ ] 계층 책임(domain -> application -> infrastructure -> presentation)이 올바르게 지켜지는가?
- [ ] 의존성 방향이 올바른가? (domain이 infrastructure를 직접 참조하지 않는가?)
- [ ] 승인되지 않은 새로운 폴더 패턴이나 구조 변경이 없는가?
- [ ] 공통 유틸리티가 특정 도메인에 강하게 결합되어 있지는 않은가?

### 3. 요구사항 정합성
- [ ] `REQUIREMENTS.md`에 명시된 기능 요구사항이 구현과 일치하는가?
- [ ] 비기능 요구사항(성능, 접근성, 오류 처리, 사용자 안내)이 빠지지 않았는가?
- [ ] 요구사항에 없는 기능을 임의로 추가하지 않았는가?
- [ ] UI가 있다면 `UI_DESIGN.md`의 화면 구조와 interaction 규칙을 따르는가?
- [ ] 문서에는 완료라고 적었지만 실제 구현은 미완료인 항목이 없는가?

### 4. 보안 검증
- [ ] API Key, Secret, Token이 코드에 하드코딩되지 않았는가?
- [ ] 환경 변수, secure storage, 비밀 관리 경로를 올바르게 사용하는가?
- [ ] `console.log`나 디버그 출력에 민감 정보가 노출되지 않는가?
- [ ] 사용자 입력 검증(validation)과 살균(sanitization)이 적절한가?
- [ ] 인증/인가 로직에 우회 가능한 취약점이 없는가?
- [ ] `.gitignore`에 비밀 파일(.env, 인증서 등)이 포함되어 있는가?

### 5. Native / Runtime / Device 리스크 검증

Expo / React Native / native module 프로젝트에서는 이 단계를 빼지 않는다.

- [ ] `package.json`, `package-lock.json`, `app.json`, `eas.json`, `android/`, `ios/`, `vendor/` 변경 여부를 확인했는가?
- [ ] native footprint가 바뀌었으면 새 Development Build 또는 Preview Build 필요성을 명시했는가?
- [ ] native module이 있는 앱인데 Expo Go로 충분하다고 잘못 판단하지 않았는가?
- [ ] 실기기에서만 드러나는 권한, 오디오, 네트워크, 브리지, VAD, replay 류 리스크를 별도로 적었는가?
- [ ] 수동 검증이 아직 안 됐으면 release-ready 승인으로 쓰지 않았는가?

### 6. 코드 품질
- [ ] 함수/클래스가 단일 책임 원칙을 따르는가?
- [ ] 중복 코드(Copy-Paste)가 없는가?
- [ ] 순환 참조(circular dependency)가 없는가?
- [ ] 네이밍이 `ARCHITECTURE_GUIDE.md`의 네이밍 컨벤션을 따르는가?
- [ ] 적정 수준의 에러 처리가 되어 있는가?
- [ ] TODO, FIXME, 임시 fallback이 프로덕션 경로에 무심코 남아 있지 않은가?

### 7. 성능 및 안정성
- [ ] 불필요한 리렌더링이나 메모리 누수 가능성이 없는가?
- [ ] N+1 쿼리, 대량 데이터 로드, 과도한 recomputation 가능성이 없는가?
- [ ] 비동기 처리에서 에러 핸들링과 cleanup이 누락되지 않았는가?
- [ ] 네트워크 요청에 적절한 timeout, retry, fallback이 있는가?
- [ ] 캐시 키, resume 데이터, session state처럼 파급 범위가 큰 값이 타입/도메인 계약과 일치하는가?

### 8. 테스트와 증빙
- [ ] 핵심 비즈니스 로직에 대한 테스트가 존재하는가?
- [ ] edge case와 error case에 대한 테스트가 있는가?
- [ ] 이번 변경으로 깨질 가능성이 큰 회귀 포인트에 테스트가 있거나, 없으면 그 사실을 적었는가?
- [ ] 실행한 검증 명령과 결과를 `WALKTHROUGH.md` 또는 `REVIEW_REPORT.md`에 사실대로 남겼는가?
- [ ] 실제 수행하지 않은 실기기 검증, manual QA, smoke test를 완료처럼 적지 않았는가?

### 9. Dependency / License 후속 확인
- [ ] dependency audit 결과가 있으면 `Critical/High` 또는 release-risk를 리뷰 결론에 연결했는가?
- [ ] vendored dependency나 `file:` dependency가 있으면 라이선스와 유지보수 주체를 확인했는가?
- [ ] 취약점이 전이적 dev-tool 이슈인지, runtime 경로까지 영향을 주는지 구분했는가?

## 리뷰 결과 기록 규칙

리뷰 결과는 `REVIEW_REPORT.md`에 아래 구조를 분리해서 적는다.

1. 검토한 범위
2. 발견 사항
3. 실행한 검증 명령
4. 남은 리스크
5. 승인 상태

### 발견 사항 작성 규칙

- 발견 사항이 있으면 **심각도 높은 순서로 먼저** 적는다.
- 각 항목에는 가능하면 파일/모듈/기능 범위를 붙인다.
- 해결이 필요한 결함과, release gate를 막는 운영 리스크를 구분한다.
- 발견 사항이 없으면 `No blocking findings in reviewed scope`를 명시한다.
- 대신 남아 있는 수동 검증, dependency triage, active lock 범위 같은 **잔여 리스크**는 따로 적는다.

### 승인 상태 예시

- `Approved for reviewed scope`
- `Changes requested`
- `Blocked for release`

`정적 코드 리뷰 승인`과 `릴리즈 승인`을 같은 뜻으로 쓰지 않는다.
