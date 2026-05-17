# src/core/runtimes/opencode.ts (create)

## Why

opencode is already documented as supported through the OHO bridge. It should remain same-level in the runtime model.

## Changes

1. Export an `opencodeRuntime` profile.
2. Document that opencode is bridge-backed.
3. Keep `chainMode` as `bridge`.
4. Avoid changing current opencode setup behavior in this phase.

## Notes

opencode currently discovers the Claude-installed plugin and dispatches hooks declared through Claude/OHO setup. Do not collapse it into Codex behavior.

Keep this profile descriptive in V1. Avoid moving opencode docs or changing opencode install flow while adding Codex support.
