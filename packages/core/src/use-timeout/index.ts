import type { ComputedSignal } from '../signals'
import type { UseTimeoutFnOptions } from '../use-timeout-fn'
import type { Fn, MaybeSignalOrGetter, Stoppable } from '../utils'
import { useComputed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useTimeoutFn } from '../use-timeout-fn'
import { noop } from '../utils'

export interface UseTimeoutOptions<Controls extends boolean> extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Callback on timeout
   */
  callback?: Fn
}

/**
 * Update value after a given time with controls.
 *
 * @see https://vueuse.org/useTimeout
 * @param interval
 * @param options
 */
export function useTimeout(interval?: MaybeSignalOrGetter<number>, options?: UseTimeoutOptions<false>): ComputedSignal<boolean>
export function useTimeout(interval: MaybeSignalOrGetter<number>, options: UseTimeoutOptions<true>): { ready: ComputedSignal<boolean> } & Stoppable
export function useTimeout(interval: MaybeSignalOrGetter<number> = 1000, options: UseTimeoutOptions<boolean> = {}) {
  useSignals()

  const {
    controls: exposeControls = false,
    callback,
  } = options

  const controls = useTimeoutFn(
    callback ?? noop,
    interval,
    options,
  )

  const ready = useComputed(() => !controls.isPending.value)

  if (exposeControls) {
    return {
      ready,
      ...controls,
    }
  }
  else {
    return ready
  }
}
