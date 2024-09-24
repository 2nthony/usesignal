import type { WatchCallback, WatchOptions, WatchSource } from '../use-watch'
import type { ConfigurableEventFilter } from '../utils/filter'
import { useSignals } from '@preact/signals-react/runtime'
import { useWatch } from '../use-watch'
import { bypassFilter, createFilterWrapper } from '../utils/filter'

export interface WatchWithFilterOptions extends WatchOptions, ConfigurableEventFilter {}

/**
 * Watch a source and apply a filter to the callback.
 *
 * @see https://vueuse.org/watchWithFilter
 */
export function useWatchWithFilter<T>(
  source: WatchSource<T>,
  cb: WatchCallback,
  options: WatchWithFilterOptions = {},
) {
  useSignals()

  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options

  return useWatch(
    source,
    createFilterWrapper(eventFilter, cb),
    watchOptions,
  )
}
