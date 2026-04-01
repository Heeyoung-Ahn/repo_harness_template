from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any

from .channels import (
    ChannelError,
    answer_callback_query,
    send_telegram_message,
    telegram_api,
)
from .constants import (
    CHANNEL_MODE_CHOICES,
    DEFAULT_GRACE_MINUTES,
    DEFAULT_NOTIFICATION_CHANNEL_MODE,
)
from .env_store import load_settings
from .models import WatcherSummary
from .runtime_store import (
    get_effective_presence,
    iter_approval_state_paths,
    load_repo_registry,
    parse_timestamp,
    read_json,
    resolve_runtime_home,
    telegram_offset_path,
    utc_now,
    utc_now_iso,
    watcher_log_path,
    watcher_summary_path,
    write_json,
)

_CALLBACK_PATTERN = re.compile(r"^gate:(?P<decision>[A-Za-z0-9]+):(?P<choice>[a-z0-9-]+)$")
_COMMAND_PATTERN = re.compile(r"^/(?P<command>[a-z0-9-]+)(?:\s+(?P<decision>[A-Za-z0-9]+))?\s*$")


def _append_log(runtime_home: str | Path | None, message: str) -> None:
    path = watcher_log_path(runtime_home)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(f"{utc_now_iso()} {message}{os.linesep}")


def _normalize_channel_mode(value: str | None) -> str:
    text = (value or DEFAULT_NOTIFICATION_CHANNEL_MODE).strip().lower()
    if text not in CHANNEL_MODE_CHOICES:
        return DEFAULT_NOTIFICATION_CHANNEL_MODE
    return text


def _get_telegram_offset(path: Path) -> int:
    if not path.exists():
        return 0
    try:
        return int(path.read_text(encoding="utf-8").strip() or "0")
    except (OSError, ValueError):
        return 0


