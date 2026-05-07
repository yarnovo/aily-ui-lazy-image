import { useState, useMemo, type CSSProperties } from 'react'
import type { LazyImageProps } from './LazyImage.types'
import './LazyImage.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

const toCssSize = (v: number | string | undefined): string | undefined => {
  if (v === undefined) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/** akong LazyImage · Web · `<img loading="lazy">` + shimmer 占位 + fade-in */
export function LazyImage(props: LazyImageProps) {
  const { src, alt = '', aspectRatio, width, height, objectFit = 'cover', onLoad, onError } = props

  type Status = 'loading' | 'loaded' | 'error'
  const [status, setStatus] = useState<Status>('loading')

  const containerStyle = useMemo<CSSProperties>(() => {
    const s: CSSProperties = {}
    const w = toCssSize(width)
    const h = toCssSize(height)
    if (w !== undefined) s.width = w
    if (h !== undefined) s.height = h
    if (aspectRatio !== undefined && (h === undefined || w === undefined)) {
      s.aspectRatio = String(aspectRatio)
    }
    return s
  }, [width, height, aspectRatio])

  const handleLoad = () => {
    setStatus('loaded')
    onLoad?.()
  }

  const handleError = () => {
    setStatus('error')
    onError?.()
  }

  return (
    <div
      className={cls('ak-lazy-image', `ak-lazy-image--${status}`)}
      style={containerStyle}
      data-status={status}
    >
      {status !== 'error' && (
        <img
          className="ak-lazy-image__img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectFit }}
        />
      )}
      {status === 'error' && (
        <div className="ak-lazy-image__fallback" role="img" aria-label={alt || 'image failed to load'}>
          <svg
            className="ak-lazy-image__broken"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="m3 16 5-5 4 4" />
            <path d="m14 14 3-3 4 4" />
            <path d="m3 21 18-18" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default LazyImage
