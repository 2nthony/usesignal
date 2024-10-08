import type { Signal } from '@preact/signals-react'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementSignal, MaybeElement, MaybeSignalOrGetter, Pausable } from '../utils'
import { defaultWindow } from '../_configurable'
import { useComputed, useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useSupported } from '../use-supported'
import { useWatch } from '../use-watch'
import { noop, notNullish, toElement, toValue } from '../utils'

export interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean

  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeComputedElementSignal | Document

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   * @default 0
   */
  threshold?: number | number[]
}

export interface UseIntersectionObserverReturn extends Pausable {
  isSupported: Signal<boolean>
  stop: () => void
}

/**
 * Detects that a target element's visibility.
 *
 * @see https://vueuse.org/useIntersectionObserver
 * @param target
 * @param callback
 * @param options
 */
export function useIntersectionObserver(
  target: MaybeComputedElementSignal | MaybeSignalOrGetter<MaybeElement[]> | MaybeComputedElementSignal[],
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    root,
    rootMargin = '0px',
    threshold = 0,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)
  const targets = useComputed(() => {
    const _target = toValue(target)
    return (Array.isArray(_target) ? _target : [_target]).map(toElement).filter(notNullish)
  })

  let cleanup = noop
  const isActive = useSignal(immediate)

  const stopWatch = useWatch(
    () => isSupported.value ? [targets.value, toElement(root as MaybeComputedElementSignal), isActive.value] as const : null,
    ([targets, root]: [MaybeElement[], MaybeElement]) => {
      cleanup()
      if (!isActive.value) {
        return
      }

      if (!targets.length) {
        return
      }

      const observer = new IntersectionObserver(
        callback,
        {
          root: toElement(root),
          rootMargin,
          threshold,
        },
      )

      targets.forEach(el => el && observer.observe(el))

      cleanup = () => {
        observer.disconnect()
        cleanup = noop
      }
    },
    { immediate },
  )

  const stop = () => {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  useOnCleanup(stop)

  return {
    isSupported,
    isActive,
    pause() {
      cleanup()
      isActive.value = false
    },
    resume() {
      isActive.value = true
    },
    stop,
  }
}
