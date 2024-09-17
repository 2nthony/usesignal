import { useComputed } from '@preact/signals-react'
import { toValue } from '@signals-use/shared'
import type { Arrayable, MaybeSignal } from '@signals-use/shared'
import { defaultWindow } from '../_configurable'
import { useSignalWatch } from '../useSignalWatch'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'

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

export function useResizeObserver(
  target: Arrayable<MaybeSignal<HTMLElement | null>>,
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

  const dispose = useSignalWatch(
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
    dispose()
  }

  return {
    isSupported,
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
