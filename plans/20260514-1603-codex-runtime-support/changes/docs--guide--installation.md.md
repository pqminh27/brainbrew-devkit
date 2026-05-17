# docs/guide/installation.md (modify)

## Why

Installation docs should explain Codex setup without conflating it with Claude Code or opencode.

## Changes

1. Add a Codex support subsection.
2. Explain prerequisites:
   - brainbrew package/plugin is available locally
   - Codex config exists at `~/.codex/config.toml`
   - `hooks = true`
3. Explain setup commands:
   - `brainbrew codex init`
   - `brainbrew codex sync-skills`
   - `brainbrew codex status`
4. Explain that `plugin_hooks = false` is acceptable.
5. Explain that active skills are global in `~/.codex/skills`.

## Notes

Do not tell users to add unsupported Codex hooks.

Follow existing guide style under `docs/guide/`: short headings, setup steps, and exact command blocks.
