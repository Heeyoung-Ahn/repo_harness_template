export const TEAM_REGISTRY_PATH = ".agents/runtime/team.json";
export const HEALTH_SNAPSHOT_PATH = ".agents/runtime/health_snapshot.json";
export const GOVERNANCE_CONTROLS_PATH = ".agents/runtime/governance_controls.json";
export const PROJECT_HISTORY_PATH = ".agents/artifacts/PROJECT_HISTORY.md";
export const UI_DESIGN_PATH = ".agents/artifacts/UI_DESIGN.md";
export const PROJECT_REGISTRY_PATH = "tools/project-monitor-web/project-registry.json";
export const PMW_LAUNCH_SCRIPT_PATH =
  "tools/project-monitor-web/launch-project-monitor-web.ps1";
export const PMW_STOP_SCRIPT_PATH =
  "tools/project-monitor-web/stop-project-monitor-web.ps1";

export const MANDATORY_SOURCE_PATHS = [
  ".agents/artifacts/CURRENT_STATE.md",
  ".agents/artifacts/TASK_LIST.md",
  ".agents/artifacts/REQUIREMENTS.md",
  ".agents/artifacts/ARCHITECTURE_GUIDE.md",
  ".agents/artifacts/IMPLEMENTATION_PLAN.md"
];

export const OPTIONAL_SOURCE_PATHS = [
  ".agents/artifacts/REVIEW_REPORT.md",
  ".agents/artifacts/DEPLOYMENT_PLAN.md",
  PROJECT_HISTORY_PATH,
  UI_DESIGN_PATH
];

export const ALLOWED_SOURCE_PATHS = [
  ...MANDATORY_SOURCE_PATHS,
  ...OPTIONAL_SOURCE_PATHS,
  TEAM_REGISTRY_PATH,
  HEALTH_SNAPSHOT_PATH,
  GOVERNANCE_CONTROLS_PATH,
  PROJECT_REGISTRY_PATH,
  PMW_LAUNCH_SCRIPT_PATH,
  PMW_STOP_SCRIPT_PATH
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

export const RESERVED_EVENT_HOOKS = [
  {
    event: "task.claimed",
    emitter: "task lifecycle",
    phase: "Phase 2+",
    note: "claim/lock transition only; no realtime transport in Phase 1"
  },
  {
    event: "task.blocked",
    emitter: "task lifecycle",
    phase: "Phase 2+",
    note: "blocked and manual gate transitions only"
  },
  {
    event: "handoff.recorded",
    emitter: "handoff log",
    phase: "Phase 2+",
    note: "handoff append point only"
  },
  {
    event: "gate.awaiting_human",
    emitter: "approval/manual gate",
    phase: "Phase 2+",
    note: "human/manual/environment gate transitions only"
  },
  {
    event: "task.completed",
    emitter: "task lifecycle",
    phase: "Phase 2+",
    note: "completion transition only"
  }
];

export const PROMOTION_BOUNDARY = [
  {
    capability: "Project Monitor Web runtime",
    default_home: "root self-hosting only",
    starter_default: "no",
    promotion_trigger: "reviewed optional package extraction after REV-03",
    note: "never ship as starter default behavior"
  },
  {
    capability: "Team registry contract",
    default_home: "root + starter",
    starter_default: "yes",
    promotion_trigger: "already shared schema",
    note: "shared contract, no runtime watcher implied"
  },
  {
    capability: "Health snapshot contract",
    default_home: "root + starter",
    starter_default: "optional",
    promotion_trigger: "when adapters or validators emit snapshot data",
    note: "placeholder file allowed; no polling or push"
  },
  {
    capability: "Event hook transport",
    default_home: "root experiment or adapter package",
    starter_default: "no",
    promotion_trigger: "after event producer shape is stable",
    note: "Phase 1 reserves names only"
  }
];
