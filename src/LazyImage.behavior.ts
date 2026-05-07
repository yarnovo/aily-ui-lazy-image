/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 写法是"给定 props · 期望状态机转移"的纯描述
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

export type LazyImageStatus = 'loading' | 'loaded' | 'error'

export interface StatusTransitionScenario {
  name: string
  /** 模拟事件 */
  event: 'load' | 'error'
  /** 期望最终状态 */
  expectedStatus: LazyImageStatus
  /** 期望触发的回调 */
  expectedCallback: 'onLoad' | 'onError' | 'none'
}

/** 共享场景 · Web + RN 都跑 */
export const lazyImageScenarios: StatusTransitionScenario[] = [
  {
    name: 'load 事件 · 切 loaded · 触发 onLoad',
    event: 'load',
    expectedStatus: 'loaded',
    expectedCallback: 'onLoad',
  },
  {
    name: 'error 事件 · 切 error · 触发 onError',
    event: 'error',
    expectedStatus: 'error',
    expectedCallback: 'onError',
  },
]
