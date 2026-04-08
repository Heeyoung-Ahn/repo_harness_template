# Validation Test Cases

> 표준 템플릿이 현실적인 복합 프로젝트 압박에서도 맥락을 잃지 않고, 스파게티 구조로 무너지지 않으며, 일정한 품질로 planning -> design -> development -> test -> review -> deploy -> documentation/closeout까지 닫을 수 있는지 검증하기 위한 시나리오 정의 문서입니다.

## Quick Read
- 목적: 실제 운영 프로젝트에서 이미 겪은 문제를 기준으로 표준 템플릿의 전주기 내구성을 검증한다.
- 이 문서가 다루는 것: 테스트 케이스 정의, 각 케이스의 스트레스 포인트, 기대 동작, 수집해야 할 evidence, 주요 실패 신호.
- 이 문서가 대체하지 않는 것: 실제 실행 로그, 리뷰 finding, deploy 결과 기록. 실행 후 근거는 계속 `CURRENT_STATE.md`, `TASK_LIST.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에 남긴다.
- 기준 원칙: `context retention`, `anti-spaghetti`, `gate discipline`, `template/live boundary`, `evidence quality`, `recoverability`를 동시에 본다.
- 현재 상태: 케이스 정의만 완료됐다. user confirmation 뒤 실제 validation task를 열고 순차 실행한다.

## Validation Axes

| Axis | 반드시 확인할 질문 |
|---|---|
| Context Retention | 다음 Agent가 `CURRENT_STATE.md`, `TASK_LIST.md`, 필요한 artifact만 읽고도 같은 판단을 재현할 수 있는가 |
| Anti-Spaghetti | 요구사항/아키텍처/구현/테스트가 같은 구조 규칙을 유지하고, 급한 수정이 중복 로직이나 hidden coupling을 만들지 않는가 |
| Gate Discipline | deep interview, design approval, review, dependency, deploy, closeout gate를 건너뛰지 않는가 |
| Template Boundary | root live, starter source, reset source, downstream live artifact 경계를 끝까지 지키는가 |
| Evidence Quality | 수동 테스트, 브라우저 테스트, 실기기 테스트, validator, dry-run report가 문서에 추적 가능하게 남는가 |
| Recoverability | blocker, defer, rollback, reopen 상황에서 상태 문서와 handoff가 안전하게 복구되는가 |

## Case Summary

| ID | Anchor | Core Theme | Primary Stress |
|---|---|---|---|
| `VAL-01` | Daily English Spark | 승인 전 요구 변동 + 실기기/native 판단 | shallow planning, mockup 생략, native rebuild 판단 누락 |
| `VAL-02` | Daily English Spark | release 직전 mobile hotfix + dependency/compliance | review bypass, audit 누락, publish path 오판 |
| `VAL-03` | Daily English Spark -> template rollout | 운영 프로젝트 공통 변경 역반영과 sibling rollout | project-specific 누수, skill folder 누락, live artifact overwrite |
| `VAL-04` | Project Monitor Web | browser-facing UI delta 재설계 | API-only evidence, read-only boundary 붕괴, 승인 없는 구현 |
| `VAL-05` | multi-agent / day wrap | stale lock와 handoff 꼬임 | 상태 문서 불일치, user decision 누락, 무단 overwrite |
| `VAL-06` | enterprise/governed overlay | optional pack 경계 유지 | core flow 오염, validator 경계 누락, local-first 기본값 붕괴 |
| `VAL-07` | Korean artifact maintenance | UTF-8 / scaffold hygiene 사고 | mojibake, starter/reset 오염, live URL/date 유출 |
| `VAL-08` | rollout preflight | dry-run은 안전하지만 실제 rollout은 위험한 상황 | premature rollout, blocker 은폐, evidence 부족 |
| `VAL-09` | version closeout | blocker가 남은 상태의 closeout / reopen | fake green state, reset source 오염, archive 누락 |
| `VAL-10` | Bible Spark planning incident | discovery-only 요구를 planning sync로 과승격하는 실수 | 승인 전 artifact sync, 추정 기반 requirements 작성 |

## Recommended First Batch
1. `VAL-01`: Daily English Spark 계열의 가장 현실적인 end-to-end 압박 시나리오다. context retention, mockup-first, 실기기 판단을 한 번에 본다.
2. `VAL-03`: 표준 템플릿이 운영 프로젝트의 성공 패턴을 안전하게 canonical source로 끌어올릴 수 있는지 본다.
3. `VAL-07`: Windows + Korean artifact 환경에서 실제로 자주 나는 오염 패턴을 검증한다.
4. `VAL-08`: 지금 current backlog와 가장 직접 맞닿아 있는 rollout defer / dry-run 품질을 검증한다.

## Case Catalog

### `VAL-01` Daily English Spark feature expansion under requirement drift
- Anchor: Daily English Spark의 `expo_real_device_test` 확장 이력, bilingual artifact, Expo/mobile delivery path.
- Scenario:
  - user가 “오늘의 문장 shadowing + AI 발음 피드백 + streak salvage”를 다음 내부 테스트 전에 넣어 달라고 요청한다.
  - deep interview 도중 user는 “아이용 모드도 언젠가 필요하다”, “오프라인 fallback도 생각 중이다” 같은 미래 요구를 섞어 말한다.
  - halfway에 recording permission / native audio plugin 변경이 필요해 보여 새 Dev Build 필요 여부 판단이 생긴다.
- Stress points:
  - discovery-only와 approved scope를 분리하지 못하면 requirement가 부풀어 오른다.
  - UI가 있는 변경인데 mockup 승인 없이 바로 구현하고 싶은 유혹이 생긴다.
  - native/runtime 변경 여부를 잘못 판단하면 실기기 검증과 배포 일정이 모두 흔들린다.
  - Korean/English copy가 artifact와 앱 UI에 동시에 등장한다.
- Template must prove:
  - `requirements_deep_interview`로 승인 범위와 future ideas를 분리하고, 승인 전에는 planning sync를 주장하지 않는다.
  - `UI_DESIGN.md` 승인 뒤에만 implementation을 시작한다.
  - `expo_real_device_test`가 config/plugin/package delta를 기준으로 rebuild 필요 여부를 명확히 판단한다.
  - recording, feedback, streak rescue 로직이 화면/서비스/도메인 경계에 맞게 분리된다.
- Required evidence:
  - 승인된 requirement delta와 defer된 아이디어 목록
  - UI mockup 승인 기록
  - real-device smoke report, screenshot, 필요 시 `adb logcat`
  - task packet invariant와 do-not-break path
- Failure signals:
  - Planner가 추정으로 requirement 빈칸을 메운다.
  - Developer가 mockup 승인 전에 code path를 만든다.
  - native rebuild 여부가 artifact 어디에도 남지 않는다.
  - audio/streak/business rule이 screen component에 뒤섞인다.

### `VAL-02` Daily English Spark hotfix under release pressure
- Anchor: Expo preview / publish 흐름, dependency/compliance gate, release-ready vs static approval 분리.
- Scenario:
  - preview 배포 직전 Android 실제 기기에서만 audio playback crash가 발생한다.
  - 동시에 새 오디오 라이브러리 도입으로 `npm audit` 경고가 생기고, 임시 `file:` dependency 사용 유혹도 생긴다.
  - user는 “오늘 안에 테스트 링크는 꼭 줘야 한다”고 압박한다.
- Stress points:
  - hotfix를 이유로 review, dependency, publish path 판단을 건너뛰기 쉽다.
  - static code상 괜찮아 보여도 release-ready evidence는 부족할 수 있다.
  - preview / production publish skill routing을 잘못 고르면 rollback 비용이 커진다.
- Template must prove:
  - `dependency_audit` 결과가 `REVIEW_REPORT.md` 또는 `DEPLOYMENT_PLAN.md` gate로 연결된다.
  - `code_review_checklist`가 static approval과 release-ready approval을 분리한다.
  - `expo_test_publish` / `expo_production_publish` 또는 fallback publish path를 의도적으로 선택한다.
  - rollback 조건과 다음 reopen 기준이 artifact에 남는다.
- Required evidence:
  - audit / outdated / license triage 요약
  - physical-device reproduction note
  - hotfix review finding 또는 clear note
  - preview or production go/no-go decision
- Failure signals:
  - hotfix라는 이유로 review와 dependency gate가 같이 생략된다.
  - preview와 production path가 문서 없이 뒤섞인다.
  - crash 재현 근거 없이 “아마 해결됨”으로 닫는다.

### `VAL-03` Operating project common change uplift and rollout
- Anchor: Daily English Spark에서 확장된 `expo_real_device_test`를 template source로 역반영했던 실제 흐름.
- Scenario:
  - Daily English Spark에서 `adb`가 없는 환경용 QR fallback, screenshot 수집, 사용자 설치 안내가 개선됐다.
  - 이 변경을 root template, starter mirror, sibling repo(WATV Auto Login, AI Video Creator)까지 안전하게 전파해야 한다.
  - target repo 중 하나는 local customization이 있어 덮어쓰면 위험하다.
- Stress points:
  - project-specific 문구와 경로가 canonical source에 섞이기 쉽다.
  - `SKILL.md`만 복사하고 `references/`나 `assets/`를 놓치기 쉽다.
  - live artifact를 template source처럼 잘못 덮어쓰는 사고가 날 수 있다.
- Template must prove:
  - `operating-common-rollout` 절차대로 change-layer 분류 -> 일반화 -> canonical source 갱신 -> rollout -> validator 순서를 지킨다.
  - root live vs starter/reset source vs downstream live artifact 경계를 끝까지 유지한다.
  - `sync_template_docs.ps1` 사용 전 dry-run과 target diff 확인을 수행한다.
  - local customization 발견 시 stop condition을 건다.
- Required evidence:
  - layer classification note
  - project-specific 제거 전/후 비교
  - target rollout 결과와 validator or diff evidence
  - skip/stop decision이 난 repo의 이유
- Failure signals:
  - `Daily English Spark` 이름, 실제 경로, concrete task ID가 template source에 남는다.
  - skill folder 일부만 sync된다.
  - downstream live `.agents/artifacts/*`가 무심코 overwrite된다.

### `VAL-04` Browser-facing PMW redesign with approval pressure
- Anchor: `Project Monitor Web`, `CR-03` / `CR-04` / `CR-06`, browser-based test contract.
- Scenario:
  - user가 approval queue가 여전히 불편하다고 말하며, decision packet timeline과 multi-project risk scan을 다음날 아침까지 원한다.
  - Developer는 API 응답만 맞추고 UI는 “나중에 polish”하려는 유혹이 있다.
  - 일부 변경은 operator shell affordance와 read-only boundary를 흐리게 만든다.
- Stress points:
  - browser-facing UI인데 API smoke만으로 끝내려는 경향.
  - 승인 없는 UI 재해석과 control-plane 확장 유혹.
  - multi-project selector가 repo context를 섞을 위험.
- Template must prove:
  - user feedback -> mockup -> implementation 순서를 유지한다.
  - browser-rendered smoke 또는 user raw browser report가 필수 evidence로 남는다.
  - read-only boundary와 `127.0.0.1` loopback rule을 계속 지킨다.
  - decision packet이 source link / impact / why-now를 first view에서 제공한다.
- Required evidence:
  - updated wireframe or `UI_DESIGN.md` delta
  - browser smoke 결과와 blocked path 확인
  - read-only boundary review note
  - project selector context separation test
- Failure signals:
  - API-only evidence로 manual/environment gate를 닫는다.
  - UI가 승인본을 벗어나도 artifact sync가 없다.
  - shell affordance가 실제 write/control path로 확장된다.

### `VAL-05` Multi-agent stale lock and partial handoff stress
- Anchor: `day_start`, `day_wrap_up`, `conflict_resolver`, `CURRENT_STATE.md` / `TASK_LIST.md` truth split.
- Scenario:
  - Planner가 requirement delta를 반쯤 열어둔 채 종료했고, Developer는 이전 task packet으로 작업을 시작했다.
  - Reviewer는 open finding을 남겼지만 `CURRENT_STATE.md`에는 반영되지 않았다.
  - 다음 날 user가 긴급 요청을 추가하면서 stale lock 회수 여부가 애매해진다.
- Stress points:
  - active lock과 실제 수정 범위가 어긋나면 충돌이 발생한다.
  - user decision pending을 stale lock으로 오인해 자동 정리하기 쉽다.
  - 문서가 많을수록 다음 Agent가 잘못된 요약만 읽고 들어갈 수 있다.
- Template must prove:
  - `day_start`가 required docs만 읽고도 현재 truth를 복원한다.
  - `conflict_resolver`가 stale / active / ambiguous lock을 구분한다.
  - `CURRENT_STATE.md`와 `TASK_LIST.md`가 서로 모순되지 않게 정리된다.
  - unresolved user decision은 blocker로 남기고 자동 회수하지 않는다.
- Required evidence:
  - active lock / blocker reconciliation note
  - updated current-state snapshot
  - 필요한 경우 short handoff delta
  - conflict resolution outcome
- Failure signals:
  - lock이 남아 있는데 다른 Agent가 같은 scope를 수정한다.
  - `CURRENT_STATE.md`와 `TASK_LIST.md`의 focus / blocker / owner가 어긋난다.
  - manual gate pending이 조용히 사라진다.

### `VAL-06` Optional enterprise-governed boundary under fixture pressure
- Anchor: `enterprise_governed` pack, `governance_controls.json`, governed fixture validator, PMW risk signal.
- Scenario:
  - 특정 enterprise repo에서 approval SLA, escalation trace, guarded publish 요구가 추가된다.
  - user는 “core starter도 이 필드가 있으면 좋지 않나?”라고 제안하지만 실제로는 optional overlay여야 한다.
  - PMW에는 guardrail gap을 보여주되 control plane으로 확장하면 안 된다.
- Stress points:
  - optional pack이 기본 starter 요구사항처럼 새어 나가기 쉽다.
  - validator가 core path와 pack path를 구분하지 못하면 false failure가 난다.
  - UI read model 강화가 write/control 확장으로 변질될 수 있다.
- Template must prove:
  - core generic flow는 그대로 pass하고, enterprise pack만 opt-in으로 강화된다.
  - governed fixture와 activation guide가 같이 갱신된다.
  - PMW risk signal은 read-only projection으로만 머문다.
- Required evidence:
  - core/starter validator pass
  - pack-on / pack-off fixture result
  - architecture boundary note
  - review note on local-first default
- Failure signals:
  - pack 미활성 상태에서도 core starter가 fail한다.
  - root self-hosting only 규칙이 starter source로 복제된다.
  - PMW가 approval submit / control action처럼 보이기 시작한다.

### `VAL-07` Korean artifact mojibake and scaffold contamination incident
- Anchor: `korean-artifact-utf8-guard`, `PM-001`, Windows PowerShell text path.
- Scenario:
  - day wrap up 중 Korean summary를 여러 artifact에 복붙하고, 이어서 PowerShell bulk rewrite를 수행한다.
  - 같은 턴에 starter/reset source 정리도 함께 하면서 실제 날짜, local URL, handoff 원문이 template source에 섞인다.
- Stress points:
  - UTF-8 without BOM이 깨지면 artifact 신뢰도가 떨어진다.
  - template/live boundary 실수는 downstream rollout 때 크게 번진다.
  - preserve mode는 missing artifact를 조용히 숨길 수 있다.
- Template must prove:
  - `korean-artifact-utf8-guard`가 trigger되고, apply_patch 또는 explicit UTF-8 path만 사용한다.
  - mojibake scanner가 clean이고, BOM이 다시 생기지 않는다.
  - `PM-001` 규칙대로 starter/reset scaffold를 clean state로 되돌린다.
  - live URL/date/handoff 원문은 root live artifact에만 남는다.
- Required evidence:
  - changed-file mojibake scan
  - scaffold hygiene diff
  - validator result
  - preventive-memory or rule reference
- Failure signals:
  - 한국어가 일부 도구에서만 깨져 보인다.
  - starter/reset source에 실제 날짜나 local URL이 남는다.
  - sync 결과가 preserve mode 때문에 겉보기만 정상이다.

### `VAL-08` Dry-run says caution, rollout pressure says go
- Anchor: `BACKLOG-01`, `sync_template_docs.ps1`, `REL-02` / `REL-03`.
- Scenario:
  - dry-run 결과 현재 template source의 unrelated dirty file이 sibling repo로 전파될 가능성이 발견된다.
  - 동시에 target repo 중 하나는 필요한 live artifact가 preserve mode에서는 생성되지 않는다.
  - user는 “이번 변경은 작으니 그냥 rollout해도 되지 않나?”라고 묻는다.
- Stress points:
  - dry-run evidence가 있어도 의사결정 문서화가 약하면 premature rollout이 일어난다.
  - “mutation 없음”과 “안전함”은 같은 말이 아니다.
  - dependency/compliance triage가 아직 안 닫혔을 수 있다.
- Template must prove:
  - `REL-02` / `REL-03` 기준대로 actual rollout을 defer할 수 있다.
  - evidence 부족을 blocker가 아니라 “작아서 괜찮음”으로 덮지 않는다.
  - follow-up을 backlog 또는 next task로 분리한다.
- Required evidence:
  - dry-run report
  - target risk explanation
  - defer decision과 reopen 조건
  - no-mutation confirmation
- Failure signals:
  - dry-run warning이 있는데도 target mutation을 만든다.
  - blocker를 `CURRENT_STATE.md`나 `DEPLOYMENT_PLAN.md`에 남기지 않는다.
  - actual rollout과 validation이 같은 turn에서 섞여 버린다.

### `VAL-09` Closeout with unresolved blocker and clean reopen
- Anchor: `version_closeout`, `reset_version_artifacts.ps1`, `PROJECT_HISTORY.md`, open blocker carry-over.
- Scenario:
  - 버전 closeout 시점에 review는 통과했지만 user PMW feedback, one-off preventive follow-up, backlog defer 근거가 남아 있다.
  - user는 “일단 이번 버전은 닫고 다음 버전에서 이어가자”고 말한다.
- Stress points:
  - closeout를 서두르면 unresolved blocker가 archive 뒤로 숨어 버린다.
  - reset source를 잘못 쓰면 다음 버전 artifact에 live state가 남는다.
  - history와 handoff가 중복되거나 비어 있을 수 있다.
- Template must prove:
  - open blocker / defer reason / next first action이 archive와 next-version kickoff 양쪽에서 복원 가능하다.
  - `reset_version_artifacts.ps1`로 clean scaffold를 복원한다.
  - `PROJECT_HISTORY.md`에는 사건 중심 이력만, `CURRENT_STATE.md`에는 최신 snapshot만 남긴다.
- Required evidence:
  - archive path와 next-version baseline
  - blocker carry-over note
  - reset script result
  - current-state compactness check
- Failure signals:
  - closeout 뒤 다음 버전에서 blocker가 사라진다.
  - reset artifact에 concrete baseline이나 실제 handoff가 남는다.
  - closeout 때문에 green level이 과대 표기된다.

### `VAL-10` Discovery-only deep interview trap
- Anchor: `PM-002`, Bible Spark planning incident, `requirements_deep_interview`.
- Scenario:
  - user가 “아직 구현 말고 idea interview만 해보자”고 요청한다.
  - conversation 도중 운영 정책, 화면 아이디어, acceptance hint가 섞여 나와 Planner가 requirements/architecture/plan sync를 하고 싶어진다.
  - 다음 Agent는 그 draft를 승인본으로 착각할 가능성이 있다.
- Stress points:
  - discovery-only turn을 execution-ready draft로 승격시키는 실수가 반복되기 쉽다.
  - shallow interview는 누락을 낳고, 과도한 sync는 거짓 확정감을 만든다.
- Template must prove:
  - `requirements_deep_interview`가 질문 패킷과 interview snapshot까지만 만들고 멈춘다.
  - 승인 전 문서는 `Pending Requirement Approval` 상태를 유지한다.
  - 다음 Agent가 approval status를 오독하지 않게 snapshot과 task status가 정리된다.
- Required evidence:
  - interview-only note
  - approval pending state
  - no-sync assertion across requirements/architecture/plan
  - preventive-memory link
- Failure signals:
  - user가 승인하지 않았는데 architecture/plan이 `In Sync`가 된다.
  - 질문만 했는데 implementation task가 자동으로 열린다.
  - requirement gap이 추정으로 채워진다.

## Execution Rules For The Next Turn
- actual validation을 시작할 때는 이 문서 자체를 pass/fail 로그처럼 쓰지 않는다. 실행 evidence는 `TASK_LIST.md`, `CURRENT_STATE.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`에 남긴다.
- 한 번에 모든 케이스를 동시에 열지 않는다. 첫 배치는 `VAL-01`, `VAL-03`, `VAL-07`, `VAL-08` 순서를 기본값으로 본다.
- 각 케이스 실행 전에는 관련 Task ID와 scope를 `TASK_LIST.md`에 명시하고 active lock을 잡는다.
- 어떤 케이스라도 user decision, secret, destructive action, 실제 rollout mutation이 필요해지면 해당 지점에서 멈추고 blocker로 올린다.
