'use client'
import type { WatchCallback, WatchOptions, WatchSource } from '../use-watch'
import type { MaybeSignalOrGetter } from '../utils'
import { useWatchWithFilter } from '../use-watch-with-filter'
import { throttleFilter } from '../utils/filter'

export interface WatchThrottledOptions extends WatchOptions {
  throttle?: MaybeSignalOrGetter<number>
  trailing?: boolean
  leading?: boolean
}

export function useWatchThrottled<T>(
  source: WatchSource<T>,
  cb: WatchCallback,
  options: WatchThrottledOptions = {},
) {
  const {
    throttle = 0,
    trailing = true,
    leading = true,
    ...watchOptions
  } = options

  return useWatchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: throttleFilter(throttle, trailing, leading),
    },
  )
}
