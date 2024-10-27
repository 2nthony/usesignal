import type { WatchCallback, WatchOptions, WatchSource } from '../use-watch'
import type { MaybeSignalOrGetter } from '../utils'
import type { DebounceFilterOptions } from '../utils/filter'
import { useWatchWithFilter } from '../use-watch-with-filter'
import { debounceFilter } from '../utils/filter'

export interface WatchDebouncedOptions extends WatchOptions, DebounceFilterOptions {
  debounce?: MaybeSignalOrGetter<number>
}

/**
 * Watch a source and debounce the callback.
 *
 * @see https://vueuse.org/watchDebounced
 */
export function useWatchDebounced<T>(
  source: WatchSource<T>,
  cb: WatchCallback,
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
