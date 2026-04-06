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
      ["Domain Map", "Domain Map"],
      ["Artifact Parser Contract", "Artifact Parser Contract"],
      ["Team Registry Contract", "Team Registry Contract"],
      ["Future Hook Contract", "Future Hook Contract"],
      ["Promotion Boundary", "Promotion Boundary"]
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
    futureHookContract: parseMarkdownTable(
      extractSection(markdown, "Future Hook Contract")
    ),
    promotionBoundary: parseMarkdownTable(
      extractSection(markdown, "Promotion Boundary")
    ),
    warnings
  };
}
