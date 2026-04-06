import fs from "node:fs/promises";
import path from "node:path";

import {
  ALLOWED_SOURCE_PATHS,
  HEALTH_PANEL_FIELDS,
  MANDATORY_SOURCE_PATHS,
  OPTIONAL_SOURCE_PATHS,
  PROFILE_REQUIREMENTS
} from "../domain/contracts.js";
import { parseArchitectureGuide } from "./parse-architecture-guide.js";
import { parseCurrentState } from "./parse-current-state.js";
import { parseImplementationPlan } from "./parse-implementation-plan.js";
import { parseRequirements } from "./parse-requirements.js";
import { parseTaskList } from "./parse-task-list.js";
import { loadTeamRegistry } from "./load-team-registry.js";

async function readTextFile(repoRoot, relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFile(filePath, "utf8");
}

function normalizeIdentity(value) {
  return String(value || "").trim().toLowerCase();
}

function buildMemberIndex(members) {
  const index = new Map();
  for (const member of members) {
    index.set(normalizeIdentity(member.id), member);
    index.set(normalizeIdentity(member.display_name), member);
  }
  return index;
}

function enrichLock(lock, memberIndex) {
  const matchedMember = memberIndex.get(normalizeIdentity(lock.owner));
  return {
    ...lock,
    ownerId: matchedMember?.id || "",
    ownerDisplay: matchedMember?.display_name || lock.owner || "",
    role: lock.role || matchedMember?.primary_role || "",
    kind: matchedMember?.kind || ""
  };
}

export function mergeTaskOwnership(tasks, locks, members) {
  const memberIndex = buildMemberIndex(members);
  const enrichedLocks = locks.map((lock) => enrichLock(lock, memberIndex));
  const lockMap = new Map(enrichedLocks.map((lock) => [lock.taskId, lock]));
  const boardTasks = tasks.map((task) => {
    const lock = lockMap.get(task.id);
    return {
      ...task,
      owner: lock?.owner || "",
      ownerId: lock?.ownerId || "",
      ownerDisplay: lock?.ownerDisplay || lock?.owner || "",
      role: lock?.role || "",
      startedAt: lock?.startedAt || "",
      note: lock?.note || ""
    };
  });

  return {
    boardTasks,
    activeLocks: enrichedLocks
  };
}

function buildSummary(tasks, locks, blockers) {
  const counts = tasks.reduce(
    (accumulator, task) => {
      accumulator[task.status] = (accumulator[task.status] || 0) + 1;
      return accumulator;
    },
    {}
  );

  const pendingApprovals = blockers.filter((item) =>
    ["approval", "manual_gate", "environment_gate"].includes(item.category)
  ).length;

  return {
    pending: counts.pending || 0,
    inProgress: counts.in_progress || 0,
    blocked: counts.blocked || 0,
    done: counts.done || 0,
    activeLocks: locks.length,
    blockers: blockers.length,
    pendingApprovals
  };
}

function buildDocumentHealth(currentState, implementationPlan) {
  const items = HEALTH_PANEL_FIELDS.map((key) => ({
    key,
    label:
      currentState.snapshot._labels?.[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    value: currentState.snapshot[key] || "unknown"
  }));

  return {
    summary: currentState.snapshot.document_health || "unknown",
    items,
    validationGates: implementationPlan.validationGates
  };
}

async function readOptionalSourceStatus(repoRoot) {
  const optionalSources = [];
  for (const relativePath of OPTIONAL_SOURCE_PATHS) {
    try {
      await fs.access(path.join(repoRoot, relativePath));
      optionalSources.push({ path: relativePath, present: true });
    } catch {
      optionalSources.push({ path: relativePath, present: false });
    }
  }
  return optionalSources;
}

export async function buildDashboardSnapshot(repoRoot) {
  const [
    currentStateText,
    taskListText,
    requirementsText,
    architectureText,
    implementationText,
    teamRegistry,
    optionalSources
  ] = await Promise.all([
    readTextFile(repoRoot, MANDATORY_SOURCE_PATHS[0]),
    readTextFile(repoRoot, MANDATORY_SOURCE_PATHS[1]),
    readTextFile(repoRoot, MANDATORY_SOURCE_PATHS[2]),
    readTextFile(repoRoot, MANDATORY_SOURCE_PATHS[3]),
    readTextFile(repoRoot, MANDATORY_SOURCE_PATHS[4]),
    loadTeamRegistry(repoRoot),
    readOptionalSourceStatus(repoRoot)
  ]);

  const currentState = parseCurrentState(currentStateText);
  const taskList = parseTaskList(taskListText);
  const requirements = parseRequirements(requirementsText);
  const architecture = parseArchitectureGuide(architectureText);
  const implementationPlan = parseImplementationPlan(implementationText);

  const ownershipProjection = mergeTaskOwnership(
    taskList.tasks,
    taskList.locks,
    teamRegistry.members
  );

  const boardTasks = ownershipProjection.boardTasks.filter(
    (task) => task.stage && task.stage !== "Documentation and Closeout"
  );

  const blockers = [...currentState.blockers, ...taskList.blockers];
  const warnings = [
    ...currentState.warnings,
    ...taskList.warnings,
    ...requirements.warnings,
    ...architecture.warnings,
    ...implementationPlan.warnings,
    ...teamRegistry.warnings
  ];

  return {
    generatedAt: new Date().toISOString(),
    repoRoot,
    repoName: path.basename(repoRoot),
    activeProfile: teamRegistry.activeProfile || "solo",
    summary: buildSummary(boardTasks, taskList.locks, blockers),
    release: {
      version: taskList.releaseTarget.version_milestone || "",
      stage: taskList.releaseTarget.current_stage || "",
      focus: taskList.releaseTarget.current_focus || "",
      goal: taskList.releaseTarget.current_release_goal || ""
    },
    currentIteration: implementationPlan.currentIteration,
    boardTasks,
    activeLocks: ownershipProjection.activeLocks,
    blockers,
    recentActivity: taskList.handoffLog.slice(0, 8),
    documentHealth: buildDocumentHealth(currentState, implementationPlan),
    teamDirectory: teamRegistry.members,
    operationalProfiles: requirements.operationalProfiles,
    profileRequirements: PROFILE_REQUIREMENTS,
    parserContract: architecture.parserContract,
    optionalSources,
    sourceFiles: ALLOWED_SOURCE_PATHS,
    warnings
  };
}
