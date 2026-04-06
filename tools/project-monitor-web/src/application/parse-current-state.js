import {
  collectSectionWarnings,
  extractSection,
  parseBulletEntries
} from "./markdown-utils.js";

function classifyBlocker(entry) {
  const source = `${entry.key} ${entry.value}`.toLowerCase();
  if (source.includes("사용자") || source.includes("approval")) {
    return "approval";
  }
  if (source.includes("manual")) {
    return "manual_gate";
  }
  if (source.includes("environment")) {
    return "environment_gate";
  }
  if (source.includes("stale")) {
    return "stale_lock";
  }
  return "general";
}

export function parseCurrentState(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Snapshot", "Snapshot"],
      ["Open Decisions / Blockers", "Open Decisions / Blockers"],
      ["Latest Handoff Summary", "Latest Handoff Summary"]
    ],
    "CURRENT_STATE.md",
    markdown
  );

  const snapshotEntries = parseBulletEntries(extractSection(markdown, "Snapshot"));
  const snapshot = snapshotEntries.reduce((accumulator, entry) => {
    accumulator[entry.keyNormalized] = entry.value;
    accumulator._labels = accumulator._labels || {};
    accumulator._labels[entry.keyNormalized] = entry.key;
    return accumulator;
  }, {});

  const blockerEntries = parseBulletEntries(
    extractSection(markdown, "Open Decisions / Blockers")
  ).filter((entry) => entry.value && entry.value.toLowerCase() !== "none");

  const blockers = blockerEntries.map((entry, index) => ({
    id: `current-state-${index + 1}`,
    category: classifyBlocker(entry),
    label: entry.key,
    value: entry.value,
    sourcePath: ".agents/artifacts/CURRENT_STATE.md"
  }));

  const handoffEntries = parseBulletEntries(
    extractSection(markdown, "Latest Handoff Summary")
  );

  return {
    snapshot,
    blockers,
    latestHandoffSummary: handoffEntries,
    warnings
  };
}
