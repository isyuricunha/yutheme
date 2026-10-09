import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from './cn'

type BlurImageProps = {
  /** Extra classes for the rendered image element. */
  imageClassName?: string
  /** When false, the image renders without the pending blur and fade-in. */
  lazy?: boolean
} & React.ComponentProps<typeof NextImage>

/**
 * Image wrapper with a pending blur that fades in when the image finishes
 * loading. It renders the image element directly, so consumers using `fill`
 * keep providing their own positioned parent. Consumer inline styles
 * (opacity, transition) intentionally take precedence over the pending
 * classes, and the effect is skipped entirely with `lazy={false}`.
 */
const BlurImage = (props: BlurImageProps) => {
  const { alt, className, imageClassName, lazy = true, onLoad, onError, ...rest } = props
  const [pending, setPending] = useState(Boolean(lazy))
  const [failed, setFailed] = useState(false)

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setPending(false)
    onLoad?.(event)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setFailed(true)
    onError?.(event)
  }

  return (
    <NextImage
      {...rest}
      alt={alt}
      className={cn(
        'yu-blur-image',
        lazy && pending && !failed &&
          'yu-blur-image--pending motion-reduce:filter-none motion-reduce:opacity-100',
        failed && 'yu-blur-image--failed',
        className,
        imageClassName
      )}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}

export { BlurImage }
