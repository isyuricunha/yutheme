# @isyuricunha/yutheme

## 0.1.2

First publish executed by the CI pipeline (tag-triggered, OIDC trusted publishing), which validates the GitLab trusted publisher configuration.

### Fixed

- `publish` job: npm version check no longer breaks the bash parse (the `||` must stay on the same command line).
- `verify` job no longer fails on every push after a release: `npm publish --dry-run` (which rejects already-published versions) was replaced by `npm pack --dry-run`.

## 0.1.0

First release of the standalone package.

### Added

- Theme core (`styles` entry): YuTheme v2.5 tokens (AMOLED default, graphite variant, app-only daylight), base styles, component classes, effect vocabulary, all as plain CSS with zero dependencies.
- React components (`components` entry) and the server-safe subset (`server` entry), extracted from `@isyuricunha/ui` with history preserved.
- Website add-ons (`site` entry): Tailwind 4 theme bridge, shadcn HSL bridge tokens, legacy `--status-*` aliases (deprecated) and layout utilities.

### Changed

- `--accent-purple-soft` is gone. Its two meanings are now explicit: `--agent-text` (#d9a8f5 on dark themes, #7d2fb0 on daylight) for solid chip text colour and `--agent-soft` (14% background tint, validated against the approved mockup) for chip backgrounds.
- Floating shadows (`--shadow-floating`, `--shadow-tooltip`) keep the 0.5px ring on AMOLED.
- `BlurImage` is an independent implementation with the same public interface (pending blur, fade-in on load, consumer `onLoad`/`onError` preserved, `lazy={false}` skips the effect).

### Legacy

- The `--status-*` aliases are deprecated; use the canonical roles (`--link`, `--success`, `--warning`, `--danger`, `--agent`, `--agent-soft`, `--agent-text`).