def _set_telegram_offset(path: Path, offset: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(str(offset), encoding="utf-8")


def _telegram_wait_lock_path(bot_token: str, chat_id: str) -> Path:
    digest = hashlib.sha256(f"{bot_token}\n{chat_id}".encode("utf-8")).hexdigest()[:16]
    return Path(tempfile.gettempdir()) / f"harness-telegram-wait-{digest}.lock"


def _acquire_telegram_wait_lock(path: Path, decision_id: str) -> Any | None:
    try:
        handle = path.open("x", encoding="utf-8")
    except FileExistsError:
        return None

    handle.write(
        json.dumps(
            {
                "decision_id": decision_id,
                "pid": os.getpid(),
                "created_at": utc_now_iso(),
            }
        )
        + os.linesep
    )
    handle.flush()
    return handle


def _release_telegram_wait_lock(handle: Any | None, path: Path) -> None:
    if handle is not None:
        handle.close()
    if path.exists():
        try:
            path.unlink()
        except OSError:
            return


def _resolve_timeout(state_path: Path, state: dict[str, Any]) -> None:
    state["status"] = "timeout"
    state["timed_out_at"] = utc_now_iso()
    state["updated_at"] = utc_now_iso()
    write_json(state_path, state)


def _replay_remote_choice_gate(
    repo_root: Path,
    state: dict[str, Any],
    *,
    force_immediate: bool,
) -> bool:
    invoke_script = repo_root / ".agents" / "scripts" / "invoke_user_gate.ps1"
    if not invoke_script.exists():
        return False

    labels = [str(item.get("label", "")).strip() for item in state.get("options", [])]
    labels = [label for label in labels if label]
    if not labels:
        labels = ["approve", "hold", "reject"]

    grace_minutes = state.get("local_response_grace_minutes", DEFAULT_GRACE_MINUTES)
    try:
        grace_minutes = int(grace_minutes)
    except (TypeError, ValueError):
        grace_minutes = DEFAULT_GRACE_MINUTES

    args = [
        "powershell.exe",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(invoke_script),
        "-TaskId",
        str(state.get("task_id", "")),
        "-Prompt",
        str(state.get("prompt", "")),
        "-DecisionId",
        str(state.get("decision_id", "")),
        "-DefaultAction",
        str(state.get("default_action", "hold")),
        "-DeliveryMode",
        "always" if force_immediate else "local-first",
        "-LocalResponseGraceMinutes",
        str(grace_minutes),
        "-Options",
        *labels,
    ]

    project_name = str(state.get("project_name", "")).strip()
    if project_name:
        args.extend(["-ProjectName", project_name])

    context = str(state.get("context", "")).strip()
    if context:
        args.extend(["-Context", context])

    completed = subprocess.run(
        args,
        cwd=str(repo_root),
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        stderr = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(stderr or f"invoke_user_gate failed for {repo_root}")
    return True


def _match_telegram_decision(
    update: dict[str, Any],
    pending_by_decision: dict[str, Path],
    expected_chat_id: str,
) -> dict[str, Any] | None:
    callback = update.get("callback_query")
    if isinstance(callback, dict):
        message = callback.get("message") or {}
        chat = message.get("chat") or {}
        chat_id = str(chat.get("id") or "")
        data = str(callback.get("data") or "")
        match = _CALLBACK_PATTERN.match(data)
        if chat_id == str(expected_chat_id) and match:
            decision_id = match.group("decision")
            selected_value = match.group("choice")
            state = read_json(pending_by_decision.get(decision_id, Path()), default=None)
            if isinstance(state, dict):
                allowed = {
                    str(option.get("value"))
                    for option in state.get("options", [])
                    if option.get("value")
                }
                if selected_value in allowed:
                    return {
                        "decision_id": decision_id,
                        "selected_value": selected_value,
                        "callback_id": str(callback.get("id") or ""),
                        "update_id": int(update.get("update_id", 0)),
                        "user": str((callback.get("from") or {}).get("username") or ""),
                        "user_id": str((callback.get("from") or {}).get("id") or ""),
                        "source": "callback_query",
                    }

    message = update.get("message")
    if isinstance(message, dict):
        chat = message.get("chat") or {}
        chat_id = str(chat.get("id") or "")
        text = str(message.get("text") or "")
        match = _COMMAND_PATTERN.match(text)
        if chat_id == str(expected_chat_id) and match:
            decision_id = match.group("decision") or ""
            selected_value = match.group("command")
            if not decision_id and len(pending_by_decision) == 1:
                decision_id = next(iter(pending_by_decision))

            state = read_json(pending_by_decision.get(decision_id, Path()), default=None)
            if isinstance(state, dict):
                allowed = {
                    str(option.get("value"))
                    for option in state.get("options", [])
                    if option.get("value")
                }
                if selected_value in allowed:
                    return {
                        "decision_id": decision_id,
                        "selected_value": selected_value,
                        "callback_id": "",
                        "update_id": int(update.get("update_id", 0)),
                        "user": str((message.get("from") or {}).get("username") or ""),
                        "user_id": str((message.get("from") or {}).get("id") or ""),
                        "source": "message_command",
                    }

    return None


def _build_confirmation_text(state: dict[str, Any], selected_label: str, selected_value: str) -> str:
    project_name = str(state.get("project_name", "")).strip() or "project"
    task_id = str(state.get("task_id", "")).strip() or "-"
    decision_id = str(state.get("decision_id", "")).strip() or "-"
    prompt = str(state.get("prompt", "")).strip()

    lines = [
        f"[{project_name}] {task_id}",
        f"Recorded: {selected_label}",
        f"Decision ID: {decision_id}",
    ]
    if prompt:
        lines.append(f"Prompt: {prompt}")
    lines.append(f"Status: resolved ({selected_value})")
    return os.linesep.join(lines)


def _poll_pending_decisions(
    pending_by_decision: dict[str, Path],
    *,
    bot_token: str,
    chat_id: str,
    runtime_home: str | Path | None,
    summary: WatcherSummary,
) -> None:
    offset_path = telegram_offset_path(runtime_home)
    offset = _get_telegram_offset(offset_path)
    wait_lock_path = _telegram_wait_lock_path(bot_token, chat_id)
    wait_lock = _acquire_telegram_wait_lock(wait_lock_path, "watcher")
    if wait_lock is None:
        return

    try:
        payload: dict[str, int] = {"timeout": 1}
        if offset > 0:
            payload["offset"] = offset

        updates = telegram_api(
            bot_token,
            "getUpdates",
            http_method="GET",
            payload=payload,
        )
        for update in updates.get("result", []):
            offset = int(update.get("update_id", 0)) + 1
            match = _match_telegram_decision(update, pending_by_decision, chat_id)
            if match is None:
                continue

            state_path = pending_by_decision[match["decision_id"]]
            state = read_json(state_path, default=None)
            if not isinstance(state, dict) or state.get("status") != "pending":
                continue

            selected_option = None
            for option in state.get("options", []):
                if str(option.get("value")) == match["selected_value"]:
                    selected_option = option
                    break

            if match["callback_id"]:
                try:
                    answer_callback_query(
                        bot_token,
                        match["callback_id"],
                        f"Recorded: {match['selected_value']}",
                    )
                except ChannelError as exc:
                    _append_log(
                        runtime_home,
                        f"Callback acknowledgement failed for {match['decision_id']}: {exc}"
                    )

            state["status"] = "resolved"
            state["selected_value"] = match["selected_value"]
            state["selected_label"] = (
                str(selected_option.get("label"))
                if isinstance(selected_option, dict)
                else match["selected_value"]
            )
            state["resolved_at"] = utc_now_iso()
            state["decision_source"] = match["source"]
            state["decision_user"] = match["user"]
            state["decision_user_id"] = match["user_id"]
            state["telegram_update_id"] = match["update_id"]
            state["updated_at"] = utc_now_iso()
            write_json(state_path, state)

            send_telegram_message(
                bot_token,
                chat_id,
                _build_confirmation_text(
                    state,
                    state["selected_label"],
                    match["selected_value"],
                ),
                reply_to_message_id=(
                    int(state["telegram_message_id"])
                    if state.get("telegram_message_id") is not None
                    else None
                ),
            )
            summary.resolved += 1

        _set_telegram_offset(offset_path, offset)
    except ChannelError as exc:
        summary.errors.append(f"Telegram polling failed: {exc}")
    finally:
        _release_telegram_wait_lock(wait_lock, wait_lock_path)


def watch_once(
    *,
    runtime_home: str | Path | None = None,
    dry_run: bool = False,
) -> WatcherSummary:
    resolved_runtime_home = resolve_runtime_home(runtime_home)
    settings = load_settings()
    presence = get_effective_presence(resolved_runtime_home)
    registry = load_repo_registry(resolved_runtime_home)
    summary = WatcherSummary()
    pending_by_decision: dict[str, Path] = {}
    now = utc_now()

    for repo in registry.get("repos", []):
        if not repo.get("active"):
            continue

        repo_root_text = str(repo.get("root") or "").strip()
        if not repo_root_text:
            continue

        repo_root = Path(repo_root_text)
        if not repo_root.exists():
            continue

        summary.scanned_repos += 1
        for state_path in iter_approval_state_paths(repo_root):
            summary.scanned_states += 1
            state = read_json(state_path, default=None)
            if not isinstance(state, dict):
                continue

            status = str(state.get("status") or "")
            if status in {"resolved", "timeout", "send_failed", "local_only", "blocked_local"}:
                continue

            expires_at = parse_timestamp(state.get("expires_at"))
            if expires_at and now >= expires_at and status in {"local_wait", "pending"}:
                if not dry_run:
                    _resolve_timeout(state_path, state)
                summary.timed_out += 1
                continue

            if status == "local_wait":
                notify_after = parse_timestamp(state.get("notify_after_at"))
                force_immediate = (
                    presence["mode"] == "away"
                    and str(state.get("decision_class") or "") == "remote-choice"
                )
                should_replay = force_immediate or (notify_after is not None and now >= notify_after)

                if should_replay:
                    try:
                        if not dry_run and _replay_remote_choice_gate(
                            repo_root,
                            state,
                            force_immediate=force_immediate,
                        ):
                            summary.escalated += 1
                        elif dry_run:
                            summary.escalated += 1
                    except Exception as exc:  # noqa: BLE001
                        summary.errors.append(f"Replay failed for {state_path}: {exc}")

                    state = read_json(state_path, default=None)
                    if not isinstance(state, dict):
                        continue
                    status = str(state.get("status") or "")

            if status == "pending" and str(state.get("decision_class") or "") == "remote-choice":
                decision_id = str(state.get("decision_id") or "").strip()
                if decision_id and decision_id not in pending_by_decision:
                    pending_by_decision[decision_id] = state_path
                elif decision_id:
                    summary.errors.append(f"Duplicate pending decision id '{decision_id}' detected.")

    summary.pending_for_resolution = len(pending_by_decision)

    if pending_by_decision and settings.telegram_bot_token and settings.telegram_chat_id:
        _poll_pending_decisions(
            pending_by_decision,
            bot_token=settings.telegram_bot_token,
            chat_id=settings.telegram_chat_id,
            runtime_home=resolved_runtime_home,
            summary=summary,
        )

    if not dry_run:
        write_json(
            watcher_summary_path(resolved_runtime_home),
            {
                **summary.to_dict(),
                "channel_mode": _normalize_channel_mode(settings.notification_channel_mode),
                "presence_mode": presence["mode"],
                "recorded_at": utc_now_iso(),
            },
        )

    return summary


def run_watch_once(runtime_home: str | Path | None = None) -> int:
    try:
        summary = watch_once(runtime_home=runtime_home)
    except Exception as exc:  # noqa: BLE001
        _append_log(runtime_home, f"watch_once failed: {exc}")
        return 1

    if summary.errors:
        for error in summary.errors:
            _append_log(runtime_home, error)
    else:
        _append_log(
            runtime_home,
            (
                "watch_once completed "
                f"(repos={summary.scanned_repos}, states={summary.scanned_states}, "
                f"pending={summary.pending_for_resolution}, resolved={summary.resolved})"
            ),
        )
    return 0
