import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { URL } from "node:url";

import { ALLOWED_SOURCE_PATHS } from "../domain/contracts.js";
import { buildDashboardSnapshot } from "../application/build-dashboard-snapshot.js";
import {
  addProjectRegistryEntry,
  loadProjectRegistry,
  removeProjectRegistryEntry,
  resolveProjectContext
} from "../application/load-project-registry.js";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

async function serveStaticFile(response, filePath) {
  const extension = path.extname(filePath);
  const contents = await fs.readFile(filePath);
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[extension] || "application/octet-stream"
  });
  response.end(contents);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendMethodNotAllowed(response, allowedMethods) {
  response.writeHead(405, {
    Allow: allowedMethods.join(", "),
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(
    JSON.stringify(
      { error: `Method not allowed. Use ${allowedMethods.join(", ")}.` },
      null,
      2
    )
  );
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function serializeProjectRegistry(registry, currentProjectId = "") {
  return {
    generatedAt: new Date().toISOString(),
    registryPath: registry.path,
    defaultProjectId: registry.defaultProjectId,
    projects: registry.projects.map((project) => ({
      id: project.id,
      label: project.label,
      repoRoot: project.repoRoot,
      isDefault: project.id === registry.defaultProjectId,
      isCurrent: project.id === currentProjectId,
      isWorkspace: project.isWorkspace,
      canDelete: project.canDelete
    })),
    warnings: registry.warnings
  };
}

function resolveStaticPath(presentationRoot, pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const absolutePath = path.normalize(path.join(presentationRoot, relativePath));
  const relativeToRoot = path.relative(presentationRoot, absolutePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return absolutePath;
}

export function createProjectMonitorServer({ repoRoot, onStopRequested } = {}) {
  const presentationRoot = path.join(
    repoRoot,
    "tools",
    "project-monitor-web",
    "src",
    "presentation"
  );

  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, "http://localhost");
      const requestedProjectId = requestUrl.searchParams.get("project") || "";

      if (requestUrl.pathname === "/api/projects") {
        if (request.method === "GET") {
          const registry = await loadProjectRegistry(repoRoot);
          sendJson(response, 200, serializeProjectRegistry(registry, requestedProjectId));
          return;
        }

        if (request.method === "POST") {
          const payload = await readJsonBody(request);
          const registry = await addProjectRegistryEntry(repoRoot, payload);
          sendJson(response, 200, serializeProjectRegistry(registry, requestedProjectId));
          return;
        }

        if (request.method === "DELETE") {
          const projectId = requestUrl.searchParams.get("projectId") || "";
          const registry = await removeProjectRegistryEntry(repoRoot, projectId);
          sendJson(response, 200, serializeProjectRegistry(registry, requestedProjectId));
          return;
        }

        sendMethodNotAllowed(response, ["GET", "POST", "DELETE"]);
        return;
      }

      if (requestUrl.pathname === "/api/server/stop") {
        if (request.method !== "POST") {
          sendMethodNotAllowed(response, ["POST"]);
          return;
        }

        if (!onStopRequested) {
          sendJson(response, 501, {
            error: "Server stop is not available in this runtime."
          });
          return;
        }

        sendJson(response, 202, {
          status: "accepted",
          detail: "Project Monitor Web stop was requested."
        });
        setTimeout(() => onStopRequested(), 80);
        return;
      }

      if (requestUrl.pathname === "/api/snapshot") {
        const snapshot = await buildDashboardSnapshot(repoRoot, {
          projectId: requestedProjectId
        });
        sendJson(response, 200, snapshot);
        return;
      }

      if (requestUrl.pathname === "/api/file") {
        const relativePath = requestUrl.searchParams.get("path") || "";
        const sourceScope = requestUrl.searchParams.get("scope") || "project";
        if (!ALLOWED_SOURCE_PATHS.includes(relativePath)) {
          sendJson(response, 400, { error: "Path is not allowed." });
          return;
        }

        const registry = await loadProjectRegistry(repoRoot);
        const projectContext =
          sourceScope === "workspace"
            ? { repoRoot }
            : resolveProjectContext(registry, requestedProjectId);
        const absolutePath = path.join(projectContext.repoRoot, relativePath);
        const contents = await fs.readFile(absolutePath, "utf8");
        response.writeHead(200, {
          "Content-Type":
            MIME_TYPES[path.extname(relativePath)] || "text/plain; charset=utf-8"
        });
        response.end(contents);
        return;
      }

      const staticPath = resolveStaticPath(presentationRoot, requestUrl.pathname);
      if (!staticPath) {
        sendJson(response, 404, { error: "File not found." });
        return;
      }

      await serveStaticFile(response, staticPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        sendJson(response, 404, { error: "File not found." });
        return;
      }

      sendJson(response, 500, {
        error: "Project Monitor Web failed to serve the request.",
        detail: error.message
      });
    }
  });
}
