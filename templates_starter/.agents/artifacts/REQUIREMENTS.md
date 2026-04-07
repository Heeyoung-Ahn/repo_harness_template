# Requirements

> Planner가 사용자와 함께 작성하는 최상위 제품 계약서입니다.  
> 구조, 구현, 테스트, 리뷰, 배포는 모두 이 문서를 기준으로 판단합니다.

## Quick Read
- 이 starter baseline의 핵심 목표: `one core, multiple profiles`를 유지한 채 optional `enterprise_governed` pack, `governance_controls.json`, optional `.omx/*` compatibility, rollout defer policy를 함께 쓸 수 있는 표준 출발점을 제공한다.
- 이 starter가 기본으로 담고 있는 것: ① `solo/team/large/governed` 운영 프로필 ② `team.json` + optional `governance_controls.json` 계약 ③ `enterprise_governed` placeholder 문서 ④ optional `.omx/*` not-truth 원칙 ⑤ actual rollout 전 dry-run/reporting 우선 원칙
- 이 starter가 기본으로 하지 않는 것: `.omx/*` truth 승격, starter 기본 orchestration dependency, write action monitor, completion review 전 operating-project actual rollout, default sandbox/runtime 강제
- 이 starter를 새 프로젝트에 적용한 뒤 가장 먼저 정할 것: greenfield인지 기존 운영 프로젝트 표준화인지, `enterprise_governed` pack이 필요한지, self-hosting visibility tool이 필요한지
- 현재 starter baseline: `Hybrid Harness Template v0.1`
- 다음 역할이 꼭 읽어야 할 포인트: `.agents/*`와 runtime contract가 계속 truth이고, optional sidecar와 rollout은 항상 그 바깥층으로 다룬다.

## Status
- Document Status: Draft / Ready for Approval
- Owner: Planner
- Current Requirement Baseline: Hybrid Harness Template v0.1
- Requirements Sync Status: In Sync
- Last Requirement Change At: 2026-04-07 15:09
- Last Updated At: 2026-04-07 15:09
- Last Approved By: [Set on project approval]
- Last Approved At: [Set on approval]

## Open Questions
- greenfield 프로젝트인가, 기존 운영 프로젝트 표준화인가
- `enterprise_governed` pack을 활성화할 것인가
- self-hosting visibility / monitor가 필요한가

