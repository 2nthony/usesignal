import type { Signal } from '@preact/signals-react'
import type { Pausable } from '../utils'
import { useSignal } from '../signals'
import { useIntervalFn } from '../use-interval-fn'
import { useRafFn } from '../use-raf-fn'

export interface UseNowOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Update the timestamp immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number

  /**
   * Callback on each update
   */
  callback?: (now: Date) => void
}

export type UseNowReturn = ReturnType<typeof useNow>

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 */
export function useNow(options?: UseNowOptions<false>): Signal<Date>
export function useNow(options: UseNowOptions<true>): { now: Signal<Date> } & Pausable
export function useNow(options: UseNowOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    immediate = true,
    interval = 'requestAnimationFrame',
    callback,
  } = options

  const now = useSignal(new Date())

  const update = () => {
    now.value = new Date()
  }

  const cb = callback
    ? () => {
        update()
        callback(now.value)
      }
    : update

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(cb, { immediate })
    : useIntervalFn(cb, interval, { immediate })

  if (exposeControls) {
    return {
      now,
      ...controls,
    }
  }
  else {
    return now
  }
}
