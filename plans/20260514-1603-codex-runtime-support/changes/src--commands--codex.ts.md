# src/commands/codex.ts (create)

## Why

Codex needs a clear first-class CLI surface without overloading existing Claude-shaped commands.

## Changes

1. Add `codexCommand(args, flags)`.
2. Support subcommands:
   - `init`
   - `sync-skills`
   - `status`
3. Add help text for `brainbrew codex`.

## Convention Notes

- Follow the command style used by `src/commands/hook.ts` and `src/commands/init.ts`.
- Use synchronous `fs` operations, as current CLI commands do.
- Use `console.error(...)` plus `process.exit(1)` for fatal validation errors.
- Use concise `console.log(...)` status lines for successful operations.
- Keep helpers in this file initially, but extract to `src/commands/codex-utils.ts` if the file becomes hard to read.
- Use `.js` extensions in imports.

## `brainbrew codex init`

1. Locate `~/.codex/config.toml` and `~/.codex/hooks.json`.
2. Warn if `config.toml` is missing.
3. Warn if `hooks = true` is absent.
4. Treat `plugin_hooks = false` as acceptable.
5. Ensure `~/.codex` exists.
6. Backup `hooks.json` before modifying it.
7. Merge brainbrew-owned entries into the six supported hook events only.
8. Preserve non-brainbrew hook entries.
9. Point entries to `node <plugin-root>/scripts/codex-runner.cjs <EventName>`.
10. Create `.codex/memory` in the current project if a cwd is available.
11. Before implementation, validate the object shape against the user's existing `~/.codex/hooks.json` format and keep tests locked to that shape.

### Hook Object Shape

Generate this exact shape for each event:

```json
{
  "matcher": ".*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"/absolute/path/to/plugin/scripts/codex-runner.cjs\" SessionStart",
      "timeout": 30
    }
  ]
}
```

Use tool matchers for tool events:

```text
PreToolUse/PostToolUse matcher: Write|Edit|MultiEdit|Bash|Agent|Task|task|apply_patch|exec_command|spawn_agent|wait_agent
Other supported events matcher: .*
```

Use timeouts:

```text
SessionStart: 30
UserPromptSubmit: 30
PreToolUse: 30
PermissionRequest: 30
PostToolUse: 60
Stop: 30
```

### Hook Ownership

Implement `isBrainbrewHook(entry)` using command detection:

```text
entry.hooks[*].command contains "/scripts/codex-runner.cjs "
or command contains "brainbrew-devkit" and "codex-runner.cjs"
```

When merging, remove existing brainbrew-owned entries for each supported event, then append the fresh entry. Leave all other entries untouched.

### Command Quoting

Generate hook commands with the runner path double-quoted:

```text
node "/absolute/path/with spaces/plugin/scripts/codex-runner.cjs" SessionStart
```

Escape embedded double quotes defensively. Add tests with a plugin root containing spaces.

### Plugin Root Resolution

Implement deterministic plugin root resolution:

1. Use `--plugin-root <path>` if supplied.
2. Use `BRAINBREW_PLUGIN_ROOT` if set.
3. Resolve from the built CLI location by walking upward until a directory containing `plugin/.claude-plugin/plugin.json` or `plugin/.codex-plugin/plugin.json` is found.
4. In development, allow the repository root if it contains `plugin/`.
5. Fail with a clear error if `plugin/scripts/codex-runner.cjs` does not exist after build, suggesting `npm run build`.

## `brainbrew codex sync-skills`

1. Ensure `~/.codex/skills` exists.
2. Project only Codex-safe brainbrew skills from `plugin/skills/*`.
3. Project template skills from `plugin/config/templates/*/skills/*` only when they pass the Codex compatibility filter.
4. Convert template agents from `plugin/config/templates/*/agents/*.md` into Codex role skills with Codex-safe wording.
5. Convert template YAML files from `plugin/config/templates/*.yaml` into Codex workflow skills.
6. Copy workflow YAML references into `references/`.
7. Add ownership metadata to every file written by brainbrew.
8. Update only skills with brainbrew ownership metadata or entries in the brainbrew skill manifest.
9. Preserve unrelated user skills.
10. Report skipped Claude-only skills.

### Codex Compatibility Filter

Do not blindly sync all Claude-oriented skills as active Codex skills.

For each skill source:

1. If it references Claude-only lifecycle behavior (`SubagentStart`, `SubagentStop`, `SessionEnd`, `TeamCreate`, `Agent(subagent_type=...)`, `.claude/hooks`, Claude plugin hook dispatch), either transform it or skip it.
2. If it is a general instruction skill and only references `.claude/skills` or `.claude/agents`, transform paths to Codex-safe wording where possible.
3. If transformation would change behavior materially, skip it and report:
   - skill name
   - source path
   - reason
4. Workflow skills generated from YAML are always Codex-safe if they state that YAML is recipe/guidance only.

Initial V1 should prefer safe transforms for role/workflow skills and skip ambiguous Claude-only utility skills instead of installing misleading active skills.

### Skill Ownership

Create a manifest at:

```text
~/.codex/brainbrew/skills-manifest.json
```

Manifest entries include:

```json
{
  "skillName": "planner",
  "source": "plugin/config/templates/develop/agents/planner.md",
  "kind": "agent-role",
  "generatedAt": "ISO timestamp"
}
```

Also prepend generated or copied `SKILL.md` files with:

```markdown
<!-- Generated by brainbrew-devkit for Codex. Source: <source-path>. Kind: <kind>. -->
```

For copied skill directories with extra files, copy supporting files only inside a brainbrew-owned destination directory. Do not add generated markers to binary assets or scripts; track them in the manifest.

### Skill Naming Rules

1. Existing plugin skills from `plugin/skills/<name>` keep `<name>`.
2. Template workflow skills use `<template>-workflow`.
3. Template skills from `plugin/config/templates/<template>/skills/<name>` use `<name>` if no collision exists across all selected sources.
4. If a template skill name collides, use `<template>-<name>`.
5. Template agents use `<agent>` if unique across all templates.
6. If a template agent name collides, use `<template>-<agent>`.
7. If the destination skill exists and is not brainbrew-owned, skip it and report a conflict instead of overwriting.

## `brainbrew codex status`

Report:

1. `~/.codex/config.toml` existence.
2. `hooks = true` status.
3. `plugin_hooks` status.
4. `~/.codex/hooks.json` existence.
5. brainbrew hook count, expected `6/6`.
6. unsupported hook names if present.
7. runner path existence.
8. installed brainbrew skill count.
9. stale or missing generated skills.
10. project `.codex/memory` state if present.

## Implementation Notes

- Use JSON parsing for `hooks.json`.
- Avoid TOML dependency for `config.toml`; simple line checks are enough for status warnings.
- Use atomic-ish write behavior: write backup first, then write new file.
- Move helper functions to focused internal functions in this file initially. If the file grows beyond readable size, extract `src/commands/codex-utils.ts` during implementation.
- Keep JSON output formatted with two spaces, matching existing generated JSON files.
- Consume constants from `codexRuntime`; do not duplicate hook lists, manifest paths, runner name, or ownership IDs in separate command constants.
