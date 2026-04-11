# Self-Hosting Runtime Reference

> root self-hosting operator용 reference / HUD / runbook이다.
> `.omx/*`와 PMW는 보조 surface일 뿐이며 truth를 대체하지 않는다.

## Quick Read
- 목적: root self-hosting runtime surface와 local HUD를 빠르게 설명하고, preview/runbook 절차를 한 곳에 고정한다.
- primary HUD: `Project Monitor Web` at `http://127.0.0.1:4173`
- truth sources: `.agents/artifacts/*`, `.agents/runtime/*`
- optional sidecar: `.omx/state/*`, `.omx/logs/*`, `.omx/project-memory.json`
- local convenience only: PMW launcher/stop scripts, project registry update, local server lifecycle
- never here: task verdict, review closure, deploy decision, starter/runtime baseline

## Runtime Surfaces

| Surface | Path / Entry | Role | Truth Status |
|---|---|---|---|
| Current state router | `.agents/artifacts/CURRENT_STATE.md` | latest snapshot, next role, blocker summary | Truth |
| Task / lock truth | `.agents/artifacts/TASK_LIST.md` | active lock, task status, blocker table | Truth |
| Runtime contract | `.agents/runtime/*` | parser-friendly machine-readable contract | Truth |
| PMW HUD | `tools/project-monitor-web/*`, `http://127.0.0.1:4173` | read-only operator workspace and readiness surface | Derived |
| OMX sidecar | `.omx/*` | optional local orchestration/cache/log signal | Auxiliary |

## HUD Map
- `CURRENT_STATE.md`: 지금 focus, next agent, blocker 압축
- `TASK_LIST.md`: active locks, stage task status, execution truth
- `PMW`: multi-artifact projection, decision packet, history, document health
- `tools/project-monitor-web/runtime/*`: local server PID/stdout/stderr evidence
- `.omx/*`: optional sidecar diagnostics only

## PMW Local Runbook
1. `CURRENT_STATE.md`와 `TASK_LIST.md`로 current truth를 먼저 확인한다.
2. 필요하면 `tools/project-monitor-web/launch-project-monitor-web.ps1`로 PMW를 올린다.
3. 브라우저에서 `http://127.0.0.1:4173`를 열고 project selector, header source trace, decision packet, history, document health를 본다.
4. 서버 상태가 필요하면 `tools/project-monitor-web/runtime/project-monitor-web.pid`, `project-monitor-web.stdout.log`, `project-monitor-web.stderr.log`를 확인한다.
5. 종료는 `tools/project-monitor-web/stop-project-monitor-web.ps1` 또는 in-app local stop request만 사용한다.

## Sidecar Runbook
1. `.omx/*`가 비어 있으면 그대로 둔다. fake state를 만들지 않는다.
2. `.omx/state/*`, `.omx/logs/*`, `.omx/project-memory.json`가 생겨도 artifact truth와 비교용 보조 입력으로만 읽는다.
3. task/gate/review/release 판단은 항상 `.agents/*`와 runtime contract로 다시 확인한다.
4. starter/reset/downstream source에는 `.omx/*` 내용을 복사하지 않는다.

## Operator Checks
- 현재 focus, blocker, next action은 `CURRENT_STATE.md`와 PMW header가 같은 의미를 가리켜야 한다.
- PMW가 보여주는 risk/document health는 reviewer gate를 대체하지 않는다.
- `.omx/*` sidecar 값만으로 task closure, release readiness, rollout go/no-go를 선언하지 않는다.
- local convenience write는 PMW `project-registry.json`과 local server lifecycle 범위에만 머문다.

## Troubleshooting
- PMW가 안 열리면 launch script, `runtime/*.log`, loopback bind를 먼저 본다.
- stale PID가 있으면 stop script로 정리한 뒤 다시 launch한다.
- `.omx/*`와 artifact truth가 충돌하면 artifact truth를 우선하고 sidecar는 보조 메모로만 남긴다.
- actual rollout이 필요해 보여도 이 문서만으로 열지 말고 `DEPLOYMENT_PLAN.md`와 `BACKLOG-01` 상태를 먼저 확인한다.

## Out Of Scope
- starter runtime guidance
- downstream orchestration contract
- public exposure / non-loopback hosting
- control plane / write action / rollout execution
