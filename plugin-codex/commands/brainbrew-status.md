---
name: brainbrew:status
description: Diagnose BrainBrew DevKit's Codex plugin, hook, skill, runner, workflow state, and MCP setup.
---

# /brainbrew:status

Run:

```bash
brainbrew codex status
```

`brainbrew codex status` now also reports BrainBrew MCP registration status with the `codex` CLI when it is on `$PATH`. If MCP access needs deeper inspection, also run:

```bash
codex mcp list
```

Summarize only problems and the smallest next command to fix each one.

Do not print secrets or MCP environment values.
