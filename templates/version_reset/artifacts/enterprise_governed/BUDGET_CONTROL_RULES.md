# Budget Control Rules

> Optional `enterprise_governed` pack placeholder.  
> `team.json > active_packs`에 `enterprise_governed`가 있을 때만 활성 문서로 취급합니다.

## Purpose
- 예산/재무 관련 protected path와 변경 통제 규칙을 기록합니다.

## Activation Rules
- `.agents/runtime/governance_controls.json > critical_domains`에 `budget` 또는 관련 도메인이 선언되어야 합니다.

## Protected Changes
- 승인 금액, 회계 마감, 정산 기준, 지급/차감 로직은 protected path로 분류합니다.

## Required Human Gates
- protected path 변경은 사람이 승인합니다.

## Verification Requirements
- 금액 계산/분배/마감 흐름 변경은 mutation/property/edge-case verification을 통과해야 합니다.
