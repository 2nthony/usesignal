import type { SignalWatchCallback, SignalWatchOptions, SignalWatchSource } from '../use-signal-watch'
import type { ConfigurableEventFilter } from '../utils/filter'
import { useSignalWatch } from '../use-signal-watch'
import { bypassFilter, createFilterWrapper } from '../utils/filter'

export interface WatchWithFilterOptions extends SignalWatchOptions, ConfigurableEventFilter {}

export function useWatchWithFilter<T>(
  source: SignalWatchSource<T>,
  cb: SignalWatchCallback,
  options: WatchWithFilterOptions = {},
) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options

  return useSignalWatch(
    source,
    createFilterWrapper(eventFilter, cb),
    watchOptions,
  )
}
