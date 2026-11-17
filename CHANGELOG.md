# @isyuricunha/yutheme

## Unreleased

### Added

- Opt-in `@isyuricunha/yutheme/effects/starfield` entry point with the
  original Starfield Depth animation cadence, lifecycle cleanup, independent
  background layer, and reduced-motion support. No automatic theme activation
  and no additional runtime dependencies.

### Changed

- **Dark (`yu-dark`)** now uses charcoal and teal: canvas `#17191c`, panels `#0f1113`, borders `#3c4248`, primary action `#46c2b3`, and text `#e8e4dc`.
- Dark is now the no-attribute default. `yu-amoled` retains its true-black palette and gold actions; Graphite and White keep their prior palettes.
- The HSL bridge follows the Dark palette for both implicit and explicit selection.
- **Compatibility:** `yu-dark` consumers and unthemed roots change appearance. No theme selector or component API was removed. Publish as a 0.x minor release; this change does not publish a release.

## 0.3.0

### Changed

- **AMOLED true black (`#000000`) is the default YuTheme root palette again**. Warm Dark (`yu-dark`, also called Swarm) is now explicitly opt-in; the original token values are unchanged.
- `yu-daylight` remains the White option for applications and products that explicitly enable it (including Vai Brasil!).
- Website CSS bridge defaults to AMOLED and sets distinct shadcn HSL triplets when selecting Swarm, Graphite, or White.
- Compatibility: existing projects selecting `data-theme="yu-dark"` continue rendering with the same warm tokens. The visual breaking change applies to projects relying on no theme attribute.

## 0.2.1

### Changed

- Syntax comment colour `--yu-syn-comment` (and the `--syntax-comment` site bridge) moves from `#87826f` to `#8a8571`: the old value measures 4.47:1 on the warm editor `#1d1b15`, just under WCAG AA; `#8a8571` measures 4.65:1 warm and 5.14:1 AMOLED. Single value on both grounds, visually near-identical. Revised by Yuri from the frozen `#87826f` rule after the ChatGPT audit.

## 0.2.0


### Changed

- **Default ground is now Warm Dark (`#1a1813`) instead of AMOLED true black.** The `:root` / `yu-dark` block carries the warm ladder (v1 hue family, v2 relationships): canvas/sidebar `#1a1813`, window/surface/panel `#1c1913`, editor/terminal `#1d1b15`, modal `#1f1c16`, titlebar/input/composer `#211e17`, hover `#232019`, raised/popover/tooltip `#23211a`, desktop `#25221b`, desktop-soft/chip/input-hover `#28251d`, active `#2d2921`. Borders keep the v2 alpha ladder with the warm ivory tint `rgba(214,204,176,…)`. `--yu-glow-alpha` is now `0.1` on the default (calibrated for the warm ground); skeleton, sheen-rest and scrollbar tokens follow the warm family.
- **AMOLED true black is now the opt-in variant** `data-theme="yu-amoled"`: a complete, verbatim copy of the previous default block (every token redefined, no inheritance from the warm root). Graphite pins the tokens it used to inherit from the AMOLED root (`--yu-bg-desktop`, `--yu-bg-desktop-soft`, `--yu-sheen-rest`); daylight pins the desktop pair and `--yu-glow-alpha: 0.08`. Their rendered output is unchanged.
- `site` entry: the shadcn HSL bridge triplets are recomputed from the warm ladder (`--background` `42.9 15.6% 8.8%`, `--card` `40 19.1% 9.2%`, `--popover`/`--secondary`/`--muted`/`--sidebar-accent` `42 17.9% 11%`, `--ui-accent` `43.6 15.9% 13.5%`, border triplets `44.2 31.7% 76.5% / 0.2`). The bridge is scoped to `:root` / `yu-dark` only: consumers of `site.css` that switch variants keep the warm bridge values (documented limitation).

### Notes

- Text ramp, accents, syntax palette, radii, typography, motion, components, animations and the Dot Matrix loader are unchanged.
- Consumers that hardcode the previous ground need a sync: the shiki theme bg (`#10100f` → `#1d1b15` for the warm editor) is the known example in the website repo.

## 0.1.3

### Added

- `site` entry: `--status-warning` (amber) and the `--color-status-warning` Tailwind bridge, so the `bg-status-warning` utility used by consumers actually resolves. The original preset never defined this token; tint follows the validated 14% pattern only for backgrounds that declare it, and this one is the plain solid role.

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
