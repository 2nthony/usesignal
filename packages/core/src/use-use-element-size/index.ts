import type { MaybeSignal } from '../utils'
import { defaultWindow } from '../_configurable'
import { useComputed, useSignal } from '../signals'
import { useOnMount } from '../use-on-mount'
import { useResizeObserver, type UseResizeObserverOptions } from '../use-resize-observer'
import { useWatch } from '../use-watch'
import { toValue } from '../utils'

export interface ElementSize {
  width: number
  height: number
}

export type UseElementSizeReturn = ReturnType<typeof useElementSize>

/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 */
export function useElementSize(
  target: MaybeSignal<HTMLElement>,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {},
) {
  const { window = defaultWindow, box = 'content-box' } = options
  const isSVG = useComputed(() => toValue(target)?.namespaceURI?.includes('svg'))
  const width = useSignal(initialSize.width)
  const height = useSignal(initialSize.height)

  const { stop: stopResizeObserver } = useResizeObserver(
    target,
    (entries) => {
      const [entry] = entries
      const boxSize = box === 'border-box'
        ? entry.borderBoxSize
        : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize

      if (window && isSVG.value) {
        const $elem = toValue(target)
        if ($elem) {
          const rect = $elem.getBoundingClientRect()
          width.value = rect.width
          height.value = rect.height
        }
      }
      else {
        if (boxSize) {
          const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize]
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0)
        }
        else {
          // fallback
          width.value = entry.contentRect.width
          height.value = entry.contentRect.height
        }
      }
    },
    options,
  )

  useOnMount(() => {
    const ele = toValue(target)
    if (ele) {
      width.value = 'offsetWidth' in ele ? ele.offsetWidth : initialSize.width
      height.value = 'offsetHeight' in ele ? ele.offsetHeight : initialSize.height
    }
  })

  const stopWatch = useWatch(target, (ele) => {
    width.value = ele ? initialSize.width : 0
    height.value = ele ? initialSize.height : 0
  })

  function stop() {
    stopResizeObserver()
    stopWatch()
  }

  return {
    width,
    height,
    stop,
  }
}
