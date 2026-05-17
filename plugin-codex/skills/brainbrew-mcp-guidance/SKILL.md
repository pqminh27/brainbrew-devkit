---
name: brainbrew-mcp-guidance
description: Use when configuring or troubleshooting BrainBrew MCP access in Codex, including .mcp.json, codex mcp commands, and available BrainBrew MCP tools.
---

# BrainBrew MCP Guidance

BrainBrew ships an MCP server at `plugin-codex/mcp/mcp-server.cjs` and plugin MCP metadata at `plugin-codex/mcp/mcp-servers.json`. The primary registration path is `brainbrew codex init`, which auto-registers the MCP server with the `codex` CLI when it is on `$PATH`. If the CLI is unavailable or registration fails, fall back to running `codex mcp add` manually as shown below.

## Verify MCP

```bash
codex mcp list
```

If BrainBrew is missing, register the installed plugin's `mcp/mcp-server.cjs` with an absolute path:

```bash
codex mcp add brainbrew -- node <installed-codex-plugin-root>/mcp/mcp-server.cjs
```

If `codex mcp list` shows `brainbrew` with `Status: enabled` and `Auth: Unsupported`, that is healthy for BrainBrew's local stdio MCP server.

## Useful BrainBrew Tools

- `template_bump`: copy a workflow recipe into `.codex/brainbrew/chains`.
- `template_list`: list packaged BrainBrew workflow templates.
- `chain_list`: list copied BrainBrew workflow recipes.
- `chain_switch`: set the active BrainBrew workflow recipe.
- `chain_run`: activate a workflow recipe and return Codex guidance.
- `chain_validate`: check the active workflow recipe structure.

## Guardrails

- Do not print secrets from MCP config.
- Prefer `codex mcp get brainbrew` or `codex mcp list` for diagnostics.
- Keep MCP registration separate from hook setup; hooks are handled by `brainbrew codex init`.
