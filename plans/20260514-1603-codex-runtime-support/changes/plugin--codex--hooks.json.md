# plugin/codex/hooks.json (create)

## Why

A checked-in Codex hook template makes the supported hook surface explicit and testable.

## Changes

1. Add template entries for:
   - `SessionStart`
   - `UserPromptSubmit`
   - `PreToolUse`
   - `PermissionRequest`
   - `PostToolUse`
   - `Stop`
2. Use the same object shape that `codex init` generates.
3. Use `{{PLUGIN_ROOT}}` as the only placeholder in command strings.
4. Use exact matchers:
   - `Write|Edit|MultiEdit|Bash|Agent|Task|task|apply_patch|exec_command|spawn_agent|wait_agent` for `PreToolUse` and `PostToolUse`
   - `.*` for all other supported events
5. Use exact timeouts:
   - `SessionStart`: 30
   - `UserPromptSubmit`: 30
   - `PreToolUse`: 30
   - `PermissionRequest`: 30
   - `PostToolUse`: 60
   - `Stop`: 30

## Example

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"{{PLUGIN_ROOT}}/scripts/codex-runner.cjs\" SessionStart",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

## Notes

This file must not contain `SubagentStart`, `SubagentStop`, `SessionEnd`, `Notification`, `PreCompact`, or `PostCompact`.

Keep this under the existing packaged plugin root:

```text
plugin/codex/hooks.json
```
