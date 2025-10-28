import type { WatchCallback, WatchHandler, WatchOptions } from '../signals'
import type { Arrayable, MaybeSignal } from '../utils'
import { useEffect } from 'react'
import { createWatchEffectHandlerWrapper, watch } from '../signals'

export * from '../signals/watch'

export function useWatch<T>(
  value: Arrayable<MaybeSignal<T>>,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function useWatch<T>(
  value: () => T,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

/**
 * @see https://vuejs.org/api/reactivity-core.html#watch
 */
export function useWatch(
  value: any,
  cb?: any,
  options?: any,
) {
  const [handler, handlerWrapper] = createWatchEffectHandlerWrapper()

  useEffect(() => {
    handler.value = watch(value, cb, options)

    return () => {
      handler.value()
    }
  }, [cb])

  return handlerWrapper
}
