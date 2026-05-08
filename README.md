# @akong/lazy-image

> ← 回 [akong design system](https://yarnovo.github.io/akong-core/) 总站

akong LazyImage · 图片懒加载 · shimmer 占位 · 加载完淡入 · 跨端 (Web + React Native)

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-lazy-image/)

## 安装

```bash
npm i github:yarnovo/akong-lazy-image github:yarnovo/akong-tokens
```

## Web

```tsx
import { LazyImage } from '@akong/lazy-image'
import '@akong/lazy-image/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token (整个 app 共用)

<LazyImage src="https://x.com/a.jpg" alt="头像" aspectRatio={1} />
<LazyImage src="https://x.com/b.jpg" alt="封面" width={320} aspectRatio={1.25} />
<LazyImage src="https://x.com/c.jpg" alt="banner" objectFit="contain" />
<LazyImage src="https://x.com/d.jpg" onLoad={() => log()} onError={() => fallback()} />
```

## React Native

```tsx
import { LazyImage } from '@akong/lazy-image'

<LazyImage src="https://x.com/a.jpg" alt="头像" aspectRatio={1} />
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| src | `string` | (必填) | 图片 URL |
| alt | `string` | `''` | a11y 描述 + 错误时 fallback 文本 |
| aspectRatio | `number` | — | 长宽比 (例 1 / 1.25) · 决定占位尺寸 |
| width | `number \| string` | — | 数字 = px · 字符串原样 |
| height | `number \| string` | — | 数字 = px · 字符串原样 |
| objectFit | `'cover' \| 'contain' \| 'fill'` | `'cover'` | 图片 fit 模式 |
| onLoad | `() => void` | — | 加载成功 |
| onError | `() => void` | — | 加载失败 |

## 视觉

- **占位**: 容器 bg shimmer 动画 (linear-gradient 来回扫 · 1.4s)
- **加载完**: shimmer 停 + image 淡入 0.25s (opacity 0 → 1)
- **错误**: 灰底 + 居中 broken-image SVG 图标 (RN 端 fallback `<Text>✗</Text>`)

## 设计原则

- **一份 props**：Web 跟 RN 共享 `LazyImage.types.ts`
- **两端实现**：`LazyImage.tsx` (Web · `<img loading="lazy">`) + `LazyImage.native.tsx` (RN · `<Image>` + Animated)
- **行为契约共享**：`LazyImage.behavior.ts` 列状态机场景 · 两端测试都跑
- **token 100% 接 @akong/tokens**：改一处 token 自动 update

## 状态机

| 状态 | Web class | RN | 触发 |
|---|---|---|---|
| loading | `.ak-lazy-image--loading` (shimmer) | shimmer Animated 循环 | 初始 |
| loaded | `.ak-lazy-image--loaded` (img opacity 1) | Animated.timing fade-in | img onLoad |
| error | `.ak-lazy-image--error` (SVG fallback) | `<Text>✗</Text>` | img onError |
