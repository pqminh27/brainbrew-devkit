# Phase 3: Codex Assets and Build

## Goal

Package Codex runtime assets with the existing brainbrew plugin bundle.

## Tasks

1. Add Codex runner - [src/hooks/codex-runner.ts](./changes/src--hooks--codex-runner.ts.md)
2. Add Codex plugin manifest - [plugin/.codex-plugin/plugin.json](./changes/plugin--codex-plugin--plugin.json.md)
3. Add Codex hook template - [plugin/codex/hooks.json](./changes/plugin--codex--hooks.json.md)
4. Build runner into plugin scripts - [tsup.config.ts](./changes/tsup.config.ts.md)

## Dependencies

Phase 1 runtime profiles.

## Success Criteria

- `npm run build` creates `plugin/scripts/codex-runner.cjs`.
- Codex assets are included under the existing `plugin/` package root.
- Codex hook template contains no unsupported hook names.
