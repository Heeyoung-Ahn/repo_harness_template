# Project History

> 프로젝트 전 기간의 주요 결정, 구현 마일스톤, 범위 변경을 append-only로 남기는 장기 이력 문서입니다.
> 현재 상태 truth는 계속 `CURRENT_STATE.md`, `TASK_LIST.md`, 관련 artifact에 있습니다.

## Quick Read
- 목적: 프로젝트의 큰 방향 전환, 승인, 구현 마일스톤, review/deploy/closeout 결과를 시간순으로 추적한다.
- 이 문서가 다루는 것: 주요 의사결정, 기준선 변경, 구현 완료, gate closure, 다음 버전으로 넘긴 핵심 이유.
- 이 문서가 대체하지 않는 것: current task/lock truth, raw handoff, turn-by-turn 작업 메모, 세부 diff log.
- 기본 update trigger: major `CR-*` 승인/변경, day wrap up, version closeout, review/deploy closure.
- future use: 프로젝트가 timeline UI나 recent history surface를 정의하면 이 문서가 source가 될 수 있다.

## Usage Rules
- append-only로 유지한다. 기존 항목을 지우지 말고, 정정이 필요하면 새 항목으로 남긴다.
- 사소한 편집 로그 대신 사건 중심으로 기록한다.
- 각 항목은 `Summary`, `Why`, `Impact`, `Related` 4줄로 짧게 남긴다.
- 현재 상태 판단은 항상 관련 live artifact에서 다시 확인한다.
- raw handoff 원문은 복사하지 않는다. 필요하면 핵심 의미만 요약한다.

## Timeline
### [YYYY-MM-DD]

#### HIST-[YYYYMMDD]-01 Decision
- Summary: [무슨 결정 또는 주요 진척이 있었는지]
- Why: [왜 중요한지]
- Impact: [어떤 artifact, 범위, 작업 흐름이 바뀌는지]
- Related: [관련 Task ID, CR, FR/NFR 등]
