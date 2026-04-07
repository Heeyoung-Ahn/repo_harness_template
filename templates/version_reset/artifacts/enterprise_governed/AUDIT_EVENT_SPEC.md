# Audit Event Spec

> Optional `enterprise_governed` pack placeholder.  
> `team.json > active_packs`에 `enterprise_governed`가 있을 때만 활성 문서로 취급합니다.

## Purpose
- 어떤 event와 evidence를 audit trail로 남길지 정의합니다.

## Activation Rules
- `.agents/runtime/governance_controls.json > critical_domains`에 `audit` 또는 관련 도메인이 선언되어야 합니다.

## Verification Requirements
- critical domain 변경은 mutation/property/edge-case verification을 requirement trace에 연결합니다.
- generator 결과만으로 pass를 선언하지 않고 reviewer/verifier lane을 분리합니다.

## Required Human Gates
- 감사 보존 정책이나 evidence mapping 변경은 사람이 승인합니다.
