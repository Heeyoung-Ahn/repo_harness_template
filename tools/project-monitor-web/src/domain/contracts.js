export const TEAM_REGISTRY_PATH = ".agents/runtime/team.json";

export const MANDATORY_SOURCE_PATHS = [
  ".agents/artifacts/CURRENT_STATE.md",
  ".agents/artifacts/TASK_LIST.md",
  ".agents/artifacts/REQUIREMENTS.md",
  ".agents/artifacts/ARCHITECTURE_GUIDE.md",
  ".agents/artifacts/IMPLEMENTATION_PLAN.md"
];

export const OPTIONAL_SOURCE_PATHS = [
  ".agents/artifacts/REVIEW_REPORT.md",
  ".agents/artifacts/DEPLOYMENT_PLAN.md"
];

export const ALLOWED_SOURCE_PATHS = [
  ...MANDATORY_SOURCE_PATHS,
  ...OPTIONAL_SOURCE_PATHS,
  TEAM_REGISTRY_PATH
];

export const TEAM_MEMBER_REQUIRED_FIELDS = [
  "id",
  "display_name",
  "kind",
  "primary_role",
  "ownership_scopes",
  "handoff_targets"
];

export const PROFILE_REQUIREMENTS = {
  solo: [],
  team: ["owner", "role", "updated_at"],
  "large/governed": [
    "owner",
    "role",
    "updated_at",
    "approval_chain",
    "gate_state",
    "handoff_reason"
  ]
};

export const HEALTH_PANEL_FIELDS = [
  "requirements_sync_check",
  "architecture_status",
  "plan_status",
  "review_gate",
  "manual_environment_gate",
  "dependency_compliance_gate",
  "document_health"
];
