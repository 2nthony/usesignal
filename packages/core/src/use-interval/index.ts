import type { Signal } from '@preact/signals-react'
import type { MaybeSignalOrGetter, Pausable } from '../utils'
import { useSignal } from '@preact/signals-react'
import { useIntervalFn } from '../use-interval-fn'

export interface UseIntervalOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Execute the update immediately on calling
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Callback on every interval
   */
  callback?: (count: number) => void
}

export interface UseIntervalControls {
  counter: Signal<number>
  reset: () => void
}

/**
 * Reactive counter increases on every interval
 *
 * @see https://vueuse.org/useInterval
 * @param interval
 * @param options
 */
export function useInterval(interval?: MaybeSignalOrGetter<number>, options?: UseIntervalOptions<false>): Signal<number>
export function useInterval(interval: MaybeSignalOrGetter<number>, options: UseIntervalOptions<true>): UseIntervalControls & Pausable
export function useInterval(interval: MaybeSignalOrGetter<number> = 1000, options: UseIntervalOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    immediate = true,
    callback,
  } = options

  const counter = useSignal(0)
  const update = () => counter.value += 1
  const reset = () => {
    counter.value = 0
  }
  const controls = useIntervalFn(
    callback
      ? () => {
          update()
          callback(counter.value)
        }
      : update,
    interval,
    { immediate },
  )

  if (exposeControls) {
    return {
      counter,
      reset,
      ...controls,
    }
  }
  else {
    return counter
  }
}
