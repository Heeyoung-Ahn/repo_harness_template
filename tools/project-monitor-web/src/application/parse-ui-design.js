import {
  collectSectionWarnings,
  extractSection,
  parseBulletEntries
} from "./markdown-utils.js";

export function parseUiDesign(markdown) {
  const warnings = collectSectionWarnings(
    [
      ["Quick Read", "Quick Read"],
      ["Current UI Scope", "Current UI Scope"],
      ["Screen Specs", "Screen Specs"]
    ],
    "UI_DESIGN.md",
    markdown
  );

  const currentUiScope = parseBulletEntries(
    extractSection(markdown, "Current UI Scope")
  ).reduce((accumulator, entry) => {
    accumulator[entry.keyNormalized] = entry.value;
    return accumulator;
  }, {});

  return {
    quickRead: parseBulletEntries(extractSection(markdown, "Quick Read")),
    currentUiScope,
    warnings
  };
}
