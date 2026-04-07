import {
  collectSectionWarnings,
  extractSection,
  parseListItems,
  parseBulletEntries,
  parseMarkdownTable
} from "./markdown-utils.js";

export function parseRequirements(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Status", "Status"],
      ["Operational Profiles", "Operational Profiles"],
      ["Functional Requirements", "Functional Requirements"]
    ],
    "REQUIREMENTS.md",
    markdown
  );

  const status = parseBulletEntries(extractSection(markdown, "Status")).reduce(
    (accumulator, entry) => {
      accumulator[entry.keyNormalized] = entry.value;
      return accumulator;
    },
    {}
  );

  return {
    status,
    quickRead: parseBulletEntries(extractSection(markdown, "Quick Read")),
    openQuestions: parseListItems(extractSection(markdown, "Open Questions")),
    productGoal: parseListItems(extractSection(markdown, "Product Goal"), {
      includeNumbered: true
    }),
    pendingChangeRequests: parseMarkdownTable(
      extractSection(markdown, "Pending Change Requests")
    ),
    operationalProfiles: parseMarkdownTable(
      extractSection(markdown, "Operational Profiles")
    ),
    functionalRequirements: parseMarkdownTable(
      extractSection(markdown, "Functional Requirements")
    ),
    warnings
  };
}
