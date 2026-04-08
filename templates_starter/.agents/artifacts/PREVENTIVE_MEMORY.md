# Preventive Memory

> 반복 실수 -> 예방 규칙 -> 검사 방법을 누적하는 얇은 canonical artifact입니다.
> `PROJECT_HISTORY.md`가 사건 이력을 남긴다면, 이 문서는 다음 Agent의 동작을 바꾸게 만드는 active preventive rule만 남깁니다.

## Quick Read
- 목적: 반복 실수와 재발 방지 규칙을 짧게 유지한다.
- 이 문서가 다루는 것: confirmed repeat issue, promoted preventive rule, check method, source evidence.
- 이 문서가 대체하지 않는 것: current task/lock truth, raw incident log, 상세 회고.
- 기본 update trigger: 같은 issue class 반복, confirmed guardrail gap, 새 rule/checklist/validator 승격.
- 기본 read policy: `day_start`는 `## Active Preventive Rules`를 확인하고, `day_wrap_up`는 recurrence review 뒤 필요 시 이 문서를 갱신한다.

## Usage Rules
- 문서는 얇게 유지한다. 한 항목은 한 가지 반복 패턴과 한 가지 예방 규칙만 다룬다.
- 장기 서술이나 사건 chronology는 `PROJECT_HISTORY.md`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `TASK_LIST.md`에 남기고 여기에는 예방 규칙만 남긴다.
- `Status`가 `Active`인 항목만 day_start 기본 읽기 대상이다.
- rule이 폐기되거나 대체되면 삭제하지 말고 `Retired`로 내리고 후속 rule ID를 남긴다.
- 같은 issue class가 다시 보이지만 아직 승격 규칙이 없으면 `## Promotion Candidates`에 먼저 기록한다.

## Active Preventive Rules

| ID | Repeated Mistake / Trigger | Preventive Rule | Check Method | Source / Evidence | Status |
|---|---|---|---|---|---|
| 없음 | - | - | - | - | - |

## Promotion Candidates

| ID | Issue Pattern | Evidence | Proposed Promotion Target | Next Action |
|---|---|---|---|---|
| 없음 | - | - | - | - |

## Update Log
- [YYYY-MM-DD HH:MM] [Role]: initial draft
