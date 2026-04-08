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
| PM-001 | starter/reset artifact source에 live 운영 내용이 섞인다 | starter/reset artifact source는 clean scaffold만 유지하고, concrete baseline/실제 날짜/승인 이력/local URL/handoff 원문을 넣지 않는다 | `template_repo.md`, `workspace.md`, root/starter `check_harness_docs.ps1`의 template scaffold validation을 함께 확인한다 | `DOC-03` / 2026-04-08 template hygiene 정비 | Active |
| PM-002 | Planner가 shallow interview 뒤 추정으로 요구사항을 메우고, 요구사항 승인 전에 arch/plan sync를 진행한다 | `requirements_deep_interview`는 discovery-only turn과 승인 후 sync를 분리한다. `deep interview만` 요청된 turn에서는 질문 패킷과 interview snapshot까지만 진행하고, 미승인 기준선은 `Pending Requirement Approval`으로 유지한다 | `requirements_deep_interview`, `plan.md`, `workspace.md`, root/starter `check_harness_docs.ps1`의 승인 전 sync 금지 규칙을 함께 확인한다 | Bible Spark planning incident / 2026-04-09 | Active |

## Promotion Candidates

| ID | Issue Pattern | Evidence | Proposed Promotion Target | Next Action |
|---|---|---|---|---|
| 없음 | - | - | - | - |

## Update Log
- [2026-04-08 23:35] Documenter: `PM-001`을 추가했다. starter/reset artifact 오염을 template rule + validator guardrail로 승격했다.
- [2026-04-09 00:44] Planner: `PM-002`를 추가했다. shallow deep-interview와 요구사항 승인 전 planning sync를 skill + workflow + validator guardrail로 승격했다.
