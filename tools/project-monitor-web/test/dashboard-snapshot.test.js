import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDashboardSnapshot,
  mergeTaskOwnership
} from "../src/application/build-dashboard-snapshot.js";
import {
  addProjectRegistryEntry,
  loadProjectRegistry,
  removeProjectRegistryEntry
} from "../src/application/load-project-registry.js";
import { parseArchitectureGuide } from "../src/application/parse-architecture-guide.js";
import { createProjectMonitorServer } from "../src/infrastructure/http-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

async function createWorkspaceFixture(rootPath) {
  const artifactPaths = [
    ".agents/artifacts/CURRENT_STATE.md",
    ".agents/artifacts/TASK_LIST.md",
    ".agents/artifacts/REQUIREMENTS.md",
    ".agents/artifacts/ARCHITECTURE_GUIDE.md",
    ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  ];

  await fs.mkdir(path.join(rootPath, "tools", "project-monitor-web"), { recursive: true });

  for (const relativePath of artifactPaths) {
    const filePath = path.join(rootPath, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "# fixture\n", "utf8");
  }
}

test("dashboard snapshot exposes the approved Phase 1 panels", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot);

  assert.equal(snapshot.activeProfile, "solo");
  assert.ok(Array.isArray(snapshot.projects));
  assert.ok(snapshot.projectContext.id);
  assert.ok(snapshot.overview.goalSummary);
  assert.ok(Array.isArray(snapshot.history));
  assert.ok(Array.isArray(snapshot.decisionPackets));
  assert.ok(Array.isArray(snapshot.boardTasks));
  assert.ok(Array.isArray(snapshot.blockers));
  assert.ok(Array.isArray(snapshot.recentActivity));
  assert.ok(Array.isArray(snapshot.teamDirectory));
  assert.ok(snapshot.documentHealth.summary);
  assert.ok(Array.isArray(snapshot.documentHealth.riskSignals));
  assert.equal(
    snapshot.documentHealth.healthSnapshot.path,
    ".agents/runtime/health_snapshot.json"
  );
});

test("team registry includes the current live members", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot);
  const ids = snapshot.teamDirectory.map((member) => member.id);

  assert.ok(ids.includes("user"));
  assert.ok(ids.includes("codex"));
});

test("ownership is normalized against the team registry contract", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot);
  const projection = mergeTaskOwnership(
    [{ id: "DEV-11", title: "Sample Task" }],
    [{ taskId: "DEV-11", owner: "Codex", role: "", startedAt: "", note: "" }],
    [
      {
        id: "codex",
        display_name: "Codex",
        kind: "ai",
        primary_role: "Developer"
      }
    ]
  );
  const projectedTask = projection.boardTasks[0];

  assert.equal(projectedTask.ownerId, "codex");
  assert.equal(projectedTask.ownerDisplay, "Codex");
  assert.equal(projectedTask.role, "Developer");
  assert.deepEqual(snapshot.profileRequirements.team, ["owner", "role", "updated_at"]);
  assert.ok(snapshot.sourceFiles.includes(".agents/runtime/team.json"));
});

