# Codex Support

BrainBrew supports Codex as a first-class runtime with a Codex-specific setup path. The integration uses Codex-native mechanisms where available and keeps Claude Code and opencode behavior on their stronger native paths.

## What Is Included

- A dedicated Codex plugin package under `plugin-codex/`.
- Curated Codex-safe BrainBrew skills under `plugin-codex/skills/`.
- Packaged MCP server under `plugin-codex/mcp/`, declared through the Codex plugin manifest.
- Supported hook metadata under `plugin-codex/hooks.json`, declared through the Codex plugin manifest.
- Global hook integration through `~/.codex/hooks.json`.
- Global skill sync into `~/.codex/skills`.
- Workflow recipe skills generated from BrainBrew templates.
- Role skills converted from template agents.
- Diagnostics through `brainbrew codex status`.

## What Is Not Included

- Automatic chain execution as a state machine.
- Claude-only `SubagentStart` or `SubagentStop` lifecycle hooks.
- Plugin-local active skills.
- Auto-loaded Codex prompt commands or Codex agent declarations. The `plugin-codex/commands/` and `plugin-codex/agents/` files are kept as source/reference assets until Codex exposes a supported plugin spec field for them.
- Generic Claude Code or OpenCode migration. Use OpenAI's curated `migrate-to-codex` skill for that.
- Claude/opencode MCP setup tools such as the shared `init` MCP tool.

Codex uses BrainBrew workflows as recipes and guidance. Use them to structure handoffs and quality gates, but do not expect Claude-style hook enforcement for every chain step.

## Setup

Install the BrainBrew plugin from the Codex marketplace:

```
/plugins marketplace add brainbrewlabs/brainbrew-devkit
/plugins install brainbrew-devkit
```

For local development before the marketplace is published, add this repository as a local marketplace source:

```
/plugins marketplace add /Users/phungminh/Code/brainbrew-devkit
/plugins install brainbrew-devkit
```

Then enable BrainBrew's Codex runtime support:

```bash
brainbrew codex init
brainbrew codex sync-brainbrew-skills
brainbrew codex status
```

Your `~/.codex/config.toml` should include:

```toml
hooks = true
```

`plugin_hooks = false` is acceptable. BrainBrew installs its supported hook entries globally.

## Plugin Assets

After plugin install, Codex can discover the spec-declared BrainBrew assets directly from the plugin package:

| Asset | Path | Purpose |
|-------|------|---------|
| Skills | `plugin-codex/skills/brainbrew-*` | Curated setup, workflow, and MCP guidance that is safe for Codex |
| Hooks | `plugin-codex/hooks.json` | Supported Codex hook metadata for the plugin runtime |
| MCP | `plugin-codex/mcp/mcp-servers.json` | Codex MCP declaration for the packaged BrainBrew MCP server |
| MCP server | `plugin-codex/mcp/mcp-server.cjs` | Packaged Codex-safe BrainBrew workflow MCP server |

These assets do not replace the global sync step. `brainbrew codex sync-brainbrew-skills` still projects template skills, template agents, and workflow YAML into `~/.codex/skills` so Codex can trigger them reliably across projects.

The repository also contains Codex command and agent markdown under `plugin-codex/commands/` and `plugin-codex/agents/`. Those files are not declared in the public Codex plugin manifest because the current verified Codex plugin spec does not expose supported `commands` or `agents` fields. Treat them as source/reference assets, not marketplace-loaded prompt commands.

BrainBrew DevKit does not perform generic Claude Code or OpenCode migration. For generic Claude Code to Codex migration, use OpenAI's curated `migrate-to-codex` skill. BrainBrew Codex CLI commands only install and validate BrainBrew-owned workflow and runtime assets.

## Commands

Shell commands:

| Command | Purpose |
|---------|---------|
| `brainbrew codex init` | Install supported BrainBrew hook entries into `~/.codex/hooks.json` |
| `brainbrew codex sync-brainbrew-skills` | Project BrainBrew-owned skills, role skills, and workflow recipe skills into `~/.codex/skills` |
| `brainbrew codex status` | Report Codex config, hook, plugin asset, MCP, skill, and project-state health |

