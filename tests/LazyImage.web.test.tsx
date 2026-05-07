/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 7 件事:
 * - 渲染输出 (children / variant / size 反映)
 * - 用户交互 (click)
 * - 状态变化 (loading / disabled)
 * - 受控行为 (handler 触发)
 * - 边界 (空 children · ariaLabel)
 * - 防误触 (disabled / loading 不触发)
 * - icon 渲染
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LazyImage } from '../src/LazyImage'
import { buttonScenarios } from '../src/LazyImage.behavior'

describe('LazyImage (Web) · 渲染', () => {
  it('渲染 children', () => {
    render(<LazyImage>Click me</LazyImage>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('应用 variant class', () => {
    const { container } = render(<LazyImage variant="destructive">删除</LazyImage>)
    expect(container.querySelector('.ak-lazy-image--destructive')).toBeTruthy()
  })

  it('应用 size class', () => {
    const { container } = render(<LazyImage size="lg">Big</LazyImage>)
    expect(container.querySelector('.ak-lazy-image--lg')).toBeTruthy()
  })

  it('fullWidth 加 class', () => {
    const { container } = render(<LazyImage fullWidth>占满</LazyImage>)
    expect(container.querySelector('.ak-lazy-image--full-width')).toBeTruthy()
  })

  it('icon-only · ariaLabel 必填 · 不报 a11y 错', () => {
    render(<LazyImage ariaLabel="搜索" iconLeft="🔍" />)
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
  })
})

describe('LazyImage (Web) · 状态', () => {
  it('disabled 加 attribute', () => {
    render(<LazyImage disabled>禁用</LazyImage>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('loading 加 aria-busy + class', () => {
    const { container } = render(<LazyImage loading>加载</LazyImage>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelector('.ak-lazy-image--loading')).toBeTruthy()
  })
})

describe('LazyImage (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of buttonScenarios) {
    it(sc.name, () => {
      const onClick = vi.fn()
      render(<LazyImage {...sc.props} onClick={onClick}>X</LazyImage>)
      fireEvent.click(screen.getByRole('button'))
      if (sc.onPressOutcome === 'callback-fired') {
        expect(onClick).toHaveBeenCalledOnce()
      } else {
        expect(onClick).not.toHaveBeenCalled()
      }
    })
  }
})

describe('LazyImage (Web) · 双口径回调', () => {
  it('onClick 跟 onPress 同时传 · 都触发', () => {
    const onClick = vi.fn()
    const onPress = vi.fn()
    render(<LazyImage onClick={onClick} onPress={onPress}>X</LazyImage>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('只传 onPress · Web 端 click 也触发', () => {
    const onPress = vi.fn()
    render(<LazyImage onPress={onPress}>X</LazyImage>)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledOnce()
  })
})

describe('LazyImage (Web) · 边界', () => {
  it('空 children + 空 ariaLabel · 仍可渲染 (但不推荐 · TS 应警告)', () => {
    render(<LazyImage />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('type=submit · 提交表单', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <LazyImage type="submit">提交</LazyImage>
      </form>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
