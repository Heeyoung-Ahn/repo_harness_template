from __future__ import annotations

import json
import random
import string
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from .constants import DEFAULT_NTFY_SERVER


class ChannelError(RuntimeError):
    pass


def _request_json(
    url: str,
    *,
    method: str = "GET",
    body: bytes | None = None,
    headers: dict[str, str] | None = None,
    timeout: int = 15,
) -> Any:
    request = urllib.request.Request(
        url=url,
        method=method,
        data=body,
        headers=headers or {},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ChannelError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise ChannelError(str(exc.reason)) from exc

    try:
        return json.loads(payload)
    except json.JSONDecodeError as exc:
        raise ChannelError("Received a non-JSON response.") from exc


def telegram_api(
    bot_token: str,
    method: str,
    *,
    http_method: str = "POST",
    payload: dict[str, Any] | None = None,
    as_json: bool = False,
    timeout: int = 15,
) -> Any:
    resolved_http_method = http_method.upper()
    url = f"https://api.telegram.org/bot{bot_token}/{method}"
    headers: dict[str, str] = {}
    body: bytes | None = None

    if payload is not None:
        if resolved_http_method == "GET":
            query = urllib.parse.urlencode(payload, doseq=True)
            if query:
                url = f"{url}?{query}"
        elif as_json:
            headers["Content-Type"] = "application/json"
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        else:
            body = urllib.parse.urlencode(payload).encode("utf-8")

    response = _request_json(
        url,
        method=resolved_http_method,
        body=body,
        headers=headers,
        timeout=timeout,
    )
    if not response.get("ok"):
        raise ChannelError(f"Telegram API call failed: {method}")
    return response


def get_bot_profile(bot_token: str) -> dict[str, Any]:
    response = telegram_api(bot_token, "getMe", http_method="GET")
    return response.get("result", {})


def fetch_chat_candidates(bot_token: str) -> list[dict[str, str]]:
    response = telegram_api(bot_token, "getUpdates", http_method="GET")
    seen: dict[str, dict[str, str]] = {}

    for update in response.get("result", []):
        message = update.get("message") or {}
        callback = update.get("callback_query") or {}
        callback_message = callback.get("message") or {}

        for source in (message, callback_message):
            chat = source.get("chat") or {}
            chat_id = str(chat.get("id") or "").strip()
            if not chat_id:
                continue

            if chat_id not in seen:
                seen[chat_id] = {
                    "chat_id": chat_id,
                    "chat_type": str(chat.get("type") or ""),
                    "title": str(chat.get("title") or chat.get("username") or ""),
                    "username": str(chat.get("username") or ""),
                    "display": "",
                }

    candidates = []
    for chat_id, entry in sorted(seen.items(), key=lambda item: item[0]):
        label = entry["title"] or entry["username"] or entry["chat_type"] or "chat"
        entry["display"] = f"{label} ({chat_id})"
        candidates.append(entry)
    return candidates


def send_telegram_test_message(bot_token: str, chat_id: str, text: str) -> dict[str, Any]:
    payload = {"chat_id": chat_id, "text": text}
    return telegram_api(bot_token, "sendMessage", payload=payload)


def send_telegram_message(
    bot_token: str,
    chat_id: str,
    text: str,
    *,
    reply_to_message_id: int | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {"chat_id": chat_id, "text": text}
    if reply_to_message_id is not None:
        payload["reply_to_message_id"] = reply_to_message_id
    return telegram_api(bot_token, "sendMessage", payload=payload)


def answer_callback_query(bot_token: str, callback_id: str, text: str) -> None:
    telegram_api(
        bot_token,
        "answerCallbackQuery",
        payload={"callback_query_id": callback_id, "text": text},
    )


def send_ntfy_notification(
    server: str,
    topic: str,
    *,
    title: str,
    body_text: str,
    priority: str = "default",
) -> None:
    resolved_server = (server or DEFAULT_NTFY_SERVER).strip().rstrip("/")
    if not topic.strip():
        raise ChannelError("ntfy topic is required.")

    url = f"{resolved_server}/{topic.strip()}"
    headers = {
        "Title": title,
        "Priority": priority,
        "Content-Type": "text/plain; charset=utf-8",
    }
    request = urllib.request.Request(
        url=url,
        data=body_text.encode("utf-8"),
        method="POST",
        headers=headers,
    )
    try:
        with urllib.request.urlopen(request, timeout=15):
            return
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ChannelError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise ChannelError(str(exc.reason)) from exc


def send_ntfy_test_notification(server: str, topic: str, text: str) -> None:
    send_ntfy_notification(server, topic, title="Harness Admin test", body_text=text)


def generate_random_ntfy_topic(prefix: str = "harness") -> str:
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
    return f"{prefix}-{suffix}"