Within Codex, use the installed BrainBrew skills and MCP tools directly. Slash prompt commands such as `/brainbrew:init` are not part of the current public Codex plugin surface.

### `brainbrew codex init`

Creates `~/.codex` if needed, checks `~/.codex/config.toml`, backs up `~/.codex/hooks.json`, and merges BrainBrew-owned hook entries for the Codex-supported hook events:

- `SessionStart`
- `UserPromptSubmit`
- `PreToolUse`
- `PermissionRequest`
- `PostToolUse`
- `Stop`

Existing non-BrainBrew hooks are preserved.

### `brainbrew codex sync-brainbrew-skills`

Projects Codex-safe BrainBrew-owned skills into `~/.codex/skills`. It also converts BrainBrew template agents into role skills and BrainBrew template YAML files into workflow recipe skills.

User skills are not overwritten unless they were previously generated by BrainBrew or are listed in the BrainBrew skills manifest at `~/.codex/brainbrew/skills-manifest.json`.

### `brainbrew codex status`

Reports config, hook, runner, and skill health:

- whether `~/.codex/config.toml` exists
- whether `hooks = true` is present
- `plugin_hooks` status
- `~/.codex/hooks.json` status
- BrainBrew hook count
- unsupported hook names
- runner path status
- installed BrainBrew skill count
- stale or missing generated skills
- project BrainBrew state status

## MCP

BrainBrew's Codex-safe MCP server is declared by the plugin manifest through:

```text
plugin-codex/mcp/mcp-servers.json
```

The MCP config points to the packaged server:

```text
plugin-codex/mcp/mcp-server.cjs
```

Claude Code and opencode continue to use the existing shared MCP server and `${CLAUDE_PLUGIN_ROOT}` entry in `plugin/.mcp.json`.

The Codex MCP server is intentionally separate from the shared Claude/opencode MCP server. It does not expose Claude/opencode setup tools such as `init`, and it does not write `.claude/settings.json`.

In Codex, check whether BrainBrew is loaded:

```bash
codex mcp list
```

If your Codex build does not auto-load plugin MCP declarations yet, register it manually with the installed Codex plugin package path:

```bash
codex mcp add brainbrew -- node <installed-codex-plugin-root>/mcp/mcp-server.cjs
```

For local development from this repository, use:

```bash
codex mcp add brainbrew -- node ./plugin-codex/mcp/mcp-server.cjs
```

Then verify:

```bash
codex mcp get brainbrew
```

Do not put secrets directly in `.mcp.json`. Use Codex MCP environment options for server-specific credentials when needed.

When registered, BrainBrew exposes these MCP workflow tools to Codex:

- `chain_list`
- `chain_run`
- `chain_switch`
- `chain_validate`
- `template_bump`
- `template_list`

## Troubleshooting

### Missing `hooks = true`

Add `hooks = true` to `~/.codex/config.toml`, then restart Codex if needed.

### Missing Runner

If `brainbrew codex init` reports a missing `codex-runner.cjs`, build or reinstall the package:

```bash
npm run build
```

Then rerun:

```bash
brainbrew codex init
```

### Stale Hooks

Run `brainbrew codex init` again. It removes stale BrainBrew-owned hook entries and appends fresh entries while preserving unrelated hooks.

### Unsupported Hook Names

Codex support only installs the six supported hook events listed above. Remove Claude-only events such as `SubagentStart`, `SubagentStop`, `SessionEnd`, `Notification`, `PreCompact`, or `PostCompact` from Codex hook configuration.

### User Skill Conflict

If a destination skill exists in `~/.codex/skills` without BrainBrew ownership metadata, BrainBrew skips it. Rename or remove the user skill, then rerun:

```bash
brainbrew codex sync-brainbrew-skills
```

### MCP Server Missing

Run:

```bash
codex mcp list
```

If `brainbrew` is not listed, your Codex build may not auto-load plugin MCP declarations. Register the installed server with `codex mcp add brainbrew -- node <installed-codex-plugin-root>/mcp/mcp-server.cjs`.

## Related

- [Installation](/guide/installation)
- [Chain Workflow](/guide/chain-workflow)
