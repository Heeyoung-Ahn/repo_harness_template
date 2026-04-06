import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDashboardSnapshot,
  mergeTaskOwnership
} from "../src/application/build-dashboard-snapshot.js";
import { createProjectMonitorServer } from "../src/infrastructure/http-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

test("dashboard snapshot exposes the approved Phase 1 panels", async () => {
  const snapshot = await buildDashboardSnapshot(repoRoot);

  assert.equal(snapshot.activeProfile, "solo");
  assert.ok(Array.isArray(snapshot.boardTasks));
  assert.ok(Array.isArray(snapshot.blockers));
  assert.ok(Array.isArray(snapshot.recentActivity));
  assert.ok(Array.isArray(snapshot.teamDirectory));
  assert.ok(snapshot.documentHealth.summary);
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

test("http server is read-only and blocks arbitrary file traversal", async (context) => {
  const server = createProjectMonitorServer({ repoRoot });
  await new Promise((resolve) => server.listen(0, resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const snapshotResponse = await fetch(`${baseUrl}/api/snapshot`);
  const teamFileResponse = await fetch(
    `${baseUrl}/api/file?path=${encodeURIComponent(".agents/runtime/team.json")}`
  );
  const blockedFileResponse = await fetch(
    `${baseUrl}/api/file?path=${encodeURIComponent("../package.json")}`
  );
  const traversalResponse = await fetch(`${baseUrl}/../../package.json`);

  assert.equal(snapshotResponse.status, 200);
  assert.equal(teamFileResponse.status, 200);
  assert.equal(blockedFileResponse.status, 400);
  assert.equal(traversalResponse.status, 404);
});
