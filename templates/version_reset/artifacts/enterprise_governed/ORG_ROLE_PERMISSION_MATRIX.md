# Org Role Permission Matrix

> Optional `enterprise_governed` pack placeholder.  
> `team.json > active_packs`에 `enterprise_governed`가 있을 때만 활성 문서로 취급합니다.

## Purpose
- 사람/에이전트 역할과 permission boundary를 연결합니다.

## Activation Rules
- role과 approval authority는 `team.json`의 member definition과 함께 유지합니다.

## Role Matrix
- 누가 task를 수정할 수 있는지, 누가 승인할 수 있는지, 누가 배포를 닫을 수 있는지 기록합니다.

## Required Human Gates
- 권한 체계 변경과 protected path 권한 위임은 사람이 승인합니다.
