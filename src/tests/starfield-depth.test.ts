import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountStarfieldDepth } from '../effects/starfield-depth'

function createLayer(width = 800, height = 450) {
  const layer = document.createElement('div')
  document.body.append(layer)
  vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({
    width, height
  } as DOMRect)
  return layer
}

function prepareCanvas() {
  const canvasContext = {
    fillStyle: '',
    globalAlpha: 1,
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn()
  }
  const fade: Array<{ fillStyle: string; alpha: number }> = []
  const starPaint: Array<{ fillStyle: string; alpha: number }> = []
  canvasContext.fillRect.mockImplementation(() => {
    fade.push({ fillStyle: canvasContext.fillStyle, alpha: canvasContext.globalAlpha })
  })
  canvasContext.fill.mockImplementation(() => {
    starPaint.push({ fillStyle: canvasContext.fillStyle, alpha: canvasContext.globalAlpha })
  })

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    canvasContext as unknown as CanvasRenderingContext2D
  )

  const scheduled: FrameRequestCallback[] = []
  const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    scheduled.push(callback)
    return scheduled.length
  })
  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

  return { canvasContext, fade, starPaint, scheduled, raf, cancel }
}

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
})

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('optional Starfield Depth entry', () => {
  it('does not mount or animate anything before it is requested', () => {
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('preserves 180 stars and identical per-frame movement, depth, fade and radius', () => {
    const layer = createLayer()
    const { canvasContext, fade, starPaint, scheduled, raf } = prepareCanvas()
    const stop = mountStarfieldDepth(layer)
    const canvas = layer.querySelector('canvas')

    expect(canvas).not.toBeNull()
    expect(canvas?.getAttribute('aria-hidden')).toBe('true')
    expect(canvas?.style.pointerEvents).toBe('none')
    expect(canvasContext.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0)
    expect(canvasContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 450)
    expect(fade[0]).toEqual({ fillStyle: 'rgba(23,25,28,0.72)', alpha: 1 })
    expect(canvasContext.arc).toHaveBeenCalledTimes(180)
    expect(starPaint[0]?.fillStyle).toBe('#e8e4dc')
    expect(starPaint[0]?.alpha).toBeCloseTo(0.34)

    // With random=0.5, depth=0.60, initial x=400, y=225.
    // A single rendering frame advances y by (0.12 + 0.60*0.8) = 0.60.
    const firstCall = canvasContext.arc.mock.calls[0]
    expect(firstCall?.[0]).toBe(400)
    expect(firstCall?.[1]).toBeCloseTo(225.6)
    expect(firstCall?.[2]).toBeCloseTo(1.13)
    expect(raf).toHaveBeenCalledTimes(1)

    scheduled[0]?.(16)
    expect(canvasContext.arc).toHaveBeenCalledTimes(360)
    expect(canvasContext.arc.mock.calls[180]?.[1]).toBeCloseTo(226.2)
    expect(raf).toHaveBeenCalledTimes(2)
    stop()
  })

  it('is idempotent and stops rendering after disposal without touching the host', () => {
    const layer = createLayer()
    const { scheduled, raf, cancel, canvasContext } = prepareCanvas()
    const first = mountStarfieldDepth(layer)
    const second = mountStarfieldDepth(layer)
    expect(first).toBe(second)
    expect(layer.querySelectorAll('canvas')).toHaveLength(1)

    first()
    first()
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(layer.isConnected).toBe(true)
    expect(layer.querySelector('canvas')).toBeNull()
    scheduled[0]?.(16)
    expect(raf).toHaveBeenCalledTimes(1)
    expect(canvasContext.arc).toHaveBeenCalledTimes(180)
  })

  it('paints a still frame when reduced motion is preferred', () => {
    const media = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(media))
    const layer = createLayer()
    const { raf, canvasContext } = prepareCanvas()
    const stop = mountStarfieldDepth(layer)
    expect(canvasContext.arc).toHaveBeenCalledTimes(180)
    expect(raf).not.toHaveBeenCalled()
    expect(media.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    stop()
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('accepts overridden CSS values only for an explicitly mounted layer', () => {
    const layer = createLayer()
    layer.style.setProperty('--yu-bg-canvas', '#000000')
    layer.style.setProperty('--yu-starfield-color', '#46c2b3')
    layer.style.setProperty('--yu-starfield-size', '2')
    layer.style.setProperty('--yu-starfield-speed', '0.5')
    layer.style.setProperty('--yu-starfield-intensity', '0.5')

    const { fade, starPaint, canvasContext } = prepareCanvas()
    const stop = mountStarfieldDepth(layer)
    expect(fade[0]?.fillStyle).toBe('rgba(0,0,0,0.72)')
    expect(starPaint[0]?.fillStyle).toBe('#46c2b3')
    expect(starPaint[0]?.alpha).toBeCloseTo(0.17)
    expect(canvasContext.arc.mock.calls[0]?.[1]).toBeCloseTo(225.6)
    expect(canvasContext.arc.mock.calls[0]?.[2]).toBeCloseTo(2.26)
    stop()
  })
})
