from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from harness_admin.runtime_store import (  # noqa: E402
    add_repo_to_registry,
    get_effective_presence,
    load_repo_registry,
    remove_repo_from_registry,
    set_presence,
)


class RuntimeStoreTests(unittest.TestCase):
    def test_presence_defaults_to_present(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            state = get_effective_presence(tmpdir)
            self.assertEqual(state["mode"], "present")
            self.assertEqual(state["source"], "default")

    def test_add_and_remove_repo_registry_entries(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir, tempfile.TemporaryDirectory() as repo_dir:
            add_repo_to_registry(repo_dir, tmpdir)
            registry = load_repo_registry(tmpdir)
            self.assertEqual(len(registry["repos"]), 1)
            self.assertTrue(registry["repos"][0]["active"])

            remove_repo_from_registry(repo_dir, tmpdir)
            registry = load_repo_registry(tmpdir)
            self.assertEqual(len(registry["repos"]), 1)
            self.assertFalse(registry["repos"][0]["active"])

    def test_set_away_presence_writes_expiration(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            state = set_presence("away", tmpdir, duration_minutes=30)
            self.assertEqual(state["mode"], "away")
            self.assertIsNotNone(state["expires_at"])


if __name__ == "__main__":
    unittest.main()
