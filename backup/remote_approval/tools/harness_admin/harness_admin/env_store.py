from __future__ import annotations

import ctypes
import os
import winreg

from .constants import (
    DEFAULT_GRACE_MINUTES,
    DEFAULT_NOTIFICATION_CHANNEL_MODE,
    DEFAULT_NTFY_SERVER,
    ENV_LOCAL_RESPONSE_GRACE_MINUTES,
    ENV_NOTIFICATION_CHANNEL_MODE,
    ENV_NTFY_SERVER,
    ENV_NTFY_TOPIC,
    ENV_RUNTIME_HOME,
    ENV_TELEGRAM_BOT_TOKEN,
    ENV_TELEGRAM_CHAT_ID,
)
from .models import AppSettings
from .runtime_store import default_runtime_home

_ENVIRONMENT_KEY = r"Environment"
_HWND_BROADCAST = 0xFFFF
_WM_SETTINGCHANGE = 0x001A
_SMTO_ABORTIFHUNG = 0x0002


def _read_registry_value(name: str) -> str:
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, _ENVIRONMENT_KEY) as key:
            value, _ = winreg.QueryValueEx(key, name)
            return str(value)
    except FileNotFoundError:
        return ""
    except OSError:
        return ""


def get_user_env_value(name: str, default: str = "") -> str:
    value = _read_registry_value(name)
    if value:
        return value
    return os.environ.get(name, default)


def _set_registry_value(name: str, value: str) -> None:
    with winreg.OpenKey(
        winreg.HKEY_CURRENT_USER,
        _ENVIRONMENT_KEY,
        0,
        winreg.KEY_SET_VALUE,
    ) as key:
        reg_type = winreg.REG_EXPAND_SZ if "%" in value else winreg.REG_SZ
        winreg.SetValueEx(key, name, 0, reg_type, value)


def _delete_registry_value(name: str) -> None:
    try:
        with winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            _ENVIRONMENT_KEY,
            0,
            winreg.KEY_SET_VALUE,
        ) as key:
            winreg.DeleteValue(key, name)
    except FileNotFoundError:
        return
    except OSError:
        return


def broadcast_environment_change() -> None:
    result = ctypes.c_void_p()
    ctypes.windll.user32.SendMessageTimeoutW(  # type: ignore[attr-defined]
        _HWND_BROADCAST,
        _WM_SETTINGCHANGE,
        0,
        "Environment",
        _SMTO_ABORTIFHUNG,
        5000,
        ctypes.byref(result),
    )


def load_settings() -> AppSettings:
    grace_text = get_user_env_value(
        ENV_LOCAL_RESPONSE_GRACE_MINUTES, str(DEFAULT_GRACE_MINUTES)
    )
    try:
        grace_minutes = int(grace_text)
    except ValueError:
        grace_minutes = DEFAULT_GRACE_MINUTES

    settings = AppSettings(
        telegram_bot_token=get_user_env_value(ENV_TELEGRAM_BOT_TOKEN),
        telegram_chat_id=get_user_env_value(ENV_TELEGRAM_CHAT_ID),
        ntfy_server=get_user_env_value(ENV_NTFY_SERVER, DEFAULT_NTFY_SERVER),
        ntfy_topic=get_user_env_value(ENV_NTFY_TOPIC),
        local_response_grace_minutes=grace_minutes,
        runtime_home=get_user_env_value(ENV_RUNTIME_HOME, str(default_runtime_home())),
        notification_channel_mode=get_user_env_value(
            ENV_NOTIFICATION_CHANNEL_MODE,
            DEFAULT_NOTIFICATION_CHANNEL_MODE,
        ),
    )
    return settings.normalize()


def save_settings(settings: AppSettings) -> AppSettings:
    settings.normalize()
    values = {
        ENV_TELEGRAM_BOT_TOKEN: settings.telegram_bot_token,
        ENV_TELEGRAM_CHAT_ID: settings.telegram_chat_id,
        ENV_NTFY_SERVER: settings.ntfy_server,
        ENV_NTFY_TOPIC: settings.ntfy_topic,
        ENV_LOCAL_RESPONSE_GRACE_MINUTES: str(settings.local_response_grace_minutes),
        ENV_RUNTIME_HOME: settings.runtime_home,
        ENV_NOTIFICATION_CHANNEL_MODE: settings.notification_channel_mode,
    }

    for key, value in values.items():
        if value:
            _set_registry_value(key, value)
            os.environ[key] = value
        else:
            _delete_registry_value(key)
            os.environ.pop(key, None)

    broadcast_environment_change()
    return settings
