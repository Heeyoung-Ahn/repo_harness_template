# Decision Log

> 구조 변경과 qualifying refactor의 이유, 대안, 영향, rollback 기준을 append-only로 남기는 ADR-lite 문서입니다.
> current-state truth와 raw handoff는 계속 기존 artifact가 소유합니다.

## Quick Read
- 목적: architecture-change와 qualifying refactor의 이유와 되돌림 판단 기준을 장기적으로 추적한다.
- mandatory trigger: 모든 `architecture-change`, 그리고 shared contract/API/schema, cross-module invariant, ownership boundary, migration/deprecation을 건드리는 `refactor`.
- 이 문서가 다루는 것: 문제, 고려한 대안, 선택 이유, 영향, rollback/retire trigger.
- 이 문서가 대체하지 않는 것: current stage, blocker, release gate, implementation diff log, raw handoff.

## Usage Rules
- append-only로 유지한다. 기존 entry를 지우지 말고 정정이 필요하면 새 entry로 남긴다.
- 각 entry는 최소한 `Status`, `Problem`, `Options Considered`, `Decision`, `Impact`, `Rollback / Retire Trigger`, `Related`를 포함한다.
- decision이 아직 열려 있으면 `Status: Proposed`로 기록하고, 승인/구현 후 새 entry나 status update로 닫는다.
- task packet의 `Decision Log Entry` 필드는 required change에서 이 문서의 entry ID를 가리킨다.
- current-state blocker나 approval conversation 원문은 여기에 복사하지 않는다.

## Entries
### DEC-20260411-01 Operating Capability Baseline
- Status: Accepted
- Change Type: architecture-change
- Problem: 기존 baseline은 artifact truth와 release gate에는 강했지만, non-trivial change taxonomy, mandatory self-review, 유지보수 context, decision rationale, change impact contract가 일상 개발 루프에 강제로 연결되어 있지 않았다.
- Options Considered:
  - 기존 release-stage review와 `PROJECT_HISTORY.md`만 유지한다.
  - 하나의 context artifact와 모든 refactor/change에 대한 unconditional decision log/full impact contract를 도입한다.
  - `SYSTEM_CONTEXT.md`와 `DOMAIN_CONTEXT.md`를 분리하고, non-trivial change에 mandatory self-review를 두되 decision log/full impact contract는 conditional gate로 둔다.
- Decision: 세 번째 안을 채택한다. `SYSTEM_CONTEXT.md`, `DOMAIN_CONTEXT.md`, `DECISION_LOG.md`를 support artifact로 추가하고, 모든 non-trivial change는 primary type, self-review, impact tier를 남긴다. `architecture-change`와 qualifying `refactor`만 decision log와 full impact contract를 강제한다.
- Impact: live/starter workflow, review checklist, validator, task packet contract가 change-governance baseline을 이해하게 된다. starter/reset split은 유지하고, long-lived context artifact는 version reset 대상에서 제외한다.
- Rollback / Retire Trigger: support artifact가 current-state truth를 중복하기 시작하거나, starter default burden이 과도해지거나, decision log/full impact contract가 trivial scope까지 무차별 확대되면 Planner가 baseline을 다시 열어 조정한다.
- Related: `CR-08`, `DEV-07`, `FR-33`~`FR-38`, `NFR-20`, `NFR-21`
