/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text --
   The mock replaces next/image with a plain img on purpose. */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const onNextImage = vi.hoisted(() =>
  vi.fn((props: Record<string, unknown>) => <img data-testid="next-image" {...props} />)
)

vi.mock('next/image', () => ({ default: onNextImage }))

import { BlurImage } from '../blur-image'

const consumerProps = {
  alt: 'Site avatar',
  src: '/images/avatar.png',
  fill: true,
  sizes: '112px',
  priority: true,
  className: 'rounded-lg',
  imageClassName: 'object-cover',
} as const

describe('BlurImage interface compatibility', () => {
  it('passes every call-site prop through to the image element', () => {
    const onLoad = vi.fn()
    const onError = vi.fn()
    render(<BlurImage {...consumerProps} lazy={false} onLoad={onLoad} onError={onError} />)

    const image = screen.getByTestId('next-image') as HTMLImageElement
    expect(image.getAttribute('alt')).toBe('Site avatar')
    expect(image.getAttribute('src')).toBe('/images/avatar.png')
    expect(image.getAttribute('sizes')).toBe('112px')
    expect(image.className).toContain('yu-blur-image')
    expect(image.className).toContain('rounded-lg')
    expect(image.className).toContain('object-cover')
    // lazy={false}: no pending effect at all
    expect(image.className).not.toContain('yu-blur-image--pending')
  })

  it('starts pending and clears the blur class once loaded', () => {
    const onLoad = vi.fn()
    const { container } = render(<BlurImage {...consumerProps} onLoad={onLoad} />)

    const image = container.querySelector('[data-testid="next-image"]') as HTMLImageElement
    expect(image.className).toContain('yu-blur-image--pending')

    fireEvent.load(image)
    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(image.className).not.toContain('yu-blur-image--pending')
  })

  it('marks the image as failed and keeps consumer error handlers', () => {
    const onError = vi.fn()
    const { container } = render(<BlurImage {...consumerProps} onError={onError} />)

    const image = container.querySelector('[data-testid="next-image"]') as HTMLImageElement
    fireEvent.error(image)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(image.className).toContain('yu-blur-image--failed')
    expect(image.className).not.toContain('yu-blur-image--pending')
  })

  it('does not break when consumers pass inline opacity styles', () => {
    const { container } = render(
      <BlurImage {...consumerProps} style={{ opacity: 0, transition: 'opacity var(--transition)' }} />
    )

    const image = container.querySelector('[data-testid="next-image"]') as HTMLImageElement
    expect(image.style.opacity).toBe('0')
    expect(image.className).toContain('yu-blur-image--pending')
  })
})
