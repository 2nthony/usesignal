import type { SignalWatchCallback, SignalWatchOptions, SignalWatchSource } from '../use-signal-watch'
import type { MaybeSignalOrGetter } from '../utils'
import type { DebounceFilterOptions } from '../utils/filter'
import { useWatchWithFilter } from '../use-watch-with-filter'
import { debounceFilter } from '../utils/filter'

export interface WatchDebouncedOptions extends SignalWatchOptions, DebounceFilterOptions {
  debounce?: MaybeSignalOrGetter<number>
}

export function useWatchDebounced<T>(
  source: SignalWatchSource<T>,
  cb: SignalWatchCallback,
  options: WatchDebouncedOptions = {},
) {
  const {
    debounce = 0,
    maxWait = undefined,
    ...watchOptions
  } = options

  return useWatchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: debounceFilter(debounce, { maxWait }),
    },
  )
}
