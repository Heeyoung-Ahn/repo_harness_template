# Month End Close Checklist

> Optional `enterprise_governed` pack placeholder.  
> `team.json > active_packs`에 `enterprise_governed`가 있을 때만 활성 문서로 취급합니다.

## Purpose
- 월말/정산/closeout 시점의 필수 확인 절차를 정의합니다.

## Activation Rules
- finance-like closeout이나 regulated close checklist가 필요한 프로젝트에서만 사용합니다.

## Checklist
- review/test/deploy gate, evidence, approval chain, rollback note를 함께 확인합니다.

## Required Human Gates
- final close와 cutoff decision은 사람이 승인합니다.

## Verification Requirements
- closeout 관련 계산/상태 전이 변경은 mutation/property/edge-case verification을 통과해야 합니다.
