from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .constants import TASK_NAME
from .models import LaunchSpec, WatcherTaskInfo


class SchedulerError(RuntimeError):
    pass


def is_frozen() -> bool:
    return bool(getattr(sys, "frozen", False))


def _ps_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def _run_powershell(script: str) -> str:
    completed = subprocess.run(
        ["powershell.exe", "-NoProfile", "-Command", script],
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        stderr = completed.stderr.strip() or completed.stdout.strip()
        raise SchedulerError(stderr or "PowerShell scheduled-task command failed.")
    return completed.stdout.strip()


def build_launch_spec(
    *,
    visible_debug: bool = False,
    runtime_home: str | None = None,
) -> LaunchSpec:
    if is_frozen():
        if visible_debug:
            raise SchedulerError(
                "Visible debug mode is not supported in the packaged EXE build."
            )

        arguments = "--watch-once"
        if runtime_home:
            arguments += f' --runtime-home "{runtime_home}"'

        return LaunchSpec(
            execute=str(Path(sys.executable).resolve()),
            arguments=arguments,
            mode_label="hidden-exe",
        )

    main_script = Path(__file__).resolve().with_name("__main__.py")
    python_executable = Path(sys.executable).resolve()
    pythonw_executable = python_executable.parent / "pythonw.exe"
    execute = python_executable
    mode_label = "visible-source"

    if not visible_debug and pythonw_executable.exists():
        execute = pythonw_executable
        mode_label = "hidden-source"
    elif not visible_debug:
        mode_label = "hidden-source-fallback"

    arguments = f'"{main_script}" --watch-once'
    if runtime_home:
        arguments += f' --runtime-home "{runtime_home}"'

    return LaunchSpec(
        execute=str(execute),
        arguments=arguments,
        mode_label=mode_label,
    )


def get_task_info(task_name: str = TASK_NAME) -> WatcherTaskInfo:
    script = f"""
$task = Get-ScheduledTask -TaskName {_ps_quote(task_name)} -ErrorAction SilentlyContinue
if ($null -eq $task) {{
  [pscustomobject]@{{
    installed = $false
    task_name = {_ps_quote(task_name)}
    state = ''
    execute = ''
    arguments = ''
  }} | ConvertTo-Json -Compress
  return
}}

[pscustomobject]@{{
  installed = $true
  task_name = $task.TaskName
  state = $task.State.ToString()
  execute = $task.Actions[0].Execute
  arguments = $task.Actions[0].Arguments
}} | ConvertTo-Json -Compress
"""
    data = json.loads(_run_powershell(script))
    return WatcherTaskInfo(
        installed=bool(data["installed"]),
        task_name=str(data["task_name"]),
        state=str(data.get("state", "")),
        execute=str(data.get("execute", "")),
        arguments=str(data.get("arguments", "")),
    )


def install_task(
    *,
    visible_debug: bool = False,
    runtime_home: str | None = None,
    task_name: str = TASK_NAME,
) -> WatcherTaskInfo:
    spec = build_launch_spec(visible_debug=visible_debug, runtime_home=runtime_home)
    script = f"""
$taskName = {_ps_quote(task_name)}
$execute = {_ps_quote(spec.execute)}
$arguments = {_ps_quote(spec.arguments)}
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -StartWhenAvailable
$action = New-ScheduledTaskAction -Execute $execute -Argument $arguments
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {{
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}}
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description 'Watch harness approval states and keep unattended decisions moving.' | Out-Null
[pscustomobject]@{{
  installed = $true
  task_name = $taskName
  state = (Get-ScheduledTask -TaskName $taskName).State.ToString()
  execute = $execute
  arguments = $arguments
}} | ConvertTo-Json -Compress
"""
    data = json.loads(_run_powershell(script))
    return WatcherTaskInfo(
        installed=True,
        task_name=str(data["task_name"]),
        state=str(data.get("state", "")),
        execute=str(data.get("execute", "")),
        arguments=str(data.get("arguments", "")),
    )


def remove_task(task_name: str = TASK_NAME) -> None:
    script = f"""
$task = Get-ScheduledTask -TaskName {_ps_quote(task_name)} -ErrorAction SilentlyContinue
if ($task) {{
  Unregister-ScheduledTask -TaskName {_ps_quote(task_name)} -Confirm:$false
}}
"""
    _run_powershell(script)


def run_task_now(task_name: str = TASK_NAME) -> None:
    script = f"Start-ScheduledTask -TaskName {_ps_quote(task_name)}"
    _run_powershell(script)
