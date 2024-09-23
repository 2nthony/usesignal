'use client'
import type { Signal } from '@preact/signals-react'
import type { UseNowOptions } from '../use-now'
import type { Pausable } from '../utils'
import { useNow } from '../use-now'
import { useWatch } from '../use-watch'
import { useSignal } from '../utils'

export type UseTimestampReturn = ReturnType<typeof useTimestamp>

export interface UseTimestampOptions<Controls extends boolean> extends
  Omit<
    UseNowOptions<Controls>,
    'callback'
  > {
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number

  /**
   * Callback on each update
   */
  callback?: (timestamp: number) => void
}

/**
 * Reactive current timestamp.
 *
 * @see https://vueuse.org/useTimestamp
 * @param options
 */
export function useTimestamp(options?: UseTimestampOptions<false>): Signal<number>
export function useTimestamp(options: UseTimestampOptions<true>): { timestamp: Signal<number> } & Pausable
export function useTimestamp(options: UseTimestampOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    immediate = true,
    interval = 'requestAnimationFrame',
    callback,
  } = options

  const { now, pause, resume, isActive } = useNow({ controls: true, interval, immediate })

  const ts = useSignal(now.value.getTime() + offset)

  useWatch(now, (val) => {
    ts.value = val.getTime() + offset

    if (callback) {
      callback(ts.value)
    }
  })

  if (exposeControls) {
    return {
      timestamp: ts,
      pause,
      resume,
      isActive,
    }
  }
  else {
    return ts
  }
}
