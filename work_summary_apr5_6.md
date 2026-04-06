# repo_harness_template 작업 정리 (4/5 ~ 4/6)

> 현재 시각: 2026-04-07 00:05 KST 기준 정리

---

## 📅 4월 5일 (토) — Template Source 분리 완료

### Git Commit
| 시각 | 메시지 | 규모 |
|---|---|---|
| 23:07 | 프로세스 강화, 운영에서 템플릿 분리 | 77 files, +6,250 / -157 |

### 주요 작업

#### 1. Self-hosting Live Docs vs Deployable Template Source 분리
- root의 `AGENTS.md`, `.agents/rules/*`, `.agents/artifacts/*` 등을 **self-hosting 전용 live 문서**로 확정
- downstream 프로젝트에 배포되는 표준 source는 `templates_starter/*`와 `templates/version_reset/artifacts/*`로 물리 분리
- `templates_starter`를 starter root로 재편하고, 불필요한 빈 `docs/`, `tools/` 디렉토리 삭제

#### 2. Downstream Rollout 완료
- 3개 운영 프로젝트(WATV Auto Login, AI Video Creator, Daily English Spark)에 safe downstream rollout 수행
- `templates/version_reset` 반영까지 완료

#### 3. Root 문서 정리
- root `README.md`를 새 구조 기준으로 갱신
- root `PROJECT_WORKFLOW_MANUAL.md` 삭제 -> starter manual은 `templates_starter` 안에만 유지

---

## 📅 4월 6일 (일) — Scalable Governance Profiles 전 과정 진행

### Git Commits
| 시각 | 메시지 | 규모 |
|---|---|---|
| 11:40 | 수정 | (minor) |
| 13:26 | 운영규칙 강화 | 77 files, +6,250 / -157 |
| 16:03 | 사용자 테스트 결과 반영 강화 | 11 files, +245 / -62 |
| 19:08 | 확장1 | 26 files, +2,645 / -218 |
| 00:02 (4/7) | 모니터링 앱 제작 | 33 files, +748 / -221 |

### 주요 작업 — 시간순 상세

---

### 오전: Skill Rollout 및 운영 지침 명문화

#### 1. `expo_real_device_test` 스킬 표준화 및 롤아웃
- Daily English Spark에서 확장한 `expo_real_device_test`를 **표준 template source로 역반영**
- 일반형 `adb_quickstart` reference 문서를 스킬에 추가하고 root/starter `SKILL.md`에서 참조 연결
- 최신본을 3개 운영 프로젝트에 재롤아웃

#### 2. `operating-common-rollout` 운영 스킬 신규 추가
- 운영 프로젝트에서 검증된 공통 변경을 표준 템플릿/sibling 프로젝트로 전파하는 **root 전용 운영 스킬** 생성
- `변경 층 분류 -> 일반화 -> canonical source 갱신 -> rollout -> validator` 순서 정립

#### 3. Self-hosting 표준 템플릿 운영 지침 정리 (`DEV-09`)
- `AGENTS.md`와 `.agents/rules/workspace.md`에 **workflow 비의존 원칙** 명문화
- 기본 입력 문서 5종만으로 재현 가능한 운영 체계 확정

#### 4. 공통 수동 테스트 프로세스 강화 (`DEV-10`)
- `Expected User Outcome`, `Feedback Capture Plan`, 비압축 `Developer Feedback Handoff` 기준 추가
- `test.md` workflow, `expo_real_device_test` 스킬, `WALKTHROUGH.md` template에 반영
- active operating projects에 rollout 완료

---

### 오후 전반: Planning 및 Architecture — Scalable Governance Profiles

#### 5. `Scalable Governance Profiles v0.1` 초안 작성 (`PLN-05 ~ PLN-07`)
- `solo/team/large` 3단계 운영 프로필 요구사항 초안
- `core/profile/observability/integration` 아키텍처 경계 초안
- dashboard MVP와 event history 후속 단계를 포함한 구현 로드맵 작성

#### 6. `v0.2` 승인본 고정 (`PLN-08`, `DSG-05`)
- `team.json` schema, parser contract, `Project Monitor Web` UI 설계를 planning artifact에 동기화
- Product boundary, board/blocker queue/recent activity/health/team directory UI 범위 확정

---

### 오후 중반: Development 및 Test — Iteration 3

#### 7. Profile Schema 및 Parser 구현 (`DEV-11`)
- `.agents/runtime/team.json` 생성, starter team defaults 정규화
- mandatory source parser contract 구현 (profile overlay structure 포함)

