# src/hooks/codex-runner.ts (create)

## Why

Codex needs a separate hook runner because the Claude runner has Claude-specific lifecycle and chain-enforcement assumptions.

## Changes

1. Read event name from `process.argv[2]`.
2. Read hook payload from stdin.
3. Resolve workspace root from payload `cwd` or `process.cwd()`.
4. Write lightweight state to:
   - `<cwd>/.codex/memory/workflow-state.json`
   - optionally `<cwd>/.codex/memory/events.jsonl`
5. Track:
   - event counts
   - last event time
   - last seen cwd
   - runner version
6. Exit 0 for all normal conditions.

## Convention Notes

- Follow the existing hook entrypoint pattern in `src/hooks/runner.ts`: shebang-compatible script, stdin JSON payload, event name argument.
- Use CommonJS build output through `tsup`, but author source as TypeScript ESM like the existing hooks.
- Use synchronous filesystem operations for simple state writes.
- Write compact diagnostic errors to stderr and exit 0 for non-fatal hook failures.

## Guardrails

1. If payload `cwd` is missing, use `process.cwd()`.
2. If the resolved cwd does not exist or is not a directory, skip project state writes and exit 0.
3. If `workflow-state.json` is corrupt, rotate it to `workflow-state.corrupt-<timestamp>.json` and start fresh.
4. Use best-effort read-modify-write; do not fail the hook on write errors.
5. Keep event log lines bounded by writing compact JSONL records.

## Notes

Do not implement Claude-style mandatory agent blocking in V1. The runner should be conservative and diagnostic-focused.
