# plugin/.codex-plugin/plugin.json (create)

## Why

Codex needs a plugin manifest separate from Claude's `.claude-plugin` manifest.

## Changes

1. Add this exact V1 manifest shape:

```json
{
  "name": "brainbrew-devkit",
  "version": "1.26.0",
  "description": "BrainBrew DevKit runtime support for Codex: workflow recipes, Codex-safe skills, and supported hooks.",
  "author": {
    "name": "BrainBrew Labs"
  },
  "license": "MIT",
  "keywords": [
    "agent-chain",
    "workflow",
    "devkit",
    "hooks",
    "skills",
    "codex"
  ],
  "interface": {
    "displayName": "BrainBrew DevKit",
    "shortDescription": "Workflow recipes and skills for Codex.",
    "longDescription": "Adds Codex-first workflow recipes, role skills, diagnostics, and supported global hooks without copying Claude-only lifecycle behavior.",
    "developerName": "BrainBrew Labs",
    "category": "Coding",
    "capabilities": [
      "Interactive",
      "Write"
    ],
    "defaultPrompt": [
      "Set up BrainBrew DevKit for Codex",
      "Use a BrainBrew workflow recipe for this task",
      "Sync BrainBrew skills for Codex"
    ],
    "brandColor": "#2563EB"
  }
}
```

2. If local Codex rejects `interface`, remove only that field and keep the minimal top-level fields. Do not add unverified fields.

## Notes

Do not include unsupported hook declarations in this manifest. Hooks are handled by global `~/.codex/hooks.json` because `plugin_hooks = false` is an expected setup.

Place this beside the existing Claude manifest under the same package root:

```text
plugin/.codex-plugin/plugin.json
```
