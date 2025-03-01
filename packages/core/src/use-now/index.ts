import type { Signal } from '../signals'
import type { Pausable } from '../utils'
import { useSignal } from '../signals'
import { useIntervalFn } from '../use-interval-fn'
import { useRafFn } from '../use-raf-fn'
import { useWatch } from '../use-watch'

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
  const isRaf = useSignal(false)

  const update = () => {
    now.value = new Date()
  }

  const cb = callback
    ? () => {
        update()
        callback(now.value)
      }
    : update

  const controlsRaf = useRafFn(cb, { immediate: false })
  const controlsInterval = useIntervalFn(cb, interval as number, { immediate: false })

  useWatch(interval, (v) => {
    if (v === 'requestAnimationFrame') {
      controlsRaf.resume()
      controlsInterval.pause()
      isRaf.value = true
    }
    else {
      controlsInterval.resume()
      controlsRaf.pause()
      isRaf.value = false
    }
  }, { immediate })

  if (exposeControls) {
    return {
      now,
      ...(isRaf.value ? controlsRaf : controlsInterval),
    }
  }
  else {
    return now
  }
}
