# Plan: Codex Runtime Support

## Problem

brainbrew-devkit currently supports Claude Code directly and opencode through the existing bridge flow, but the CLI, hooks, generated assets, and paths are still Claude-shaped. Codex should become a first-class runtime without weakening Claude Code or opencode behavior.

## Approach

Add a Codex-specific runtime lane with its own command namespace, hook allowlist, plugin manifest, runner, skill projection, diagnostics, and documentation. Keep Claude Code chain orchestration intact. Treat Codex chains as workflow recipes and role skills, not as an executable state machine.

## Existing Conventions To Follow

- Keep CLI commands as focused modules under `src/commands/`.
- Use TypeScript ESM imports with `.js` extensions.
- Prefer the repo's existing synchronous `fs` style for CLI/config file operations.
- Keep packaged runtime assets under the existing `plugin/` root.
- Build hook entrypoints into `plugin/scripts/*.cjs` through `tsup.config.ts`.
- Use Markdown frontmatter for skills and agents.
- Use YAML for chain/template recipes and JSON for runtime state.
- Add Vitest tests beside related source files.
- Use concise CLI output with `console.log`, `console.error`, and `process.exit(1)` for fatal command errors.

## Phases

1. [Phase 1: Runtime Foundations](./phase-01-runtime-foundations.md)
2. [Phase 2: Codex Commands](./phase-02-codex-commands.md)
3. [Phase 3: Codex Assets and Build](./phase-03-codex-assets-build.md)
4. [Phase 4: Docs and Verification](./phase-04-docs-verification.md)

## Files Affected

| File | Change Type | Details |
|------|-------------|---------|
| `src/core/runtimes/types.ts` | create | [details](./changes/src--core--runtimes--types.ts.md) |
| `src/core/runtimes/claude.ts` | create | [details](./changes/src--core--runtimes--claude.ts.md) |
| `src/core/runtimes/opencode.ts` | create | [details](./changes/src--core--runtimes--opencode.ts.md) |
| `src/core/runtimes/codex.ts` | create | [details](./changes/src--core--runtimes--codex.ts.md) |
| `src/commands/codex.ts` | create | [details](./changes/src--commands--codex.ts.md) |
| `src/cli.ts` | modify | [details](./changes/src--cli.ts.md) |
| `src/hooks/codex-runner.ts` | create | [details](./changes/src--hooks--codex-runner.ts.md) |
| `plugin/.codex-plugin/plugin.json` | create | [details](./changes/plugin--codex-plugin--plugin.json.md) |
| `plugin/codex/hooks.json` | create | [details](./changes/plugin--codex--hooks.json.md) |
| `tsup.config.ts` | modify | [details](./changes/tsup.config.ts.md) |
| `src/commands/codex.test.ts` | create | [details](./changes/src--commands--codex.test.ts.md) |
| `README.md` | modify | [details](./changes/README.md.md) |
| `docs/guide/installation.md` | modify | [details](./changes/docs--guide--installation.md.md) |
| `docs/guide/codex-support.md` | create | [details](./changes/docs--guide--codex-support.md.md) |
| `docs/.vitepress/config.ts` | modify | [details](./changes/docs--vitepress--config.ts.md) |

## Explicit Non-Goals

- Do not add unsupported Codex hook names.
- Do not copy Claude `SubagentStart` or `SubagentStop` behavior into Codex.
- Do not make Codex chain YAML an executable state machine.
- Do not move or delete existing Claude/opencode files.
- Do not overwrite unrelated user skills or hooks.
