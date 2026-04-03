from __future__ import annotations

import tempfile
import unittest
from datetime import timedelta
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from harness_admin.runtime_store import set_presence, utc_now  # noqa: E402
from harness_admin.ui import build_presence_text  # noqa: E402


class UITests(unittest.TestCase):
    def test_build_presence_text_formats_same_day_away_expiration_as_local_time(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            presence = set_presence("away", tmpdir, duration_minutes=30)
            text = build_presence_text(presence)

        self.assertTrue(text.startswith("away (until "))
        self.assertRegex(text, r"^away \(until \d{2}:\d{2}:\d{2}\)$")

    def test_build_presence_text_includes_date_for_other_day_expiration(self) -> None:
        future = (utc_now() + timedelta(days=1, hours=2)).isoformat()

        text = build_presence_text(
            {
                "mode": "away",
                "expired": False,
                "expires_at": future,
            }
        )

        self.assertTrue(text.startswith("away (until "))
        self.assertRegex(text, r"^away \(until \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\)$")

    def test_build_presence_text_shows_expired_time_cleanly(self) -> None:
        expired = (utc_now() - timedelta(minutes=5)).isoformat()

        text = build_presence_text(
            {
                "mode": "present",
                "expired": True,
                "expires_at": expired,
            }
        )

        self.assertTrue(text.startswith("present (expired at "))
        self.assertRegex(text, r"^present \(expired at \d{2}:\d{2}:\d{2}\)$")


if __name__ == "__main__":
    unittest.main()
