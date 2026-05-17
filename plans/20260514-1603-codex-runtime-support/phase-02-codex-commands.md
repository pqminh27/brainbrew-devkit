# Phase 2: Codex Commands

## Goal

Add a Codex command namespace that installs and diagnoses Codex support without changing existing command semantics.

## Tasks

1. Create Codex command implementation - [src/commands/codex.ts](./changes/src--commands--codex.ts.md)
2. Wire `brainbrew codex` into the CLI - [src/cli.ts](./changes/src--cli.ts.md)
3. Add command tests - [src/commands/codex.test.ts](./changes/src--commands--codex.test.ts.md)

## Dependencies

Phase 1 runtime profiles.

## Success Criteria

- `brainbrew codex init` safely merges brainbrew-owned hooks into `~/.codex/hooks.json`.
- `brainbrew codex sync-skills` installs Codex-native skills into `~/.codex/skills` while preserving unrelated skills.
- `brainbrew codex status` reports config, hook, runner, and skill health.
- Existing commands still behave as before.
