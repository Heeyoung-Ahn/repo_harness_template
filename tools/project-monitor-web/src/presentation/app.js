const MENU_ITEMS = [
  { id: "overview", label: "Project Overview" },
  { id: "current-state", label: "Current State" },
  { id: "board", label: "Project Board" },
  { id: "task-detail", label: "Task Detail" },
  { id: "blockers", label: "Blocker / Approval Queue" },
  { id: "activity", label: "Recent Activity" },
  { id: "projects", label: "Project Registry" },
  { id: "history", label: "Project History" },
  { id: "health", label: "Document Health" },
  { id: "team", label: "Team Registry" }
];

const state = {
  snapshot: null,
  activeView: "overview",
  currentProjectId: "",
  selectedTaskId: "",
  selectedPacketId: "",
  selectedHistoryId: "",
  detail: null,
  notice: "",
  filters: {
    profileLens: "all",
    owner: "all",
    status: "all"
  }
};

const elements = {
  appHeader: document.querySelector("#app-header"),
  warnings: document.querySelector("#warnings"),
  navigation: document.querySelector("#navigation"),
  dashboard: document.querySelector("#dashboard"),
  contentHeading: document.querySelector("#content-heading"),
  contentMeta: document.querySelector("#content-meta"),
  content: document.querySelector("#content"),
  drawer: document.querySelector("#drawer"),
  drawerTitle: document.querySelector("#drawer-title"),
  drawerContent: document.querySelector("#drawer-content")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusLabel(status) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "blocked":
      return "Blocked";
    case "done":
      return "Done";
    default:
      return "Pending";
  }
}

