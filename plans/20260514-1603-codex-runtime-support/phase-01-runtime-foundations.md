# Phase 1: Runtime Foundations

## Goal

Introduce the minimal runtime abstraction needed for Codex support while preserving existing Claude and opencode behavior.

## Tasks

1. Define runtime capability types - [src/core/runtimes/types.ts](./changes/src--core--runtimes--types.ts.md)
2. Add Claude runtime profile - [src/core/runtimes/claude.ts](./changes/src--core--runtimes--claude.ts.md)
3. Add opencode runtime profile - [src/core/runtimes/opencode.ts](./changes/src--core--runtimes--opencode.ts.md)
4. Add Codex runtime profile - [src/core/runtimes/codex.ts](./changes/src--core--runtimes--codex.ts.md)

## Dependencies

None. This phase creates new shared definitions and should not rewire existing commands yet.

## Success Criteria

- Runtime profiles compile under `npm run lint`.
- Codex supported hooks are exactly `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, and `Stop`.
- Claude/opencode profiles do not remove currently documented behavior.
