'use client'
import type { Signal } from '@preact/signals-react'
import type { Pausable } from '../utils'
import { useIntervalFn } from '../use-interval-fn'
import { useRafFn } from '../use-raf-fn'
import { useSignal } from '../utils'

export interface UseNowOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

export type UseNowReturn = ReturnType<typeof useNow>

/**
 * Reactive current Date instance.
 *
 * @param options
 */
export function useNow(options?: UseNowOptions<false>): Signal<Date>
export function useNow(options: UseNowOptions<true>): { now: Signal<Date> } & Pausable
export function useNow(options: UseNowOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    interval = 'requestAnimationFrame',
  } = options

  const now = useSignal(new Date())

  const update = () => {
    now.value = new Date()
  }

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate: true })
    : useIntervalFn(update, interval, { immediate: true })

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