test("http server restricts file access and blocks arbitrary traversal", async (context) => {
  const server = createProjectMonitorServer({ repoRoot });
  await new Promise((resolve) => server.listen(0, resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const projectsResponse = await fetch(`${baseUrl}/api/projects`);
  const snapshotResponse = await fetch(`${baseUrl}/api/snapshot`);
  const projectAwareSnapshotResponse = await fetch(
    `${baseUrl}/api/snapshot?project=${encodeURIComponent("self-hosting-template")}`
  );
  const teamFileResponse = await fetch(
    `${baseUrl}/api/file?project=${encodeURIComponent("self-hosting-template")}&path=${encodeURIComponent(".agents/runtime/team.json")}`
  );
  const healthSnapshotResponse = await fetch(
    `${baseUrl}/api/file?path=${encodeURIComponent(".agents/runtime/health_snapshot.json")}`
  );
  const registryWorkspaceResponse = await fetch(
    `${baseUrl}/api/file?scope=workspace&path=${encodeURIComponent("tools/project-monitor-web/project-registry.json")}`
  );
  const blockedFileResponse = await fetch(
    `${baseUrl}/api/file?path=${encodeURIComponent("../package.json")}`
  );
  const traversalResponse = await fetch(`${baseUrl}/../../package.json`);

  assert.equal(projectsResponse.status, 200);
  assert.equal(snapshotResponse.status, 200);
  assert.equal(projectAwareSnapshotResponse.status, 200);
  assert.equal(teamFileResponse.status, 200);
  assert.equal(healthSnapshotResponse.status, 200);
  assert.equal(registryWorkspaceResponse.status, 200);
  assert.equal(blockedFileResponse.status, 400);
  assert.equal(traversalResponse.status, 404);
});

test("project registry helpers add and remove external projects without touching the workspace entry", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pmw-registry-"));
  const workspaceRoot = path.join(tempRoot, "workspace");
  const externalRoot = path.join(tempRoot, "external-repo");

  await createWorkspaceFixture(workspaceRoot);
  await createWorkspaceFixture(externalRoot);

  const initialRegistry = await loadProjectRegistry(workspaceRoot);
  assert.equal(initialRegistry.projects.length, 1);
  assert.equal(initialRegistry.projects[0].isWorkspace, true);

  const addedRegistry = await addProjectRegistryEntry(workspaceRoot, {
    label: "External Repo",
    repoRoot: externalRoot
  });
  const addedProject = addedRegistry.projects.find(
    (project) => project.label === "External Repo"
  );

  assert.ok(addedProject);
  assert.equal(addedProject.repoRoot, path.resolve(externalRoot));
  assert.equal(addedProject.canDelete, true);

  const removedRegistry = await removeProjectRegistryEntry(workspaceRoot, addedProject.id);
  assert.equal(
    removedRegistry.projects.some((project) => project.label === "External Repo"),
    false
  );
  assert.equal(
    removedRegistry.projects.some((project) => project.isWorkspace),
    true
  );
});

test("snapshot exposes decision packet and multi-project metadata", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot, {
    projectId: "self-hosting-template"
  });

  assert.equal(snapshot.projectContext.id, "self-hosting-template");
  assert.ok(snapshot.projects.some((project) => project.isCurrent));
  assert.ok(snapshot.header.currentAgent);
  assert.ok(Array.isArray(snapshot.overview.productGoal));
  assert.ok(Array.isArray(snapshot.documentHealth.optionalSources));
  assert.ok(Array.isArray(snapshot.governance.protectedPaths));
  assert.ok(Array.isArray(snapshot.governance.sensitivePaths));
  assert.ok(Array.isArray(snapshot.governance.toolAllowlist));
  assert.ok(Array.isArray(snapshot.governance.toolDenylist));
  assert.ok(
    Array.isArray(snapshot.governance.exfiltrationSensitiveInputClasses)
  );
  assert.ok(
    snapshot.documentHealth.riskSignals.some(
      (signal) => signal.id === "evidence_stale"
    )
  );
});

test("future hook and promotion boundary contracts are exposed in the snapshot", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot);

  assert.ok(Array.isArray(snapshot.futureContracts.eventHooks));
  assert.ok(
    snapshot.futureContracts.eventHooks.some((item) => item.event === "task.claimed")
  );
  assert.ok(Array.isArray(snapshot.futureContracts.promotionBoundary));
  assert.ok(
    snapshot.futureContracts.promotionBoundary.some(
      (item) => item.capability === "Project Monitor Web runtime"
    )
  );
});

test("architecture guide parser warns when a required contract section is missing", () => {
  const parsed = parseArchitectureGuide(`
## Status
- Document Status: Approved

## Artifact Parser Contract
| File | Phase 1 Role | Required Sections / Fields | Notes |
|---|---|---|---|
| \`ARCHITECTURE_GUIDE.md\` | Mandatory | sample | sample |

## Team Registry Contract
| Field | Required In | Meaning |
|---|---|---|
| \`id\` | all rows | stable owner identifier |

## Future Hook Contract
| Event | Reserved Emit Point | Phase | Notes |
|---|---|---|---|
| \`task.claimed\` | sample | Phase 2+ | sample |

## Promotion Boundary
| Capability | Default Home | Starter Default | Promotion Rule | Notes |
|---|---|---|---|---|
| sample | root | No | sample | sample |
`);

  assert.ok(
    parsed.warnings.includes('ARCHITECTURE_GUIDE.md: missing section "Domain Map"')
  );
});
