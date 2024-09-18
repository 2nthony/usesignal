import type { SignalWatchCallback, SignalWatchOptions, SignalWatchSource } from '../use-signal-watch'
import { useSignalWatch } from '../use-signal-watch'

export interface WheneverOptions extends SignalWatchOptions {
  /**
   * Only trigger once when the condition is met
   *
   * Override the `once` option in `WatchOptions`
   *
   * @default false
   */
  once?: boolean
}

export function useWhenever<T>(value: SignalWatchSource<T>, cb: SignalWatchCallback, options?: WheneverOptions) {
  const stop = useSignalWatch(
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
