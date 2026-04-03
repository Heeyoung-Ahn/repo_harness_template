from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest import mock

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from harness_admin.scheduler import SchedulerError, _run_powershell, build_launch_spec  # noqa: E402


class SchedulerTests(unittest.TestCase):
    def test_build_launch_spec_source_hidden_prefers_pythonw(self) -> None:
        fake_python = Path("C:/Python312/python.exe")
        fake_pythonw = fake_python.parent / "pythonw.exe"
        with mock.patch("harness_admin.scheduler.sys.executable", str(fake_python)):
            with mock.patch("harness_admin.scheduler.is_frozen", return_value=False):
                with mock.patch("pathlib.Path.exists", return_value=True):
                    spec = build_launch_spec(visible_debug=False, runtime_home="C:/runtime")

        self.assertEqual(spec.execute, str(fake_pythonw))
        self.assertIn("--watch-once", spec.arguments)
        self.assertIn("--runtime-home", spec.arguments)

    def test_build_launch_spec_frozen_visible_debug_is_rejected(self) -> None:
        with mock.patch("harness_admin.scheduler.is_frozen", return_value=True):
            with self.assertRaises(SchedulerError):
                build_launch_spec(visible_debug=True)

    def test_run_powershell_uses_hidden_subprocess_kwargs(self) -> None:
        completed = mock.Mock(returncode=0, stdout='{"ok":true}', stderr="")

        with mock.patch(
            "harness_admin.scheduler.hidden_subprocess_kwargs",
            return_value={"creationflags": 123},
        ) as hidden_mock, mock.patch(
            "harness_admin.scheduler.subprocess.run",
            return_value=completed,
        ) as run_mock:
            result = _run_powershell("Write-Output ok")

        self.assertEqual(result, '{"ok":true}')
        hidden_mock.assert_called_once_with()
        self.assertEqual(run_mock.call_args.kwargs["creationflags"], 123)


if __name__ == "__main__":
    unittest.main()
