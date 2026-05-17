# src/core/runtimes/codex.ts (create)

## Why

Codex needs explicit capabilities so commands can enforce Codex-supported hooks and Codex-specific installation paths.

## Changes

1. Export a `codexRuntime` profile.
2. Point paths at:
   - `~/.codex/config.toml`
   - `~/.codex/hooks.json`
   - `~/.codex/skills`
3. Set project memory directory name to `.codex/memory`.
4. Set `chainMode` to `recipe`.
5. Set:
   - `pluginManifestPath` to `plugin/.codex-plugin/plugin.json`
   - `hookTemplatePath` to `plugin/codex/hooks.json`
   - `runnerScriptName` to `codex-runner.cjs`
   - `ownedHookId` to `brainbrew-devkit`
   - `skillMode` to `global`
6. Define supported hooks exactly:
   - `SessionStart`
   - `UserPromptSubmit`
   - `PreToolUse`
   - `PermissionRequest`
   - `PostToolUse`
   - `Stop`
7. Export a `CODEX_UNSUPPORTED_HOOKS` list for diagnostics and tests:
   - `SubagentStart`
   - `SubagentStop`
   - `SessionEnd`
   - `Notification`
   - `PreCompact`
   - `PostCompact`

## Notes

Codex support must not use plugin-local active skills. Active skills live in `~/.codex/skills`.

Use `homedir()` and `join()` like `src/utils/paths.ts`; do not hardcode `/Users/...` paths.
