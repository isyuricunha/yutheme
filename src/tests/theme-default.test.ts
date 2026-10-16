import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.resolve(process.cwd(), 'styles/yutheme.css'), 'utf8')
const site = readFileSync(path.resolve(process.cwd(), 'styles/site.css'), 'utf8')

function palette(selector: string) {
  const index = css.indexOf(selector + ' {')
  expect(index, selector).toBeGreaterThanOrEqual(0)
  const end = css.indexOf('\n}', index)
  expect(end).toBeGreaterThan(index)
  return css.slice(index, end)
}

describe('YuTheme v0.3 default and retained variants', () => {
  it('defaults to AMOLED black even without a data-theme attribute', () => {
    const block = palette(":root,\n[data-theme='yu-amoled']")
    expect(block).toContain('--yu-bg-canvas: #000000;')
    expect(block).toContain('--yu-bg-window: #0b0b0a;')
    expect(block).toContain('--yu-bg-titlebar: #121211;')
    expect(block).toContain('color-scheme: dark;')
  })

  it('keeps opt-in Swarm warm and White daylight tokens unchanged', () => {
    const warm = palette("[data-theme='yu-dark']")
    expect(warm).toContain('--yu-bg-canvas: #1a1813;')
    expect(warm).toContain('--yu-bg-window: #1c1913;')
    const white = palette("[data-theme='yu-daylight']")
    expect(white).toContain('--yu-bg-canvas: #faf9f5;')
    expect(white).toContain('--yu-bg-window: #ffffff;')
    expect(white).toContain('color-scheme: light;')
  })

  it('retains graphite and theme-specific HSL bridges', () => {
    expect(palette("[data-theme='yu-graphite']")).toContain('--yu-bg-canvas: #262624;')
    expect(site).toContain("/* YuTheme 0.3: keep the shadcn HSL bridge")
    expect(site).toContain("[data-theme='yu-daylight'] {")
    expect(site).toContain("--background: 0 0% 0%;")
    expect(site).toContain("--background: 48 33% 97%;")
  })
})
