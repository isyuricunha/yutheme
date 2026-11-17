// @vitest-environment jsdom

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.resolve(process.cwd(), 'styles/yutheme.css'), 'utf8')
const site = readFileSync(path.resolve(process.cwd(), 'styles/site.css'), 'utf8')

function palette(source: string, selector: string) {
  const index = source.indexOf(selector + ' {')
  expect(index, selector).toBeGreaterThanOrEqual(0)
  const end = source.indexOf(source === site ? '\n  }' : '\n}', index)
  expect(end).toBeGreaterThan(index)
  return source.slice(index, end)
}

describe('YuTheme Dark default and explicit variants', () => {
  const darkSelector = ":root:not([data-theme]),\n[data-theme='yu-dark']"
  const blackSelector = ":root,\n[data-theme='yu-amoled']"

  it('uses the same charcoal palette by default and by explicit selection', () => {
    const dark = palette(css, darkSelector)
    expect(dark).toContain('--yu-bg-canvas: #17191c;')
    expect(dark).toContain('--yu-bg-panel: #0f1113;')
    expect(dark).toContain('--border-default: #3c4248;')
    expect(dark).toContain('--text-primary: #e8e4dc;')
    expect(dark).toContain('--accent-teal: #46c2b3;')
    expect(dark).toContain('--action-primary: var(--accent-teal);')
    expect(dark).toContain('color-scheme: dark;')
    expect(css.indexOf(blackSelector)).toBeLessThan(css.indexOf(darkSelector))
  })

  it('keeps AMOLED explicitly true black with gold actions', () => {
    const black = palette(css, blackSelector)
    expect(black).toContain('--yu-bg-canvas: #000000;')
    expect(black).toContain('--yu-bg-window: #0b0b0a;')
    expect(black).toContain('--yu-bg-titlebar: #121211;')
    expect(black).toContain('--action-primary: var(--accent-gold);')
  })

  it('retains Graphite and White palettes', () => {
    const graphite = palette(css, "[data-theme='yu-graphite']")
    expect(graphite).toContain('--yu-bg-canvas: #262624;')
    expect(graphite).toContain('--yu-bg-panel: #2b2a27;')
    const white = palette(css, "[data-theme='yu-daylight']")
    expect(white).toContain('--yu-bg-canvas: #faf9f5;')
    expect(white).toContain('--yu-bg-window: #ffffff;')
    expect(white).toContain('color-scheme: light;')
  })

  it('uses matching Dark HSL bridge without changing explicit variants', () => {
    const dark = palette(site, "  :root:not([data-theme]),\n  [data-theme='yu-dark']")
    expect(dark).toContain('--background: 216 9.8% 10%;')
    expect(dark).toContain('--card: 210 11.8% 6.7%;')
    expect(dark).toContain('--primary: 172.7 50.4% 51.8%;')
    expect(dark).toContain('--action-primary-soft: rgba(70, 194, 179, 0.18);')
    expect(palette(site, "  [data-theme='yu-amoled']")).toContain('--background: 0 0% 0%;')
    expect(palette(site, "  [data-theme='yu-graphite']")).toContain('--background: 60 2% 14.5%;')
    expect(palette(site, "  [data-theme='yu-daylight']")).toContain('--background: 48 33% 97%;')
  })

  it('resolves default and explicit theme tokens in the DOM', () => {
    const tokensOnly = css.split('/* ============================== BASE ============================== */')[0] ?? ''
    const style = document.createElement('style')
    style.textContent = tokensOnly
    document.head.append(style)

    const themes = [
      { name: null, canvas: '#17191c', action: 'var(--accent-teal)' },
      { name: 'yu-dark', canvas: '#17191c', action: 'var(--accent-teal)' },
      { name: 'yu-amoled', canvas: '#000000', action: 'var(--accent-gold)' },
      { name: 'yu-graphite', canvas: '#262624', action: 'var(--accent-gold)' },
      { name: 'yu-daylight', canvas: '#faf9f5', action: 'var(--accent-gold)' }
    ]

    for (const theme of themes) {
      if (theme.name === null) document.documentElement.removeAttribute('data-theme')
      else document.documentElement.setAttribute('data-theme', theme.name)
      const computed = window.getComputedStyle(document.documentElement)
      expect(computed.getPropertyValue('--yu-bg-canvas').trim()).toBe(theme.canvas)
      expect(computed.getPropertyValue('--action-primary').trim()).toBe(theme.action)
    }
    document.documentElement.removeAttribute('data-theme')
    style.remove()
  })
})
