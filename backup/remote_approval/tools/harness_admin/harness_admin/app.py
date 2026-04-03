from __future__ import annotations

import argparse
import json
from pathlib import Path

from .ui import launch_ui
from .watcher import run_watch_once, watch_once


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Harness Admin App")
    parser.add_argument(
        "--watch-once",
        action="store_true",
        help="Run the headless watcher once and exit.",
    )
    parser.add_argument(
        "--runtime-home",
        help="Override the user-level runtime home for this process.",
    )
    parser.add_argument(
        "--print-summary",
        action="store_true",
        help="Print the watcher summary JSON when --watch-once is used.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.watch_once:
        if args.print_summary:
            summary = watch_once(runtime_home=args.runtime_home)
            print(json.dumps(summary.to_dict(), ensure_ascii=False))
            return 0 if not summary.errors else 1
        return run_watch_once(runtime_home=args.runtime_home)

    return launch_ui()
