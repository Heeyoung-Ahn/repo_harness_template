const state = {
  snapshot: null,
  filters: {
    profileLens: "all",
    owner: "all",
    status: "all"
  },
  detail: null
};

const elements = {
  hero: document.querySelector("#hero"),
  filters: document.querySelector("#filters"),
  warnings: document.querySelector("#warnings"),
  board: document.querySelector("#board"),
  blockers: document.querySelector("#blockers"),
  activity: document.querySelector("#activity"),
  health: document.querySelector("#health"),
  team: document.querySelector("#team"),
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

function buildIndices(snapshot) {
  state.indices = {
    task: new Map(snapshot.boardTasks.map((task) => [task.id, task])),
    blocker: new Map(snapshot.blockers.map((blocker) => [blocker.id, blocker])),
    activity: new Map(
      snapshot.recentActivity.map((entry, index) => [`activity-${index}`, entry])
    ),
    team: new Map(snapshot.teamDirectory.map((member) => [member.id, member]))
  };
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

function renderHero(snapshot) {
  elements.hero.innerHTML = `
    <div class="hero-grid">
      <div>
        <p class="eyebrow">Project Monitor Web</p>
        <h1>${escapeHtml(snapshot.repoName)}</h1>
        <p class="hero-subtitle">
          ${escapeHtml(snapshot.release.focus || "현재 프로젝트의 active scope와 blocker를 한 화면에서 읽는 정적 운영 보드")}
        </p>
      </div>
      <div class="metric-strip">
        <div class="metric-tile">
          <span class="metric-label">Current Stage</span>
          <span class="metric-value">${escapeHtml(snapshot.release.stage || "Unknown")}</span>
          <span class="metric-meta">Profile ${escapeHtml(snapshot.activeProfile)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Open Tasks</span>
          <span class="metric-value">${snapshot.summary.pending + snapshot.summary.inProgress + snapshot.summary.blocked}</span>
          <span class="metric-meta">${snapshot.summary.activeLocks} active locks</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Attention Queue</span>
          <span class="metric-value">${snapshot.summary.blockers}</span>
          <span class="metric-meta">${snapshot.summary.pendingApprovals} approvals / manual gates</span>
        </div>
      </div>
    </div>
  `;
}

function renderFilters(snapshot) {
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

  elements.filters.innerHTML = `
    <div class="filter-group">
      <label for="profile-lens">Profile Lens</label>
      <select id="profile-lens">
        ${profileOptions
          .map(
            (option) =>
              `<option value="${escapeHtml(option.value)}"${state.filters.profileLens === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>`
          )
          .join("")}
      </select>
    </div>
    <div class="filter-group">
      <label for="owner-filter">Owner</label>
      <select id="owner-filter">
        ${ownerOptions
          .map(
            (option) =>
              `<option value="${escapeHtml(option.value)}"${state.filters.owner === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>`
          )
          .join("")}
      </select>
    </div>
    <div class="filter-group">
      <label for="status-filter">Status</label>
      <select id="status-filter">
        <option value="all">All Status</option>
        <option value="pending"${state.filters.status === "pending" ? " selected" : ""}>Pending</option>
        <option value="in_progress"${state.filters.status === "in_progress" ? " selected" : ""}>In Progress</option>
        <option value="blocked"${state.filters.status === "blocked" ? " selected" : ""}>Blocked</option>
        <option value="done"${state.filters.status === "done" ? " selected" : ""}>Done</option>
      </select>
    </div>
    <button type="button" data-refresh="true">Refresh Snapshot</button>
  `;
}

function renderWarnings(snapshot) {
  if (!snapshot.warnings.length) {
    elements.warnings.innerHTML = "";
    return;
  }

  elements.warnings.innerHTML = snapshot.warnings
    .map(
      (warning) =>
        `<div class="warning-banner"><strong>Parse Warning</strong><div>${escapeHtml(warning)}</div></div>`
    )
    .join("");
}

function renderBoard(snapshot) {
  const tasks = filteredTasks();

  if (!tasks.length) {
    elements.board.innerHTML = `<div class="empty-state">현재 필터 조건에 맞는 task가 없습니다.</div>`;
    return;
  }

  elements.board.innerHTML = `
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
                  <button class="board-row-button" type="button" data-open-detail="task" data-detail-id="${escapeHtml(task.id)}">
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
  `;
}

function renderBlockers(snapshot) {
  if (!snapshot.blockers.length) {
    elements.blockers.innerHTML = `<div class="empty-state">열려 있는 blocker가 없습니다.</div>`;
    return;
  }

  elements.blockers.innerHTML = `
    <div class="stack-list">
      ${snapshot.blockers
        .map(
          (blocker) => `
            <div class="queue-item">
              <button type="button" data-open-detail="blocker" data-detail-id="${escapeHtml(blocker.id)}">
                <div class="queue-item-header">
                  <span class="status-pill blocked">${escapeHtml(blocker.category)}</span>
                  <span class="mono">${escapeHtml(blocker.sourcePath)}</span>
                </div>
                <strong>${escapeHtml(blocker.label)}</strong>
                <div class="subtle">${escapeHtml(blocker.value)}</div>
              </button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderActivity(snapshot) {
  if (!snapshot.recentActivity.length) {
    elements.activity.innerHTML = `<div class="empty-state">최근 handoff가 없습니다.</div>`;
    return;
  }

  elements.activity.innerHTML = `
    <div class="stack-list">
      ${snapshot.recentActivity
        .map(
          (entry, index) => `
            <div class="activity-item">
              <button type="button" data-open-detail="activity" data-detail-id="activity-${index}">
                <div class="activity-meta">
                  <span class="mono">${escapeHtml(entry.date)}</span>
                  <span class="subtle">TASK_LIST.md</span>
                </div>
                <div>${escapeHtml(entry.message)}</div>
              </button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderHealth(snapshot) {
  const healthSnapshot = snapshot.documentHealth.healthSnapshot;

  elements.health.innerHTML = `
    <div class="health-grid">
      <div class="health-summary">
        <p class="eyebrow">Snapshot Health</p>
        <h2>${escapeHtml(snapshot.documentHealth.summary)}</h2>
        <p class="subtle">${escapeHtml(snapshot.release.goal || "goal unavailable")}</p>
      </div>
      <div class="health-item">
        <span>Health Snapshot</span>
        <span class="mono">${escapeHtml(healthSnapshot.generatedAt || healthSnapshot.summary || "unknown")}</span>
      </div>
      <div class="health-item">
        <span>Health Snapshot Source</span>
        <span>${buildSourceLink(healthSnapshot.path)}</span>
      </div>
      ${snapshot.documentHealth.items
        .map(
          (item) => `
            <div class="health-item">
              <span>${escapeHtml(item.label)}</span>
              <span class="mono">${escapeHtml(item.value)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderTeam(snapshot) {
  if (!snapshot.teamDirectory.length) {
    elements.team.innerHTML = `<div class="empty-state">team registry가 비어 있습니다. solo 프로필에서는 정상일 수 있습니다.</div>`;
    return;
  }

  elements.team.innerHTML = `
    <div class="team-grid">
      ${snapshot.teamDirectory
        .map(
          (member) => `
            <div class="team-card">
              <button type="button" data-open-detail="team" data-detail-id="${escapeHtml(member.id)}">
                <div class="team-meta">
                  <span class="kind-pill ${escapeHtml(member.kind)}">${escapeHtml(member.kind)}</span>
                  <span class="role-pill">${escapeHtml(member.primary_role)}</span>
                </div>
                <strong>${escapeHtml(member.display_name)}</strong>
                <div class="subtle mono">${escapeHtml(member.id)}</div>
                <div class="subtle">${escapeHtml((member.ownership_scopes || []).join(", "))}</div>
              </button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buildSourceLink(path) {
  return `<a class="source-link" href="/api/file?path=${encodeURIComponent(path)}" target="_blank" rel="noreferrer">${escapeHtml(path)}</a>`;
}

function renderDrawer() {
  if (!state.detail) {
    elements.drawer.dataset.open = "false";
    elements.drawer.setAttribute("aria-hidden", "true");
    elements.drawerTitle.textContent = "Detail";
    elements.drawerContent.innerHTML = "";
    return;
  }

  let title = "";
  let body = "";
  let sourcePath = "";

  if (state.detail.kind === "task") {
    const task = state.indices.task.get(state.detail.id);
    title = task.id;
    sourcePath = task.sourcePath;
    body = `
      <div class="drawer-content">
        <h3>${escapeHtml(task.title)}</h3>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Status</strong>
            <div class="status-pill ${escapeHtml(task.status)}">${escapeHtml(statusLabel(task.status))}</div>
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
            <strong>Stage / Iteration</strong>
            <div>${escapeHtml(task.stage || "stage unset")}</div>
            <div class="subtle">${escapeHtml(task.iteration || "iteration unset")}</div>
          </div>
          <div class="detail-card">
            <strong>Source Artifact</strong>
            <div>${buildSourceLink(sourcePath)}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (state.detail.kind === "blocker") {
    const blocker = state.indices.blocker.get(state.detail.id);
    title = blocker.label;
    sourcePath = blocker.sourcePath;
    body = `
      <div class="drawer-content">
        <h3>${escapeHtml(blocker.label)}</h3>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Category</strong>
            <div>${escapeHtml(blocker.category)}</div>
          </div>
          <div class="detail-card">
            <strong>Value</strong>
            <div>${escapeHtml(blocker.value)}</div>
          </div>
          <div class="detail-card">
            <strong>Source Artifact</strong>
            <div>${buildSourceLink(sourcePath)}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (state.detail.kind === "activity") {
    const activity = state.indices.activity.get(state.detail.id);
    title = activity.date;
    sourcePath = ".agents/artifacts/TASK_LIST.md";
    body = `
      <div class="drawer-content">
        <h3>${escapeHtml(activity.date)}</h3>
        <div class="detail-grid">
          <div class="detail-card">
            <strong>Message</strong>
            <div>${escapeHtml(activity.message)}</div>
          </div>
          <div class="detail-card">
            <strong>Source Artifact</strong>
            <div>${buildSourceLink(sourcePath)}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (state.detail.kind === "team") {
    const member = state.indices.team.get(state.detail.id);
    title = member.display_name;
    sourcePath = ".agents/runtime/team.json";
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
            <div>${buildSourceLink(sourcePath)}</div>
          </div>
        </div>
      </div>
    `;
  }

  elements.drawer.dataset.open = "true";
  elements.drawer.setAttribute("aria-hidden", "false");
  elements.drawerTitle.textContent = title || "Detail";
  elements.drawerContent.innerHTML = body || `<div class="empty-state">세부 정보를 찾지 못했습니다.</div>`;
}

function render(snapshot) {
  renderHero(snapshot);
  renderFilters(snapshot);
  renderWarnings(snapshot);
  renderBoard(snapshot);
  renderBlockers(snapshot);
  renderActivity(snapshot);
  renderHealth(snapshot);
  renderTeam(snapshot);
  renderDrawer();
}

async function loadSnapshot() {
  const response = await fetch("/api/snapshot");
  const snapshot = await response.json();
  state.snapshot = snapshot;
  buildIndices(snapshot);
  render(snapshot);
}

document.addEventListener("change", (event) => {
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
  const detailTrigger = event.target.closest("[data-open-detail]");
  if (detailTrigger) {
    state.detail = {
      kind: detailTrigger.dataset.openDetail,
      id: detailTrigger.dataset.detailId
    };
    renderDrawer();
    return;
  }

  if (event.target.closest("[data-close-drawer]")) {
    state.detail = null;
    renderDrawer();
    return;
  }

  if (event.target.closest("[data-refresh]")) {
    await loadSnapshot();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    state.detail = null;
    renderDrawer();
  }
});

loadSnapshot().catch((error) => {
  elements.warnings.innerHTML = `<div class="warning-banner"><strong>Startup Error</strong><div>${escapeHtml(error.message)}</div></div>`;
});
