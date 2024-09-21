import type { WatchCallback, WatchOptions, WatchSource } from '../use-watch'
import { useWatch } from '../use-watch'

export interface WheneverOptions extends WatchOptions {
  /**
   * Only trigger once when the condition is met
   *
   * Override the `once` option in `WatchOptions`
   *
   * @default false
   */
  once?: boolean
}

export function useWhenever<T>(value: WatchSource<T>, cb: WatchCallback, options?: WheneverOptions) {
  const stop = useWatch(
    value,
    (val, prevVal) => {
      if (val) {
        cb(val, prevVal)

        if (options?.once) {
          stop()
        }
      }
    },
    {
      ...options,
      once: false,
    },
  )
}
