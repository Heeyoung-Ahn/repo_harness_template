# OMX Sidecar

- 이 경로는 root self-hosting에서만 쓰는 optional sidecar다.
- truth는 계속 `.agents/artifacts/*`와 `.agents/runtime/*`에 남는다.
- `.omx/*`는 orchestration/runtime 보조 상태, 로컬 operator reference, 선택적 진단 메모만 담는다.
- starter/downstream 기본 동작은 이 디렉터리에 의존하지 않는다.

## Files
- `RUNTIME_REFERENCE.md`: root self-hosting runtime surface, HUD, local runbook
- `state/*`: optional sidecar state written by local orchestration only
- `logs/*`: optional sidecar logs written by local orchestration only
- `project-memory.json`: optional sidecar memory, never task/gate/release truth

## Do Not Use As Truth
- task/lock/handoff truth
- review or release gate verdict
- starter/reset scaffold source
- operating-project rollout input

## Read Order
1. `.agents/artifacts/CURRENT_STATE.md`
2. `.agents/artifacts/TASK_LIST.md`
3. `.omx/RUNTIME_REFERENCE.md`

## Boundary Rule
- `.omx/*`가 비어 있거나 없어도 self-hosting 기본 운영은 계속 가능해야 한다.
- `.omx/*`에 값이 있어도 current-state truth보다 우선하면 안 된다.