#### 8. `Project Monitor Web` Phase 1 MVP 구현 (`DEV-12`)
- `tools/project-monitor-web/` 에 self-hosting web app 구축
- local Node.js backend, shared parser/projection, dashboard panels
- read-only HTTP 경계 (쓰기 없음)

#### 9. Future Hook 및 Health Snapshot (`DEV-13`)
- future integration adapter를 위한 reserved hook point schema 예약
- optional `health_snapshot.json` contract 정의

#### 10. Promotion Strategy 정리 (`DEV-14`)
- self-hosting only 도구와 downstream optional promotion 전략 분리
- `templates_starter/*`, `templates/version_reset/*` 기준 갱신

#### 11. 테스트 완료 (`TST-03`, `TST-04`)
- profile / team registry / parser contract regression 검증 pass
- `Project Monitor Web` Phase 1 read-only regression 검증 pass
- `node --test` 6 pass 확인

---

### 오후 후반: Review -> 재작업 -> Review Closure

#### 12. Review Gate 진행 (`REV-03`)
- scalable governance profile과 `Project Monitor Web` source-of-truth 경계 리뷰 완료
- **Finding 2건 발견:**
  - `REV-03-01`: parser contract drift (ARCHITECTURE_GUIDE vs 실제 parser 코드)
  - `REV-03-02`: reset source drift (templates/version_reset mirror 불일치)

#### 13. Finding 재작업 (`DEV-15`)
- `ARCHITECTURE_GUIDE.md` parser contract row와 `parse-architecture-guide.js` required section 정합
- `templates/version_reset/*` reset source 2곳에 optional boundary prompt 동기화
- 회귀 테스트 추가 -> `node --test` 6 pass, `check_harness_docs.ps1` pass

#### 14. Delta Review 승인 (`REV-04`)
- `DEV-15` delta 확인 -> `REV-03-01`, `REV-03-02` 닫음
- Review gate: **reviewed scope 기준 승인**

---

### 저녁 ~ 심야: Deployment Stage

#### 15. Deploy Workflow Hardening (`REL-04`)
- starter deploy workflow에 **GitHub release gate 선행 규칙** 추가
- Expo/provider skill routing 반영
- shared deploy skill mirror 4종 + `DEPLOYMENT_PLAN` template 3곳에 GitHub release path, provider/skill, fallback 필드 갱신

#### 16. Active Operating Projects Rollout (`REL-05`)
- `active_operating_projects` preset으로 3개 운영 repo에 deploy workflow/skill hardening 변경 rollout
- Target validator: Daily English Spark pass, WATV/AI Video Creator는 기존 migration debt 19 warning만 (errors 0)
- 핵심 rollout 파일 hash 3개 repo 모두 template 일치 확인

#### 17. Dependency/Compliance Gate Closure (`REL-06`)
- `Project Monitor Web`에 `package-lock.json` 추가
- `npm ls --depth=0` empty, `npm audit --json` **0 vulnerabilities**
- `node --test` 6 pass
- `server.js` 기본 bind host를 `127.0.0.1`로 **loopback hardening**
- Dependency/compliance gate: **Closed**

---

## 📊 2일간 종합 현황

### 완료된 Task ID (총 24건)
```
Planning:  PLN-05, PLN-06, PLN-07, PLN-08
Design:    DSG-05
Dev:       DEV-09 ~ DEV-15
Test:      TST-03, TST-04
Review:    REV-03, REV-04
Release:   REL-04, REL-05, REL-06
Doc:       DOC-03, DOC-04
```

### 현재 상태
| 항목 | 상태 |
|---|---|
| **Version** | Scalable Governance Profiles |
| **Stage** | Deployment |
| **Review Gate** | Approved (reviewed scope) |
| **Dependency Gate** | Closed (0 vulnerabilities) |
| **남은 Blocker** | 첫 self-hosting target 선택 (developer PC / internal VM / NAS) |

### 다음 단계
- DevOps가 첫 self-hosting preview deployment target을 정하고 bring-up evidence를 쌓는다
- 실제 deployment target 결정 전까지 `Ready to Deploy`는 열지 않는다

> [!NOTE]
> 4/5는 주로 **구조 분리와 rollout 기반 정비**, 4/6은 **Scalable Governance Profiles의 기획 -> 개발 -> 테스트 -> 리뷰 -> 배포 준비까지 전 과정**을 하루에 진행한 집중 작업일이었습니다.
