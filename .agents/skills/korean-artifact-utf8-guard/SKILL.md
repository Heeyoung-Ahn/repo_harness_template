---
name: korean-artifact-utf8-guard
description: Guardrail for Windows artifact and document updates that include Korean text. Use this skill whenever you edit or generate `.agents/artifacts/*.md`, `.agents/rules/*.md`, `AGENTS.md`, `README.md`, `docs/*.md`, or Korean-heavy user-facing copy through PowerShell, scripts, bulk sync, day wrap up, handoff, feature-artifact-sync, version closeout, or cross-file summarization. Also use it when you reuse existing Korean lines from repo files. Skip it for small ASCII-only `apply_patch` edits with no Korean text.
---

# Korean Artifact UTF-8 Guard

Use this skill only at the risky points named in the description. The goal is to prevent mojibake such as `?뚯뒪??硫붾え`, which happens when UTF-8 Korean text is read through a non-UTF-8 path and then written back.

## Trigger points

Activate this skill if at least one of these is true:

- The target is a physical artifact or rule document under `.agents/artifacts/`, `.agents/rules/`, `AGENTS.md`, `README.md`, or `docs/`.
- The edit includes Korean prose, Korean UI copy, or Korean comments copied from another repo file.
- The work uses PowerShell text commands, generated scripts, bulk rewrite flows, or document sync skills such as `feature-artifact-sync`, `day_wrap_up`, or `version_closeout`.
- The task summarizes or reuses existing Korean text from other files before writing a new document.

Do not activate it for tiny ASCII-only edits made directly with `apply_patch` where no Korean text is introduced or touched.

## Default policy

1. Prefer `apply_patch` for tracked file edits.
2. If shell-based read or write is unavoidable, use explicit UTF-8 APIs.
3. Never trust Windows PowerShell's implicit text encoding for Korean artifact work.
4. Before commit or handoff, scan the changed files for mojibake.

## Safe read and write patterns

Use explicit UTF-8 in PowerShell:

```powershell
$path = ".agents/artifacts/TASK_LIST.md"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
```

Avoid these for Korean artifact rewrites unless encoding is explicitly controlled:

- `Get-Content` without an encoding-safe wrapper
- `Set-Content` or `Out-File` without explicit encoding
- `>` or `>>` redirection for generated Korean prose
- reading one file with implicit encoding and pasting that text into another file

## Workflow

### 1. Preflight

- Identify the exact files that will receive Korean text.
- Check whether the content is being copied or summarized from another repo file.
- If the change is script-driven, convert the script to explicit UTF-8 reads and writes before running it.

### 2. Edit

- Use `apply_patch` whenever possible.
- If you must script the change, read source files with explicit UTF-8 and write the final output with explicit UTF-8.
- Keep Korean text in one controlled path. Do not bounce it through multiple shells or temporary tools with unknown encodings.

### 3. Verify

Run the scanner on the exact changed files:

```powershell
powershell -ExecutionPolicy Bypass -File ".agents/skills/korean-artifact-utf8-guard/scripts/check_korean_mojibake.ps1" -Path ".agents/artifacts/TASK_LIST.md","src/screens/SettingsScreen.tsx"
```

Also spot-check changed Korean lines with explicit UTF-8 reads before you finish.

## Stop conditions

Stop and fix the file before commit or handoff if any of these happens:

- The scanner reports a suspect line.
- Korean text looks correct in one tool but garbled in another.
- The edit path used implicit encoding even once.
- A bulk sync touched more files than expected.

## Output expectations

When this skill is used, report:

- why the skill triggered
- which files were protected
- whether the scanner found suspect lines
- whether any shell path was replaced with explicit UTF-8 handling
