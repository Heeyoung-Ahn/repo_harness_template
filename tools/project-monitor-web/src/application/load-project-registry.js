import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_REGISTRY_PATH = "tools/project-monitor-web/project-registry.json";

function defaultProjectEntry(repoRoot) {
  return {
    id: "self-hosting-template",
    label: path.basename(repoRoot),
    repoRoot
  };
}

export async function loadProjectRegistry(repoRoot) {
  const defaultEntry = defaultProjectEntry(repoRoot);
  const registryFilePath = path.join(repoRoot, PROJECT_REGISTRY_PATH);
  const registryDirectory = path.dirname(registryFilePath);

  try {
    const raw = await fs.readFile(registryFilePath, "utf8");
    const parsed = JSON.parse(raw);
    const projects = Array.isArray(parsed.projects)
      ? parsed.projects
          .filter((project) => project?.id && project?.label && project?.repoRoot)
          .map((project) => ({
            id: String(project.id),
            label: String(project.label),
            repoRoot: path.resolve(registryDirectory, String(project.repoRoot))
          }))
      : [];

    if (!projects.length) {
      return {
        path: PROJECT_REGISTRY_PATH,
        defaultProjectId: defaultEntry.id,
        projects: [defaultEntry],
        warnings: ["project-registry.json: no valid projects found, using current repo only"]
      };
    }

    const defaultProjectId =
      projects.find((project) => project.id === parsed.defaultProjectId)?.id ||
      projects[0].id;

    return {
      path: PROJECT_REGISTRY_PATH,
      defaultProjectId,
      projects,
      warnings: []
    };
  } catch {
    return {
      path: PROJECT_REGISTRY_PATH,
      defaultProjectId: defaultEntry.id,
      projects: [defaultEntry],
      warnings: []
    };
  }
}

export function resolveProjectContext(registry, requestedProjectId) {
  const requested = registry.projects.find((project) => project.id === requestedProjectId);
  const fallback =
    registry.projects.find((project) => project.id === registry.defaultProjectId) ||
    registry.projects[0];

  return requested || fallback;
}
