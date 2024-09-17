import { useSignal } from '@signals-use/shared'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useMediaQuery } from '../useMediaQuery'
import { useOnMounted } from '../useOnMounted'
import { useSignalWatch } from '../useSignalWatch'
import type { ConfigurableWindow } from '../_configurable'

export interface UseWindowSizeOptions extends ConfigurableWindow {
  initialWidth?: number
  initialHeight?: number
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean
  /**
   * Whether the scrollbar should be included in the width and height
   * @default true
   */
  includeScrollbar?: boolean
  /**
   * Use `window.innerWidth` or `window.outerWidth`
   *
   * @default 'inner'
   */
  type?: 'inner' | 'outer'
}

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const {
    window = defaultWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true,
    type = 'inner',
  } = options

  const width = useSignal(initialWidth)
  const height = useSignal(initialHeight)

  const update = () => {
    if (window) {
      if (type === 'outer') {
        width.value = window.outerWidth
        height.value = window.outerHeight
      }
      else if (includeScrollbar) {
        width.value = window.innerWidth
        height.value = window.innerHeight
      }
      else {
        width.value = window.document.documentElement.clientWidth
        height.value = window.document.documentElement.clientHeight
      }
    }
  }

  useOnMounted(update)
  useEventListener('resize', update, { passive: true })

  const matches = useMediaQuery('(orientation: portrait)')
  useSignalWatch(matches, () => {
    if (listenOrientation) {
      update()
    }
  })

  return { width, height }
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
