import path from "node:path";
import { fileURLToPath } from "node:url";

import { createProjectMonitorServer } from "./src/infrastructure/http-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.PROJECT_MONITOR_REPO_ROOT
  ? path.resolve(process.env.PROJECT_MONITOR_REPO_ROOT)
  : path.resolve(__dirname, "..", "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.PROJECT_MONITOR_HOST || "127.0.0.1";
const displayHost = host.includes(":") ? `[${host}]` : host;

const server = createProjectMonitorServer({ repoRoot, port });
server.listen(port, host, () => {
  console.log(`[project-monitor-web] listening on http://${displayHost}:${port}`);
  console.log(`[project-monitor-web] repo root: ${repoRoot}`);
  console.log(`[project-monitor-web] bind host: ${host}`);
});
