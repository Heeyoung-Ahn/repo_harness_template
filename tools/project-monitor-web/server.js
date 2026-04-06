import path from "node:path";
import { fileURLToPath } from "node:url";

import { createProjectMonitorServer } from "./src/infrastructure/http-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.PROJECT_MONITOR_REPO_ROOT
  ? path.resolve(process.env.PROJECT_MONITOR_REPO_ROOT)
  : path.resolve(__dirname, "..", "..");
const port = Number(process.env.PORT || 4173);

const server = createProjectMonitorServer({ repoRoot, port });
server.listen(port, () => {
  console.log(`[project-monitor-web] listening on http://localhost:${port}`);
  console.log(`[project-monitor-web] repo root: ${repoRoot}`);
});
