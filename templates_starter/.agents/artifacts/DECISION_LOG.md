# Decision Log

> 구조 변경과 qualifying refactor의 이유, 대안, 영향, rollback 기준을 append-only로 남기는 ADR-lite 문서입니다.
> current-state truth와 raw handoff는 계속 기존 artifact가 소유합니다.

## Quick Read
- 목적: [architecture-change와 qualifying refactor의 이유를 남기는 목적 작성]
- mandatory trigger: [어떤 change type 또는 조건에서 entry가 필수인지 작성]
- 이 문서가 다루는 것: 문제, 고려한 대안, 선택 이유, 영향, rollback/retire trigger.
- 이 문서가 대체하지 않는 것: current stage, blocker, release gate, implementation diff log, raw handoff.

## Usage Rules
- append-only로 유지한다. 기존 entry를 지우지 말고, 정정이 필요하면 새 entry로 남긴다.
- 각 entry는 최소한 `Status`, `Problem`, `Options Considered`, `Decision`, `Impact`, `Rollback / Retire Trigger`, `Related`를 포함한다.
- task packet의 `Decision Log Entry` 필드는 required change에서 이 문서의 entry ID를 가리킨다.

## Entries
### DEC-[YYYYMMDD]-01 [Short Title]
- Status: [Proposed / Accepted / Retired]
- Change Type: [architecture-change / refactor]
- Problem: [무슨 문제가 있었는지]
- Options Considered:
  - [대안 1]
  - [대안 2]
- Decision: [무엇을 선택했는지]
- Impact: [어떤 계약/모듈/운영 절차가 바뀌는지]
- Rollback / Retire Trigger: [언제 되돌리거나 폐기할지]
- Related: [관련 Task ID, CR, FR/NFR 등]
