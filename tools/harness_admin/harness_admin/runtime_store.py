from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from .constants import (
    DEFAULT_RUNTIME_HOME_NAME,
    LOG_FILE_NAME,
    OPTIONAL_REPO_MARKERS,
    REQUIRED_REPO_MARKERS,
    WATCHER_SUMMARY_FILE_NAME,
)
from .models import RepoStateSummary


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_now_iso() -> str:
    return utc_now().isoformat()


def parse_timestamp(value: str | None) -> datetime | None:
    if not value:
        return None

    text = value.strip()
    if not text:
        return None

    if text.endswith("Z"):
        text = f"{text[:-1]}+00:00"

    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None

    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed


def default_runtime_home() -> Path:
    user_home = os.environ.get("USERPROFILE") or str(Path.home())
    return Path(user_home) / ".harness-runtime"


def resolve_runtime_home(configured: str | Path | None = None) -> Path:
    if configured:
        return Path(configured).expanduser().resolve()
    return default_runtime_home().resolve()


def ensure_directory(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default

    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return default

    if not text.strip():
        return default

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return default


def write_json(path: Path, value: Any) -> None:
    ensure_directory(path.parent)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + os.linesep,
        encoding="utf-8",
    )


def presence_path(runtime_home: str | Path | None = None) -> Path:
    return resolve_runtime_home(runtime_home) / "presence.json"


def repo_registry_path(runtime_home: str | Path | None = None) -> Path:
    return resolve_runtime_home(runtime_home) / "repo_registry.json"


def telegram_offset_path(runtime_home: str | Path | None = None) -> Path:
    return resolve_runtime_home(runtime_home) / "telegram_offset.txt"


def watcher_log_path(runtime_home: str | Path | None = None) -> Path:
    return resolve_runtime_home(runtime_home) / LOG_FILE_NAME


def watcher_summary_path(runtime_home: str | Path | None = None) -> Path:
    return resolve_runtime_home(runtime_home) / WATCHER_SUMMARY_FILE_NAME


def get_effective_presence(runtime_home: str | Path | None = None) -> dict[str, Any]:
    path = presence_path(runtime_home)
    state = read_json(path, default={}) or {}
    now = utc_now()
    mode = str(state.get("mode") or "").strip().lower()
    expires_at = parse_timestamp(state.get("expires_at"))

    if mode not in {"present", "away"}:
        return {
            "mode": "present",
            "source": "default" if not state else "invalid",
            "expired": False,
            "expires_at": expires_at.isoformat() if expires_at else None,
            "updated_at": state.get("updated_at"),
            "path": str(path),
        }

    if expires_at and expires_at <= now:
        return {
            "mode": "present",
            "source": "expired",
            "expired": True,
            "expires_at": expires_at.isoformat(),
            "updated_at": state.get("updated_at"),
            "path": str(path),
        }

    return {
        "mode": mode,
        "source": "file",
        "expired": False,
        "expires_at": expires_at.isoformat() if expires_at else None,
        "updated_at": state.get("updated_at"),
        "path": str(path),
    }


def set_presence(
    mode: str,
    runtime_home: str | Path | None = None,
    duration_minutes: int | None = None,
) -> dict[str, Any]:
    if mode not in {"present", "away"}:
        raise ValueError("Mode must be either 'present' or 'away'.")

    now = utc_now()
    state: dict[str, Any] = {
        "version": 1,
        "mode": mode,
        "updated_at": now.isoformat(),
        "machine_name": os.environ.get("COMPUTERNAME", ""),
        "user_name": os.environ.get("USERNAME", ""),
        "expires_at": None,
    }

    if mode == "away" and duration_minutes and duration_minutes > 0:
        state["expires_at"] = (now + timedelta(minutes=duration_minutes)).isoformat()

    write_json(presence_path(runtime_home), state)
    return state


def load_repo_registry(runtime_home: str | Path | None = None) -> dict[str, Any]:
    path = repo_registry_path(runtime_home)
    registry = read_json(path, default=None)
    if not isinstance(registry, dict):
        return {
            "version": 1,
            "updated_at": utc_now_iso(),
            "repos": [],
            "path": str(path),
        }

    registry.setdefault("version", 1)
    registry.setdefault("updated_at", utc_now_iso())
    repos = registry.get("repos")
    if not isinstance(repos, list):
        registry["repos"] = []
    registry["path"] = str(path)
    return registry


def save_repo_registry(
    registry: dict[str, Any],
    runtime_home: str | Path | None = None,
) -> dict[str, Any]:
    path = repo_registry_path(runtime_home)
    registry["version"] = 1
    registry["updated_at"] = utc_now_iso()
    registry["path"] = str(path)
    write_json(path, registry)
    return registry


