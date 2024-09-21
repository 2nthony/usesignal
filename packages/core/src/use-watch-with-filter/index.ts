import type { WatchCallback, WatchOptions, WatchSource } from '../use-watch'
import type { ConfigurableEventFilter } from '../utils/filter'
import { useWatch } from '../use-watch'
import { bypassFilter, createFilterWrapper } from '../utils/filter'

export interface WatchWithFilterOptions extends WatchOptions, ConfigurableEventFilter {}

export function useWatchWithFilter<T>(
  source: WatchSource<T>,
  cb: WatchCallback,
  options: WatchWithFilterOptions = {},
) {
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