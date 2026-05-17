# tsup.config.ts (modify)

## Why

The Codex runner must be built into the package plugin scripts directory.

## Changes

1. Add `codex-runner: 'src/hooks/codex-runner.ts'` to the hook entries build.
2. Ensure output path remains:
   - `plugin/scripts/codex-runner.cjs`

## Notes

Do not alter existing Claude hook outputs.

Follow the existing hook build block in `tsup.config.ts`; do not add a separate build pipeline.
