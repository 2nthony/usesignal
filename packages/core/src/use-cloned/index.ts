import type { Signal } from '../signals'
import type { WatchOptions } from '../use-watch'
import type { MaybeSignalOrGetter } from '../utils'
import { isSignal, useSignal } from '../signals'
import { useWatch } from '../use-watch'
import { toValue } from '../utils'

export interface UseClonedOptions<T = any> extends WatchOptions {
  /**
   * Custom clone function.
   *
   * By default, it use `JSON.parse(JSON.stringify(value))` to clone.
   */
  clone?: (source: T) => T

  /**
   * Manually sync the ref
   *
   * @default false
   */
  manual?: boolean
}

export interface UseClonedReturn<T> {
  /**
   * Cloned ref
   */
  cloned: Signal<T>
  /**
   * Sync cloned data with source manually
   */
  sync: () => void
}

export type CloneFn<F, T = F> = (x: F) => T

export function cloneFnJSON<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

export function useCloned<T>(
  source: MaybeSignalOrGetter<T>,
  options: UseClonedOptions = {},
): UseClonedReturn<T> {
  const cloned = useSignal({} as T) as Signal<T>
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    immediate = true,
  } = options

  function sync() {
    cloned.value = clone(toValue(source))
  }

  const shouldWatch = !manual && (isSignal(source) || typeof source === 'function')

  let watchOptions: WatchOptions = { immediate }
  if (!shouldWatch) {
    watchOptions = {
      immediate: true,
      once: true,
    }
  }

  useWatch(source, sync, watchOptions)

  return { cloned, sync }
}
