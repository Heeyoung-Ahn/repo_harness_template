import fs from "node:fs/promises";
import path from "node:path";

const GOVERNANCE_CONTROLS_PATH = ".agents/runtime/governance_controls.json";

export async function loadGovernanceControls(repoRoot) {
  const filePath = path.join(repoRoot, GOVERNANCE_CONTROLS_PATH);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      path: GOVERNANCE_CONTROLS_PATH,
      validatorProfile: parsed.validator_profile || "unknown",
      protectedPaths: Array.isArray(parsed.protected_paths) ? parsed.protected_paths : [],
      humanReviewRequiredScopes: Array.isArray(parsed.human_review_required_scopes)
        ? parsed.human_review_required_scopes
        : [],
      criticalDomains: Array.isArray(parsed.critical_domains) ? parsed.critical_domains : [],
      sandboxPolicy: parsed.sandbox_policy || {},
      warnings: []
    };
  } catch (error) {
    return {
      path: GOVERNANCE_CONTROLS_PATH,
      validatorProfile: "unknown",
      protectedPaths: [],
      humanReviewRequiredScopes: [],
      criticalDomains: [],
      sandboxPolicy: {},
      warnings: [`governance_controls.json: ${error.message}`]
    };
  }
}
