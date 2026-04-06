import {
  collectSectionWarnings,
  extractSection,
  parseBulletEntries,
  parseMarkdownTable
} from "./markdown-utils.js";

export function parseArchitectureGuide(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Status", "Status"],
      ["Artifact Parser Contract", "Artifact Parser Contract"],
      ["Team Registry Contract", "Team Registry Contract"]
    ],
    "ARCHITECTURE_GUIDE.md",
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
    parserContract: parseMarkdownTable(
      extractSection(markdown, "Artifact Parser Contract")
    ),
    teamRegistryContract: parseMarkdownTable(
      extractSection(markdown, "Team Registry Contract")
    ),
    warnings
  };
}
