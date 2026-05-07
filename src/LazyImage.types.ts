/**
 * akong LazyImage props · Web + RN 共享
 *
 * 用途: 图片懒加载 · shimmer 占位 · 加载完淡入 · 跨端
 */

export type LazyImageObjectFit = 'cover' | 'contain' | 'fill'

export interface LazyImageProps {
  /** 图片 URL */
  src: string
  /** a11y 描述 · 错误时也作为 fallback 文本 */
  alt?: string
  /**
   * 长宽比 (width / height) · 例 1 / 1.25 · 决定占位尺寸
   * 优先级低于 width + height 双传 · 高于单传
   */
  aspectRatio?: number
  /** 容器宽度 · 数字 = px · 字符串原样 */
  width?: number | string
  /** 容器高度 · 数字 = px · 字符串原样 */
  height?: number | string
  /** 图片 fit 模式 · default 'cover' */
  objectFit?: LazyImageObjectFit
  /** 加载成功回调 */
  onLoad?: () => void
  /** 加载失败回调 */
  onError?: () => void
}
