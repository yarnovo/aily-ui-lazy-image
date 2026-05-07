/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * spec 8 项:
 * - 渲染初始 loading 状态 + shimmer 占位
 * - src 加载完触发 onLoad + 切 loaded class
 * - src 错误触发 onError + 切 error state
 * - 错误时显示 fallback SVG (不见 img)
 * - aspectRatio 反映在 style
 * - width / height 反映在 style
 * - objectFit 反映在 img style
 * - 行为契约共享 spec (load + error 状态机)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LazyImage } from '../src/LazyImage'
import { lazyImageScenarios } from '../src/LazyImage.behavior'

const TEST_SRC = 'https://example.com/img.jpg'

describe('LazyImage (Web) · 渲染', () => {
  it('初始渲染 · loading 状态 + shimmer 占位 class', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" />)
    const root = container.querySelector('.ak-lazy-image')
    expect(root).toBeTruthy()
    expect(root).toHaveClass('ak-lazy-image--loading')
    expect(root?.getAttribute('data-status')).toBe('loading')
  })

  it('img 默认带 loading="lazy" + decoding="async"', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(img?.getAttribute('decoding')).toBe('async')
  })
})

describe('LazyImage (Web) · 加载状态机', () => {
  it('img onLoad 触发 · 切 loaded class · 不再 loading', () => {
    const onLoad = vi.fn()
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" onLoad={onLoad} />)
    const img = container.querySelector('img')!
    fireEvent.load(img)
    const root = container.querySelector('.ak-lazy-image')!
    expect(root).toHaveClass('ak-lazy-image--loaded')
    expect(root).not.toHaveClass('ak-lazy-image--loading')
    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('img onError 触发 · 切 error state · 不再渲染 img', () => {
    const onError = vi.fn()
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" onError={onError} />)
    const img = container.querySelector('img')!
    fireEvent.error(img)
    const root = container.querySelector('.ak-lazy-image')!
    expect(root).toHaveClass('ak-lazy-image--error')
    expect(root?.getAttribute('data-status')).toBe('error')
    expect(container.querySelector('img')).toBeNull()
    expect(onError).toHaveBeenCalledOnce()
  })

  it('错误状态 · fallback SVG broken-image 出现', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="头像" />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('.ak-lazy-image__fallback')).toBeTruthy()
    expect(container.querySelector('.ak-lazy-image__broken')).toBeTruthy()
    // a11y · fallback 带 alt 文本
    expect(screen.getByRole('img', { name: '头像' })).toBeInTheDocument()
  })
})

describe('LazyImage (Web) · 尺寸 props', () => {
  it('aspectRatio 反映在容器 style', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" aspectRatio={1.25} />)
    const root = container.querySelector('.ak-lazy-image') as HTMLElement
    // jsdom 把 1.25 normalize 成 "1.25 / 1" · 用 startsWith 兼容
    expect(root.style.aspectRatio).toMatch(/^1\.25/)
  })

  it('width / height 数字 · 自动加 px', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" width={200} height={150} />)
    const root = container.querySelector('.ak-lazy-image') as HTMLElement
    expect(root.style.width).toBe('200px')
    expect(root.style.height).toBe('150px')
  })

  it('width 字符串原样', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" width="50%" />)
    const root = container.querySelector('.ak-lazy-image') as HTMLElement
    expect(root.style.width).toBe('50%')
  })

  it('objectFit 反映在 img inline style', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" objectFit="contain" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.style.objectFit).toBe('contain')
  })

  it('objectFit default cover', () => {
    const { container } = render(<LazyImage src={TEST_SRC} alt="x" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.style.objectFit).toBe('cover')
  })
})

describe('LazyImage (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of lazyImageScenarios) {
    it(sc.name, () => {
      const onLoad = vi.fn()
      const onError = vi.fn()
      const { container } = render(
        <LazyImage src={TEST_SRC} alt="x" onLoad={onLoad} onError={onError} />,
      )
      const img = container.querySelector('img')!
      if (sc.event === 'load') fireEvent.load(img)
      else fireEvent.error(img)

      const root = container.querySelector('.ak-lazy-image')!
      expect(root).toHaveClass(`ak-lazy-image--${sc.expectedStatus}`)

      if (sc.expectedCallback === 'onLoad') {
        expect(onLoad).toHaveBeenCalledOnce()
        expect(onError).not.toHaveBeenCalled()
      } else if (sc.expectedCallback === 'onError') {
        expect(onError).toHaveBeenCalledOnce()
        expect(onLoad).not.toHaveBeenCalled()
      }
    })
  }
})

describe('LazyImage (Web) · alt / a11y', () => {
  it('alt 透传到 img', () => {
    render(<LazyImage src={TEST_SRC} alt="头像图片" />)
    expect(screen.getByRole('img', { name: '头像图片' })).toBeInTheDocument()
  })

  it('alt 缺省 · img alt 空字符串 (装饰性图)', () => {
    const { container } = render(<LazyImage src={TEST_SRC} />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('alt')).toBe('')
  })
})
