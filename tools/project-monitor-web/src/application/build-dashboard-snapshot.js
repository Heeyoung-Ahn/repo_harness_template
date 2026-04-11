import fs from "node:fs/promises";
import path from "node:path";

import {
  ALLOWED_SOURCE_PATHS,
  HEALTH_PANEL_FIELDS,
  HEALTH_SNAPSHOT_PATH,
  MANDATORY_SOURCE_PATHS,
  OPTIONAL_SOURCE_PATHS,
  PMW_LAUNCH_SCRIPT_PATH,
  PMW_STOP_SCRIPT_PATH,
  PROFILE_REQUIREMENTS,
  PROJECT_HISTORY_PATH,
  PROJECT_REGISTRY_PATH,
  PROMOTION_BOUNDARY,
  RESERVED_EVENT_HOOKS,
  UI_DESIGN_PATH
} from "../domain/contracts.js";
import { loadGovernanceControls } from "./load-governance-controls.js";
import { loadHealthSnapshot } from "./load-health-snapshot.js";
import {
  loadProjectRegistry,
  resolveProjectContext
} from "./load-project-registry.js";
import { loadTeamRegistry } from "./load-team-registry.js";
import { parseArchitectureGuide } from "./parse-architecture-guide.js";
import { parseCurrentState } from "./parse-current-state.js";
import { parseImplementationPlan } from "./parse-implementation-plan.js";
import { parseProjectHistory } from "./parse-project-history.js";
import { parseRequirements } from "./parse-requirements.js";
import { parseTaskList } from "./parse-task-list.js";
import { parseUiDesign } from "./parse-ui-design.js";

async function readTextFile(repoRoot, relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFile(filePath, "utf8");
}

async function readOptionalTextFile(repoRoot, relativePath) {
  try {
    return {
      present: true,
      path: relativePath,
      text: await readTextFile(repoRoot, relativePath)
    };
  } catch (error) {
    return {
      present: false,
      path: relativePath,
      text: "",
      warning: `${relativePath}: ${error.message}`
    };
  }
}

