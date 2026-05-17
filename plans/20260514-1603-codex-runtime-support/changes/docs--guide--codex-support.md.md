# docs/guide/codex-support.md (create)

## Why

Codex support needs a dedicated guide because its runtime model differs from Claude Code.

## Changes

1. Explain what Codex support includes:
   - Codex plugin manifest
   - global hook integration
   - global skill sync
   - workflow recipe skills
   - role skills converted from template agents
2. Explain what Codex support does not include:
   - automatic chain execution
   - Claude subagent lifecycle hooks
   - plugin-local active skills
3. Document command reference:
   - `brainbrew codex init`
   - `brainbrew codex sync-skills`
   - `brainbrew codex status`
4. Add troubleshooting for:
   - missing `hooks = true`
   - missing runner
   - stale hooks
   - unsupported hook names
   - user skill conflict

## Notes

Use clear runtime comparison language: same support level, different runtime mechanism.

Follow existing VitePress docs conventions: Markdown headings, fenced command blocks, and relative links to related guide pages.
