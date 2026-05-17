# src/commands/codex.test.ts (create)

## Why

Codex support touches global config-style files. Tests should protect against destructive merges and unsupported hooks.

## Changes

1. Test Codex supported hook list is exact.
2. Test generated/merged hooks contain only supported hooks.
3. Test merge preserves existing non-brainbrew hooks.
4. Test merge replaces stale brainbrew-owned hooks.
5. Test sync-skills refuses to overwrite a user skill without the brainbrew marker.
6. Test generated workflow skill text says recipe/guidance and not executable state machine.
7. Test invalid `hooks.json` reports a clear error and leaves the original file in place.
8. Test backup creation before hook writes.
9. Test status reports missing runner path.
10. Test template skills are included in sync output.
11. Test colliding template skills and agents use `<template>-<name>`.
12. Test copied plugin skills are tracked in `~/.codex/brainbrew/skills-manifest.json`.
13. Test `brainbrew help` still lists existing commands.
14. Test generated hook commands quote runner paths and handle plugin roots with spaces.
15. Test Claude-only skills are skipped or transformed, not blindly installed.
16. Test status/shape logic against a fixture copied from the user's existing `~/.codex/hooks.json` format.
17. Add manual verification notes for existing command dispatch:
   - `node dist/cli.js help`
   - `node dist/cli.js hook`
   - `node dist/cli.js memory`
   - `node dist/cli.js init --help`

## Notes

Prefer temporary directories and dependency-injected paths. Avoid writing to real `~/.codex` in tests.

Use the existing Vitest style:

```ts
import { describe, it, expect } from 'vitest';
```

Keep tests focused on pure helpers where possible, matching `src/core/config.test.ts`.
