# Phase 4: Docs and Verification

## Goal

Document Codex support clearly and verify that the new runtime does not regress existing behavior.

## Tasks

1. Update README runtime support section - [README.md](./changes/README.md.md)
2. Update installation guide - [docs/guide/installation.md](./changes/docs--guide--installation.md.md)
3. Add Codex support guide - [docs/guide/codex-support.md](./changes/docs--guide--codex-support.md.md)
4. Add Codex guide to docs navigation - [docs/.vitepress/config.ts](./changes/docs--vitepress--config.ts.md)
5. Run verification commands and record outcomes.

## Dependencies

Phases 1 through 3.

## Success Criteria

- Docs explain that Codex is first-class but recipe-guided.
- Docs explain the default install path: install brainbrew package, then run `brainbrew codex init` and `brainbrew codex sync-skills`.
- Tests and build pass, or failures are documented with root cause.
