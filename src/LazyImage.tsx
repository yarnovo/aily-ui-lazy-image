import type { LazyImageProps } from './LazyImage.types'
import './LazyImage.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong LazyImage · Web · DOM `<button>` */
export function LazyImage(props: LazyImageProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-lazy-image',
        `ak-lazy-image--${variant}`,
        `ak-lazy-image--${size}`,
        fullWidth && 'ak-lazy-image--full-width',
        loading && 'ak-lazy-image--loading',
      )}
    >
      {iconLeft && <span className="ak-lazy-image__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-lazy-image__icon">{iconRight}</span>}
    </button>
  )
}

export default LazyImage
