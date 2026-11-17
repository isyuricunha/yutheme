# @isyuricunha/yutheme

YuTheme is the design system of [isyuricunha](https://yuricunha.com)'s projects. Its default **Dark** theme uses a charcoal canvas (`#17191c`), deep panels (`#0f1113`), ivory text (`#e8e4dc`), and teal actions (`#46c2b3`). AMOLED true black (`#000000`), Graphite and White remain optional variants. The theme core is plain CSS with zero dependencies; the React components are optional.

## Install

```sh
pnpm add @isyuricunha/yutheme
```

## Importing

```css
/* Theme core: Dark default, optional AMOLED, Graphite and White variants;
   base, component classes and effects. Plain CSS, no Tailwind. */
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

## Optional Starfield Depth background

Starfield Depth is **opt-in** and only loaded when imported from its own
entry point. It does not run when the CSS theme is loaded and does not require
React or additional dependencies. Animation behavior matches the original
Starfield Depth timing: 180 stars, fixed movement per rendered frame and a
0.72-alpha trail. The browser's `requestAnimationFrame` determines frame
cadence; there is no fixed-duration animation.

```ts
import { mountStarfieldDepth } from '@isyuricunha/yutheme/effects/starfield'

// Call on the client after the background layer exists.
const layer = document.getElementById('background-layer')
if (layer) {
  const dispose = mountStarfieldDepth(layer)
  // Call dispose() on component unmount or when the effect is disabled.
}
```

Give the decorative layer its own stacking context and put app content above it:

```css
#background-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

#app-root { position: relative; z-index: 1; }
```

The app owns the layer, toggling, and cleanup. For optional customization,
set inherited CSS properties: `--yu-starfield-color`,
`--yu-starfield-intensity`, `--yu-starfield-size` and
`--yu-starfield-speed` (the last three default to `1`). The effect
takes its backdrop and default star color from `--yu-bg-canvas` and
`--text-primary`. It renders a still frame under
`prefers-reduced-motion: reduce`, and animation stops when disposed.
Do not use the same layer for two independently managed effect instances.

The theme switch is set on `<html>`: no attribute (or `data-theme="yu-dark"`) selects **Dark** (canvas `#17191c`), `data-theme="yu-amoled"` selects AMOLED true black (`#000000`), `data-theme="yu-graphite"` selects Graphite, and `data-theme="yu-daylight"` selects White. Both `yu-dark` and the no-attribute default have a new appearance; no theme selector has been removed. Apps can also set `data-accent="blue|green|violet|coral"`.

## Core tokens

| Token | Value | Role |
| --- | --- | --- |
| `--yu-bg-canvas` | `#17191c` | default Dark canvas |
| `--yu-bg-window` / `-surface` / `-panel` | `#0f1113` | default Dark surfaces |
| `--yu-bg-titlebar` / `-input` / `-composer` | `#1c2023` | default Dark raised surfaces |
| `--yu-bg-editor` / `-terminal` | `#101214` | default Dark code surfaces |
| `--text-primary` | `#e8e4dc` | default ivory primary text |
| `--text-secondary` | `#adb5b8` | default secondary text |
| `--text-tertiary` | `#8d989f` | default hints and labels |
| `--accent-teal` | `#46c2b3` | default primary action |
| `--accent-cyan` | `#64d2ff` | optional blue/info accent |
| `--accent-green` | `#31d158` | success |
| `--accent-red` | `#ff6961` | danger |
| `--accent-purple` | `#bf5af2` | agent states |
| `--agent-text` | `#d9a8f5` | solid text colour on agent-tinted chips |
| `--agent-soft` | `rgba(191,90,242,0.14)` | agent chip background tint (mockup-validated) |
| `--yu-chart` | `#32998e` | default Dark chart accent |
| `--radius-window` | `14px` | windows, cards, code blocks |
| `--yu-ease` | `cubic-bezier(0.2, 0, 0, 1)` | default easing |
| `--yu-fast` | `160ms` | default fast transition |
| `--yu-glow-alpha` | `0.08` | default Dark glow strength |

Fonts: Geist and Geist Mono, loaded by the host application (Vercel's [`geist`](https://www.npmjs.com/package/geist) package or self-hosted woff2).

## Versioning policy

- **Major**: a visual change big enough to alter the identity of existing screens (palette shifts, radius reworks, typography changes, effect vocabulary changes that break existing looks). While the package is pre-1.0 (0.x), this class of change bumps the MINOR number instead (0.x minors are the breaking-change vehicle in semver).
- **Minor**: new tokens, new classes, new components. (Pre-1.0: also the vehicle for the breaking class above.)
- **Patch**: fixes and tweaks invisible or near-invisible to existing screens.

## Credits

Built on code from [honghong.me](https://github.com/tszhong0411/honghong.me) by Nelson Lai (MIT) and fragments from shadcn-table, heroui, shadcn/ui and Magic UI (MIT). See [CREDITS.md](./CREDITS.md) and [NOTICE](./NOTICE).

## License

[AGPL-3.0-only](./LICENSE.txt)
