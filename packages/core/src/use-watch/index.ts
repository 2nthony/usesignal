import type { WatchCallback, WatchHandler, WatchOptions } from '../signals'
import type { Arrayable, MaybeSignal } from '../utils'
import { watch } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'

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
  const stop = watch(value, cb, options)

  useOnCleanup(stop)

  return stop
}