function prettyCategory(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildSourceLink(path, label = path, scope = "project") {
  const scopeQuery = scope === "workspace" ? "scope=workspace&" : "";
  const projectQuery =
    scope === "workspace"
      ? ""
      : state.currentProjectId
        ? `project=${encodeURIComponent(state.currentProjectId)}&`
        : "";
  return `<a class="source-link" href="/api/file?${scopeQuery}${projectQuery}path=${encodeURIComponent(path)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function percentLabel(value) {
  return `${Number(value || 0)}%`;
}

function renderSourceHint(source, scope = "project") {
  if (!source?.path || !source?.label) {
    return "";
  }

  return `<div class="source-hint">Source ${buildSourceLink(source.path, source.label, scope)}</div>`;
}

async function requestJson(url, options = {}) {
  const requestOptions = {
    headers: {},
    ...options
  };

  if (options.body && !requestOptions.headers["Content-Type"]) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, requestOptions);
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || payload?.detail || `Request failed: ${response.status}`);
  }

  return payload;
}

async function copyToClipboard(text, successMessage) {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API is not available in this browser.");
  }

  await navigator.clipboard.writeText(text);
  state.notice = successMessage;

  if (state.snapshot) {
    renderWarnings(state.snapshot);
  }
}

function buildIndices(snapshot) {
  state.indices = {
    task: new Map(snapshot.boardTasks.map((task) => [task.id, task])),
    blocker: new Map(snapshot.blockers.map((blocker) => [blocker.id, blocker])),
    packet: new Map(snapshot.decisionPackets.map((packet) => [packet.id, packet])),
    activity: new Map(snapshot.recentActivity.map((item) => [item.id, item])),
    history: new Map(snapshot.history.map((entry) => [entry.id, entry])),
    team: new Map(snapshot.teamDirectory.map((member) => [member.id, member]))
  };
}

function ensureSelection(snapshot) {
  if (!state.currentProjectId) {
    state.currentProjectId = snapshot.projectContext.id;
  }

  if (!state.selectedTaskId && snapshot.header.currentTask?.id) {
    state.selectedTaskId = snapshot.header.currentTask.id;
  }

  if (!state.selectedPacketId && snapshot.decisionPackets.length) {
    state.selectedPacketId = snapshot.decisionPackets[0].id;
  }

  if (!state.selectedHistoryId && snapshot.history.length) {
    state.selectedHistoryId = snapshot.history[0].id;
  }
}

function filteredTasks() {
  if (!state.snapshot) {
    return [];
  }

  return state.snapshot.boardTasks.filter((task) => {
    if (state.filters.owner !== "all" && task.ownerId !== state.filters.owner) {
      return false;
    }

    if (state.filters.status !== "all" && task.status !== state.filters.status) {
      return false;
    }

    return true;
  });
}

function getMissingFields(task, profileLens) {
  const requiredFields = state.snapshot?.profileRequirements?.[profileLens] || [];
  if (!requiredFields.length) {
    return [];
  }

  return requiredFields.filter((field) => {
    if (field === "owner") {
      return !task.ownerDisplay;
    }
    if (field === "updated_at") {
      return !task.updatedAt;
    }
    return !task[field];
  });
}

function cardClass(active) {
  return active ? "dashboard-card is-active" : "dashboard-card";
}

function navClass(viewId) {
  return state.activeView === viewId ? "nav-button is-active" : "nav-button";
}

function renderHeader(snapshot) {
  elements.appHeader.innerHTML = `
    <div class="header-main">
      <div class="brand-copy">
        <p class="eyebrow">Project Monitor Web</p>
        <h1>${escapeHtml(snapshot.projectContext.label)}</h1>
        <p class="header-goal">${escapeHtml(snapshot.header.projectDescription)}</p>
        ${renderSourceHint(snapshot.header.projectDescriptionSource)}
      </div>

      <div class="header-controls">
        <div class="control-cluster">
          <label class="project-picker">
            <span>Project</span>
            <select id="project-selector">
              ${snapshot.projects
                .map(
                  (project) => `
                    <option value="${escapeHtml(project.id)}"${project.isCurrent ? " selected" : ""}>
                      ${escapeHtml(project.label)}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>
          <div class="header-actions">
            <button class="ghost-button" type="button" data-view="projects">Projects</button>
            <button class="ghost-button" type="button" data-refresh="true">Refresh</button>
            <button class="ghost-button" type="button" data-stop-server="true">Stop Server</button>
            <button class="ghost-button ghost-button-strong" type="button" data-exit="true">Exit</button>
          </div>
        </div>
        <div class="header-meta-row">
          <span class="status-chip">${escapeHtml(snapshot.release.stage || "Unknown Stage")}</span>
          <span class="muted-label">${escapeHtml(snapshot.activeProfile)}</span>
          <span class="muted-label">${escapeHtml(snapshot.generatedAt)}</span>
        </div>
      </div>
    </div>

    <div class="headline-strip">
      <article class="headline-card">
        <span class="headline-label">One-line status</span>
        <strong>${escapeHtml(snapshot.header.oneLineStatus)}</strong>
        ${renderSourceHint(snapshot.header.oneLineStatusSource)}
      </article>
      <article class="headline-card">
        <span class="headline-label">Next action</span>
        <strong>${escapeHtml(snapshot.header.nextAction || "다음 action이 아직 없습니다.")}</strong>
        ${renderSourceHint(snapshot.header.nextActionSource)}
      </article>
    </div>
  `;
}

function renderWarnings(snapshot) {
  const warningBlocks = [];

  if (state.notice) {
    warningBlocks.push(`
      <div class="warning-banner info">
        <strong>Notice</strong>
        <div>${escapeHtml(state.notice)}</div>
      </div>
    `);
  }

  for (const warning of snapshot.warnings || []) {
    warningBlocks.push(`
      <div class="warning-banner">
        <strong>Parse Warning</strong>
        <div>${escapeHtml(warning)}</div>
      </div>
    `);
  }

  elements.warnings.innerHTML = warningBlocks.join("");
}

function renderNavigation() {
  elements.navigation.innerHTML = `
    <div class="nav-card">
      <p class="eyebrow">Workspace Menu</p>
      <div class="nav-list">
        ${MENU_ITEMS.map(
          (item) => `
            <button type="button" class="${navClass(item.id)}" data-view="${escapeHtml(item.id)}">
              ${escapeHtml(item.label)}
            </button>
          `
        ).join("")}
      </div>
    </div>
  `;
}

function renderDashboard(snapshot) {
  const currentTask = snapshot.header.currentTask;
  const cards = [
    {
      title: "Current Stage",
      value: snapshot.release.stage || "Unknown",
      meta: snapshot.release.focus || snapshot.release.goal || "Focus unavailable",
      view: "current-state"
    },
    {
      title: "Open Tasks",
      value: String(snapshot.summary.openTasks),
      meta: `${snapshot.summary.activeLocks} active locks`,
      view: "board"
    },
    {
      title: "Attention Queue",
      value: String(snapshot.decisionPackets.length),
      meta: `${snapshot.summary.pendingApprovals} approvals / manual gates`,
      view: "blockers"
    },
    {
      title: "Progress",
      value: percentLabel(snapshot.summary.progressPercent),
      meta: `${snapshot.summary.done} / ${snapshot.summary.total} complete`,
      view: "overview"
    },
    {
      title: "Current Agent",
      value: snapshot.header.currentAgent || "Unassigned",
      meta: snapshot.header.nextRecommendedAgent.reason || "Current agent summary",
      view: "current-state"
    },
    {
      title: "Current Task",
      value: currentTask?.id || "None",
      meta: currentTask?.title || "선택된 task가 없습니다.",
      view: "task-detail"
    },
    {
      title: "Next Action",
      value: snapshot.header.nextAction || "None",
      meta: snapshot.header.nextActionSource?.label || "Current State",
      view: "current-state"
    },
    {
      title: "Document Health",
      value: snapshot.documentHealth.summary || "Unknown",
      meta: `${snapshot.documentHealth.signalSummary.active} active / ${snapshot.documentHealth.signalSummary.watch} watch`,
      view: "health"
    }
  ];

  elements.dashboard.innerHTML = cards
    .map(
      (card) => `
        <button type="button" class="${cardClass(state.activeView === card.view)} dashboard-chip" data-view="${escapeHtml(card.view)}">
          <span class="dashboard-label">${escapeHtml(card.title)}</span>
          <strong class="dashboard-value">${escapeHtml(card.value)}</strong>
          <span class="dashboard-meta">${escapeHtml(card.meta)}</span>
        </button>
      `
    )
    .join("");
}

function formatSignalStatus(status) {
  switch (status) {
    case "active":
      return "Active";
    case "watch":
      return "Watch";
    default:
      return "Clear";
  }
}

function renderRiskSignalCards(signals) {
  if (!signals.length) {
    return `<div class="empty-state">현재 추가 주의 signal이 없습니다.</div>`;
  }

  return `<div class="stack-list">${signals
    .map(
      (signal) => `
        <article class="list-card compact">
          <div class="queue-item-header">
            <span class="info-pill">${escapeHtml(signal.label)}</span>
            <span class="subtle">${escapeHtml(formatSignalStatus(signal.status))}</span>
          </div>
          <div class="subtle">${escapeHtml(signal.detail)}</div>
          ${
            signal.sourceLinks?.length
              ? `<div class="source-stack">${signal.sourceLinks
                  .map((item) => buildSourceLink(item.path, item.label))
                  .join("")}</div>`
              : ""
          }
        </article>
      `
    )
    .join("")}</div>`;
}

function renderOverview(snapshot) {
  const overview = snapshot.overview;

  return `
    <div class="overview-grid">
      <section class="content-card hero-summary">
        <div class="section-head">
          <div>
            <p class="eyebrow">Project Summary</p>
            <h3>${escapeHtml(overview.projectName)}</h3>
          </div>
          <div class="summary-stat">
            <span>Progress</span>
            <strong>${percentLabel(overview.taskProgress.progressPercent)}</strong>
          </div>
        </div>
        <p class="lead-copy">${escapeHtml(overview.goalSummary)}</p>
        ${renderSourceHint(overview.goalSummarySource)}
        <div class="pill-row">
          <span class="info-pill">${escapeHtml(snapshot.activeProfile)}</span>
          ${snapshot.activePacks
            .map((pack) => `<span class="info-pill">${escapeHtml(pack)}</span>`)
            .join("")}
          <span class="info-pill">Open Tasks ${escapeHtml(String(snapshot.summary.openTasks))}</span>
        </div>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Product Goal</p>
            <h3>What This Project Must Solve</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/REQUIREMENTS.md", "REQUIREMENTS.md")}</div>
        </div>
        ${overview.productGoal.length
          ? `<ol class="ordered-list">${overview.productGoal
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ol>`
          : `<div class="empty-state">Product Goal이 아직 비어 있습니다.</div>`}
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Open Questions</p>
            <h3>What Still Needs a Decision</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/REQUIREMENTS.md", "Open Questions")}</div>
        </div>
        ${overview.openQuestions.length
          ? `<ul class="bullet-list">${overview.openQuestions
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>`
          : `<div class="empty-state">열린 질문이 없습니다.</div>`}
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Architecture</p>
            <h3>Guide Summary</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/ARCHITECTURE_GUIDE.md", "ARCHITECTURE_GUIDE.md")}</div>
        </div>
        <ul class="bullet-list">${overview.architectureSummary
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Implementation</p>
            <h3>Plan Summary</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/IMPLEMENTATION_PLAN.md", "IMPLEMENTATION_PLAN.md")}</div>
        </div>
        <ul class="bullet-list">${overview.implementationSummary
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Design Mockup</p>
            <h3>UI Baseline</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/UI_DESIGN.md", "UI_DESIGN.md")}</div>
        </div>
        ${
          overview.designMockup.present
            ? `<ul class="bullet-list">${overview.designMockup.summary
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul>`
            : `<div class="empty-state">UI design source가 아직 없습니다.</div>`
        }
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Task Progress</p>
            <h3>Overall Workload</h3>
          </div>
          <button type="button" class="link-button" data-view="board">Open Board</button>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${escapeHtml(String(overview.taskProgress.progressPercent))}%"></div>
        </div>
        <div class="metric-row">
          <div><span>Open</span><strong>${escapeHtml(String(overview.taskProgress.openTasks))}</strong></div>
          <div><span>Done</span><strong>${escapeHtml(String(overview.taskProgress.doneTasks))}</strong></div>
          <div><span>Total</span><strong>${escapeHtml(String(overview.taskProgress.totalTasks))}</strong></div>
        </div>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Major Issues</p>
            <h3>Attention Points</h3>
          </div>
          <button type="button" class="link-button" data-view="blockers">Open Queue</button>
        </div>
        ${
          overview.majorIssues.length
            ? `<div class="stack-list">${overview.majorIssues
                .map(
                  (item) => `
                    <article class="list-card compact">
                      <strong>${escapeHtml(item.label)}</strong>
                      <div class="subtle">${escapeHtml(item.value)}</div>
                    </article>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">주요 이슈가 없습니다.</div>`
        }
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Risk Signals</p>
            <h3>Recurrence and Guardrail Watch</h3>
          </div>
          <button type="button" class="link-button" data-view="health">Open Health</button>
        </div>
        ${renderRiskSignalCards(overview.riskSignals)}
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Recent History</p>
            <h3>Milestones and Decisions</h3>
          </div>
          <button type="button" class="link-button" data-view="history">Open History</button>
        </div>
        ${
          overview.recentHistory.length
            ? `<div class="timeline-list">${overview.recentHistory
                .map(
                  (entry) => `
                    <button type="button" class="timeline-item" data-open-detail="history" data-detail-id="${escapeHtml(entry.id)}">
                      <span class="timeline-date">${escapeHtml(entry.date)}</span>
                      <strong>${escapeHtml(entry.title)}</strong>
                      <div class="subtle">${escapeHtml(entry.summary)}</div>
                    </button>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">프로젝트 이력이 아직 없습니다.</div>`
        }
      </section>
    </div>
  `;
}

function renderProjects(snapshot) {
  return `
    <div class="two-column">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Project Registry</p>
            <h3>Monitored Projects</h3>
          </div>
          <div>${buildSourceLink(snapshot.projectRegistry.path, "project-registry.json", "workspace")}</div>
        </div>
        <div class="stack-list">
          ${snapshot.projects
            .map(
              (project) => `
                <article class="list-card registry-item">
                  <div class="queue-item-header">
                    <strong>${escapeHtml(project.label)}</strong>
                    <div class="pill-row">
                      ${project.isCurrent ? '<span class="info-pill">Current</span>' : ""}
                      ${project.isDefault ? '<span class="info-pill">Default</span>' : ""}
                      ${project.isWorkspace ? '<span class="info-pill">Workspace</span>' : ""}
                    </div>
                  </div>
                  <div class="subtle mono">${escapeHtml(project.repoRoot)}</div>
                  <div class="registry-actions">
                    ${
                      project.canDelete
                        ? `<button type="button" class="inline-chip inline-chip-danger" data-delete-project="${escapeHtml(project.id)}">Remove</button>`
                        : `<span class="subtle">workspace project는 삭제하지 않습니다.</span>`
                    }
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Add Project</p>
            <h3>Register Another Workspace</h3>
          </div>
        </div>
        <form class="project-form" id="project-registry-form">
          <label>
            <span>Project Label</span>
            <input type="text" name="label" placeholder="Daily English Spark" />
          </label>
          <label>
            <span>Repository Path</span>
            <input
              type="text"
              name="repoRoot"
              placeholder="C:\\Newface\\10 Antigravity\\11 Daily English Spark"
              required
            />
          </label>
          <div class="registry-actions">
            <button type="submit" class="ghost-button ghost-button-strong">Add Project</button>
          </div>
        </form>
        <p class="subtle">
          PMW는 필수 artifact 파일이 있는 repo만 등록합니다. write 범위는
          <code>project-registry.json</code> 한 파일로 제한됩니다.
        </p>
      </section>

      <section class="content-card content-card-span">
        <div class="section-head">
          <div>
            <p class="eyebrow">Local Shell</p>
            <h3>Start and Stop PMW</h3>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Launch Command</strong>
            <div class="command-block">${escapeHtml(snapshot.localShell.launchCommand)}</div>
            <div class="registry-actions">
              <button type="button" class="inline-chip" data-copy-command="${escapeHtml(snapshot.localShell.launchCommand)}">Copy Command</button>
              ${buildSourceLink(snapshot.localShell.launchScriptPath, "launch-project-monitor-web.ps1", "workspace")}
            </div>
          </div>
          <div class="detail-card">
            <strong>Stop Command</strong>
            <div class="command-block">${escapeHtml(snapshot.localShell.stopCommand)}</div>
            <div class="registry-actions">
              <button type="button" class="inline-chip" data-copy-command="${escapeHtml(snapshot.localShell.stopCommand)}">Copy Command</button>
              ${buildSourceLink(snapshot.localShell.stopScriptPath, "stop-project-monitor-web.ps1", "workspace")}
            </div>
          </div>
          <div class="detail-card">
            <strong>Stop Running Server</strong>
            <div class="subtle">현재 열려 있는 PMW 서버를 로컬에서 종료합니다. 브라우저 탭은 자동으로 닫히지 않을 수 있습니다.</div>
            <div class="registry-actions">
              <button type="button" class="ghost-button" data-stop-server="true">Stop Server Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderCurrentState(snapshot) {
  const current = snapshot.currentStateView;
  const nextAgent = current.nextRecommendedAgent || {};
  const items = [
    ["Current Stage", snapshot.header.currentStage || snapshot.release.stage || "Unknown"],
    ["Current Focus", snapshot.header.currentFocus || "없음"],
    ["Release Goal", snapshot.header.currentReleaseGoal || "없음"],
    ["Green Level", snapshot.header.currentGreenLevel || "없음"],
    ["Requirements Status", current.snapshot.requirements_status || "Unknown"],
    ["Architecture Status", current.snapshot.architecture_status || "Unknown"],
    ["Plan Status", current.snapshot.plan_status || "Unknown"],
    ["Review Gate", current.snapshot.review_gate || "Unknown"],
    ["Manual / Environment", current.snapshot.manual_environment_gate || "Unknown"],
    ["Dependency / Compliance", current.snapshot.dependency_compliance_gate || "Unknown"]
  ];

  return `
    <div class="two-column">
      <section class="content-card state-spotlight">
        <p class="eyebrow">Current Snapshot</p>
        <h3>${escapeHtml(snapshot.header.oneLineStatus)}</h3>
        <p class="lead-copy">${escapeHtml(snapshot.header.nextAction || "다음 action이 아직 없습니다.")}</p>
        <div class="metric-row">
          <div><span>Current Agent</span><strong>${escapeHtml(snapshot.header.currentAgent || "Unassigned")}</strong></div>
          <div><span>Current Task</span><strong>${escapeHtml(snapshot.header.currentTask?.id || "None")}</strong></div>
          <div><span>Attention</span><strong>${escapeHtml(String(snapshot.header.attentionCount))}</strong></div>
        </div>
      </section>

      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Next Recommended Agent</p>
            <h3>${escapeHtml(nextAgent.recommended_role || nextAgent.recommended_agent || "Not Set")}</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/CURRENT_STATE.md", "CURRENT_STATE.md")}</div>
        </div>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Reason</strong>
            <div>${escapeHtml(nextAgent.reason || "없음")}</div>
          </div>
          <div class="detail-card">
            <strong>Trigger To Switch</strong>
            <div>${escapeHtml(nextAgent.trigger_to_switch || "없음")}</div>
          </div>
        </div>
      </section>
    </div>
    <section class="content-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">State Fields</p>
          <h3>Project Status by Gate</h3>
        </div>
      </div>
      <div class="state-grid">
        ${items
          .map(
            ([label, value]) => `
              <article class="state-cell">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(value)}</strong>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBoard(snapshot) {
  const tasks = filteredTasks();
  const ownerOptions = [
    { label: "All Owners", value: "all" },
    ...snapshot.teamDirectory.map((member) => ({
      label: member.display_name,
      value: member.id
    }))
  ];

  const profileOptions = [
    { label: "Current Profile", value: "all" },
    ...snapshot.operationalProfiles.map((row) => ({
      label: row.profile,
      value: row.profile
    }))
  ];

  return `
    <section class="content-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Project Board</p>
          <h3>Task Summary and Progress</h3>
        </div>
        <div>${buildSourceLink(".agents/artifacts/TASK_LIST.md", "TASK_LIST.md")}</div>
      </div>
      <div class="filter-bar">
        <label>
          <span>Profile Lens</span>
          <select id="profile-lens">
            ${profileOptions
              .map(
                (option) => `
                  <option value="${escapeHtml(option.value)}"${state.filters.profileLens === option.value ? " selected" : ""}>
                    ${escapeHtml(option.label)}
                  </option>
                `
              )
              .join("")}
          </select>
        </label>
        <label>
          <span>Owner</span>
          <select id="owner-filter">
            ${ownerOptions
              .map(
                (option) => `
                  <option value="${escapeHtml(option.value)}"${state.filters.owner === option.value ? " selected" : ""}>
                    ${escapeHtml(option.label)}
                  </option>
                `
              )
              .join("")}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select id="status-filter">
            <option value="all">All Status</option>
            <option value="pending"${state.filters.status === "pending" ? " selected" : ""}>Pending</option>
            <option value="in_progress"${state.filters.status === "in_progress" ? " selected" : ""}>In Progress</option>
            <option value="blocked"${state.filters.status === "blocked" ? " selected" : ""}>Blocked</option>
            <option value="done"${state.filters.status === "done" ? " selected" : ""}>Done</option>
          </select>
        </label>
      </div>
      ${
        tasks.length
          ? `
            <table class="board-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                ${tasks
                  .map((task) => {
                    const missingFields = getMissingFields(task, state.filters.profileLens);
                    return `
                      <tr>
                        <td>
                          <button class="board-row-button" type="button" data-open-detail="task" data-detail-id="${escapeHtml(task.id)}" data-select-task="${escapeHtml(task.id)}">
                            <span class="task-id">${escapeHtml(task.id)}</span>
                            <span class="task-title">${escapeHtml(task.title)}</span>
                            <span class="task-scope">${escapeHtml(task.scope || "scope not set")}</span>
                            ${
                              missingFields.length
                                ? `<div class="contract-warning">${escapeHtml(state.filters.profileLens)} lens missing: ${escapeHtml(missingFields.join(", "))}</div>`
                                : ""
                            }
                          </button>
                        </td>
                        <td><span class="status-pill ${escapeHtml(task.status)}">${escapeHtml(statusLabel(task.status))}</span></td>
                        <td>
                          <div>${escapeHtml(task.ownerDisplay || "unassigned")}</div>
                          <div class="subtle">${escapeHtml(task.role || "role unset")}</div>
                        </td>
                        <td>
                          <div>${escapeHtml(task.stage || "stage unset")}</div>
                          <div class="subtle">${escapeHtml(task.iteration || "iteration unset")}</div>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          `
          : `<div class="empty-state">현재 필터 조건에 맞는 task가 없습니다.</div>`
      }
    </section>
  `;
}

function renderTaskDetail(snapshot) {
  const selectedTask =
    state.indices.task.get(state.selectedTaskId) ||
    (snapshot.header.currentTask && state.indices.task.get(snapshot.header.currentTask.id));
  const candidateTasks = snapshot.boardTasks
    .filter((task) => task.status !== "done")
    .slice(0, 8);

  return `
    <div class="split-detail">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Task Detail</p>
            <h3>${escapeHtml(selectedTask?.id || "No Task Selected")}</h3>
          </div>
          ${selectedTask ? buildSourceLink(selectedTask.sourcePath, "Open Source") : ""}
        </div>
        ${
          selectedTask
            ? `
              <h4>${escapeHtml(selectedTask.title)}</h4>
              <div class="detail-grid">
                <div class="detail-card">
                  <strong>Status</strong>
                  <div><span class="status-pill ${escapeHtml(selectedTask.status)}">${escapeHtml(statusLabel(selectedTask.status))}</span></div>
                </div>
                <div class="detail-card">
                  <strong>Scope</strong>
                  <div>${escapeHtml(selectedTask.scope || "scope not set")}</div>
                </div>
                <div class="detail-card">
                  <strong>Owner / Role</strong>
                  <div>${escapeHtml(selectedTask.ownerDisplay || "unassigned")}</div>
                  <div class="subtle">${escapeHtml(selectedTask.role || "role unset")}</div>
                </div>
                <div class="detail-card">
                  <strong>Stage / Iteration</strong>
                  <div>${escapeHtml(selectedTask.stage || "stage unset")}</div>
                  <div class="subtle">${escapeHtml(selectedTask.iteration || "iteration unset")}</div>
                </div>
              </div>
              <div class="note-card">
                <strong>Note</strong>
                <div>${escapeHtml(selectedTask.note || "active lock note가 없습니다.")}</div>
              </div>
            `
            : `<div class="empty-state">board에서 task를 선택하면 상세 정보가 표시됩니다.</div>`
        }
      </section>
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Active Candidates</p>
            <h3>Open Tasks</h3>
          </div>
        </div>
        ${
          candidateTasks.length
            ? `<div class="stack-list">${candidateTasks
                .map(
                  (task) => `
                    <button type="button" class="list-card" data-select-task="${escapeHtml(task.id)}" data-view="task-detail">
                      <div class="queue-item-header">
                        <span class="task-id">${escapeHtml(task.id)}</span>
                        <span class="status-pill ${escapeHtml(task.status)}">${escapeHtml(statusLabel(task.status))}</span>
                      </div>
                      <strong>${escapeHtml(task.title)}</strong>
                      <div class="subtle">${escapeHtml(task.ownerDisplay || "unassigned")} · ${escapeHtml(task.stage || "stage unset")}</div>
                    </button>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">열린 task가 없습니다.</div>`
        }
      </section>
    </div>
  `;
}

function renderPacketDetail(packet) {
  if (!packet) {
    return `<div class="empty-state">현재 표시할 decision packet이 없습니다.</div>`;
  }

  return `
    <article class="packet-panel">
      <div class="packet-head">
        <div>
          <p class="eyebrow">Decision Packet</p>
          <h3>${escapeHtml(packet.decisionTitle)}</h3>
        </div>
        <div class="packet-tags">
          <span class="info-pill">${escapeHtml(packet.decisionType)}</span>
          <span class="info-pill">${escapeHtml(packet.urgencyGate)}</span>
        </div>
      </div>
      <section class="packet-block">
        <span class="packet-label">Recommended Default</span>
        <strong>${escapeHtml(packet.recommendedDefault)}</strong>
      </section>
      <section class="packet-block">
        <span class="packet-label">Why This Matters Now</span>
        <p>${escapeHtml(packet.whyNow)}</p>
      </section>
      <section class="packet-block">
        <span class="packet-label">Options And Impact</span>
        <div class="option-stack">
          ${packet.options
            .map(
              (option) => `
                <article class="option-card">
                  <strong>${escapeHtml(option.label)}</strong>
                  <div>${escapeHtml(option.impact)}</div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="packet-block">
        <span class="packet-label">Affected Tasks / Artifacts</span>
        <div class="list-inline">
          ${
            packet.affectedTaskIds.length
              ? packet.affectedTaskIds
                  .map(
                    (taskId) => `<button type="button" class="inline-chip" data-select-task="${escapeHtml(taskId)}" data-view="task-detail">${escapeHtml(taskId)}</button>`
                  )
                  .join("")
              : `<span class="subtle">관련 task가 명시되지 않았습니다.</span>`
          }
        </div>
        <div class="source-stack">
          ${packet.affectedArtifacts
            .map((item) => buildSourceLink(item.path, item.label))
            .join("")}
        </div>
      </section>
      <section class="packet-block">
        <span class="packet-label">Current Risk Signals</span>
        ${renderRiskSignalCards(packet.riskSignals || [])}
      </section>
      <section class="packet-block">
        <span class="packet-label">Recent History Context</span>
        ${
          packet.recentHistoryContext.length
            ? `<div class="timeline-list">${packet.recentHistoryContext
                .map(
                  (entry) => `
                    <article class="list-card compact">
                      <strong>${escapeHtml(entry.title)}</strong>
                      <div class="subtle">${escapeHtml(entry.summary)}</div>
                    </article>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">최근 history context가 없습니다.</div>`
        }
      </section>
      <section class="packet-block">
        <span class="packet-label">What Happens If Delayed</span>
        <p>${escapeHtml(packet.whatHappensIfDelayed)}</p>
      </section>
      <section class="packet-block">
        <span class="packet-label">Return To Codex Next Step</span>
        <p>${escapeHtml(packet.nextStep)}</p>
      </section>
      <section class="packet-block">
        <span class="packet-label">Related Artifact Links</span>
        <div class="source-stack">
          ${packet.sourceLinks.map((item) => buildSourceLink(item.path, item.label)).join("")}
        </div>
      </section>
      <button type="button" class="link-button" data-open-detail="packet" data-detail-id="${escapeHtml(packet.id)}">
        Open Packet Detail Drawer
      </button>
    </article>
  `;
}

function renderBlockers(snapshot) {
  const selectedPacket =
    state.indices.packet.get(state.selectedPacketId) || snapshot.decisionPackets[0] || null;

  return `
    <div class="split-detail">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Approval Queue</p>
            <h3>Decision Packets</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/CURRENT_STATE.md", "CURRENT_STATE.md")}</div>
        </div>
        ${
          snapshot.decisionPackets.length
            ? `<div class="stack-list">${snapshot.decisionPackets
                .map(
                  (packet) => `
                    <button type="button" class="list-card ${packet.id === selectedPacket?.id ? "is-selected" : ""}" data-select-packet="${escapeHtml(packet.id)}">
                      <div class="queue-item-header">
                        <span class="status-pill pending">${escapeHtml(packet.decisionType)}</span>
                        <span class="mono">${escapeHtml(packet.sourceId)}</span>
                      </div>
                      <strong>${escapeHtml(packet.decisionTitle)}</strong>
                      <div class="subtle">${escapeHtml(packet.recommendedDefault)}</div>
                    </button>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">열린 approval / decision packet이 없습니다.</div>`
        }
      </section>
      <section class="content-card packet-shell">
        ${renderPacketDetail(selectedPacket)}
      </section>
    </div>
  `;
}

function renderActivity(snapshot) {
  return `
    <section class="content-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Recent Activity</p>
          <h3>Latest Handoff and History</h3>
        </div>
        <div>${buildSourceLink(".agents/artifacts/TASK_LIST.md", "TASK_LIST.md")}</div>
      </div>
      ${
        snapshot.recentActivity.length
          ? `<div class="timeline-list">${snapshot.recentActivity
              .map(
                (item) => `
                  <button type="button" class="timeline-item" data-open-detail="${escapeHtml(item.kind)}" data-detail-id="${escapeHtml(item.id)}">
                    <span class="timeline-date">${escapeHtml(item.date)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <div class="subtle">${escapeHtml(item.summary)}</div>
                  </button>
                `
              )
              .join("")}</div>`
          : `<div class="empty-state">최근 활동이 없습니다.</div>`
      }
    </section>
  `;
}

function renderHistory(snapshot) {
  const selectedHistory =
    state.indices.history.get(state.selectedHistoryId) || snapshot.history[0] || null;

  return `
    <div class="split-detail">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Project History</p>
            <h3>Timeline</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/PROJECT_HISTORY.md", "PROJECT_HISTORY.md")}</div>
        </div>
        ${
          snapshot.history.length
            ? `<div class="timeline-list">${snapshot.history
                .map(
                  (entry) => `
                    <button type="button" class="timeline-item ${entry.id === selectedHistory?.id ? "is-selected" : ""}" data-select-history="${escapeHtml(entry.id)}">
                      <span class="timeline-date">${escapeHtml(entry.date)}</span>
                      <strong>${escapeHtml(entry.title)}</strong>
                      <div class="subtle">${escapeHtml(entry.summary)}</div>
                    </button>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">프로젝트 이력이 아직 없습니다.</div>`
        }
      </section>
      <section class="content-card">
        ${
          selectedHistory
            ? `
              <div class="section-head">
                <div>
                  <p class="eyebrow">${escapeHtml(selectedHistory.date)}</p>
                  <h3>${escapeHtml(selectedHistory.title)}</h3>
                </div>
                <button type="button" class="link-button" data-open-detail="history" data-detail-id="${escapeHtml(selectedHistory.id)}">Open Drawer</button>
              </div>
              <div class="detail-grid">
                <div class="detail-card">
                  <strong>Summary</strong>
                  <div>${escapeHtml(selectedHistory.summary || "없음")}</div>
                </div>
                <div class="detail-card">
                  <strong>Why</strong>
                  <div>${escapeHtml(selectedHistory.why || "없음")}</div>
                </div>
                <div class="detail-card">
                  <strong>Impact</strong>
                  <div>${escapeHtml(selectedHistory.impact || "없음")}</div>
                </div>
                <div class="detail-card">
                  <strong>Related</strong>
                  <div>${escapeHtml(selectedHistory.related || "없음")}</div>
                </div>
                <div class="detail-card">
                  <strong>Source</strong>
                  <div>${buildSourceLink(selectedHistory.sourcePath)}</div>
                </div>
              </div>
            `
            : `<div class="empty-state">선택된 history entry가 없습니다.</div>`
        }
      </section>
    </div>
  `;
}

function renderHealth(snapshot) {
  const health = snapshot.documentHealth;
  return `
    <div class="two-column">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Document Health</p>
            <h3>${escapeHtml(health.summary)}</h3>
          </div>
          <div>${buildSourceLink(".agents/artifacts/CURRENT_STATE.md", "CURRENT_STATE.md")}</div>
        </div>
        <div class="state-grid">
          ${health.items
            .map(
              (item) => `
                <article class="state-cell">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.value)}</strong>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="section-head secondary">
          <div>
            <p class="eyebrow">Risk Signals</p>
            <h3>${escapeHtml(
              `${health.signalSummary.active} active / ${health.signalSummary.watch} watch`
            )}</h3>
          </div>
        </div>
        ${renderRiskSignalCards(health.riskSignals)}
        <div class="section-head secondary">
          <div>
            <p class="eyebrow">Optional Sources</p>
            <h3>Projection Coverage</h3>
          </div>
        </div>
        <div class="source-stack">
          ${health.optionalSources
            .map(
              (item) => `
                <div class="source-row">
                  ${buildSourceLink(item.path)}
                  <span class="muted-label">${item.present ? "Present" : "Missing"}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Governance Summary</p>
            <h3>Read-only Contract Health</h3>
          </div>
          <div>${buildSourceLink(snapshot.governance.path, "governance_controls.json")}</div>
        </div>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Validator Profile</strong>
            <div>${escapeHtml(health.governance.validatorProfile)}</div>
          </div>
          <div class="detail-card">
            <strong>Protected Paths</strong>
            <div>${escapeHtml(String(health.governance.protectedPathCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Sensitive Paths</strong>
            <div>${escapeHtml(String(health.governance.sensitivePathCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Human Review Scopes</strong>
            <div>${escapeHtml(String(health.governance.humanReviewScopeCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Critical Domains</strong>
            <div>${escapeHtml(String(health.governance.criticalDomainCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Tool Allowlist</strong>
            <div>${escapeHtml(String(health.governance.toolAllowlistCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Tool Denylist</strong>
            <div>${escapeHtml(String(health.governance.toolDenylistCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Exfiltration Classes</strong>
            <div>${escapeHtml(String(health.governance.exfiltrationClassCount))}</div>
          </div>
          <div class="detail-card">
            <strong>Sandbox Mode</strong>
            <div>${escapeHtml(health.governance.sandboxMode)}</div>
          </div>
        </div>
        <div class="section-head secondary">
          <div>
            <p class="eyebrow">Health Snapshot</p>
            <h3>${escapeHtml(health.healthSnapshot.generatedAt || health.healthSnapshot.summary || "Unavailable")}</h3>
          </div>
        </div>
        <div class="source-stack">
          ${buildSourceLink(health.healthSnapshot.path, "health_snapshot.json")}
        </div>
      </section>
    </div>
  `;
}

function renderTeam(snapshot) {
  return `
    <div class="two-column">
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Team Registry</p>
            <h3>${escapeHtml(snapshot.teamRegistry.activeProfile)}</h3>
          </div>
          <div>${buildSourceLink(".agents/runtime/team.json", "team.json")}</div>
        </div>
        <div class="metric-row">
          <div><span>Schema</span><strong>${escapeHtml(snapshot.teamRegistry.schemaVersion)}</strong></div>
          <div><span>Members</span><strong>${escapeHtml(String(snapshot.teamDirectory.length))}</strong></div>
          <div><span>Active Packs</span><strong>${escapeHtml(String(snapshot.activePacks.length))}</strong></div>
        </div>
        ${
          snapshot.activePacks.length
            ? `<div class="pill-row">${snapshot.activePacks
                .map((pack) => `<span class="info-pill">${escapeHtml(pack)}</span>`)
                .join("")}</div>`
            : `<div class="empty-state">active pack이 없습니다.</div>`
        }
      </section>
      <section class="content-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Governance Controls</p>
            <h3>${escapeHtml(snapshot.governance.validatorProfile)}</h3>
          </div>
          <div>${buildSourceLink(snapshot.governance.path, "governance_controls.json")}</div>
        </div>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Protected Paths</strong>
            <div>${escapeHtml(snapshot.governance.protectedPaths.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Sensitive Paths</strong>
            <div>${escapeHtml(snapshot.governance.sensitivePaths.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Human Review Required</strong>
            <div>${escapeHtml(snapshot.governance.humanReviewRequiredScopes.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Critical Domains</strong>
            <div>${escapeHtml(snapshot.governance.criticalDomains.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Tool Allowlist</strong>
            <div>${escapeHtml(snapshot.governance.toolAllowlist.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Tool Denylist</strong>
            <div>${escapeHtml(snapshot.governance.toolDenylist.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Exfiltration Classes</strong>
            <div>${escapeHtml(snapshot.governance.exfiltrationSensitiveInputClasses.join(", ") || "none")}</div>
          </div>
          <div class="detail-card">
            <strong>Sandbox Policy</strong>
            <div>${escapeHtml(JSON.stringify(snapshot.governance.sandboxPolicy || {}))}</div>
          </div>
        </div>
      </section>
      <section class="content-card content-card-span">
        <div class="section-head">
          <div>
            <p class="eyebrow">Members</p>
            <h3>Current Agents</h3>
          </div>
        </div>
        ${
          snapshot.teamDirectory.length
            ? `<div class="team-grid">${snapshot.teamDirectory
                .map(
                  (member) => `
                    <button type="button" class="team-card" data-open-detail="team" data-detail-id="${escapeHtml(member.id)}">
                      <div class="queue-item-header">
                        <span class="kind-pill ${escapeHtml(member.kind)}">${escapeHtml(member.kind)}</span>
                        <span class="role-pill">${escapeHtml(member.primary_role)}</span>
                      </div>
                      <strong>${escapeHtml(member.display_name)}</strong>
                      <div class="subtle mono">${escapeHtml(member.id)}</div>
                      <div class="subtle">${escapeHtml((member.ownership_scopes || []).join(", ") || "none")}</div>
                    </button>
                  `
                )
                .join("")}</div>`
            : `<div class="empty-state">team registry가 비어 있습니다. solo 프로필에서는 정상일 수 있습니다.</div>`
        }
      </section>
    </div>
  `;
}

function renderContent(snapshot) {
  const headings = {
    overview: ["Project Overview", "프로젝트 목표, 질문, 요약, 진척률을 한 화면에서 봅니다."],
    "current-state": ["Current State", "현재 단계, 상태, 게이트, 다음 역할을 읽습니다."],
    board: ["Project Board", "owner / status 기준으로 task를 탐색합니다."],
    "task-detail": ["Task Detail", "현재 진행 중인 task와 상세 정보를 확인합니다."],
    blockers: ["Blocker / Approval Queue", "decision packet을 먼저 읽고 Codex로 돌아가 결정을 내립니다."],
    activity: ["Recent Activity", "최근 handoff와 history delta를 확인합니다."],
    projects: ["Project Registry", "조회할 프로젝트 목록과 PMW start / stop shell affordance를 관리합니다."],
    history: ["Project History", "프로젝트 전체 의사결정과 구현 마일스톤을 조회합니다."],
    health: ["Document Health", "artifact sync와 governance summary를 확인합니다."],
    team: ["Team Registry", "active profile, pack, governance controls, member registry를 읽습니다."]
  };

  const [title, meta] = headings[state.activeView] || headings.overview;
  elements.contentHeading.textContent = title;
  elements.contentMeta.textContent = meta;

  switch (state.activeView) {
    case "current-state":
      elements.content.innerHTML = renderCurrentState(snapshot);
      return;
    case "board":
      elements.content.innerHTML = renderBoard(snapshot);
      return;
    case "task-detail":
      elements.content.innerHTML = renderTaskDetail(snapshot);
      return;
    case "blockers":
      elements.content.innerHTML = renderBlockers(snapshot);
      return;
    case "activity":
      elements.content.innerHTML = renderActivity(snapshot);
      return;
    case "projects":
      elements.content.innerHTML = renderProjects(snapshot);
      return;
    case "history":
      elements.content.innerHTML = renderHistory(snapshot);
      return;
    case "health":
      elements.content.innerHTML = renderHealth(snapshot);
      return;
    case "team":
      elements.content.innerHTML = renderTeam(snapshot);
      return;
    default:
      elements.content.innerHTML = renderOverview(snapshot);
  }
}

function drawerPacketBody(packet) {
  return `
    <div class="drawer-content">
      <h3>${escapeHtml(packet.decisionTitle)}</h3>
      <div class="detail-grid">
        <div class="detail-card">
          <strong>Decision Type</strong>
          <div>${escapeHtml(packet.decisionType)}</div>
        </div>
        <div class="detail-card">
          <strong>Urgency / Gate</strong>
          <div>${escapeHtml(packet.urgencyGate)}</div>
        </div>
        <div class="detail-card">
          <strong>Recommended Default</strong>
          <div>${escapeHtml(packet.recommendedDefault)}</div>
        </div>
        <div class="detail-card">
          <strong>Why Now</strong>
          <div>${escapeHtml(packet.whyNow)}</div>
        </div>
        <div class="detail-card">
          <strong>What Happens If Delayed</strong>
          <div>${escapeHtml(packet.whatHappensIfDelayed)}</div>
        </div>
        <div class="detail-card">
          <strong>Return To Codex Next Step</strong>
          <div>${escapeHtml(packet.nextStep)}</div>
        </div>
        <div class="detail-card">
          <strong>Source Links</strong>
          <div class="source-stack">${packet.sourceLinks
            .map((item) => buildSourceLink(item.path, item.label))
            .join("")}</div>
        </div>
        <div class="detail-card">
          <strong>Risk Signals</strong>
          <div>${escapeHtml(
            (packet.riskSignals || [])
              .map((signal) => `${signal.label}: ${formatSignalStatus(signal.status)}`)
              .join(" / ") || "none"
          )}</div>
        </div>
      </div>
    </div>
  `;
}

function renderDrawer() {
  if (!state.detail) {
    elements.drawer.dataset.open = "false";
    elements.drawer.setAttribute("aria-hidden", "true");
    elements.drawerTitle.textContent = "Detail";
    elements.drawerContent.innerHTML = "";
    return;
  }

  let title = "Detail";
  let body = `<div class="empty-state">세부 정보를 찾지 못했습니다.</div>`;

  if (state.detail.kind === "task") {
    const task = state.indices.task.get(state.detail.id);
    if (task) {
      title = task.id;
      body = `
        <div class="drawer-content">
          <h3>${escapeHtml(task.title)}</h3>
          <div class="detail-grid">
            <div class="detail-card">
              <strong>Status</strong>
              <div><span class="status-pill ${escapeHtml(task.status)}">${escapeHtml(statusLabel(task.status))}</span></div>
            </div>
            <div class="detail-card">
              <strong>Scope</strong>
              <div>${escapeHtml(task.scope || "scope not set")}</div>
            </div>
            <div class="detail-card">
              <strong>Owner / Role</strong>
              <div>${escapeHtml(task.ownerDisplay || "unassigned")}</div>
              <div class="subtle">${escapeHtml(task.role || "role unset")}</div>
            </div>
            <div class="detail-card">
              <strong>Source Artifact</strong>
              <div>${buildSourceLink(task.sourcePath)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (state.detail.kind === "blocker") {
    const blocker = state.indices.blocker.get(state.detail.id);
    if (blocker) {
      title = blocker.label;
      body = `
        <div class="drawer-content">
          <h3>${escapeHtml(blocker.label)}</h3>
          <div class="detail-grid">
            <div class="detail-card">
              <strong>Category</strong>
              <div>${escapeHtml(prettyCategory(blocker.category))}</div>
            </div>
            <div class="detail-card">
              <strong>Value</strong>
              <div>${escapeHtml(blocker.value || blocker.observedSymptom || "")}</div>
            </div>
            <div class="detail-card">
              <strong>Impact</strong>
              <div>${escapeHtml(blocker.impact || blocker.nextEscalation || "")}</div>
            </div>
            <div class="detail-card">
              <strong>Source Artifact</strong>
              <div>${buildSourceLink(blocker.sourcePath)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (state.detail.kind === "handoff" || state.detail.kind === "activity") {
    const activity = state.indices.activity.get(state.detail.id);
    if (activity) {
      title = activity.title;
      body = `
        <div class="drawer-content">
          <h3>${escapeHtml(activity.title)}</h3>
          <div class="detail-grid">
            <div class="detail-card">
              <strong>Date</strong>
              <div>${escapeHtml(activity.date)}</div>
            </div>
            <div class="detail-card">
              <strong>Summary</strong>
              <div>${escapeHtml(activity.summary)}</div>
            </div>
            <div class="detail-card">
              <strong>Source Artifact</strong>
              <div>${buildSourceLink(activity.sourcePath)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (state.detail.kind === "history") {
    const history = state.indices.history.get(state.detail.id);
    if (history) {
      title = history.title;
      body = `
        <div class="drawer-content">
          <h3>${escapeHtml(history.title)}</h3>
          <div class="detail-grid">
            <div class="detail-card">
              <strong>Date</strong>
              <div>${escapeHtml(history.date)}</div>
            </div>
            <div class="detail-card">
              <strong>Summary</strong>
              <div>${escapeHtml(history.summary || "없음")}</div>
            </div>
            <div class="detail-card">
              <strong>Why</strong>
              <div>${escapeHtml(history.why || "없음")}</div>
            </div>
            <div class="detail-card">
              <strong>Impact</strong>
              <div>${escapeHtml(history.impact || "없음")}</div>
            </div>
            <div class="detail-card">
              <strong>Related</strong>
              <div>${escapeHtml(history.related || "없음")}</div>
            </div>
            <div class="detail-card">
              <strong>Source Artifact</strong>
              <div>${buildSourceLink(history.sourcePath)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (state.detail.kind === "team") {
    const member = state.indices.team.get(state.detail.id);
    if (member) {
      title = member.display_name;
      body = `
        <div class="drawer-content">
          <h3>${escapeHtml(member.display_name)}</h3>
          <div class="detail-grid">
            <div class="detail-card">
              <strong>Role</strong>
              <div>${escapeHtml(member.primary_role)}</div>
            </div>
            <div class="detail-card">
              <strong>Ownership Scopes</strong>
              <div>${escapeHtml((member.ownership_scopes || []).join(", ") || "none")}</div>
            </div>
            <div class="detail-card">
              <strong>Handoff Targets</strong>
              <div>${escapeHtml((member.handoff_targets || []).join(", ") || "none")}</div>
            </div>
            <div class="detail-card">
              <strong>Model / Approval</strong>
              <div>${escapeHtml(member.default_model || "model unset")}</div>
              <div class="subtle">${escapeHtml((member.approval_authority || []).join(", ") || "approval authority unset")}</div>
            </div>
            <div class="detail-card">
              <strong>Source Artifact</strong>
              <div>${buildSourceLink(".agents/runtime/team.json")}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (state.detail.kind === "packet") {
    const packet = state.indices.packet.get(state.detail.id);
    if (packet) {
      title = packet.decisionTitle;
      body = drawerPacketBody(packet);
    }
  }

  elements.drawer.dataset.open = "true";
  elements.drawer.setAttribute("aria-hidden", "false");
  elements.drawerTitle.textContent = title;
  elements.drawerContent.innerHTML = body;
}

function render(snapshot) {
  renderHeader(snapshot);
  renderWarnings(snapshot);
  renderNavigation();
  renderDashboard(snapshot);
  renderContent(snapshot);
  renderDrawer();
}

async function loadSnapshot(projectId = state.currentProjectId) {
  const query = projectId ? `?project=${encodeURIComponent(projectId)}` : "";
  const response = await fetch(`/api/snapshot${query}`);
  if (!response.ok) {
    throw new Error(`Snapshot request failed: ${response.status}`);
  }

  const snapshot = await response.json();
  state.snapshot = snapshot;
  state.currentProjectId = snapshot.projectContext.id;
  buildIndices(snapshot);
  ensureSelection(snapshot);
  render(snapshot);
}

async function refreshProjectsView(nextProjectId = state.currentProjectId) {
  await loadSnapshot(nextProjectId);
  state.activeView = "projects";
  if (state.snapshot) {
    render(state.snapshot);
  }
}

function openDetail(kind, id) {
  state.detail = { kind, id };
  renderDrawer();
}

async function handleProjectRegistrySubmit(form) {
  const formData = new FormData(form);
  const payload = {
    label: String(formData.get("label") || "").trim(),
    repoRoot: String(formData.get("repoRoot") || "").trim()
  };

  await requestJson("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  form.reset();
  state.notice = `프로젝트를 목록에 추가했습니다: ${payload.label || payload.repoRoot}`;
  await refreshProjectsView();
}

async function handleProjectRemoval(projectId) {
  const target = state.snapshot?.projects?.find((project) => project.id === projectId);
  await requestJson(`/api/projects?projectId=${encodeURIComponent(projectId)}`, {
    method: "DELETE"
  });

  state.notice = `${target?.label || projectId} 프로젝트를 목록에서 제거했습니다.`;
  const nextProjectId = state.currentProjectId === projectId ? "" : state.currentProjectId;
  await refreshProjectsView(nextProjectId);
}

async function handleStopServer() {
  await requestJson("/api/server/stop", { method: "POST" });
  state.notice =
    "PMW 서버 종료를 요청했습니다. 브라우저 탭은 자동으로 닫히지 않을 수 있습니다.";

  if (state.snapshot) {
    renderWarnings(state.snapshot);
  }
}

function handleExit() {
  window.close();
  state.notice =
    "브라우저 탭이 자동으로 닫히지 않으면 직접 닫거나 Project Registry 화면의 Stop Server를 사용하세요.";
  if (state.snapshot) {
    renderWarnings(state.snapshot);
  }
}

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "project-registry-form") {
    return;
  }

  event.preventDefault();

  try {
    await handleProjectRegistrySubmit(event.target);
  } catch (error) {
    state.notice = error.message;
    if (state.snapshot) {
      renderWarnings(state.snapshot);
    }
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.id === "project-selector") {
    state.notice = "";
    await loadSnapshot(event.target.value);
    return;
  }

  if (event.target.id === "profile-lens") {
    state.filters.profileLens = event.target.value;
  }

  if (event.target.id === "owner-filter") {
    state.filters.owner = event.target.value;
  }

  if (event.target.id === "status-filter") {
    state.filters.status = event.target.value;
  }

  if (state.snapshot) {
    render(state.snapshot);
  }
});

document.addEventListener("click", async (event) => {
  const viewTrigger = event.target.closest("[data-view]");
  if (viewTrigger) {
    state.activeView = viewTrigger.dataset.view;
    if (state.snapshot) {
      render(state.snapshot);
    }
    return;
  }

  const taskTrigger = event.target.closest("[data-select-task]");
  if (taskTrigger) {
    state.selectedTaskId = taskTrigger.dataset.selectTask;
    state.activeView = "task-detail";
    if (state.snapshot) {
      render(state.snapshot);
    }
    return;
  }

  const packetTrigger = event.target.closest("[data-select-packet]");
  if (packetTrigger) {
    state.selectedPacketId = packetTrigger.dataset.selectPacket;
    state.activeView = "blockers";
    if (state.snapshot) {
      render(state.snapshot);
    }
    return;
  }

  const historyTrigger = event.target.closest("[data-select-history]");
  if (historyTrigger) {
    state.selectedHistoryId = historyTrigger.dataset.selectHistory;
    state.activeView = "history";
    if (state.snapshot) {
      render(state.snapshot);
    }
    return;
  }

  const detailTrigger = event.target.closest("[data-open-detail]");
  if (detailTrigger) {
    openDetail(detailTrigger.dataset.openDetail, detailTrigger.dataset.detailId);
    return;
  }

  if (event.target.closest("[data-close-drawer]")) {
    state.detail = null;
    renderDrawer();
    return;
  }

  if (event.target.closest("[data-refresh]")) {
    state.notice = "";
    await loadSnapshot();
    return;
  }

  const deleteProjectTrigger = event.target.closest("[data-delete-project]");
  if (deleteProjectTrigger) {
    try {
      await handleProjectRemoval(deleteProjectTrigger.dataset.deleteProject);
    } catch (error) {
      state.notice = error.message;
      if (state.snapshot) {
        renderWarnings(state.snapshot);
      }
    }
    return;
  }

  const copyTrigger = event.target.closest("[data-copy-command]");
  if (copyTrigger) {
    try {
      await copyToClipboard(
        copyTrigger.dataset.copyCommand,
        "명령어를 클립보드에 복사했습니다."
      );
    } catch (error) {
      state.notice = error.message;
      if (state.snapshot) {
        renderWarnings(state.snapshot);
      }
    }
    return;
  }

  if (event.target.closest("[data-stop-server]")) {
    try {
      await handleStopServer();
    } catch (error) {
      state.notice = error.message;
      if (state.snapshot) {
        renderWarnings(state.snapshot);
      }
    }
    return;
  }

  if (event.target.closest("[data-exit]")) {
    handleExit();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    state.detail = null;
    renderDrawer();
  }
});

loadSnapshot().catch((error) => {
  elements.warnings.innerHTML = `
    <div class="warning-banner">
      <strong>Startup Error</strong>
      <div>${escapeHtml(error.message)}</div>
    </div>
  `;
});
