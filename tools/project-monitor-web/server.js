import path from "node:path";
import fs from "node:fs/promises";
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
const runtimeDir = path.join(__dirname, "runtime");
const pidFile = path.join(runtimeDir, "project-monitor-web.pid");

let server;
server = createProjectMonitorServer({
  repoRoot,
  port,
  onStopRequested: async () => {
    await fs.rm(pidFile, { force: true }).catch(() => {});
    server.close(() => {
      process.exit(0);
    });
  }
});
server.on("error", (error) => {
  console.error(`[project-monitor-web] server error: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`[project-monitor-web] listening on http://${displayHost}:${port}`);
  console.log(`[project-monitor-web] repo root: ${repoRoot}`);
  console.log(`[project-monitor-web] bind host: ${host}`);
});
