export function parseProjectHistory(markdown) {
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  let currentDate = "";
  let currentEntry = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const dateMatch = line.match(/^###\s+(.+)$/);
    if (dateMatch) {
      currentDate = dateMatch[1].trim();
      continue;
    }

    const entryMatch = line.match(/^####\s+(.+)$/);
    if (entryMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }

      currentEntry = {
        date: currentDate,
        title: entryMatch[1].trim(),
        summary: "",
        why: "",
        impact: "",
        related: "",
        sourcePath: ".agents/artifacts/PROJECT_HISTORY.md"
      };
      continue;
    }

    if (!currentEntry || !line.startsWith("- ")) {
      continue;
    }

    const content = line.slice(2).trim();
    const separatorIndex = content.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = content.slice(0, separatorIndex).trim().toLowerCase();
    const value = content.slice(separatorIndex + 1).trim();

    if (key === "summary") {
      currentEntry.summary = value;
    } else if (key === "why") {
      currentEntry.why = value;
    } else if (key === "impact") {
      currentEntry.impact = value;
    } else if (key === "related") {
      currentEntry.related = value;
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return {
    entries
  };
}
