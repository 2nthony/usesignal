import type { ConfigurableWindow } from '../_configurable'
import type { Arrayable, MaybeComputedElementSignal, MaybeElement, MaybeSignalOrGetter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useComputed } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useSupported } from '../use-supported'
import { useWatch } from '../use-watch'
import { notNullish, toValue } from '../utils'

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>

export interface UseMutationObserverOptions extends MutationObserverInit, ConfigurableWindow {}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://vueuse.org/useMutationObserver/
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @param target
 * @param callback
 * @param options
 */
export function useMutationObserver(
  target: Arrayable<MaybeComputedElementSignal> | MaybeSignalOrGetter<Arrayable<MaybeElement>>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
) {
  const {
    window = defaultWindow,
    ...mutationOptions
  } = options
  let observer: MutationObserver | undefined
  const isSupported = useSupported(() => window && 'MutationObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = useComputed(() => {
    const value = toValue(target)
    const items = (Array.isArray(value) ? value : [value])
      .map(toValue)
      .filter(notNullish)

    return new Set(items)
  })

  const stopWatch = useWatch(
    () => targets.value,
    (targets) => {
      cleanup()

      if (isSupported.value && targets.size) {
        observer = new MutationObserver(callback)
        targets.forEach((el: MaybeElement) => {
          observer!.observe(el!, mutationOptions)
        })
      }
    },
    { immediate: true },
  )

  const takeRecords = () => {
    return observer?.takeRecords()
  }

  const stop = () => {
    stopWatch()
    cleanup()
  }

  useOnCleanup(stop)

  return {
    isSupported,
    stop,
    takeRecords,
  }
}
