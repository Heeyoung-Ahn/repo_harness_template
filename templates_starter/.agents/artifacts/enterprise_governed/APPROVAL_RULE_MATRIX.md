# Approval Rule Matrix

> Optional `enterprise_governed` pack placeholder.  
> `team.json > active_packs`에 `enterprise_governed`가 있을 때만 활성 문서로 취급합니다.

## Purpose
- approval authority, escalation, protected path 승인 경로를 기록합니다.

## Activation Rules
- `active_profile`은 `large/governed`여야 합니다.
- `.agents/runtime/governance_controls.json`이 존재해야 합니다.
- 승인 담당 member에는 `approval_authority`가 채워져 있어야 합니다.

## Required Human Gates
- scope / release / protected path 변경은 사람이 승인합니다.
- `approval`, `budget`, `audit` critical domain은 auto-merge보다 HITL escalation이 기본값입니다.

## Notes
- 세부 매트릭스는 프로젝트별 role/authority에 맞춰 채웁니다.
