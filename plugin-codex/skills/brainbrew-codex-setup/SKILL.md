---
name: brainbrew-codex-setup
description: Use when setting up, verifying, or repairing BrainBrew DevKit in Codex, including hooks, global skills, MCP config, runner files, and plugin-native assets.
---

# BrainBrew Codex Setup

Use this skill when the user asks to install BrainBrew for Codex, repair missing hooks, sync BrainBrew-owned skills, or verify that BrainBrew is available after plugin installation.

## Prerequisites

The `brainbrew` CLI is required for `brainbrew codex init`, `sync-brainbrew-skills`, and `status`. Install it globally if not already present:

```bash
npm install -g brainbrew-devkit
```

Verify with `brainbrew --version`. If installed via Codex marketplace alone, the CLI is NOT included automatically.

## Setup Flow

1. Confirm the BrainBrew package or plugin is available locally.
2. Run:

   ```bash
   brainbrew codex init
   brainbrew codex sync-brainbrew-skills
   brainbrew codex status
   ```

3. If `brainbrew codex init` reports a missing runner, build or reinstall the package so `plugin-codex/scripts/codex-runner.cjs` exists.
4. If status reports `hooks = true: no`, ask the user to add this to `~/.codex/config.toml`:

   ```toml
   hooks = true
   ```

5. `brainbrew codex init` auto-registers the MCP server when the `codex` CLI is on `$PATH`. If the CLI is unavailable or registration fails, run the manual command printed by init (`codex mcp add brainbrew -- node <installed-codex-plugin-root>/mcp/mcp-server.cjs`). `Auth: Unsupported` is expected when `Status` is `enabled`.

## Codex Runtime Rules

- BrainBrew writes supported hook entries to `~/.codex/hooks.json`.
- `plugin_hooks = false` is acceptable.
- Active Codex skills live in `~/.codex/skills`.
- `brainbrew codex sync-brainbrew-skills` syncs only BrainBrew-owned workflow, role, template, and helper skills.
- Workflow recipes guide the work; they do not execute automatic Claude-style chain routing.
- For generic Claude Code to Codex migration, use OpenAI's curated `migrate-to-codex` skill.
- Do not add `SubagentStart`, `SubagentStop`, `SessionEnd`, `Notification`, `PreCompact`, or `PostCompact` to Codex hooks.
- To mark a workflow gate as passed without relying on English-phrase heuristics, tell Codex `brainbrew gate-pass <gate-name>` in your prompt (gates: `plan-review`, `code-review`, `security-review`, `test`).
