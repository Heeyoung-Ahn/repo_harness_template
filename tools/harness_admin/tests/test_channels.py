from __future__ import annotations

import json
import unittest
from pathlib import Path
from unittest import mock
from urllib.parse import parse_qs, urlparse

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from harness_admin.channels import telegram_api  # noqa: E402


class _FakeResponse:
    def __enter__(self) -> "_FakeResponse":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps({"ok": True, "result": []}).encode("utf-8")


class TelegramApiTests(unittest.TestCase):
    def test_get_payload_is_encoded_as_query_string(self) -> None:
        captured: dict[str, str] = {}

        def fake_urlopen(request, timeout=0):  # noqa: ANN001
            captured["url"] = request.full_url
            return _FakeResponse()

        with mock.patch("urllib.request.urlopen", side_effect=fake_urlopen):
            telegram_api(
                "sample-token",
                "getUpdates",
                http_method="GET",
                payload={"timeout": 1, "offset": 42},
            )

        parsed = urlparse(captured["url"])
        query = parse_qs(parsed.query)
        self.assertEqual(parsed.path, "/botsample-token/getUpdates")
        self.assertEqual(query["timeout"], ["1"])
        self.assertEqual(query["offset"], ["42"])


if __name__ == "__main__":
    unittest.main()
