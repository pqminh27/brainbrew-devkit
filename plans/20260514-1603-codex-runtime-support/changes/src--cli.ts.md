# src/cli.ts (modify)

## Why

The CLI needs to expose the new Codex command namespace.

## Changes

1. Import `codexCommand` from `./commands/codex.js`.
2. Add help entry:
   - `codex <subcommand>           Manage Codex runtime support`
3. Add switch case:
   - `case 'codex': return codexCommand(args, flags);`

## Notes

Do not change existing command behavior or aliases in this phase.

Keep the help text format aligned with the current `printHelp()` block: short command summary, no nested details beyond top-level command discovery.
