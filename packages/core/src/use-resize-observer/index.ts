import type { ConfigurableWindow } from '../_configurable'
import type { WatchSource } from '../use-watch'
import { defaultWindow } from '../_configurable'
import { useComputed } from '../signals'
import { useSupported } from '../use-supported'
import { useWatch } from '../use-watch'
import { toValue } from '../utils'

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

export interface UseResizeObserverOptions extends ConfigurableWindow {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://vueuse.org/useResizeObserver
 */
export function useResizeObserver(
  target: WatchSource<HTMLElement>,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
) {
  const { window = defaultWindow, ...observerOptions } = options
  let observer: ResizeObserver | undefined
  const isSupported = useSupported(() => window && 'ResizeObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = useComputed(() => {
    const _targets = toValue(target)
    return Array.isArray(_targets)
      ? _targets.map(toValue)
      : [toValue(_targets)]
  })

  const stopWatch = useWatch(
    targets,
    (els) => {
      cleanup()
      if (isSupported.value && window) {
        observer = new ResizeObserver(callback)
        for (const el of els) {
          if (el) {
            observer!.observe(el, observerOptions)
          }
        }
      }
    },
    { immediate: true },
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  return {
    isSupported,
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
