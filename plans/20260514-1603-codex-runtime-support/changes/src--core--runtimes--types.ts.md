# src/core/runtimes/types.ts (create)

## Why

The codebase needs a small runtime capability model so Codex support can be first-class without making Claude/opencode follow Codex limitations.

## Changes

1. Create a `RuntimeName` union: `claude | opencode | codex`.
2. Create a `RuntimeProfile` interface with:
   - `name`
   - `displayName`
   - `homeDir`
   - `configFile`
   - `hooksFile`
   - `skillsDir`
   - `projectMemoryDirName`
   - `supportedHooks`
   - `chainMode`
   - `pluginManifestPath`
   - `hookTemplatePath`
   - `runnerScriptName`
   - `ownedHookId`
   - `skillMode`
3. Use `chainMode` values such as:
   - `orchestrated`
   - `bridge`
   - `recipe`
4. Use `skillMode` values such as:
   - `plugin-local`
   - `global`
   - `bridge`
5. Add helpers for hook support checks and owned hook detection.

## Convention Notes

- Export plain TypeScript types and constants, matching existing `src/core/config.ts` and strategy modules.
- Use ESM-compatible imports with `.js` extensions if imports are needed.
- Keep runtime profiles data-oriented; command side effects belong in command modules.

## Notes

Keep this file generic. Do not import command-specific logic here.
