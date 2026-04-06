import fs from "node:fs/promises";
import path from "node:path";

import {
  TEAM_MEMBER_REQUIRED_FIELDS,
  TEAM_REGISTRY_PATH
} from "../domain/contracts.js";

export async function loadTeamRegistry(repoRoot) {
  const filePath = path.join(repoRoot, TEAM_REGISTRY_PATH);
  const warnings = [];

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const members = Array.isArray(parsed.members) ? parsed.members : [];

    members.forEach((member, index) => {
      for (const field of TEAM_MEMBER_REQUIRED_FIELDS) {
        if (
          member[field] === undefined ||
          member[field] === null ||
          member[field] === ""
        ) {
          warnings.push(
            `team.json: member ${index + 1} is missing required field "${field}"`
          );
        }
      }
    });

    return {
      path: TEAM_REGISTRY_PATH,
      activeProfile: parsed.active_profile || "solo",
      schemaVersion: parsed.schema_version || "1.0",
      members,
      warnings
    };
  } catch (error) {
    warnings.push(`team.json: ${error.message}`);
    return {
      path: TEAM_REGISTRY_PATH,
      activeProfile: "solo",
      schemaVersion: "1.0",
      members: [],
      warnings
    };
  }
}
