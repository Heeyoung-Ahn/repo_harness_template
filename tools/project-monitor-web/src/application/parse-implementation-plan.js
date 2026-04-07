import {
  collectSectionWarnings,
  extractSection,
  parseBulletEntries,
  parseMarkdownTable
} from "./markdown-utils.js";

export function parseImplementationPlan(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Status", "Status"],
      ["Current Iteration", "Current Iteration"],
      ["Validation Gates", "Validation Gates"]
    ],
    "IMPLEMENTATION_PLAN.md",
    markdown
  );

  const status = parseBulletEntries(extractSection(markdown, "Status")).reduce(
    (accumulator, entry) => {
      accumulator[entry.keyNormalized] = entry.value;
      return accumulator;
    },
    {}
  );

  const currentIteration = parseBulletEntries(
    extractSection(markdown, "Current Iteration")
  ).reduce((accumulator, entry) => {
    accumulator[entry.keyNormalized] = entry.value;
    return accumulator;
  }, {});

  const validationGates = (extractSection(markdown, "Validation Gates") || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());

  return {
    status,
    quickRead: parseBulletEntries(extractSection(markdown, "Quick Read")),
    currentIteration,
    requirementTrace: parseMarkdownTable(extractSection(markdown, "Requirement Trace")),
    taskPacketLedger: parseMarkdownTable(extractSection(markdown, "Task Packet Ledger")),
    validationGates,
    warnings
  };
}
