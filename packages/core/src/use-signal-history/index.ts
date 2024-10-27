import type { CloneFn } from '../use-cloned'
import type { UseManualSignalHistoryReturn } from '../use-manual-signal-history'
import type { ConfigurableEventFilter } from '../utils'
import { type Signal, useSignal } from '../signals'
import { useManualSignalHistory } from '../use-manual-signal-history'
import { useWatchWithFilter } from '../use-watch-with-filter'

export interface UseSignalHistoryOptions<Raw, Serialized = Raw> extends ConfigurableEventFilter {
  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number

  /**
   * Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)).
   * Default to false
   *
   * @default false
   */
  clone?: boolean | CloneFn<Raw>
  /**
   * Serialize data into the history
   */
  dump?: (v: Raw) => Serialized
  /**
   * Deserialize data from the history
   */
  parse?: (v: Serialized) => Raw
}

export interface UseSignalHistoryReturn<Raw, Serialized> extends UseManualSignalHistoryReturn<Raw, Serialized> {
  /**
   * A ref representing if the tracking is enabled
   */
  isTracking: Signal<boolean>

  /**
   * Pause change tracking
   */
  pause: () => void

  /**
   * Resume change tracking
   *
   * @param [commit] if true, a history record will be create after resuming
   */
  resume: (commit?: boolean) => void

  /**
   * Clear the data and stop the watch
   */
  dispose: () => void
}

/**
 * Track the change history of a ref, also provides undo and redo functionality.
 *
 * @see https://vueuse.org/useRefHistory
 * @param source
 * @param options
 */
export function useSignalHistory<Raw, Serialized = Raw>(
  source: Signal<Raw>,
  options: UseSignalHistoryOptions<Raw, Serialized> = {},
): UseSignalHistoryReturn<Raw, Serialized> {
  const {
    eventFilter,
  } = options

  // TODO: may use a `watchIgnorable` to handle
  const active = useSignal(true)

  const manualHistory = useManualSignalHistory(source, { ...options })

  const {
    clear,
    commit,
    undo: manualUndo,
    redo: manualRedo,
  } = manualHistory

  const {
    stop,
    isActive: isTracking,
    resume,
    pause,
  } = useWatchWithFilter(
    source,
    () => {
      if (active.peek()) {
        commit()
      }
    },
    { eventFilter },
  )

  function undo() {
    active.value = false
    manualUndo()
    active.value = true
  }

  function redo() {
    active.value = false
    manualRedo()
    active.value = true
  }

  function dispose() {
    stop()
    clear()
  }

  return {
    ...manualHistory,
    isTracking,
    pause,
    resume,
    commit,
    dispose,
    undo,
    redo,
  }
}
