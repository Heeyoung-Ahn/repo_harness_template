from __future__ import annotations

import os
import sys
import tkinter as tk
import webbrowser
from tkinter import filedialog, messagebox, ttk

from .channels import (
    ChannelError,
    fetch_chat_candidates,
    generate_random_ntfy_topic,
    get_bot_profile,
    send_ntfy_test_notification,
    send_telegram_test_message,
)
from .constants import (
    APP_NAME,
    APP_VERSION,
    BOTFATHER_URL,
    CHANNEL_MODE_TELEGRAM_AND_NTFY,
    CHANNEL_MODE_TELEGRAM_ONLY,
    DEFAULT_AWAY_MINUTES,
    DEFAULT_NTFY_SERVER,
    TELEGRAM_WEB_URL,
)
from .env_store import load_settings, save_settings
from .models import AppSettings
from .runtime_store import (
    add_repo_to_registry,
    collect_overview,
    default_runtime_home,
    remove_repo_from_registry,
    resolve_runtime_home,
    set_presence,
    validate_template_repo,
    watcher_summary_path,
    read_json,
)
from .scheduler import SchedulerError, get_task_info, install_task, remove_task
from .watcher import watch_once


class HarnessAdminUI(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title(f"{APP_NAME} v{APP_VERSION}")
        self.geometry("1320x860")
        self.minsize(1180, 760)

        self.settings_vars: dict[str, tk.StringVar] = {}
        self.visible_debug_var = tk.BooleanVar(value=False)
        self.custom_away_minutes_var = tk.StringVar(value=str(DEFAULT_AWAY_MINUTES))
        self.status_var = tk.StringVar(value="Ready.")
        self.bot_profile_var = tk.StringVar(value="Bot profile: not loaded")
        self.chat_candidates: list[dict[str, str]] = []

        self._load_settings_into_vars(load_settings())
        self._build_ui()
        self.refresh_dashboard()
        self.after(15000, self._auto_refresh)

    def _load_settings_into_vars(self, settings: AppSettings) -> None:
        values = {
            "telegram_bot_token": settings.telegram_bot_token,
            "telegram_chat_id": settings.telegram_chat_id,
            "ntfy_server": settings.ntfy_server or DEFAULT_NTFY_SERVER,
            "ntfy_topic": settings.ntfy_topic,
            "local_response_grace_minutes": str(settings.local_response_grace_minutes),
            "runtime_home": settings.runtime_home or str(default_runtime_home()),
            "notification_channel_mode": settings.notification_channel_mode,
        }
        for key, value in values.items():
            if key not in self.settings_vars:
                self.settings_vars[key] = tk.StringVar(value=value)
            else:
                self.settings_vars[key].set(value)

    def _build_ui(self) -> None:
        self.columnconfigure(0, weight=1)
        self.rowconfigure(1, weight=1)

        toolbar = ttk.Frame(self, padding=(12, 12, 12, 6))
        toolbar.grid(row=0, column=0, sticky="ew")
        toolbar.columnconfigure(8, weight=1)

        ttk.Button(toolbar, text="Refresh", command=self.refresh_dashboard).grid(row=0, column=0, padx=(0, 8))
        ttk.Button(toolbar, text="Install Watcher", command=self.install_watcher).grid(row=0, column=1, padx=(0, 8))
        ttk.Button(toolbar, text="Remove Watcher", command=self.remove_watcher).grid(row=0, column=2, padx=(0, 8))
        ttk.Button(toolbar, text="Run Watcher Once", command=self.run_watcher_once).grid(row=0, column=3, padx=(0, 8))
        ttk.Button(toolbar, text="Open Runtime Home", command=self.open_runtime_home).grid(row=0, column=4, padx=(0, 8))
        ttk.Checkbutton(toolbar, text="Visible debug install", variable=self.visible_debug_var).grid(row=0, column=5, padx=(12, 8))
        ttk.Label(toolbar, textvariable=self.status_var).grid(row=0, column=8, sticky="e")

        notebook = ttk.Notebook(self)
        notebook.grid(row=1, column=0, sticky="nsew", padx=12, pady=(0, 12))

        self.overview_frame = ttk.Frame(notebook, padding=12)
        self.projects_frame = ttk.Frame(notebook, padding=12)
        self.presence_frame = ttk.Frame(notebook, padding=12)
        self.settings_frame = ttk.Frame(notebook, padding=12)
        self.wizard_frame = ttk.Frame(notebook, padding=12)

        notebook.add(self.overview_frame, text="Overview")
        notebook.add(self.projects_frame, text="Projects")
        notebook.add(self.presence_frame, text="Presence")
        notebook.add(self.settings_frame, text="Settings")
        notebook.add(self.wizard_frame, text="Setup Wizard")

        self._build_overview_tab()
        self._build_projects_tab()
        self._build_presence_tab()
        self._build_settings_tab()
        self._build_wizard_tab()

    def _build_overview_tab(self) -> None:
        frame = self.overview_frame
        frame.columnconfigure(0, weight=1)
        frame.columnconfigure(1, weight=1)
        frame.rowconfigure(1, weight=1)

        task_group = ttk.LabelFrame(frame, text="Watcher Status", padding=12)
        task_group.grid(row=0, column=0, sticky="nsew", padx=(0, 8), pady=(0, 8))
        task_group.columnconfigure(1, weight=1)

        self.task_installed_var = tk.StringVar()
        self.task_state_var = tk.StringVar()
        self.task_command_var = tk.StringVar()

        ttk.Label(task_group, text="Installed").grid(row=0, column=0, sticky="w")
        ttk.Label(task_group, textvariable=self.task_installed_var).grid(row=0, column=1, sticky="w")
        ttk.Label(task_group, text="State").grid(row=1, column=0, sticky="w")
        ttk.Label(task_group, textvariable=self.task_state_var).grid(row=1, column=1, sticky="w")
        ttk.Label(task_group, text="Command").grid(row=2, column=0, sticky="nw")
        ttk.Label(task_group, textvariable=self.task_command_var, wraplength=520, justify="left").grid(row=2, column=1, sticky="w")

        runtime_group = ttk.LabelFrame(frame, text="Runtime Status", padding=12)
        runtime_group.grid(row=0, column=1, sticky="nsew", pady=(0, 8))
        runtime_group.columnconfigure(1, weight=1)

        self.presence_status_var = tk.StringVar()
        self.channel_mode_status_var = tk.StringVar()
        self.telegram_status_var = tk.StringVar()
        self.ntfy_status_var = tk.StringVar()
        self.summary_counts_var = tk.StringVar()

        labels = (
            ("Presence", self.presence_status_var),
            ("Channel mode", self.channel_mode_status_var),
            ("Telegram", self.telegram_status_var),
            ("ntfy", self.ntfy_status_var),
            ("Counts", self.summary_counts_var),
        )
        for row_index, (label, variable) in enumerate(labels):
            ttk.Label(runtime_group, text=label).grid(row=row_index, column=0, sticky="w")
            ttk.Label(runtime_group, textvariable=variable, wraplength=520, justify="left").grid(row=row_index, column=1, sticky="w")

        repos_group = ttk.LabelFrame(frame, text="Monitored Projects", padding=12)
        repos_group.grid(row=1, column=0, columnspan=2, sticky="nsew")
        repos_group.columnconfigure(0, weight=1)
        repos_group.rowconfigure(0, weight=1)

        columns = ("valid", "pending", "local_wait", "timeout", "send_failed", "last_updated")
        self.overview_tree = ttk.Treeview(repos_group, columns=columns, show="tree headings", height=14)
        self.overview_tree.heading("#0", text="Project Root")
        for name, text in (
            ("valid", "Template"),
            ("pending", "Pending"),
            ("local_wait", "Local Wait"),
            ("timeout", "Timeout"),
            ("send_failed", "Send Failed"),
            ("last_updated", "Last Updated"),
        ):
            self.overview_tree.heading(name, text=text)
        self.overview_tree.column("#0", width=560)
        self.overview_tree.column("valid", width=90, anchor="center")
        self.overview_tree.column("pending", width=80, anchor="center")
        self.overview_tree.column("local_wait", width=90, anchor="center")
        self.overview_tree.column("timeout", width=80, anchor="center")
        self.overview_tree.column("send_failed", width=90, anchor="center")
        self.overview_tree.column("last_updated", width=180, anchor="center")
        self.overview_tree.grid(row=0, column=0, sticky="nsew")

        scrollbar = ttk.Scrollbar(repos_group, orient="vertical", command=self.overview_tree.yview)
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.overview_tree.configure(yscrollcommand=scrollbar.set)

    def _build_projects_tab(self) -> None:
        frame = self.projects_frame
        frame.columnconfigure(0, weight=1)
        frame.rowconfigure(1, weight=1)

        controls = ttk.Frame(frame)
        controls.grid(row=0, column=0, sticky="ew", pady=(0, 8))
        ttk.Button(controls, text="Add Folder", command=self.add_project).grid(row=0, column=0, padx=(0, 8))
        ttk.Button(controls, text="Remove Selected", command=self.remove_selected_project).grid(row=0, column=1, padx=(0, 8))
        ttk.Button(controls, text="Open Folder", command=self.open_selected_project).grid(row=0, column=2, padx=(0, 8))

        columns = ("valid", "pending", "local_wait", "timeout", "send_failed", "last_updated")
        self.projects_tree = ttk.Treeview(frame, columns=columns, show="tree headings", height=18)
        self.projects_tree.heading("#0", text="Project Root")
        for name, text in (
            ("valid", "Template"),
            ("pending", "Pending"),
            ("local_wait", "Local Wait"),
            ("timeout", "Timeout"),
            ("send_failed", "Send Failed"),
            ("last_updated", "Last Updated"),
        ):
            self.projects_tree.heading(name, text=text)
        self.projects_tree.column("#0", width=560)
        self.projects_tree.column("valid", width=90, anchor="center")
        self.projects_tree.column("pending", width=80, anchor="center")
        self.projects_tree.column("local_wait", width=90, anchor="center")
        self.projects_tree.column("timeout", width=80, anchor="center")
        self.projects_tree.column("send_failed", width=90, anchor="center")
        self.projects_tree.column("last_updated", width=180, anchor="center")
        self.projects_tree.grid(row=1, column=0, sticky="nsew")

        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=self.projects_tree.yview)
        scrollbar.grid(row=1, column=1, sticky="ns")
        self.projects_tree.configure(yscrollcommand=scrollbar.set)

    def _build_presence_tab(self) -> None:
        frame = self.presence_frame
        frame.columnconfigure(0, weight=1)

        status_group = ttk.LabelFrame(frame, text="Current Presence", padding=12)
        status_group.grid(row=0, column=0, sticky="ew", pady=(0, 12))
        status_group.columnconfigure(1, weight=1)

        self.presence_detail_var = tk.StringVar()
        ttk.Label(status_group, text="Status").grid(row=0, column=0, sticky="w")
        ttk.Label(status_group, textvariable=self.presence_detail_var, wraplength=760).grid(row=0, column=1, sticky="w")

        action_group = ttk.LabelFrame(frame, text="Quick Actions", padding=12)
        action_group.grid(row=1, column=0, sticky="ew")

        ttk.Button(action_group, text="Present", command=self.set_present).grid(row=0, column=0, padx=(0, 8), pady=(0, 8))
        ttk.Button(action_group, text="Away 30 min", command=lambda: self.set_away(30)).grid(row=0, column=1, padx=(0, 8), pady=(0, 8))
        ttk.Button(action_group, text="Away 60 min", command=lambda: self.set_away(60)).grid(row=0, column=2, padx=(0, 8), pady=(0, 8))
        ttk.Button(action_group, text="Away 120 min", command=lambda: self.set_away(120)).grid(row=0, column=3, padx=(0, 8), pady=(0, 8))

        ttk.Label(action_group, text="Custom away minutes").grid(row=1, column=0, sticky="w")
        ttk.Entry(action_group, textvariable=self.custom_away_minutes_var, width=12).grid(row=1, column=1, sticky="w", padx=(0, 8))
        ttk.Button(action_group, text="Apply Custom Away", command=self.apply_custom_away).grid(row=1, column=2, sticky="w")

    def _build_settings_tab(self) -> None:
        frame = self.settings_frame
        frame.columnconfigure(0, weight=1)
        frame.columnconfigure(1, weight=1)

        channels_group = ttk.LabelFrame(frame, text="Channels", padding=12)
        channels_group.grid(row=0, column=0, sticky="nsew", padx=(0, 8), pady=(0, 8))
        channels_group.columnconfigure(1, weight=1)

        fields = (
            ("Telegram bot token", "telegram_bot_token", True),
            ("Telegram chat id", "telegram_chat_id", False),
            ("ntfy server", "ntfy_server", False),
            ("ntfy topic", "ntfy_topic", False),
        )
        for row_index, (label, key, secret) in enumerate(fields):
            ttk.Label(channels_group, text=label).grid(row=row_index, column=0, sticky="w")
            ttk.Entry(
                channels_group,
                textvariable=self.settings_vars[key],
                show="*" if secret else "",
                width=48,
            ).grid(row=row_index, column=1, sticky="ew", pady=4)

        ttk.Label(channels_group, text="Notification mode").grid(row=4, column=0, sticky="w")
        mode_frame = ttk.Frame(channels_group)
        mode_frame.grid(row=4, column=1, sticky="w", pady=4)
        ttk.Radiobutton(
            mode_frame,
            text="Telegram only",
            variable=self.settings_vars["notification_channel_mode"],
            value=CHANNEL_MODE_TELEGRAM_ONLY,
        ).grid(row=0, column=0, padx=(0, 12))
        ttk.Radiobutton(
            mode_frame,
            text="Telegram + ntfy",
            variable=self.settings_vars["notification_channel_mode"],
            value=CHANNEL_MODE_TELEGRAM_AND_NTFY,
        ).grid(row=0, column=1)

        runtime_group = ttk.LabelFrame(frame, text="Runtime", padding=12)
        runtime_group.grid(row=0, column=1, sticky="nsew", pady=(0, 8))
        runtime_group.columnconfigure(1, weight=1)

        ttk.Label(runtime_group, text="Grace minutes").grid(row=0, column=0, sticky="w")
        ttk.Entry(runtime_group, textvariable=self.settings_vars["local_response_grace_minutes"], width=12).grid(row=0, column=1, sticky="w", pady=4)
        ttk.Label(runtime_group, text="Runtime home").grid(row=1, column=0, sticky="w")
        ttk.Entry(runtime_group, textvariable=self.settings_vars["runtime_home"], width=48).grid(row=1, column=1, sticky="ew", pady=4)
        ttk.Button(runtime_group, text="Browse", command=self.browse_runtime_home).grid(row=1, column=2, padx=(8, 0))
        ttk.Button(runtime_group, text="Open Runtime Home", command=self.open_runtime_home).grid(row=2, column=1, sticky="w", pady=(8, 0))

        action_group = ttk.Frame(frame)
        action_group.grid(row=1, column=0, columnspan=2, sticky="ew")
        ttk.Button(action_group, text="Save Settings", command=self.save_settings).grid(row=0, column=0, padx=(0, 8))
        ttk.Button(action_group, text="Fetch Chat IDs", command=self.fetch_chat_ids).grid(row=0, column=1, padx=(0, 8))
        ttk.Button(action_group, text="Send Telegram Test", command=self.send_telegram_test).grid(row=0, column=2, padx=(0, 8))
        ttk.Button(action_group, text="Send ntfy Test", command=self.send_ntfy_test).grid(row=0, column=3, padx=(0, 8))

    def _build_wizard_tab(self) -> None:
        frame = self.wizard_frame
        frame.columnconfigure(0, weight=1)
        frame.rowconfigure(0, weight=1)

        wizard_notebook = ttk.Notebook(frame)
        wizard_notebook.grid(row=0, column=0, sticky="nsew")

        telegram_tab = ttk.Frame(wizard_notebook, padding=12)
        ntfy_tab = ttk.Frame(wizard_notebook, padding=12)
        wizard_notebook.add(telegram_tab, text="Telegram Wizard")
        wizard_notebook.add(ntfy_tab, text="ntfy Wizard")

        self._build_telegram_wizard(telegram_tab)
        self._build_ntfy_wizard(ntfy_tab)

    def _build_telegram_wizard(self, frame: ttk.Frame) -> None:
        frame.columnconfigure(0, weight=1)
        frame.rowconfigure(5, weight=1)

        sections = [
            ("1. Open BotFather", "Create a bot with /newbot in Telegram.", self.open_botfather),
            ("2. Save bot token", "Paste the bot token below, then save settings.", None),
            ("3. Open your bot chat", "Use the button below after the token is filled.", self.open_bot_chat),
            ("4. Send /start", "In Telegram, send /start to the bot before fetching chat ids.", self.open_telegram_web),
            ("5. Fetch chat ids", "Use getUpdates to discover personal chat ids.", self.fetch_chat_ids),
        ]

        for row_index, (title, body, callback) in enumerate(sections):
            group = ttk.LabelFrame(frame, text=title, padding=12)
            group.grid(row=row_index, column=0, sticky="ew", pady=(0, 8))
            group.columnconfigure(0, weight=1)
            ttk.Label(group, text=body, wraplength=880, justify="left").grid(row=0, column=0, sticky="w")
            if callback:
                button_text = title.split(". ", 1)[1]
                ttk.Button(group, text=button_text, command=callback).grid(row=0, column=1, padx=(12, 0))

        token_group = ttk.LabelFrame(frame, text="Telegram Credentials", padding=12)
        token_group.grid(row=5, column=0, sticky="nsew")
        token_group.columnconfigure(1, weight=1)
        token_group.rowconfigure(2, weight=1)

        ttk.Label(token_group, text="Bot token").grid(row=0, column=0, sticky="w")
        ttk.Entry(token_group, textvariable=self.settings_vars["telegram_bot_token"], show="*", width=56).grid(row=0, column=1, sticky="ew", pady=4)
        ttk.Button(token_group, text="Save", command=self.save_settings).grid(row=0, column=2, padx=(8, 0))

        ttk.Label(token_group, text="Chat id").grid(row=1, column=0, sticky="w")
        ttk.Entry(token_group, textvariable=self.settings_vars["telegram_chat_id"], width=32).grid(row=1, column=1, sticky="w", pady=4)
        ttk.Button(token_group, text="Send Test Message", command=self.send_telegram_test).grid(row=1, column=2, padx=(8, 0))

        self.chat_candidates_tree = ttk.Treeview(token_group, columns=("chat_id", "type", "title"), show="headings", height=8)
        self.chat_candidates_tree.heading("chat_id", text="Chat ID")
        self.chat_candidates_tree.heading("type", text="Type")
        self.chat_candidates_tree.heading("title", text="Label")
        self.chat_candidates_tree.column("chat_id", width=180, anchor="center")
        self.chat_candidates_tree.column("type", width=120, anchor="center")
        self.chat_candidates_tree.column("title", width=420)
        self.chat_candidates_tree.grid(row=2, column=0, columnspan=2, sticky="nsew", pady=(8, 0))

        candidate_controls = ttk.Frame(token_group)
        candidate_controls.grid(row=2, column=2, sticky="ns", padx=(8, 0), pady=(8, 0))
        ttk.Button(candidate_controls, text="Use Selected Chat ID", command=self.use_selected_chat_id).grid(row=0, column=0, pady=(0, 8))
        ttk.Label(candidate_controls, textvariable=self.bot_profile_var, wraplength=180, justify="left").grid(row=1, column=0, sticky="nw")

    def _build_ntfy_wizard(self, frame: ttk.Frame) -> None:
        frame.columnconfigure(0, weight=1)

        sections = [
            ("1. Pick the server", "Use the public ntfy server or enter your own instance URL.", None),
            ("2. Pick a topic", "Use a hard-to-guess topic if you are on the public server.", None),
            ("3. Open ntfy", "Open the server or topic in your browser or mobile app, then subscribe.", self.open_ntfy_topic),
        ]

        for row_index, (title, body, callback) in enumerate(sections):
            group = ttk.LabelFrame(frame, text=title, padding=12)
            group.grid(row=row_index, column=0, sticky="ew", pady=(0, 8))
            group.columnconfigure(0, weight=1)
            ttk.Label(group, text=body, wraplength=880, justify="left").grid(row=0, column=0, sticky="w")
            if callback:
                ttk.Button(group, text="Open", command=callback).grid(row=0, column=1, padx=(12, 0))

        config_group = ttk.LabelFrame(frame, text="ntfy Settings", padding=12)
        config_group.grid(row=3, column=0, sticky="ew")
        config_group.columnconfigure(1, weight=1)

        ttk.Label(config_group, text="Server").grid(row=0, column=0, sticky="w")
        ttk.Entry(config_group, textvariable=self.settings_vars["ntfy_server"], width=56).grid(row=0, column=1, sticky="ew", pady=4)
        ttk.Button(config_group, text="Open Server", command=self.open_ntfy_home).grid(row=0, column=2, padx=(8, 0))

        ttk.Label(config_group, text="Topic").grid(row=1, column=0, sticky="w")
        ttk.Entry(config_group, textvariable=self.settings_vars["ntfy_topic"], width=36).grid(row=1, column=1, sticky="w", pady=4)
        ttk.Button(config_group, text="Random Topic", command=self.randomize_ntfy_topic).grid(row=1, column=2, padx=(8, 0))

        action_row = ttk.Frame(config_group)
        action_row.grid(row=2, column=0, columnspan=3, sticky="w", pady=(8, 0))
        ttk.Button(action_row, text="Save", command=self.save_settings).grid(row=0, column=0, padx=(0, 8))
        ttk.Button(action_row, text="Open Topic", command=self.open_ntfy_topic).grid(row=0, column=1, padx=(0, 8))
        ttk.Button(action_row, text="Send Test Notification", command=self.send_ntfy_test).grid(row=0, column=2)

    def _build_settings_object(self) -> AppSettings:
        grace_text = self.settings_vars["local_response_grace_minutes"].get().strip()
        try:
            grace_minutes = int(grace_text or "0")
        except ValueError as exc:
            raise ValueError("Grace minutes must be an integer.") from exc

        settings = AppSettings(
            telegram_bot_token=self.settings_vars["telegram_bot_token"].get(),
            telegram_chat_id=self.settings_vars["telegram_chat_id"].get(),
            ntfy_server=self.settings_vars["ntfy_server"].get() or DEFAULT_NTFY_SERVER,
            ntfy_topic=self.settings_vars["ntfy_topic"].get(),
            local_response_grace_minutes=grace_minutes,
            runtime_home=self.settings_vars["runtime_home"].get() or str(default_runtime_home()),
            notification_channel_mode=self.settings_vars["notification_channel_mode"].get(),
        )
        return settings.normalize()

    def save_settings(self) -> None:
        try:
            settings = save_settings(self._build_settings_object())
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("Save settings failed", str(exc), parent=self)
            self.status_var.set(f"Save failed: {exc}")
            return

        self._load_settings_into_vars(settings)
        self.status_var.set("Settings saved.")
        self.refresh_dashboard()

    def install_watcher(self) -> None:
        try:
            settings = save_settings(self._build_settings_object())
            task_info = install_task(
                visible_debug=self.visible_debug_var.get(),
                runtime_home=settings.runtime_home,
            )
        except SchedulerError as exc:
            messagebox.showerror("Install watcher failed", str(exc), parent=self)
            self.status_var.set(f"Install failed: {exc}")
            return
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("Install watcher failed", str(exc), parent=self)
            self.status_var.set(f"Install failed: {exc}")
            return

        self.status_var.set(f"Watcher installed: {task_info.execute} {task_info.arguments}")
        self.refresh_dashboard()

    def remove_watcher(self) -> None:
        try:
            remove_task()
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("Remove watcher failed", str(exc), parent=self)
            self.status_var.set(f"Remove failed: {exc}")
            return

        self.status_var.set("Watcher task removed.")
        self.refresh_dashboard()

    def run_watcher_once(self) -> None:
        try:
            settings = save_settings(self._build_settings_object())
            summary = watch_once(runtime_home=settings.runtime_home)
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("Watcher run failed", str(exc), parent=self)
            self.status_var.set(f"Watcher run failed: {exc}")
            return

        self.status_var.set(
            "Watcher ran once "
            f"(repos={summary.scanned_repos}, pending={summary.pending_for_resolution}, "
            f"resolved={summary.resolved}, errors={len(summary.errors)})"
        )
        self.refresh_dashboard()

    def refresh_dashboard(self) -> None:
        try:
            settings = self._build_settings_object()
        except Exception:
            settings = load_settings()

        self._load_settings_into_vars(settings)
        overview = collect_overview(settings.runtime_home)
        task_info = get_task_info()
        presence = overview["presence"]
        repo_summaries = overview["repo_summaries"]
        last_summary = read_json(watcher_summary_path(settings.runtime_home), default={}) or {}

        self.task_installed_var.set("Yes" if task_info.installed else "No")
        self.task_state_var.set(task_info.state or "Not installed")
        task_command = (
            f"{task_info.execute} {task_info.arguments}".strip()
            if task_info.installed
            else "Not installed"
        )
        self.task_command_var.set(task_command)

        presence_text = presence["mode"]
        if presence.get("expires_at"):
            presence_text += f" (until {presence['expires_at']})"
        elif presence.get("expired"):
            presence_text += " (expired -> present)"
        self.presence_status_var.set(presence_text)
        self.presence_detail_var.set(presence_text)

        self.channel_mode_status_var.set(settings.notification_channel_mode)
        self.telegram_status_var.set("Configured" if settings.telegram_bot_token and settings.telegram_chat_id else "Missing token or chat id")
        self.ntfy_status_var.set("Configured" if settings.ntfy_topic else "Not configured")
        totals = overview["totals"]
        counts_text = (
            f"pending={totals['pending']}, local_wait={totals['local_wait']}, "
            f"timeout={totals['timeout']}, send_failed={totals['send_failed']}"
        )
        if last_summary:
            counts_text += f", last watcher errors={len(last_summary.get('errors', []))}"
        self.summary_counts_var.set(counts_text)

        self._populate_repo_tree(self.overview_tree, repo_summaries)
        self._populate_repo_tree(self.projects_tree, repo_summaries)

    def _populate_repo_tree(self, tree: ttk.Treeview, repo_summaries) -> None:
        for item in tree.get_children():
            tree.delete(item)

        for repo in repo_summaries:
            template_text = "Valid" if repo.is_valid_template else "Invalid"
            if repo.missing_markers:
                template_text += f" ({len(repo.missing_markers)} missing)"

            tree.insert(
                "",
                "end",
                iid=str(repo.root),
                text=str(repo.root),
                values=(
                    template_text,
                    repo.pending_count,
                    repo.local_wait_count,
                    repo.timeout_count,
                    repo.send_failed_count,
                    repo.last_updated or "-",
                ),
            )

    def add_project(self) -> None:
        selected = filedialog.askdirectory(parent=self)
        if not selected:
            return

        is_valid, missing = validate_template_repo(selected)
        if not is_valid:
            messagebox.showerror(
                "Invalid template repo",
                "The selected folder does not contain the required template markers:\n\n"
                + "\n".join(missing),
                parent=self,
            )
            return

        settings = self._build_settings_object()
        add_repo_to_registry(selected, settings.runtime_home)
        self.status_var.set(f"Registered project: {selected}")
        self.refresh_dashboard()

    def _selected_project_root(self) -> str | None:
        selection = self.projects_tree.selection()
        if not selection:
            return None
        return selection[0]

    def remove_selected_project(self) -> None:
        root = self._selected_project_root()
        if not root:
            messagebox.showinfo("No selection", "Select a project first.", parent=self)
            return

        settings = self._build_settings_object()
        remove_repo_from_registry(root, settings.runtime_home)
        self.status_var.set(f"Removed project: {root}")
        self.refresh_dashboard()

    def open_selected_project(self) -> None:
        root = self._selected_project_root()
        if not root:
            messagebox.showinfo("No selection", "Select a project first.", parent=self)
            return
        os.startfile(root)  # type: ignore[attr-defined]

    def set_present(self) -> None:
        settings = self._build_settings_object()
        set_presence("present", settings.runtime_home)
        self.status_var.set("Presence set to present.")
        self.refresh_dashboard()

    def set_away(self, minutes: int) -> None:
        settings = self._build_settings_object()
        set_presence("away", settings.runtime_home, duration_minutes=minutes)
        self.status_var.set(f"Presence set to away for {minutes} minutes.")
        self.refresh_dashboard()

    def apply_custom_away(self) -> None:
        try:
            minutes = int(self.custom_away_minutes_var.get().strip() or "0")
        except ValueError:
            messagebox.showerror("Invalid duration", "Custom away minutes must be an integer.", parent=self)
            return

        if minutes <= 0:
            messagebox.showerror("Invalid duration", "Custom away minutes must be greater than zero.", parent=self)
            return

        self.set_away(minutes)

    def browse_runtime_home(self) -> None:
        selected = filedialog.askdirectory(parent=self)
        if selected:
            self.settings_vars["runtime_home"].set(selected)

    def open_runtime_home(self) -> None:
        try:
            runtime_home = resolve_runtime_home(self.settings_vars["runtime_home"].get())
            runtime_home.mkdir(parents=True, exist_ok=True)
            os.startfile(str(runtime_home))  # type: ignore[attr-defined]
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("Open runtime home failed", str(exc), parent=self)

    def fetch_chat_ids(self) -> None:
        token = self.settings_vars["telegram_bot_token"].get().strip()
        if not token:
            messagebox.showerror("Missing Telegram token", "Enter the Telegram bot token first.", parent=self)
            return

        try:
            profile = get_bot_profile(token)
            self.chat_candidates = fetch_chat_candidates(token)
        except ChannelError as exc:
            messagebox.showerror("Fetch chat ids failed", str(exc), parent=self)
            self.status_var.set(f"Fetch chat ids failed: {exc}")
            return

        self.bot_profile_var.set(
            f"Bot profile: @{profile.get('username', '')} / {profile.get('first_name', '')}"
        )

        for item in self.chat_candidates_tree.get_children():
            self.chat_candidates_tree.delete(item)
        for candidate in self.chat_candidates:
            self.chat_candidates_tree.insert(
                "",
                "end",
                iid=candidate["chat_id"],
                values=(
                    candidate["chat_id"],
                    candidate["chat_type"],
                    candidate["title"] or candidate["username"] or "-",
                ),
            )

        self.status_var.set(f"Fetched {len(self.chat_candidates)} chat ids.")

    def use_selected_chat_id(self) -> None:
        selection = self.chat_candidates_tree.selection()
        if not selection:
            messagebox.showinfo("No selection", "Select a chat id first.", parent=self)
            return
        self.settings_vars["telegram_chat_id"].set(selection[0])
        self.status_var.set(f"Selected chat id: {selection[0]}")

    def send_telegram_test(self) -> None:
        token = self.settings_vars["telegram_bot_token"].get().strip()
        chat_id = self.settings_vars["telegram_chat_id"].get().strip()
        if not token or not chat_id:
            messagebox.showerror("Missing Telegram settings", "Telegram bot token and chat id are required.", parent=self)
            return

        try:
            send_telegram_test_message(
                token,
                chat_id,
                f"{APP_NAME} test message from {os.environ.get('COMPUTERNAME', 'this machine')}",
            )
        except ChannelError as exc:
            messagebox.showerror("Telegram test failed", str(exc), parent=self)
            self.status_var.set(f"Telegram test failed: {exc}")
            return

        self.status_var.set("Telegram test message sent.")

    def send_ntfy_test(self) -> None:
        server = self.settings_vars["ntfy_server"].get().strip() or DEFAULT_NTFY_SERVER
        topic = self.settings_vars["ntfy_topic"].get().strip()
        if not topic:
            messagebox.showerror("Missing ntfy topic", "Enter an ntfy topic first.", parent=self)
            return

        try:
            send_ntfy_test_notification(
                server,
                topic,
                f"{APP_NAME} test notification from {os.environ.get('COMPUTERNAME', 'this machine')}",
            )
        except ChannelError as exc:
            messagebox.showerror("ntfy test failed", str(exc), parent=self)
            self.status_var.set(f"ntfy test failed: {exc}")
            return

        self.status_var.set("ntfy test notification sent.")

    def randomize_ntfy_topic(self) -> None:
        self.settings_vars["ntfy_topic"].set(generate_random_ntfy_topic())
        self.status_var.set("Generated a random ntfy topic.")

    def open_botfather(self) -> None:
        webbrowser.open(BOTFATHER_URL)
        self.status_var.set("Opened BotFather.")

    def open_telegram_web(self) -> None:
        webbrowser.open(TELEGRAM_WEB_URL)
        self.status_var.set("Opened Telegram Web.")

    def open_bot_chat(self) -> None:
        token = self.settings_vars["telegram_bot_token"].get().strip()
        if not token:
            messagebox.showerror("Missing Telegram token", "Enter the Telegram bot token first.", parent=self)
            return

        try:
            profile = get_bot_profile(token)
        except ChannelError as exc:
            messagebox.showerror("Load bot profile failed", str(exc), parent=self)
            return

        username = str(profile.get("username") or "").strip()
        if not username:
            messagebox.showerror("Missing bot username", "The bot profile did not return a username.", parent=self)
            return

        webbrowser.open(f"https://t.me/{username}")
        self.bot_profile_var.set(f"Bot profile: @{username} / {profile.get('first_name', '')}")
        self.status_var.set(f"Opened bot chat for @{username}.")

    def open_ntfy_home(self) -> None:
        server = self.settings_vars["ntfy_server"].get().strip() or DEFAULT_NTFY_SERVER
        webbrowser.open(server)
        self.status_var.set("Opened ntfy server.")

    def open_ntfy_topic(self) -> None:
        server = self.settings_vars["ntfy_server"].get().strip() or DEFAULT_NTFY_SERVER
        topic = self.settings_vars["ntfy_topic"].get().strip()
        url = server if not topic else f"{server.rstrip('/')}/{topic}"
        webbrowser.open(url)
        self.status_var.set("Opened ntfy topic.")

    def _auto_refresh(self) -> None:
        self.refresh_dashboard()
        self.after(15000, self._auto_refresh)


def launch_ui() -> int:
    if not hasattr(os, "startfile") and sys.platform != "win32":
        raise RuntimeError("Harness Admin App is Windows-only.")

    app = HarnessAdminUI()
    app.mainloop()
    return 0
