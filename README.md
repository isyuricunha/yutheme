# @isyuricunha/yutheme

YuTheme is the design system of [isyuricunha](https://yuricunha.com)'s projects: an AMOLED true-black theme (default canvas `#000000`) with warm ivory text, a gold action accent, and a small motion vocabulary. Swarm (`#1a1813`), Graphite and White are supported opt-in palettes. The theme is plain CSS with zero dependencies; the React components are optional.

## Install

```sh
pnpm add @isyuricunha/yutheme
```

## Importing

```css
/* Theme core: tokens (AMOLED default, warm Swarm and graphite variants, optional
   daylight), base, component classes and effects. Plain CSS, no Tailwind. */
@import '@isyuricunha/yutheme/styles';
```

```ts
// React components (Radix/Ark UI libraries are peer dependencies)
import { Button, Badge, Card, DotMatrixLoader } from '@isyuricunha/yutheme/components'

// Server-safe subset (RSC components without 'use client')
import { Button, Badge, Card, Link } from '@isyuricunha/yutheme/server'

// Website add-ons (Tailwind 4 bridge, shadcn HSL bridge, layout utilities)
@import '@isyuricunha/yutheme/site';
```

The theme switch is set on `<html>`: no attribute (or `data-theme="yu-amoled"`) for the **AMOLED black default** (canvas `#000000`), `data-theme="yu-dark"` for Swarm/Warm Dark (canvas `#1a1813`), `data-theme="yu-graphite"` for Graphite, and `data-theme="yu-daylight"` for White (an explicit user option, as in Vai Brasil!). Accent switch for apps: `data-accent="blue|green|violet|coral"`.

## Core tokens

| Token | Value | Role |
| --- | --- | --- |
| `--yu-bg-canvas` | `#000000` | AMOLED black canvas (default ground) |
| `--yu-bg-window` / `-surface` / `-panel` | `#0b0b0a` | default near-black window surfaces |
| `--yu-bg-titlebar` / `-input` / `-composer` | `#121211` | default titlebar, inputs, composer |
| `--yu-bg-editor` / `-terminal` | `#10100f` | default code surfaces, lifted above the window |
| `--text-primary` | `#f4f1e8` | ivory primary text |
| `--text-secondary` | `#b8b2a4` | secondary text |
| `--text-tertiary` | `#9a9488` | hints, labels, shimmer base |
| `--accent-gold` | `#d6a84f` | action + one accent word |
| `--accent-cyan` | `#64d2ff` | links and info |
| `--accent-green` | `#31d158` | success |
| `--accent-red` | `#ff6961` | danger |
| `--accent-purple` | `#bf5af2` | agent states |
| `--agent-text` | `#d9a8f5` | solid text colour on agent-tinted chips |
| `--agent-soft` | `rgba(191,90,242,0.14)` | agent chip background tint (mockup-validated) |
| `--yu-chart` | `#b8862b` | validated chart gold (never the action colour) |
| `--radius-window` | `14px` | windows, cards, code blocks |
| `--yu-ease` | `cubic-bezier(0.2, 0, 0, 1)` | default easing |
| `--yu-fast` | `160ms` | default fast transition |
| `--yu-glow-alpha` | `0.08` | focal glow strength on the AMOLED ground |

Fonts: Geist and Geist Mono, loaded by the host application (Vercel's [`geist`](https://www.npmjs.com/package/geist) package or self-hosted woff2).

## Versioning policy

- **Major**: a visual change big enough to alter the identity of existing screens (palette shifts, radius reworks, typography changes, effect vocabulary changes that break existing looks). While the package is pre-1.0 (0.x), this class of change bumps the MINOR number instead (0.x minors are the breaking-change vehicle in semver).
- **Minor**: new tokens, new classes, new components. (Pre-1.0: also the vehicle for the breaking class above.)
- **Patch**: fixes and tweaks invisible or near-invisible to existing screens.

## Credits

Built on code from [honghong.me](https://github.com/tszhong0411/honghong.me) by Nelson Lai (MIT) and fragments from shadcn-table, heroui, shadcn/ui and Magic UI (MIT). See [CREDITS.md](./CREDITS.md) and [NOTICE](./NOTICE).

## License

[AGPL-3.0-only](./LICENSE.txt)
