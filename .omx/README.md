# OMX Sidecar

- 이 경로는 self-hosting optional sidecar입니다.
- `.omx/state/*`, `.omx/logs/*`, `.omx/project-memory.json`은 orchestration/runtime 보조 상태만 담을 수 있습니다.
- task, gate, handoff, release, review의 truth는 계속 `.agents/artifacts/*`와 `.agents/runtime/*`에 남아야 합니다.
- starter/downstream 기본 동작은 이 디렉터리에 의존하지 않습니다.