def add_repo_to_registry(
    repo_root: str | Path,
    runtime_home: str | Path | None = None,
) -> dict[str, Any]:
    registry = load_repo_registry(runtime_home)
    resolved = str(Path(repo_root).expanduser().resolve())
    now = utc_now_iso()
    retained: list[dict[str, Any]] = []
    existing: dict[str, Any] | None = None

    for entry in registry["repos"]:
        if str(entry.get("root", "")).lower() == resolved.lower():
            existing = entry
            continue
        retained.append(entry)

    retained.append(
        {
            "root": resolved,
            "active": True,
            "added_at": existing.get("added_at", now) if existing else now,
            "updated_at": now,
        }
    )
    registry["repos"] = sorted(retained, key=lambda item: item["root"].lower())
    return save_repo_registry(registry, runtime_home)


def remove_repo_from_registry(
    repo_root: str | Path,
    runtime_home: str | Path | None = None,
) -> dict[str, Any]:
    registry = load_repo_registry(runtime_home)
    resolved = str(Path(repo_root).expanduser().resolve())
    now = utc_now_iso()
    retained: list[dict[str, Any]] = []

    for entry in registry["repos"]:
        if str(entry.get("root", "")).lower() == resolved.lower():
            retained.append(
                {
                    "root": resolved,
                    "active": False,
                    "added_at": entry.get("added_at", now),
                    "updated_at": now,
                }
            )
        else:
            retained.append(entry)

    registry["repos"] = sorted(retained, key=lambda item: item["root"].lower())
    return save_repo_registry(registry, runtime_home)


def approval_state_root(repo_root: str | Path) -> Path:
    return Path(repo_root).expanduser().resolve() / ".agents" / "runtime" / "approvals"


def iter_approval_state_paths(repo_root: str | Path) -> list[Path]:
    root = approval_state_root(repo_root)
    if not root.exists():
        return []
    return sorted(root.glob("*.json"))


def validate_template_repo(repo_root: str | Path) -> tuple[bool, list[str]]:
    root = Path(repo_root).expanduser().resolve()
    missing = [str(marker) for marker in REQUIRED_REPO_MARKERS if not (root / marker).exists()]
    return len(missing) == 0, missing


def summarize_repo(repo_root: str | Path) -> RepoStateSummary:
    root = Path(repo_root).expanduser().resolve()
    is_valid, missing = validate_template_repo(root)
    summary = RepoStateSummary(root=root, is_valid_template=is_valid, missing_markers=missing)
    counts: dict[str, int] = {}
    last_updated: datetime | None = None

    for state_path in iter_approval_state_paths(root):
        state = read_json(state_path, default=None)
        if not isinstance(state, dict):
            summary.errors.append(f"Invalid JSON: {state_path.name}")
            continue

        status = str(state.get("status") or "unknown")
        counts[status] = counts.get(status, 0) + 1

        updated_at = parse_timestamp(state.get("updated_at"))
        if updated_at is None:
            try:
                updated_at = datetime.fromtimestamp(
                    state_path.stat().st_mtime,
                    tz=timezone.utc,
                )
            except OSError:
                updated_at = None
        if updated_at and (last_updated is None or updated_at > last_updated):
            last_updated = updated_at

    summary.status_counts = counts
    summary.pending_count = counts.get("pending", 0)
    summary.local_wait_count = counts.get("local_wait", 0)
    summary.timeout_count = counts.get("timeout", 0)
    summary.send_failed_count = counts.get("send_failed", 0)
    summary.last_updated = last_updated.isoformat() if last_updated else ""
    return summary


def load_repo_summaries(runtime_home: str | Path | None = None) -> list[RepoStateSummary]:
    registry = load_repo_registry(runtime_home)
    summaries: list[RepoStateSummary] = []
    for entry in registry["repos"]:
        if not entry.get("active"):
            continue
        root = entry.get("root")
        if not root:
            continue
        summaries.append(summarize_repo(root))
    return summaries


def collect_overview(runtime_home: str | Path | None = None) -> dict[str, Any]:
    repo_summaries = load_repo_summaries(runtime_home)
    totals = {
        "pending": 0,
        "local_wait": 0,
        "timeout": 0,
        "send_failed": 0,
    }
    invalid_repos = 0
    for repo in repo_summaries:
        totals["pending"] += repo.pending_count
        totals["local_wait"] += repo.local_wait_count
        totals["timeout"] += repo.timeout_count
        totals["send_failed"] += repo.send_failed_count
        if not repo.is_valid_template:
            invalid_repos += 1

    return {
        "repo_summaries": repo_summaries,
        "totals": totals,
        "invalid_repos": invalid_repos,
        "presence": get_effective_presence(runtime_home),
        "registry": load_repo_registry(runtime_home),
        "runtime_home": str(resolve_runtime_home(runtime_home)),
        "optional_markers": [str(marker) for marker in OPTIONAL_REPO_MARKERS],
    }
