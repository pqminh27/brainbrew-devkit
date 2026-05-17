# src/core/runtimes/claude.ts (create)

## Why

Claude Code is the current native runtime and should remain first-class with its stronger lifecycle assumptions.

## Changes

1. Export a `claudeRuntime` profile.
2. Point paths at `~/.claude`.
3. Include the current Claude hook names already used by the plugin.
4. Set `chainMode` to `orchestrated`.

## Notes

This phase should not rewrite existing Claude code to consume the profile yet. The profile exists so future commands can become runtime-aware incrementally.

Follow the existing convention of additive changes. Do not modify `src/utils/paths.ts` or current Claude command behavior during this phase unless implementation proves it is necessary.
