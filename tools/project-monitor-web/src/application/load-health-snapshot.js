import fs from "node:fs/promises";
import path from "node:path";

import { HEALTH_SNAPSHOT_PATH } from "../domain/contracts.js";

function createDefaultSnapshot() {
  return {
    path: HEALTH_SNAPSHOT_PATH,
    present: false,
    schemaVersion: "1.0",
    generatedAt: "",
    producer: "",
    summary: "unknown",
    checks: [],
    warnings: []
  };
}

export async function loadHealthSnapshot(repoRoot) {
  const filePath = path.join(repoRoot, HEALTH_SNAPSHOT_PATH);
  const snapshot = createDefaultSnapshot();

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    snapshot.present = true;
    snapshot.schemaVersion = parsed.schema_version || "1.0";
    snapshot.generatedAt = parsed.generated_at || "";
    snapshot.producer = parsed.producer || "";
    snapshot.summary = parsed.summary || "unknown";
    snapshot.checks = Array.isArray(parsed.checks) ? parsed.checks : [];

    if (!parsed.schema_version) {
      snapshot.warnings.push("health_snapshot.json: missing schema_version");
    }

    if (!parsed.summary) {
      snapshot.warnings.push("health_snapshot.json: missing summary");
    }

    return snapshot;
  } catch (error) {
    if (error.code === "ENOENT") {
      return snapshot;
    }

    snapshot.warnings.push(`health_snapshot.json: ${error.message}`);
    return snapshot;
  }
}
