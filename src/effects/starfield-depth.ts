/**
 * Optional Canvas starfield. Import this entry point only when the effect is used.
 *
 * The cadence and drawing constants are intentionally frame-based:
 * 180 stars, depth 0.15–1.05, step (0.12 + depth * 0.8) per frame,
 * fade alpha 0.72, and radius (0.35 + depth * 1.3).
 * Do not convert to delta-time motion: that would change the animation.
 */

type Star = { x: number; y: number; z: number }

const mounted = new WeakMap<HTMLElement, () => void>()

function parseHexColor(value: string): { r: number; g: number; b: number } | null {
  const hex = value.trim().replace(/^#/, '')

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return {
      r: parseInt(hex[0]! + hex[0]!, 16),
      g: parseInt(hex[1]! + hex[1]!, 16),
      b: parseInt(hex[2]! + hex[2]!, 16)
    }
  }

  if (!/^[0-9a-f]{6}$/i.test(hex)) return null
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  }
}

function readMultiplier(styles: CSSStyleDeclaration, name: string): number {
  const value = parseFloat(styles.getPropertyValue(name))
  return Number.isFinite(value) ? value : 1
}

/**
 * Mount Starfield Depth on a dedicated, positioned background layer.
 *
 * The caller owns the layer and its stacking context. Example: make the layer
 * `position: fixed; inset: 0; pointer-events: none; z-index: 0`, and position
 * the app content above it with `position: relative; z-index: 1`.
 *
 * Returns an idempotent disposer that cancels animation, unregisters resize
 * listeners, disconnects observers, and removes only the generated canvas.
 *
 * This module is safe to import during SSR; call the function on the client.
 */
export function mountStarfieldDepth(layer: HTMLElement): () => void {
  const previous = mounted.get(layer)
  if (previous) return previous

  const doc = layer.ownerDocument
  const win = doc.defaultView
  if (!win) return () => {}

  const canvas = doc.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:var(--yu-starfield-intensity,1);'
  layer.prepend(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return () => {}
  }

  const dpr = Math.min(win.devicePixelRatio || 1, 2)
  let width = 0
  let height = 0
  let stars: Star[] = []
  let frame: number | null = null
  let stopped = false
  let hasDrawn = false

  const motionPreference = win.matchMedia?.('(prefers-reduced-motion: reduce)')

  const stop = () => {
    if (stopped) return
    stopped = true
    if (frame !== null) win.cancelAnimationFrame(frame)
    win.removeEventListener('resize', resize)
    observer?.disconnect()
    motionPreference?.removeEventListener?.('change', onMotionChange)
    canvas.remove()
    mounted.delete(layer)
  }

  const resize = () => {
    if (stopped) return
    const rect = layer.getBoundingClientRect()
    width = rect.width
    height = rect.height
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!stars.length && width > 0 && height > 0) {
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.15 + Math.random() * 0.9
      }))
    }

    if (motionPreference?.matches && hasDrawn) draw()
  }

  const draw = () => {
    if (stopped || !canvas.isConnected) {
      stop()
      return
    }

    if (!motionPreference?.matches) frame = win.requestAnimationFrame(draw)

    const styles = win.getComputedStyle(layer)
    const bg = parseHexColor(styles.getPropertyValue('--yu-bg-canvas')) ??
      { r: 23, g: 25, b: 28 }
    const color = styles.getPropertyValue('--yu-starfield-color').trim() ||
      styles.getPropertyValue('--text-primary').trim() || '#e8e4dc'
    const size = readMultiplier(styles, '--yu-starfield-size')
    const speed = readMultiplier(styles, '--yu-starfield-speed')
    const intensity = readMultiplier(styles, '--yu-starfield-intensity')

    ctx.globalAlpha = 1
    ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},0.72)`
    ctx.fillRect(0, 0, width, height)

    for (const star of stars) {
      star.y += (0.12 + star.z * 0.8) * size * speed
      if (star.y > height + 4) {
        star.y = -4
        star.x = Math.random() * width
      }

      ctx.fillStyle = color
      ctx.globalAlpha = (0.1 + star.z * 0.4) * intensity
      ctx.beginPath()
      ctx.arc(star.x, star.y, (0.35 + star.z * 1.3) * size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1
    hasDrawn = true
  }

  const onMotionChange = () => {
    if (stopped) return
    if (frame !== null) {
      win.cancelAnimationFrame(frame)
      frame = null
    }
    draw()
  }

  const ResizeObserverConstructor = win.ResizeObserver
  const observer = ResizeObserverConstructor ? new ResizeObserverConstructor(resize) : null

  mounted.set(layer, stop)
  win.addEventListener('resize', resize)
  observer?.observe(layer)
  motionPreference?.addEventListener?.('change', onMotionChange)
  resize()
  draw()

  return stop
}
