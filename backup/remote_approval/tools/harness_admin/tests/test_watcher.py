from __future__ import annotations

import json
import os
import tempfile
import unittest
from datetime import timedelta
from pathlib import Path
from unittest import mock

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from harness_admin.runtime_store import utc_now, write_json  # noqa: E402
from harness_admin.models import AppSettings  # noqa: E402
from harness_admin.channels import ChannelError  # noqa: E402
from harness_admin.watcher import _replay_remote_choice_gate, watch_once  # noqa: E402


class WatcherTests(unittest.TestCase):
    def _create_repo(self, root: Path) -> Path:
        (root / ".agents/scripts").mkdir(parents=True, exist_ok=True)
        (root / ".agents/runtime/approvals").mkdir(parents=True, exist_ok=True)
        (root / ".agents/scripts/open_user_gate.ps1").write_text("", encoding="utf-8")
        (root / ".agents/scripts/invoke_user_gate.ps1").write_text("", encoding="utf-8")
        return root

    def test_watch_once_marks_expired_state_as_timeout(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_runtime, tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            write_json(
                Path(tmp_runtime) / "repo_registry.json",
                {
                    "version": 1,
                    "updated_at": utc_now().isoformat(),
                    "repos": [{"root": str(repo_root), "active": True, "added_at": "", "updated_at": ""}],
                },
            )

            state_path = repo_root / ".agents/runtime/approvals/expired.json"
            write_json(
                state_path,
                {
                    "status": "pending",
                    "decision_class": "remote-choice",
                    "decision_id": "expired",
                    "options": [{"label": "approve", "value": "approve"}],
                    "expires_at": (utc_now() - timedelta(minutes=5)).isoformat(),
                },
            )

            with mock.patch.dict(os.environ, {}, clear=False):
                summary = watch_once(runtime_home=tmp_runtime)

            updated = json.loads(state_path.read_text(encoding="utf-8"))
            self.assertEqual(summary.timed_out, 1)
            self.assertEqual(updated["status"], "timeout")

    def test_watch_once_passes_saved_offset_to_telegram_polling(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_runtime, tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            write_json(
                Path(tmp_runtime) / "repo_registry.json",
                {
                    "version": 1,
                    "updated_at": utc_now().isoformat(),
                    "repos": [{"root": str(repo_root), "active": True, "added_at": "", "updated_at": ""}],
                },
            )
            (Path(tmp_runtime) / "telegram_offset.txt").write_text("17", encoding="utf-8")

            write_json(
                repo_root / ".agents/runtime/approvals/pending.json",
                {
                    "status": "pending",
                    "decision_class": "remote-choice",
                    "decision_id": "pending",
                    "options": [{"label": "approve", "value": "approve"}],
                },
            )

            settings = AppSettings(
                telegram_bot_token="token",
                telegram_chat_id="chat-id",
                runtime_home=tmp_runtime,
            ).normalize()

            with mock.patch("harness_admin.watcher.load_settings", return_value=settings), mock.patch(
                "harness_admin.watcher.telegram_api",
                return_value={"ok": True, "result": []},
            ) as telegram_api_mock:
                summary = watch_once(runtime_home=tmp_runtime)

            self.assertEqual(summary.pending_for_resolution, 1)
            self.assertEqual(telegram_api_mock.call_count, 1)
            self.assertEqual(
                telegram_api_mock.call_args.kwargs["payload"],
                {"timeout": 1, "offset": 17},
            )

    def test_watch_once_sends_confirmation_message_after_resolution(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_runtime, tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            write_json(
                Path(tmp_runtime) / "repo_registry.json",
                {
                    "version": 1,
                    "updated_at": utc_now().isoformat(),
                    "repos": [{"root": str(repo_root), "active": True, "added_at": "", "updated_at": ""}],
                },
            )

            state_path = repo_root / ".agents/runtime/approvals/pending.json"
            write_json(
                state_path,
                {
                    "status": "pending",
                    "decision_class": "remote-choice",
                    "decision_id": "pending",
                    "project_name": "repo_harness_template",
                    "task_id": "APP-TEST-01",
                    "prompt": "Live test prompt",
                    "telegram_message_id": 12,
                    "options": [
                        {"label": "approve", "value": "approve"},
                        {"label": "hold", "value": "hold"},
                    ],
                },
            )

            settings = AppSettings(
                telegram_bot_token="token",
                telegram_chat_id="chat-id",
                runtime_home=tmp_runtime,
            ).normalize()

            updates = {
                "ok": True,
                "result": [
                    {
                        "update_id": 91,
                        "callback_query": {
                            "id": "cb-1",
                            "data": "gate:pending:approve",
                            "from": {"id": 1001, "username": "tester"},
                            "message": {"chat": {"id": "chat-id"}},
                        },
                    }
                ],
            }

            with mock.patch("harness_admin.watcher.load_settings", return_value=settings), mock.patch(
                "harness_admin.watcher.telegram_api",
                return_value=updates,
            ), mock.patch("harness_admin.watcher.answer_callback_query") as answer_mock, mock.patch(
                "harness_admin.watcher.send_telegram_message"
            ) as send_message_mock:
                summary = watch_once(runtime_home=tmp_runtime)

            updated = json.loads(state_path.read_text(encoding="utf-8"))
            self.assertEqual(summary.resolved, 1)
            self.assertEqual(updated["status"], "resolved")
            self.assertEqual(updated["selected_value"], "approve")
            answer_mock.assert_called_once_with("token", "cb-1", "Recorded: approve")
            send_message_mock.assert_called_once()
            self.assertEqual(send_message_mock.call_args.args[0], "token")
            self.assertEqual(send_message_mock.call_args.args[1], "chat-id")
            self.assertIn("Recorded: approve", send_message_mock.call_args.args[2])
            self.assertEqual(send_message_mock.call_args.kwargs["reply_to_message_id"], 12)

    def test_watch_once_resolves_even_if_callback_acknowledgement_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_runtime, tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            write_json(
                Path(tmp_runtime) / "repo_registry.json",
                {
                    "version": 1,
                    "updated_at": utc_now().isoformat(),
                    "repos": [{"root": str(repo_root), "active": True, "added_at": "", "updated_at": ""}],
                },
            )

            state_path = repo_root / ".agents/runtime/approvals/pending.json"
            write_json(
                state_path,
                {
                    "status": "pending",
                    "decision_class": "remote-choice",
                    "decision_id": "pending",
                    "project_name": "repo_harness_template",
                    "task_id": "APP-TEST-03",
                    "prompt": "Callback ack failure test",
                    "telegram_message_id": 15,
                    "options": [{"label": "approve", "value": "approve"}],
                },
            )

            settings = AppSettings(
                telegram_bot_token="token",
                telegram_chat_id="chat-id",
                runtime_home=tmp_runtime,
            ).normalize()

            updates = {
                "ok": True,
                "result": [
                    {
                        "update_id": 92,
                        "callback_query": {
                            "id": "cb-2",
                            "data": "gate:pending:approve",
                            "from": {"id": 1002, "username": "tester"},
                            "message": {"chat": {"id": "chat-id"}},
                        },
                    }
                ],
            }

            with mock.patch("harness_admin.watcher.load_settings", return_value=settings), mock.patch(
                "harness_admin.watcher.telegram_api",
                return_value=updates,
            ), mock.patch(
                "harness_admin.watcher.answer_callback_query",
                side_effect=ChannelError("callback expired"),
            ) as answer_mock, mock.patch(
                "harness_admin.watcher.send_telegram_message"
            ) as send_message_mock:
                summary = watch_once(runtime_home=tmp_runtime)

            updated = json.loads(state_path.read_text(encoding="utf-8"))
            self.assertEqual(summary.resolved, 1)
            self.assertEqual(updated["status"], "resolved")
            answer_mock.assert_called_once()
            send_message_mock.assert_called_once()

    def test_plain_command_without_decision_id_resolves_single_pending_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_runtime, tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            write_json(
                Path(tmp_runtime) / "repo_registry.json",
                {
                    "version": 1,
                    "updated_at": utc_now().isoformat(),
                    "repos": [{"root": str(repo_root), "active": True, "added_at": "", "updated_at": ""}],
                },
            )

            state_path = repo_root / ".agents/runtime/approvals/pending.json"
            write_json(
                state_path,
                {
                    "status": "pending",
                    "decision_class": "remote-choice",
                    "decision_id": "pending",
                    "project_name": "repo_harness_template",
                    "task_id": "APP-TEST-04",
                    "prompt": "Plain slash command test",
                    "telegram_message_id": 20,
                    "options": [{"label": "approve", "value": "approve"}],
                },
            )

            settings = AppSettings(
                telegram_bot_token="token",
                telegram_chat_id="chat-id",
                runtime_home=tmp_runtime,
            ).normalize()

            updates = {
                "ok": True,
                "result": [
                    {
                        "update_id": 93,
                        "message": {
                            "chat": {"id": "chat-id"},
                            "text": "/approve",
                            "from": {"id": 1003, "username": "tester"},
                        },
                    }
                ],
            }

            with mock.patch("harness_admin.watcher.load_settings", return_value=settings), mock.patch(
                "harness_admin.watcher.telegram_api",
                return_value=updates,
            ), mock.patch("harness_admin.watcher.send_telegram_message"):
                summary = watch_once(runtime_home=tmp_runtime)

            updated = json.loads(state_path.read_text(encoding="utf-8"))
            self.assertEqual(summary.resolved, 1)
            self.assertEqual(updated["status"], "resolved")
            self.assertEqual(updated["decision_source"], "message_command")

    def test_replay_remote_choice_gate_uses_hidden_subprocess_kwargs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_repo:
            repo_root = self._create_repo(Path(tmp_repo))
            completed = mock.Mock(returncode=0, stdout="", stderr="")

            with mock.patch(
                "harness_admin.watcher.hidden_subprocess_kwargs",
                return_value={"creationflags": 456},
            ) as hidden_mock, mock.patch(
                "harness_admin.watcher.subprocess.run",
                return_value=completed,
            ) as run_mock:
                replayed = _replay_remote_choice_gate(
                    repo_root,
                    {
                        "task_id": "APP-TEST-05",
                        "prompt": "Hide window test",
                        "decision_id": "hide-window-test",
                        "default_action": "hold",
                        "options": [{"label": "approve", "value": "approve"}],
                    },
                    force_immediate=False,
                )

        self.assertTrue(replayed)
        hidden_mock.assert_called_once_with()
        self.assertEqual(run_mock.call_args.kwargs["creationflags"], 456)


if __name__ == "__main__":
    unittest.main()