## Change Control Rules
- 승인 후에도 범위, 완료 기준, acceptance criteria, out-of-scope 정의가 바뀔 수 있으며, 이 경우 Planner가 먼저 이 문서를 갱신합니다.
- 중간 변경이 승인되면 최소한 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 같은 턴에 같은 기준선으로 갱신합니다.
- 중간 변경이 승인되면 `CR-*` ID를 부여하고 `In Scope`, `Out of Scope`, `Functional Requirements`, `Non-Functional Requirements`, 관련 제약과 acceptance criteria를 같은 턴에 함께 갱신합니다.
- downstream 문서(`ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `TASK_LIST.md`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `CURRENT_STATE.md`)가 아직 새 기준선을 반영하지 못했으면 `Requirements Sync Status`를 `Downstream Update Required`로 두고 handoff에 남깁니다.
- 사용자가 아직 변경을 승인하지 않았으면 `Requirements Sync Status`를 `Needs Re-Approval`로 두고 review / deploy gate를 닫지 않습니다.
- Reviewer와 DevOps는 이 문서의 최신 기준선을 먼저 확인하고, 문서 sync 누락을 코드 결함과 같은 종류의 blocker로 섞지 않습니다.

## Changelog
- [2026-04-06] Template Maintainer: profile/runtime/monitor boundary를 담을 starter baseline 골격을 추가했다.
- [2026-04-07] Template Maintainer: `enterprise_governed`, `governance_controls.json`, optional `.omx/*` compatibility, rollout defer 기본 원칙을 starter baseline에 반영했다.

## Product Goal
- 이 starter가 해결하려는 문제:
  1. 새 프로젝트가 시작부터 `solo/team/large/governed` 운영 프로필과 문서 기반 governance truth를 갖게 한다.
  2. enterprise 규율이 필요한 프로젝트도 core template를 깨지 않고 optional pack으로 확장되게 한다.
  3. optional orchestration/runtime이나 read-only visibility tool을 붙여도 truth boundary가 흔들리지 않게 한다.
  4. 기존 운영 프로젝트 표준화가 필요할 때도 actual rollout 전에 dry-run/reporting gate를 먼저 닫게 한다.
- 최종 사용자: maintainer, planner, developer, tester, reviewer, devops, 팀 리드, 운영 프로젝트 표준화 담당자
- 성공 기준:
  1. starter 복사 직후에도 `solo` 기준으로 가볍게 시작할 수 있다.
  2. 필요 시 `team`, `large/governed`, `enterprise_governed`로 안전하게 확장할 수 있다.
  3. optional `.omx/*`나 self-hosting visibility를 붙여도 artifact와 runtime contract가 truth로 남는다.
  4. rollout이 필요한 경우 completion review와 dry-run/reporting evidence 뒤에만 actual mutation을 연다.

## Operational Profiles

| Profile | Typical Scale | Required Operational Fields | Team Registry | Approval / Handoff Rules |
|---|---|---|---|---|
| `solo` | 1명 + AI | 추가 필수 필드 없음 | Optional | 기본 task/lock/handoff 규칙만 사용 |
| `team` | 2~8명 + AI | `owner`, `role`, `updated_at` | Required | owner 기반 handoff와 블로커/승인 큐 사용 |
| `large/governed` | 9명+ 또는 승인 체계 강한 조직 | `owner`, `role`, `updated_at`, `approval_chain`, `gate_state`, `handoff_reason` | Required | 승인 체인, gate 상태, handoff 이유를 모두 기록 |

## Optional Packs

| Pack | Eligible Profile | Required Contracts | Required Documents | Default Behavior |
|---|---|---|---|---|
| `enterprise_governed` | `large/governed` only | `.agents/runtime/governance_controls.json`, `team.json > active_packs`, `approval_authority` | `.agents/artifacts/enterprise_governed/*` | starter에는 placeholder가 있을 수 있지만 활성화 전까지 core flow는 generic하게 유지 |

## In Scope
- `solo/team/large/governed` 운영 프로필 정의와 required field 구체화
- `.agents/runtime/team.json`과 optional `governance_controls.json` contract
- `enterprise_governed` optional pack placeholder와 activation path
- optional `.omx/*` compatibility와 not-truth boundary
- self-hosting visibility / monitor를 붙일 때의 read-only boundary
- 기존 운영 프로젝트 표준화 시 dry-run/reporting을 먼저 요구하는 배포 정책

## Out of Scope
- `.omx/*`를 truth나 write path로 사용하는 구조
- starter 기본 경로에 orchestration engine이나 runtime control plane 강제 포함
- write action monitor, approval action UI, watcher / scheduler / registry 기본 포함
- container/read-only sandbox 기본 강제
- completion review와 dry-run/reporting 전 actual rollout 실행

## Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | 템플릿은 `solo`, `team`, `large/governed` 운영 프로필을 정의해야 한다. | High | 프로필별 required field와 handoff/gate 규칙이 문서에 고정된다. |
| FR-02 | 모든 프로필은 공용 governance core schema를 공유해야 한다. | High | `task`, `lock`, `owner`, `role`, `gate`, `handoff` 의미가 일관되고 parser가 core field를 읽을 수 있다. |
| FR-03 | 팀 구성은 `.agents/runtime/team.json`으로 선언적으로 관리해야 한다. | High | `schema_version`, `active_profile`, `members`가 top-level 필수이고 `active_packs`로 overlay를 켤 수 있다. |
| FR-04 | `enterprise_governed`는 optional overlay로만 동작해야 한다. | High | pack identifier, required docs, `approval_authority`, `governance_controls.json` prerequisite가 고정된다. |
| FR-05 | optional self-hosting visibility / monitor를 붙이더라도 read-only boundary가 유지되어야 한다. | High | write path가 없고 artifact/runtime contract가 truth로 남는다. |
| FR-06 | optional `.omx/*` sidecar가 있더라도 truth를 대체하면 안 된다. | High | `.agents/*`와 runtime contract가 authoritative state로 유지된다. |
| FR-07 | 기존 운영 프로젝트 표준화가 필요할 때는 actual rollout 전에 dry-run/reporting gate를 먼저 닫아야 한다. | High | deployment/review artifact에 defer policy와 dry-run/reporting evidence가 기록된다. |

## Non-Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| NFR-01 | starter default는 `solo` 기준으로 낮은 오버헤드를 유지해야 한다. | High | 추가 pack과 optional runtime이 starter 기본 경로를 무겁게 만들지 않는다. |
| NFR-02 | local-first와 문서 기반 truth를 유지해야 한다. | High | 네트워크 없이 핵심 문서 흐름, validator, runtime contract 운용이 가능하다. |
| NFR-03 | enterprise burden은 opt-in pack으로만 격리되어야 한다. | High | pack 미활성 상태에서도 core flow와 validator 기본 경로가 유지된다. |
| NFR-04 | rollout 전 completion evidence는 self-hosting repo 안에서 재현 가능해야 한다. | High | dry-run/reporting, validator, optional visibility evidence를 local-first로 남길 수 있다. |
| NFR-05 | `.omx/*`는 auxiliary state여야 한다. | High | validator/workflow가 `.omx/*`를 authoritative truth로 다루지 않는다. |

## Constraints
- 기술 제약: source of truth는 markdown artifact와 runtime contract이며, starter/reset source split과 validator 규칙을 깨지 않아야 한다.
- 운영 제약: watcher / scheduler / registry / mobile routing 같은 별도 runtime 계층은 기본 템플릿에 넣지 않는다.
- 일정 제약: actual rollout은 completion review와 dry-run/reporting evidence 뒤로 미룬다.
- 법무/보안/플랫폼 제약: 승인/예산/감사 같은 critical domain은 HITL과 requirement trace를 유지해야 한다.

## Dependencies
- 외부 서비스: 없음이 기본이며 Git/PR/CI/PM 도구 연동은 optional adapter로만 고려한다.
- 내부 시스템: `.agents/artifacts/*`, `.agents/rules/*`, `.agents/scripts/check_harness_docs.ps1`
- runtime contracts: `.agents/runtime/team.json`, `.agents/runtime/governance_controls.json`, optional `.agents/runtime/health_snapshot.json`
- optional sidecar: `.omx/*`가 있을 수 있어도 truth는 `.agents/*`와 runtime contract에 남아야 함
- 인증/배포/인프라 의존성: 로컬 파일 접근, validator 실행 환경, optional self-hosting preview/runtime

## Assumptions
- 기본 starter profile은 `solo`로 시작하고 필요 시 `team`, `large/governed`, `enterprise_governed`로 확장한다.
- optional pack 문서는 활성화 전까지 placeholder로 유지한다.
- `Project Monitor Web`이나 `.omx/*` 같은 self-hosting only 도구는 starter 기본 동작을 바꾸지 않는다.
- 기존 운영 프로젝트 표준화는 current project completion gate가 닫힌 뒤에만 actual rollout으로 연다.

## Approved Change Log

| Change ID | Approved At | Summary | Affected Requirement IDs | Downstream Sync Needed | Sync Status |
|---|---|---|---|---|---|
| TEMPLATE-01 | 2026-04-06 | profile/runtime/monitor boundary starter baseline 추가 | FR-01~FR-05, NFR-01~NFR-03 | Architecture / Plan / Task / Review / Deploy | In Sync |
| TEMPLATE-02 | 2026-04-07 | enterprise pack, optional `.omx/*`, rollout defer / dry-run defaults 반영 | FR-03~FR-07, NFR-03~NFR-05 | Architecture / Plan / Review / Deploy | In Sync |

## Pending Change Requests

| Change ID | Status | Requested By | Summary | Affected Areas | Next Action |
|---|---|---|---|---|---|
| 없음 | - | - | starter baseline 기준으로 열려 있는 template-level 변경 없음 | - | 프로젝트별 change request는 실제 요구사항 확정 후 작성 |

## Approval History
- 2026-04-06 Template Maintainer: profile/runtime/monitor starter baseline 반영
- 2026-04-07 Template Maintainer: enterprise pack, `.omx/*`, rollout defer starter baseline 반영