function normalizeIdentity(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function toEntryMap(entries) {
  return entries.reduce((accumulator, entry) => {
    accumulator[entry.keyNormalized] = entry.value;
    return accumulator;
  }, {});
}

function renderBulletSummary(entry) {
  if (!entry) {
    return "";
  }

  if (!entry.key || !entry.value) {
    return entry?.value || entry?.key || "";
  }

  return `${entry.key}: ${entry.value}`;
}

function extractTaskIds(...values) {
  const ids = new Set();
  const pattern = /\b[A-Z]+-\d+\b/g;

  for (const value of values.flat()) {
    const text = String(value || "");
    const matches = text.match(pattern) || [];
    for (const match of matches) {
      ids.add(match);
    }
  }

  return [...ids];
}

function uniqueBy(items, keySelector) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildSummary(tasks, locks, blockers) {
  const counts = tasks.reduce(
    (accumulator, task) => {
      accumulator[task.status] = (accumulator[task.status] || 0) + 1;
      return accumulator;
    },
    {}
  );

  const total = tasks.length || 1;
  const done = counts.done || 0;
  const pendingApprovals = blockers.filter((item) =>
    ["approval", "manual_gate", "environment_gate"].includes(item.category)
  ).length;

  return {
    pending: counts.pending || 0,
    inProgress: counts.in_progress || 0,
    blocked: counts.blocked || 0,
    done,
    total: tasks.length,
    progressPercent: Math.round((done / total) * 100),
    openTasks: (counts.pending || 0) + (counts.in_progress || 0) + (counts.blocked || 0),
    activeLocks: locks.length,
    blockers: blockers.length,
    pendingApprovals
  };
}

function buildDocumentHealth(
  currentState,
  implementationPlan,
  healthSnapshot,
  governanceControls,
  optionalSources,
  riskSignals
) {
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
    validationGates: implementationPlan.validationGates,
    governance: {
      path: governanceControls.path,
      validatorProfile: governanceControls.validatorProfile,
      protectedPathCount: governanceControls.protectedPaths.length,
      sensitivePathCount: governanceControls.sensitivePaths.length,
      humanReviewScopeCount: governanceControls.humanReviewRequiredScopes.length,
      criticalDomainCount: governanceControls.criticalDomains.length,
      toolAllowlistCount: governanceControls.toolAllowlist.length,
      toolDenylistCount: governanceControls.toolDenylist.length,
      exfiltrationClassCount:
        governanceControls.exfiltrationSensitiveInputClasses.length,
      sandboxMode: governanceControls.sandboxPolicy.mode || "unspecified"
    },
    riskSignals: riskSignals.signals,
    signalSummary: {
      active: riskSignals.active.length,
      watch: riskSignals.watch.length
    },
    optionalSources,
    healthSnapshot: {
      path: healthSnapshot.path,
      present: healthSnapshot.present,
      schemaVersion: healthSnapshot.schemaVersion,
      generatedAt: healthSnapshot.generatedAt,
      producer: healthSnapshot.producer,
      summary: healthSnapshot.summary,
      checks: healthSnapshot.checks
    }
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

function buildSourceLinks(paths) {
  return uniqueBy(
    paths
      .filter(Boolean)
      .map((sourcePath) => ({
        path: sourcePath,
        label: path.basename(sourcePath)
      })),
    (item) => item.path
  );
}

function normalizeSignalText(...values) {
  return values
    .flat(Infinity)
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function buildRiskSignals({
  currentState,
  taskList,
  implementationPlan,
  governanceControls,
  blockers,
  teamRegistry
}) {
  const blockerText = normalizeSignalText(
    blockers.map((item) => [
      item.id,
      item.label,
      item.value,
      item.observedSymptom,
      item.nextEscalation
    ])
  );
  const handoffText = normalizeSignalText(
    currentState.latestHandoffSummary.map((entry) => entry.value),
    taskList.handoffLog.map((entry) => entry.message)
  );
  const gateText = normalizeSignalText(
    currentState.snapshot.review_gate,
    currentState.snapshot.manual_environment_gate,
    currentState.snapshot.dependency_compliance_gate,
    implementationPlan.validationGates
  );
  const searchText = normalizeSignalText(blockerText, handoffText, gateText);
  const governedActive =
    (teamRegistry.activePacks || []).includes("enterprise_governed") ||
    /governed/i.test(teamRegistry.activeProfile || "");

  const signals = [
    {
      id: "context_miss",
      label: "Context Miss",
      status: includesAny(searchText, [
        "맥락 상실",
        "아키텍처 표류",
        "context miss",
        "architecture drift"
      ])
        ? "active"
        : "clear",
      detail: includesAny(searchText, [
        "맥락 상실",
        "아키텍처 표류",
        "context miss",
        "architecture drift"
      ])
        ? "handoff 또는 blocker에 전역 맥락 상실이나 구조 표류 징후가 기록됐다."
        : "현재 blocker와 handoff에서는 전역 맥락 상실 징후가 명시되지 않았다.",
      sourceLinks: buildSourceLinks([
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/TASK_LIST.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md"
      ])
    },
    {
      id: "review_reopen",
      label: "Review Reopen",
      status: includesAny(searchText, [
        "review reopen",
        "reopen",
        "changes requested",
        "재오픈"
      ])
        ? "active"
        : "clear",
      detail: includesAny(searchText, [
        "review reopen",
        "reopen",
        "changes requested",
        "재오픈"
      ])
        ? "review 재오픈이나 changes requested 신호가 현재 artifact에 남아 있다."
        : "현재 artifact에는 review reopen 신호가 없다.",
      sourceLinks: buildSourceLinks([
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/REVIEW_REPORT.md"
      ])
    },
    {
      id: "evidence_stale",
      label: "Evidence Stale",
      status: includesAny(searchText, ["evidence stale", "stale evidence"])
        ? "active"
        : [
              currentState.snapshot.review_gate,
              currentState.snapshot.manual_environment_gate,
              currentState.snapshot.dependency_compliance_gate
            ].some((value) => /not started|open/i.test(String(value || "")))
          ? "watch"
          : "clear",
      detail: includesAny(searchText, ["evidence stale", "stale evidence"])
        ? "artifact에 stale evidence 신호가 직접 기록됐다."
        : [
              currentState.snapshot.review_gate,
              currentState.snapshot.manual_environment_gate,
              currentState.snapshot.dependency_compliance_gate
            ].some((value) => /not started|open/i.test(String(value || "")))
          ? "review/manual/dependency gate가 아직 열려 있어 close evidence가 더 필요하다."
          : "현재 open gate 기준으로 stale evidence 신호는 없다.",
      sourceLinks: buildSourceLinks([
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/DEPLOYMENT_PLAN.md",
        ".agents/artifacts/REVIEW_REPORT.md"
      ])
    },
    {
      id: "repeat_issue",
      label: "Repeat Issue",
      status: includesAny(searchText, ["repeat issue", "재발", "반복"])
        ? "active"
        : "clear",
      detail: includesAny(searchText, ["repeat issue", "재발", "반복"])
        ? "handoff 또는 blocker에 반복 이슈 신호가 기록됐다."
        : "현재 artifact에는 반복 이슈 신호가 직접 기록되지 않았다.",
      sourceLinks: buildSourceLinks([
        ".agents/artifacts/TASK_LIST.md",
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/PROJECT_HISTORY.md"
      ])
    },
    {
      id: "guardrail_gap",
      label: "Guardrail Gap",
      status: governedActive &&
        (governanceControls.protectedPaths.length === 0 ||
          governanceControls.humanReviewRequiredScopes.length === 0)
        ? "active"
        : governedActive &&
            governanceControls.sensitivePaths.length === 0 &&
            governanceControls.toolAllowlist.length === 0 &&
            governanceControls.toolDenylist.length === 0 &&
            governanceControls.exfiltrationSensitiveInputClasses.length === 0
          ? "watch"
          : "clear",
      detail: governedActive &&
        (governanceControls.protectedPaths.length === 0 ||
          governanceControls.humanReviewRequiredScopes.length === 0)
        ? "governed profile 또는 pack이 활성인데 protected path 또는 human review scope가 비어 있다."
        : governedActive &&
            governanceControls.sensitivePaths.length === 0 &&
            governanceControls.toolAllowlist.length === 0 &&
            governanceControls.toolDenylist.length === 0 &&
            governanceControls.exfiltrationSensitiveInputClasses.length === 0
          ? "governed profile은 맞지만 optional guardrail field는 아직 placeholder 수준이다."
          : "현재 profile 기준에서 guardrail gap 신호는 없다.",
      sourceLinks: buildSourceLinks([
        ".agents/runtime/governance_controls.json",
        ".agents/artifacts/ARCHITECTURE_GUIDE.md"
      ])
    }
  ];

  return {
    signals,
    active: signals.filter((signal) => signal.status === "active"),
    watch: signals.filter((signal) => signal.status === "watch")
  };
}

function buildActivity(taskList, historyEntries) {
  const historyItems = historyEntries.slice(0, 4).map((entry) => ({
    id: `history-${slugify(`${entry.date}-${entry.title}`)}`,
    kind: "history",
    title: entry.title,
    summary: entry.summary,
    date: entry.date,
    sourcePath: entry.sourcePath
  }));

  const handoffItems = taskList.handoffLog.slice(0, 6).map((entry, index) => ({
    id: `handoff-${index + 1}`,
    kind: "handoff",
    title: entry.date,
    summary: entry.message,
    date: entry.date,
    sourcePath: ".agents/artifacts/TASK_LIST.md"
  }));

  return [...handoffItems, ...historyItems]
    .sort((left, right) => String(right.date).localeCompare(String(left.date)))
    .slice(0, 8);
}

function buildProjectDescription(requirements, currentState) {
  const descriptiveGoalLines = requirements.productGoal
    .map((item) => item.value?.trim())
    .filter(Boolean)
    .filter(
      (value) =>
        !value.endsWith(":") &&
        !value.startsWith("최종 사용자") &&
        !value.startsWith("성공 기준")
    );

  if (descriptiveGoalLines.length > 0) {
    return {
      value: descriptiveGoalLines.slice(0, 3).join(" "),
      sourcePath: ".agents/artifacts/REQUIREMENTS.md",
      sourceLabel: "Product Goal > Problem Statement"
    };
  }

  if (requirements.quickRead[0]?.value) {
    return {
      value: requirements.quickRead[0].value,
      sourcePath: ".agents/artifacts/REQUIREMENTS.md",
      sourceLabel: "Quick Read > 1"
    };
  }

  if (currentState.snapshot.current_release_goal) {
    return {
      value: currentState.snapshot.current_release_goal,
      sourcePath: ".agents/artifacts/CURRENT_STATE.md",
      sourceLabel: "Snapshot > Current Release Goal"
    };
  }

  return {
    value: "프로젝트 설명이 아직 준비되지 않았습니다.",
    sourcePath: "",
    sourceLabel: ""
  };
}

function findPrimaryTask(boardTasks, activeLocks) {
  if (activeLocks.length) {
    const taskId = activeLocks[0].taskId;
    const matched = boardTasks.find((task) => task.id === taskId);
    if (matched) {
      return matched;
    }
  }

  return (
    boardTasks.find((task) => task.status === "in_progress") ||
    boardTasks.find((task) => task.status === "blocked") ||
    boardTasks[0] ||
    null
  );
}

function buildOverview({
  projectContext,
  requirements,
  architecture,
  implementationPlan,
  uiDesign,
  currentState,
  projectDescription,
  summary,
  blockers,
  historyEntries,
  boardTasks,
  riskSignals
}) {
  const recentHistory = historyEntries.slice(0, 4);
  const primaryIssues = blockers.slice(0, 3).map((item) => ({
    id: item.id,
    label: item.label || item.id,
    value: item.value || item.observedSymptom || item.nextEscalation || ""
  }));

  return {
    projectName: projectContext.label,
    goalSummary: projectDescription.value,
    goalSummarySource: projectDescription,
    productGoal: requirements.productGoal.map((item) => item.value),
    openQuestions: requirements.openQuestions.map((item) => item.value),
    requirementsSummary: requirements.quickRead.map(renderBulletSummary),
    architectureSummary:
      architecture.architectureSummary.length > 0
        ? architecture.architectureSummary.map(renderBulletSummary)
        : architecture.quickRead.map(renderBulletSummary),
    implementationSummary: implementationPlan.quickRead.map(renderBulletSummary),
    designMockup: {
      present: uiDesign.present,
      summary: uiDesign.quickRead.map(renderBulletSummary),
      sourcePath: UI_DESIGN_PATH
    },
    taskProgress: {
      openTasks: summary.openTasks,
      doneTasks: summary.done,
      totalTasks: summary.total,
      progressPercent: summary.progressPercent
    },
    currentStatus: {
      stage: currentState.snapshot.current_stage || "",
      focus: currentState.snapshot.current_focus || "",
      goal: currentState.snapshot.current_release_goal || "",
      activeTaskCount: boardTasks.filter((task) => task.status !== "done").length
    },
    majorIssues: primaryIssues,
    riskSignals: [...riskSignals.active, ...riskSignals.watch],
    recentHistory
  };
}

function describeCategory(category) {
  switch (category) {
    case "approval":
      return "Approval";
    case "manual_gate":
      return "Manual Gate";
    case "environment_gate":
      return "Environment Gate";
    case "stale_lock":
      return "Stale Lock";
    case "change_request":
      return "Change Request";
    default:
      return "Decision";
  }
}

function buildOptions(category, nextEscalation = "") {
  switch (category) {
    case "approval":
      return [
        {
          label: "Approve in Codex",
          impact: "결정이 닫히면 다음 implementation 또는 gate task를 이어갈 수 있습니다."
        },
        {
          label: "Revise First",
          impact: "추가 수정 포인트를 정의한 뒤 같은 approval flow를 다시 엽니다."
        },
        {
          label: "Defer",
          impact: "현재 blocker가 남아 iteration 이동이나 후속 task가 지연됩니다."
        }
      ];
    case "manual_gate":
    case "environment_gate":
      return [
        {
          label: "Run the Gate",
          impact: "수동 검증 또는 환경 확인을 수행한 뒤 결과를 artifact에 반영합니다."
        },
        {
          label: "Defer",
          impact: "실환경 증빙이 없어서 review/deploy gate를 닫지 못합니다."
        }
      ];
    case "change_request":
      return [
        {
          label: "Approve the Baseline",
          impact: "요구사항/아키텍처/구현 계획을 같은 기준선으로 닫고 DEV/TST를 진행합니다."
        },
        {
          label: "Request Revision",
          impact: "변경 범위를 다시 열고 wireframe 또는 acceptance를 수정합니다."
        }
      ];
    default:
      return [
        {
          label: "Resolve Now",
          impact: nextEscalation || "현재 blocker가 닫히면 후속 task를 계속 진행할 수 있습니다."
        },
        {
          label: "Carry Forward",
          impact: "다음 iteration이나 별도 change request로 넘기되 current evidence는 남겨야 합니다."
        }
      ];
  }
}

function historyContext(historyEntries) {
  return historyEntries.slice(0, 3).map((entry) => ({
    title: `${entry.date} · ${entry.title}`,
    summary: entry.summary
  }));
}

function buildDecisionPackets({
  currentState,
  taskList,
  requirements,
  implementationPlan,
  historyEntries,
  riskSignals
}) {
  const packets = [];
  const currentStateMap = toEntryMap(currentState.latestHandoffSummary);

  for (const blocker of currentState.blockers) {
    const relatedTaskIds = extractTaskIds(blocker.label, blocker.value);
    packets.push({
      id: `packet-${blocker.id}`,
      sourceKind: "current_state",
      sourceId: blocker.id,
      queueLabel: blocker.label,
      decisionTitle: blocker.label,
      decisionType: describeCategory(blocker.category),
      urgencyGate: blocker.category,
      recommendedDefault:
        blocker.category === "approval"
          ? "요약을 확인한 뒤 Codex에서 승인 또는 수정 지시를 남긴다."
          : "현재 blocker 원인을 먼저 정리하고 가장 가까운 다음 action을 닫는다.",
      whyNow: blocker.value,
      options: buildOptions(blocker.category),
      affectedTaskIds: relatedTaskIds,
      affectedArtifacts: buildSourceLinks([
        blocker.sourcePath,
        ".agents/artifacts/TASK_LIST.md",
        ".agents/artifacts/REQUIREMENTS.md"
      ]),
      riskSignals: [...riskSignals.active, ...riskSignals.watch],
      recentHistoryContext: historyContext(historyEntries),
      whatHappensIfDelayed:
        currentStateMap.first_next_action ||
        "현재 stage 진행이 멈추고 다음 역할 전환이 늦어집니다.",
      nextStep:
        blocker.category === "approval"
          ? "결정을 내릴 준비가 되면 Codex로 돌아와 승인 또는 수정 방향을 전달합니다."
          : "관련 artifact를 확인한 뒤 Codex에서 다음 implementation 또는 planning action을 요청합니다.",
      sourceLinks: buildSourceLinks([
        blocker.sourcePath,
        ".agents/artifacts/CURRENT_STATE.md"
      ])
    });
  }

  for (const blocker of taskList.blockers) {
    const relatedTaskIds = extractTaskIds(
      blocker.id,
      blocker.observedSymptom,
      blocker.attemptedRecovery,
      blocker.nextEscalation
    );

    packets.push({
      id: `packet-${blocker.id}`,
      sourceKind: "task_list",
      sourceId: blocker.id,
      queueLabel: blocker.id,
      decisionTitle: blocker.observedSymptom || blocker.id,
      decisionType: describeCategory(blocker.category),
      urgencyGate: blocker.impact || blocker.category,
      recommendedDefault:
        blocker.nextEscalation ||
        "source artifact를 확인한 뒤 Codex에서 해소 방향을 정한다.",
      whyNow: blocker.observedSymptom || blocker.value,
      options: buildOptions(blocker.category, blocker.nextEscalation),
      affectedTaskIds: relatedTaskIds,
      affectedArtifacts: buildSourceLinks([
        blocker.sourcePath,
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md"
      ]),
      riskSignals: [...riskSignals.active, ...riskSignals.watch],
      recentHistoryContext: historyContext(historyEntries),
      whatHappensIfDelayed:
        blocker.impact || "current iteration의 다음 단계로 넘어갈 근거가 부족해집니다.",
      nextStep:
        blocker.nextEscalation ||
        "관련 task와 artifact를 확인한 뒤 Codex에서 다음 조치를 지정합니다.",
      sourceLinks: buildSourceLinks([blocker.sourcePath])
    });
  }

  for (const request of requirements.pendingChangeRequests) {
    const status = String(request.status || "").toLowerCase();
    if (!status || status.includes("in sync")) {
      continue;
    }

    const relatedTaskIds = extractTaskIds(
      request.change_id,
      request.summary,
      request.affected_areas,
      request.next_action
    );

    packets.push({
      id: `packet-${request.change_id}`,
      sourceKind: "change_request",
      sourceId: request.change_id,
      queueLabel: request.change_id,
      decisionTitle: request.summary || request.change_id,
      decisionType: describeCategory("change_request"),
      urgencyGate: request.status || "Pending Review",
      recommendedDefault:
        request.next_action ||
        `${request.change_id} 범위를 확인한 뒤 Codex에서 승인 또는 수정 요청을 남긴다.`,
      whyNow:
        request.summary ||
        "요구사항 기준선이 아직 닫히지 않아 implementation/review gate가 열리지 않습니다.",
      options: buildOptions("change_request"),
      affectedTaskIds: relatedTaskIds,
      affectedArtifacts: buildSourceLinks([
        ".agents/artifacts/REQUIREMENTS.md",
        ".agents/artifacts/ARCHITECTURE_GUIDE.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md",
        PROJECT_HISTORY_PATH
      ]),
      riskSignals: [...riskSignals.active, ...riskSignals.watch],
      recentHistoryContext: historyContext(historyEntries),
      whatHappensIfDelayed:
        "요구사항 기준선이 열린 상태로 남아 downstream implementation과 review 판단이 흔들립니다.",
      nextStep:
        "결정을 내릴 준비가 되면 Codex에서 승인 또는 수정 포인트를 알려주고 artifact sync를 닫습니다.",
      sourceLinks: buildSourceLinks([
        ".agents/artifacts/REQUIREMENTS.md",
        ".agents/artifacts/UI_DESIGN.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md"
      ])
    });
  }

  return uniqueBy(packets, (packet) => packet.id);
}

function buildHistoryView(entries) {
  return entries.map((entry, index) => ({
    id: `history-entry-${index + 1}`,
    ...entry
  }));
}

function buildCurrentStatus({
  currentState,
  projectDescription,
  primaryTask,
  activeLocks,
  summary,
  blockers
}) {
  const latestHandoff = toEntryMap(currentState.latestHandoffSummary);
  const nextAgent = currentState.nextRecommendedAgent;
  const currentAgent =
    activeLocks[0]?.ownerDisplay ||
    nextAgent.recommended_role ||
    nextAgent.recommended_agent ||
    "unassigned";
  const oneLineStatus =
    currentState.snapshot.current_focus ||
    latestHandoff.completed ||
    "현재 상태 요약이 아직 없습니다.";
  const oneLineStatusSource = currentState.snapshot.current_focus
    ? {
        path: ".agents/artifacts/CURRENT_STATE.md",
        label: "Snapshot > Current Focus"
      }
    : latestHandoff.completed
      ? {
          path: ".agents/artifacts/CURRENT_STATE.md",
          label: "Latest Handoff Summary > Completed"
        }
      : null;
  const nextAction =
    latestHandoff.first_next_action ||
    nextAgent.trigger_to_switch ||
    currentState.snapshot.document_health ||
    "";
  const nextActionSource = latestHandoff.first_next_action
    ? {
        path: ".agents/artifacts/CURRENT_STATE.md",
        label: "Latest Handoff Summary > First Next Action"
      }
    : nextAgent.trigger_to_switch
      ? {
          path: ".agents/artifacts/CURRENT_STATE.md",
          label: "Next Recommended Agent > Trigger To Switch"
        }
      : currentState.snapshot.document_health
        ? {
            path: ".agents/artifacts/CURRENT_STATE.md",
            label: "Snapshot > Document Health"
          }
        : null;

  return {
    projectDescription: projectDescription.value,
    projectDescriptionSource: {
      path: projectDescription.sourcePath,
      label: projectDescription.sourceLabel
    },
    oneLineStatus,
    oneLineStatusSource,
    currentStage: currentState.snapshot.current_stage || "",
    currentFocus: currentState.snapshot.current_focus || "",
    currentReleaseGoal: currentState.snapshot.current_release_goal || "",
    currentGreenLevel: currentState.snapshot.current_green_level || "",
    nextAction,
    nextActionSource,
    currentAgent,
    currentTask: primaryTask
      ? {
          id: primaryTask.id,
          title: primaryTask.title,
          ownerDisplay: primaryTask.ownerDisplay,
          status: primaryTask.status
        }
      : null,
    nextRecommendedAgent: nextAgent,
    openTaskCount: summary.openTasks,
    attentionCount: blockers.length
  };
}

function buildLocalShell(workspaceRepoRoot) {
  const launchScriptAbsolute = path.join(workspaceRepoRoot, PMW_LAUNCH_SCRIPT_PATH);
  const stopScriptAbsolute = path.join(workspaceRepoRoot, PMW_STOP_SCRIPT_PATH);

  return {
    launchScriptPath: PMW_LAUNCH_SCRIPT_PATH,
    stopScriptPath: PMW_STOP_SCRIPT_PATH,
    launchCommand: `powershell -ExecutionPolicy Bypass -File "${launchScriptAbsolute}"`,
    stopCommand: `powershell -ExecutionPolicy Bypass -File "${stopScriptAbsolute}"`,
    launchCommandLabel: "PowerShell launch command",
    stopCommandLabel: "PowerShell stop command"
  };
}

function buildProjectBoardTasks(boardTasks) {
  return boardTasks.filter((task) => task.stage && task.stage !== "Documentation and Closeout");
}

export async function buildDashboardSnapshot(repoRoot, options = {}) {
  const registry = await loadProjectRegistry(repoRoot);
  const projectContext = resolveProjectContext(registry, options.projectId);
  const projectRoot = projectContext.repoRoot;

  const [
    currentStateText,
    taskListText,
    requirementsText,
    architectureText,
    implementationText,
    historySource,
    uiDesignSource,
    teamRegistry,
    governanceControls,
    healthSnapshot,
    optionalSources
  ] = await Promise.all([
    readTextFile(projectRoot, MANDATORY_SOURCE_PATHS[0]),
    readTextFile(projectRoot, MANDATORY_SOURCE_PATHS[1]),
    readTextFile(projectRoot, MANDATORY_SOURCE_PATHS[2]),
    readTextFile(projectRoot, MANDATORY_SOURCE_PATHS[3]),
    readTextFile(projectRoot, MANDATORY_SOURCE_PATHS[4]),
    readOptionalTextFile(projectRoot, PROJECT_HISTORY_PATH),
    readOptionalTextFile(projectRoot, UI_DESIGN_PATH),
    loadTeamRegistry(projectRoot),
    loadGovernanceControls(projectRoot),
    loadHealthSnapshot(projectRoot),
    readOptionalSourceStatus(projectRoot)
  ]);

  const currentState = parseCurrentState(currentStateText);
  const taskList = parseTaskList(taskListText);
  const requirements = parseRequirements(requirementsText);
  const architecture = parseArchitectureGuide(architectureText);
  const implementationPlan = parseImplementationPlan(implementationText);
  const history = historySource.present
    ? {
        ...parseProjectHistory(historySource.text),
        warnings: []
      }
    : { entries: [], warnings: historySource.warning ? [historySource.warning] : [] };
  const uiDesign = uiDesignSource.present
    ? { present: true, ...parseUiDesign(uiDesignSource.text) }
    : {
        present: false,
        quickRead: [],
        currentUiScope: {},
        warnings: uiDesignSource.warning ? [uiDesignSource.warning] : []
      };

  const ownershipProjection = mergeTaskOwnership(
    taskList.tasks,
    taskList.locks,
    teamRegistry.members
  );

  const boardTasks = buildProjectBoardTasks(ownershipProjection.boardTasks);
  const blockers = uniqueBy(
    [...currentState.blockers, ...taskList.blockers],
    (item) => `${item.sourcePath}:${item.id}`
  );
  const summary = buildSummary(boardTasks, ownershipProjection.activeLocks, blockers);
  const primaryTask = findPrimaryTask(boardTasks, ownershipProjection.activeLocks);
  const historyEntries = buildHistoryView(history.entries).sort((left, right) =>
    String(right.date).localeCompare(String(left.date))
  );
  const projectDescription = buildProjectDescription(requirements, currentState);
  const riskSignals = buildRiskSignals({
    currentState,
    taskList,
    implementationPlan,
    governanceControls,
    blockers,
    teamRegistry
  });
  const decisionPackets = buildDecisionPackets({
    currentState,
    taskList,
    requirements,
    implementationPlan,
    historyEntries,
    riskSignals
  });

  const warnings = [
    ...currentState.warnings,
    ...taskList.warnings,
    ...requirements.warnings,
    ...architecture.warnings,
    ...implementationPlan.warnings,
    ...teamRegistry.warnings,
    ...governanceControls.warnings,
    ...healthSnapshot.warnings,
    ...registry.warnings,
    ...history.warnings,
    ...uiDesign.warnings
  ];

  return {
    generatedAt: new Date().toISOString(),
    workspaceRepoRoot: repoRoot,
    repoRoot: projectRoot,
    repoName: projectContext.label,
    projects: registry.projects.map((project) => ({
      id: project.id,
      label: project.label,
      repoRoot: project.repoRoot,
      isDefault: project.id === registry.defaultProjectId,
      isCurrent: project.id === projectContext.id,
      isWorkspace: project.isWorkspace,
      canDelete: project.canDelete
    })),
    projectRegistry: {
      path: PROJECT_REGISTRY_PATH,
      defaultProjectId: registry.defaultProjectId
    },
    projectContext: {
      id: projectContext.id,
      label: projectContext.label,
      repoRoot: projectContext.repoRoot,
      registryPath: registry.path
    },
    activeProfile: teamRegistry.activeProfile || "solo",
    activePacks: teamRegistry.activePacks || [],
    summary,
    release: {
      version: taskList.releaseTarget.version_milestone || "",
      stage: taskList.releaseTarget.current_stage || "",
      focus: taskList.releaseTarget.current_focus || "",
      goal: taskList.releaseTarget.current_release_goal || ""
    },
    header: buildCurrentStatus({
      currentState,
      projectDescription,
      primaryTask,
      activeLocks: ownershipProjection.activeLocks,
      summary,
      blockers
    }),
    overview: buildOverview({
      projectContext,
      requirements,
      architecture,
      implementationPlan,
      uiDesign,
      currentState,
      projectDescription,
      summary,
      blockers,
      historyEntries,
      boardTasks,
      riskSignals
    }),
    currentStateView: {
      snapshot: currentState.snapshot,
      latestHandoff: toEntryMap(currentState.latestHandoffSummary),
      nextRecommendedAgent: currentState.nextRecommendedAgent
    },
    currentIteration: implementationPlan.currentIteration,
    boardTasks,
    activeLocks: ownershipProjection.activeLocks,
    blockers,
    decisionPackets,
    recentActivity: buildActivity(taskList, historyEntries),
    history: historyEntries,
    documentHealth: buildDocumentHealth(
      currentState,
      implementationPlan,
      healthSnapshot,
      governanceControls,
      optionalSources,
      riskSignals
    ),
    teamDirectory: teamRegistry.members,
    teamRegistry: {
      path: teamRegistry.path,
      schemaVersion: teamRegistry.schemaVersion,
      activeProfile: teamRegistry.activeProfile,
      activePacks: teamRegistry.activePacks
    },
    governance: {
      path: governanceControls.path,
      validatorProfile: governanceControls.validatorProfile,
      protectedPaths: governanceControls.protectedPaths,
      sensitivePaths: governanceControls.sensitivePaths,
      humanReviewRequiredScopes: governanceControls.humanReviewRequiredScopes,
      criticalDomains: governanceControls.criticalDomains,
      toolAllowlist: governanceControls.toolAllowlist,
      toolDenylist: governanceControls.toolDenylist,
      exfiltrationSensitiveInputClasses:
        governanceControls.exfiltrationSensitiveInputClasses,
      sandboxPolicy: governanceControls.sandboxPolicy
    },
    operationalProfiles: requirements.operationalProfiles,
    profileRequirements: PROFILE_REQUIREMENTS,
    parserContract: architecture.parserContract,
    futureContracts: {
      healthSnapshotPath: HEALTH_SNAPSHOT_PATH,
      eventHooks: RESERVED_EVENT_HOOKS,
      promotionBoundary: PROMOTION_BOUNDARY,
      architectureHookContract: architecture.futureHookContract,
      architecturePromotionBoundary: architecture.promotionBoundary
    },
    localShell: buildLocalShell(repoRoot),
    optionalSources,
    sourceFiles: ALLOWED_SOURCE_PATHS,
    warnings
  };
}
