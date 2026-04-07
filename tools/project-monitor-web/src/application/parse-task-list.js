import {
  collectSectionWarnings,
  extractSection,
  parseBracketedLogLine,
  parseBulletEntries,
  parseMarkdownTable,
  parseTaskLine
} from "./markdown-utils.js";

function normalizeLockRow(row) {
  return {
    taskId: row.task_id,
    owner: row.owner,
    role: row.role,
    startedAt: row.started_at,
    scope: row.scope,
    note: row.note
  };
}

export function parseTaskList(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Current Release Target", "Current Release Target"],
      ["Active Locks", "Active Locks"],
      ["Handoff Log", "Handoff Log"]
    ],
    "TASK_LIST.md",
    markdown
  );

  const releaseTarget = parseBulletEntries(
    extractSection(markdown, "Current Release Target")
  ).reduce((accumulator, entry) => {
    accumulator[entry.keyNormalized] = entry.value;
    return accumulator;
  }, {});

  const lockRows = parseMarkdownTable(extractSection(markdown, "Active Locks"));
  const locks = lockRows
    .filter((row) => row.task_id)
    .map(normalizeLockRow);

  const handoffLog = (extractSection(markdown, "Handoff Log") || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map(parseBracketedLogLine)
    .filter(Boolean);

  const blockerRows = parseMarkdownTable(extractSection(markdown, "Blockers"));
  const blockers = blockerRows
    .filter((row) => row.id)
    .map((row) => ({
      id: row.id,
      category: row.category || "general",
      impact: row.impact || "",
      observedSymptom: row.observed_symptom || "",
      attemptedRecovery: row.attempted_recovery || "",
      nextEscalation: row.next_escalation || "",
      label: row.id,
      value: row.observed_symptom || row.next_escalation || row.category || "",
      sourcePath: ".agents/artifacts/TASK_LIST.md"
    }));

  const tasks = [];
  let currentStage = "";
  let currentIteration = "";
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const stageMatch = line.match(/^## Workflow Stage:\s+(.+)$/);
    if (stageMatch) {
      currentStage = stageMatch[1].trim();
      currentIteration = "";
      continue;
    }

    const iterationMatch = line.match(/^###\s+(.+)$/);
    if (iterationMatch) {
      currentIteration = iterationMatch[1].trim();
      continue;
    }

    const parsedTask = parseTaskLine(line);
    if (!parsedTask) {
      continue;
    }

    tasks.push({
      ...parsedTask,
      stage: currentStage,
      iteration: currentIteration,
      sourcePath: ".agents/artifacts/TASK_LIST.md"
    });
  }

  return {
    releaseTarget,
    locks,
    tasks,
    blockers,
    handoffLog,
    warnings
  };
}
