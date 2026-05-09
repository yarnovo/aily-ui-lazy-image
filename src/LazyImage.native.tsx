/**
 * akong LazyImage · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { LazyImage } from '@aily-ui/lazy-image'` 自动取对应平台
 */

import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  Text,
  View,
  useColorScheme,
  type ImageErrorEventData,
  type NativeSyntheticEvent,
  type ImageResizeMode,
} from 'react-native'
import { tokens } from '@aily-ui/tokens'
import type { LazyImageObjectFit, LazyImageProps } from './LazyImage.types'

const fitMap: Record<LazyImageObjectFit, ImageResizeMode> = {
  cover: 'cover',
  contain: 'contain',
  fill: 'stretch',
}

type Status = 'loading' | 'loaded' | 'error'

export function LazyImage(props: LazyImageProps) {
  const { src, alt = '', aspectRatio, width, height, objectFit = 'cover', onLoad, onError } = props

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  const [status, setStatus] = useState<Status>('loading')
  const opacity = useRef(new Animated.Value(0)).current
  const shimmer = useRef(new Animated.Value(0)).current

  // shimmer 来回扫 · 1.4s 一轮
  useEffect(() => {
    if (status !== 'loading') return
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [status, shimmer])

  // image 淡入 0.25s
  useEffect(() => {
    if (status === 'loaded') {
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start()
    }
  }, [status, opacity])

  const handleLoad = () => {
    setStatus('loaded')
    onLoad?.()
  }
  const handleError = (_e: NativeSyntheticEvent<ImageErrorEventData>) => {
    setStatus('error')
    onError?.()
  }

  const containerStyle = {
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    aspectRatio: aspectRatio,
    backgroundColor: t.bgSubtle,
    borderRadius: tokens.radius.md,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  }

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <View style={containerStyle} accessible accessibilityLabel={alt}>
      {status === 'loading' && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: t.bgHover,
            opacity: shimmerOpacity,
          }}
        />
      )}
      {status !== 'error' && (
        <Animated.View style={{ flex: 1, opacity }}>
          <Image
            source={{ uri: src }}
            onLoad={handleLoad}
            onError={handleError}
            resizeMode={fitMap[objectFit]}
            style={{ width: '100%', height: '100%' }}
            accessibilityLabel={alt}
          />
        </Animated.View>
      )}
      {status === 'error' && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.bgSubtle,
          }}
        >
          <Text
            style={{
              color: t.fgSubtle,
              fontSize: tokens.text.lg,
              fontWeight: tokens.weight.regular,
            }}
          >
            ✗
          </Text>
        </View>
      )}
    </View>
  )
}

export default LazyImage
