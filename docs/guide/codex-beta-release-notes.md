# Codex Beta Release Notes

BrainBrew DevKit now includes beta support for Codex as a first-class runtime. The Codex integration is packaged separately from the Claude Code plugin surface so Codex discovers only Codex-safe skills, hooks, MCP metadata, and scripts.

## Included

- Dedicated Codex plugin package: `plugin-codex/`
- Codex marketplace entry: `.agents/plugins/marketplace.json`
- Codex-safe skills under `plugin-codex/skills/`
- Codex-supported hook metadata under `plugin-codex/hooks.json`
- Codex MCP declaration under `plugin-codex/mcp/mcp-servers.json`
- Codex-safe workflow MCP server under `plugin-codex/mcp/mcp-server.cjs`
- Codex hook runner state under `.codex/brainbrew/`
- Global BrainBrew-owned skill projection through `brainbrew codex sync-brainbrew-skills`

The repository keeps Codex command and agent markdown under `plugin-codex/commands/` and `plugin-codex/agents/` as source/reference assets. They are not declared in the public Codex plugin manifest because the current verified Codex plugin spec does not expose supported `commands` or `agents` fields.

BrainBrew Codex support only installs and validates BrainBrew-owned workflow and runtime assets. Use OpenAI's curated `migrate-to-codex` skill for generic Claude Code to Codex migration.

## Supported Hooks

BrainBrew installs only Codex-supported hook events:

- `SessionStart`
- `UserPromptSubmit`
- `PreToolUse`
- `PermissionRequest`
- `PostToolUse`
- `Stop`

Claude-only lifecycle events are intentionally not installed for Codex.

## MCP

The BrainBrew MCP server is packaged at:

```bash
plugin-codex/mcp/mcp-server.cjs
```

The Codex plugin manifest declares MCP through `plugin-codex/mcp/mcp-servers.json`. Check whether BrainBrew is loaded:

```bash
codex mcp list
```

If your Codex build does not auto-load plugin MCP declarations yet, register MCP explicitly:

```bash
codex mcp add brainbrew -- node <installed-codex-plugin-root>/mcp/mcp-server.cjs
```

## Verification Checklist

Before public production:

1. Push or merge this branch so `brainbrewlabs/brainbrew-devkit` includes `plugin-codex/`.
2. In a fresh Codex home, run:

   ```text
   /plugins marketplace add brainbrewlabs/brainbrew-devkit
   /plugins install brainbrew-devkit
   ```

3. Run `brainbrew codex init`, `brainbrew codex sync-brainbrew-skills`, and `brainbrew codex status`.
4. Verify `codex mcp list` includes `brainbrew`; if not, register it manually as shown above.
5. Verify `chain_list`, `chain_run`, `chain_switch`, `chain_validate`, `template_bump`, and `template_list`.
6. Run `brainbrew codex status` and confirm unsupported hooks are `none`.

## Known Limitations

- Codex workflows are recipe-guided, not Claude-style executable chain state machines.
- Active Codex skills are global under `~/.codex/skills`.
- Slash prompt commands such as `/brainbrew:init` are not part of the current public Codex plugin surface.
- Some Codex builds may require manual MCP registration even though the plugin declares MCP metadata.
- Codex MCP uses a dedicated Codex-safe server and does not expose the shared Claude/opencode `init` setup tool.
