import fs from "node:fs/promises";
import path from "node:path";

import {
  MANDATORY_SOURCE_PATHS,
  PROJECT_REGISTRY_PATH
} from "../domain/contracts.js";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultProjectEntry(repoRoot) {
  return {
    id: "self-hosting-template",
    label: path.basename(repoRoot),
    repoRoot: path.resolve(repoRoot)
  };
}

function serializeRelativePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath) || ".";
  return relativePath.split(path.sep).join("/");
}

function normalizeProjectEntry(project, registryDirectory, workspaceRoot) {
  const repoRoot = path.resolve(registryDirectory, String(project.repoRoot));
  const isWorkspace = path.resolve(workspaceRoot) === repoRoot;

  return {
    id: String(project.id),
    label: String(project.label),
    repoRoot,
    isWorkspace,
    canDelete: !isWorkspace
  };
}

async function readRegistryConfig(repoRoot) {
  const registryFilePath = path.join(repoRoot, PROJECT_REGISTRY_PATH);
  const registryDirectory = path.dirname(registryFilePath);
  const workspaceRoot = path.resolve(repoRoot);
  const defaultEntry = defaultProjectEntry(workspaceRoot);

  try {
    const raw = await fs.readFile(registryFilePath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      path: PROJECT_REGISTRY_PATH,
      filePath: registryFilePath,
      registryDirectory,
      workspaceRoot,
      defaultEntry,
      parsed,
      parsedProjects: Array.isArray(parsed.projects) ? parsed.projects : []
    };
  } catch {
    return {
      path: PROJECT_REGISTRY_PATH,
      filePath: registryFilePath,
      registryDirectory,
      workspaceRoot,
      defaultEntry,
      parsed: {
        defaultProjectId: defaultEntry.id,
        projects: [
          {
            id: defaultEntry.id,
            label: defaultEntry.label,
            repoRoot: serializeRelativePath(registryDirectory, defaultEntry.repoRoot)
          }
        ]
      },
      parsedProjects: [
        {
          id: defaultEntry.id,
          label: defaultEntry.label,
          repoRoot: serializeRelativePath(registryDirectory, defaultEntry.repoRoot)
        }
      ]
    };
  }
}

function materializeRegistry(config) {
  const projects = config.parsedProjects
    .filter((project) => project?.id && project?.label && project?.repoRoot)
    .map((project) =>
      normalizeProjectEntry(project, config.registryDirectory, config.workspaceRoot)
    );

  const normalizedProjects = projects.length
    ? projects
    : [
        {
          ...config.defaultEntry,
          isWorkspace: true,
          canDelete: false
        }
      ];

  const defaultProjectId =
    normalizedProjects.find(
      (project) => project.id === String(config.parsed.defaultProjectId || "")
    )?.id || normalizedProjects[0].id;

  return {
    path: config.path,
    filePath: config.filePath,
    registryDirectory: config.registryDirectory,
    workspaceRoot: config.workspaceRoot,
    defaultProjectId,
    projects: normalizedProjects,
    warnings: projects.length
      ? []
      : ["project-registry.json: no valid projects found, using current repo only"]
  };
}

async function writeRegistry(workspaceRoot, registry) {
  const config = await readRegistryConfig(workspaceRoot);
  const payload = {
    defaultProjectId: registry.defaultProjectId,
    projects: registry.projects.map((project) => ({
      id: project.id,
      label: project.label,
      repoRoot: serializeRelativePath(config.registryDirectory, project.repoRoot)
    }))
  };

  const output = `${JSON.stringify(payload, null, 2)}\n`;
  await fs.mkdir(config.registryDirectory, { recursive: true });
  await fs.writeFile(config.filePath, output, "utf8");
}

async function ensureProjectSources(repoRoot) {
  const resolvedRoot = path.resolve(String(repoRoot || ""));
  const stats = await fs.stat(resolvedRoot);

  if (!stats.isDirectory()) {
    throw new Error("repoRoot must point to a directory.");
  }

  for (const relativePath of MANDATORY_SOURCE_PATHS) {
    await fs.access(path.join(resolvedRoot, relativePath));
  }

  return resolvedRoot;
}

function ensureUniqueProjectId(candidateId, existingIds) {
  const baseId = slugify(candidateId) || "project";
  let nextId = baseId;
  let suffix = 2;

  while (existingIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return nextId;
}

export async function loadProjectRegistry(repoRoot) {
  const config = await readRegistryConfig(repoRoot);
  return materializeRegistry(config);
}

export async function addProjectRegistryEntry(
  repoRoot,
  { label = "", repoRoot: nextRepoRoot = "", setDefault = false } = {}
) {
  if (!String(nextRepoRoot || "").trim()) {
    throw new Error("repoRoot is required.");
  }

  const registry = await loadProjectRegistry(repoRoot);
  const resolvedRepoRoot = await ensureProjectSources(nextRepoRoot);
  const existingIds = new Set(registry.projects.map((project) => project.id));
  const existingPath = registry.projects.find(
    (project) => path.resolve(project.repoRoot) === resolvedRepoRoot
  );

  if (existingPath) {
    throw new Error("That project is already registered.");
  }

  const projectLabel = String(label || path.basename(resolvedRepoRoot)).trim();
  const nextProjectId = ensureUniqueProjectId(projectLabel, existingIds);
  const nextProject = normalizeProjectEntry(
    {
      id: nextProjectId,
      label: projectLabel,
      repoRoot: resolvedRepoRoot
    },
    path.dirname(path.join(repoRoot, PROJECT_REGISTRY_PATH)),
    repoRoot
  );

  const nextRegistry = {
    ...registry,
    defaultProjectId: setDefault ? nextProject.id : registry.defaultProjectId,
    projects: [...registry.projects, nextProject]
  };

  await writeRegistry(repoRoot, nextRegistry);
  return loadProjectRegistry(repoRoot);
}

export async function removeProjectRegistryEntry(repoRoot, projectId) {
  const registry = await loadProjectRegistry(repoRoot);
  const target = registry.projects.find((project) => project.id === String(projectId || ""));

  if (!target) {
    throw new Error("The requested project was not found.");
  }

  if (target.isWorkspace) {
    throw new Error("The current workspace project cannot be removed.");
  }

  const remainingProjects = registry.projects.filter(
    (project) => project.id !== target.id
  );
  const fallbackDefault =
    remainingProjects.find((project) => project.id === registry.defaultProjectId)?.id ||
    remainingProjects[0]?.id ||
    defaultProjectEntry(repoRoot).id;

  const nextRegistry = {
    ...registry,
    defaultProjectId: fallbackDefault,
    projects: remainingProjects
  };

  await writeRegistry(repoRoot, nextRegistry);
  return loadProjectRegistry(repoRoot);
}

export function resolveProjectContext(registry, requestedProjectId) {
  const requested = registry.projects.find((project) => project.id === requestedProjectId);
  const fallback =
    registry.projects.find((project) => project.id === registry.defaultProjectId) ||
    registry.projects[0];

  return requested || fallback;
}
