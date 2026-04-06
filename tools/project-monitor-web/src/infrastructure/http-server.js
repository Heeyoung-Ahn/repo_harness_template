import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { URL } from "node:url";

import { ALLOWED_SOURCE_PATHS } from "../domain/contracts.js";
import { buildDashboardSnapshot } from "../application/build-dashboard-snapshot.js";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8"
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

function resolveStaticPath(presentationRoot, pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const absolutePath = path.normalize(path.join(presentationRoot, relativePath));
  const relativeToRoot = path.relative(presentationRoot, absolutePath);

  if (
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    return null;
  }

  return absolutePath;
}

export function createProjectMonitorServer({ repoRoot }) {
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

      if (requestUrl.pathname === "/api/snapshot") {
        const snapshot = await buildDashboardSnapshot(repoRoot);
        sendJson(response, 200, snapshot);
        return;
      }

      if (requestUrl.pathname === "/api/file") {
        const relativePath = requestUrl.searchParams.get("path") || "";
        if (!ALLOWED_SOURCE_PATHS.includes(relativePath)) {
          sendJson(response, 400, { error: "Path is not allowed." });
          return;
        }

        const absolutePath = path.join(repoRoot, relativePath);
        const contents = await fs.readFile(absolutePath, "utf8");
        response.writeHead(200, {
          "Content-Type": MIME_TYPES[path.extname(relativePath)] || "text/plain; charset=utf-8"
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
