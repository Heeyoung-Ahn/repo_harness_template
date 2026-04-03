from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from .constants import (
    CHANNEL_MODE_CHOICES,
    DEFAULT_GRACE_MINUTES,
    DEFAULT_NOTIFICATION_CHANNEL_MODE,
    DEFAULT_NTFY_SERVER,
)


@dataclass(slots=True)
class AppSettings:
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    ntfy_server: str = DEFAULT_NTFY_SERVER
    ntfy_topic: str = ""
    local_response_grace_minutes: int = DEFAULT_GRACE_MINUTES
    runtime_home: str = ""
    notification_channel_mode: str = DEFAULT_NOTIFICATION_CHANNEL_MODE

    def normalize(self) -> "AppSettings":
        if self.local_response_grace_minutes < 0:
            raise ValueError("Grace minutes must be zero or greater.")

        if self.notification_channel_mode not in CHANNEL_MODE_CHOICES:
            raise ValueError(
                "Notification channel mode must be one of: "
                + ", ".join(CHANNEL_MODE_CHOICES)
            )

        self.telegram_bot_token = self.telegram_bot_token.strip()
        self.telegram_chat_id = self.telegram_chat_id.strip()
        self.ntfy_server = (self.ntfy_server or DEFAULT_NTFY_SERVER).strip().rstrip("/")
        self.ntfy_topic = self.ntfy_topic.strip()
        self.runtime_home = self.runtime_home.strip()
        return self


@dataclass(slots=True)
class RepoStateSummary:
    root: Path
    is_valid_template: bool
    missing_markers: list[str] = field(default_factory=list)
    status_counts: dict[str, int] = field(default_factory=dict)
    pending_count: int = 0
    local_wait_count: int = 0
    timeout_count: int = 0
    send_failed_count: int = 0
    last_updated: str = ""
    errors: list[str] = field(default_factory=list)


@dataclass(slots=True)
class WatcherTaskInfo:
    installed: bool
    task_name: str
    state: str = ""
    execute: str = ""
    arguments: str = ""


@dataclass(slots=True)
class LaunchSpec:
    execute: str
    arguments: str
    mode_label: str


@dataclass(slots=True)
class WatcherSummary:
    scanned_repos: int = 0
    scanned_states: int = 0
    escalated: int = 0
    resolved: int = 0
    timed_out: int = 0
    pending_for_resolution: int = 0
    errors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {
            "scanned_repos": self.scanned_repos,
            "scanned_states": self.scanned_states,
            "escalated": self.escalated,
            "resolved": self.resolved,
            "timed_out": self.timed_out,
            "pending_for_resolution": self.pending_for_resolution,
            "errors": list(self.errors),
        }
