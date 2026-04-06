function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeKey(value) {
  return value
    .toLowerCase()
    .replace(/[`']/g, "")
    .replace(/[/()]/g, " ")
    .replace(/[^a-z0-9가-힣]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function extractSection(markdown, heading, level = 2) {
  const lines = markdown.split(/\r?\n/);
  const marker = `${"#".repeat(level)} ${heading}`;
  const nextMarker = new RegExp(`^#{1,${level}}\\s+`);
  const start = lines.findIndex((line) => line.trim() === marker);
  if (start === -1) {
    return null;
  }

  const sectionLines = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (nextMarker.test(line)) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

export function parseBulletEntries(sectionText) {
  if (!sectionText) {
    return [];
  }

  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const content = line.slice(2).trim();
      const separatorIndex = content.indexOf(":");
      if (separatorIndex === -1) {
        return {
          key: content,
          keyNormalized: normalizeKey(content),
          value: ""
        };
      }

      const label = content.slice(0, separatorIndex).trim();
      return {
        key: label,
        keyNormalized: normalizeKey(label),
        value: content.slice(separatorIndex + 1).trim()
      };
    });
}

export function parseMarkdownTable(sectionText) {
  if (!sectionText) {
    return [];
  }

  const lines = sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (lines.length < 3) {
    return [];
  }

  const headers = lines[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());

  return lines.slice(2).map((line) => {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    return headers.reduce((row, header, index) => {
      row[normalizeKey(header)] = cells[index] || "";
      row._rawHeaderMap = row._rawHeaderMap || {};
      row._rawHeaderMap[normalizeKey(header)] = header;
      return row;
    }, {});
  });
}

export function parseCheckboxStatus(marker) {
  switch (marker) {
    case "x":
      return "done";
    case "-":
      return "in_progress";
    case "!":
      return "blocked";
    default:
      return "pending";
  }
}

export function parseTaskLine(line) {
  const match = line.match(/^- \[(?<marker>[ x!\-])\] (?<id>[A-Z]+-\d+) (?<title>.+?)(?: — Scope: (?<scope>.+))?$/);
  if (!match) {
    return null;
  }

  return {
    status: parseCheckboxStatus(match.groups.marker.trim()),
    id: match.groups.id.trim(),
    title: match.groups.title.trim(),
    scope: match.groups.scope ? match.groups.scope.trim() : "",
    raw: line
  };
}

export function collectSectionWarnings(requiredSections, fileLabel, markdown) {
  const warnings = [];
  for (const [heading, label] of requiredSections) {
    if (!extractSection(markdown, heading)) {
      warnings.push(`${fileLabel}: missing section "${label || heading}"`);
    }
  }
  return warnings;
}

export function parseBracketedLogLine(line) {
  const match = line.match(/^- \[(?<date>[^\]]+)\]\s+(?<message>.+)$/);
  if (!match) {
    return null;
  }

  return {
    date: match.groups.date.trim(),
    message: match.groups.message.trim()
  };
}
