import type { Signal } from '../signals'
import type { CloneFn } from '../use-cloned'
import { useComputed, useSignal } from '../signals'
import { cloneFnJSON } from '../use-cloned'
import { timestamp } from '../utils'

export interface UseSignalHistoryRecord<T> {
  snapshot: T
  timestamp: number
}

export interface UseManualSignalHistoryOptions<Raw, Serialized = Raw> {
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

  /**
   * set data source
   */
  setSource?: (source: Signal<Raw>, v: Raw) => void
}

export interface UseManualSignalHistoryReturn<Raw, Serialized> {
  /**
   * Bypassed tracking ref from the argument
   */
  source: Signal<Raw>

  /**
   * An array of history records for undo, newest comes to first
   */
  history: Signal<UseSignalHistoryRecord<Serialized>[]>

  /**
   * Last history point, source can be different if paused
   */
  last: Signal<UseSignalHistoryRecord<Serialized>>

  /**
   * Same as {@link UseManualSignalHistoryReturn.history | history}
   */
  undoStack: Signal<UseSignalHistoryRecord<Serialized>[]>

  /**
   * Records array for redo
   */
  redoStack: Signal<UseSignalHistoryRecord<Serialized>[]>

  /**
   * A ref representing if undo is possible (non empty undoStack)
   */
  canUndo: Signal<boolean>

  /**
   * A ref representing if redo is possible (non empty redoStack)
   */
  canRedo: Signal<boolean>

  /**
   * Undo changes
   */
  undo: () => void

  /**
   * Redo changes
   */
  redo: () => void

  /**
   * Clear all the history
   */
  clear: () => void

  /**
   * Create a new history record
   */
  commit: () => void

  /**
   * Reset ref's value with latest history
   */
  reset: () => void
}

function fnBypass<F, T>(v: F) {
  return v as unknown as T
}
function fnSetSource<F>(source: Signal<F>, value: F) {
  return source.value = value
}

type FnCloneOrBypass<F, T> = (v: F) => T

function defaultDump<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<R, S>
}

function defaultParse<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<S, R>
}

/**
 * Track the change history of a ref, also provides undo and redo functionality.
 *
 * @see https://vueuse.org/useManualRefHistory
 * @param source
 * @param options
 */
export function useManualSignalHistory<Raw, Serialized = Raw>(
  source: Signal<Raw>,
  options: UseManualSignalHistoryOptions<Raw, Serialized> = {},
): UseManualSignalHistoryReturn<Raw, Serialized> {
  const {
    clone = false,
    dump = defaultDump<Raw, Serialized>(clone),
    parse = defaultParse<Raw, Serialized>(clone),
    setSource = fnSetSource,
  } = options

  function _createHistoryRecord(): UseSignalHistoryRecord<Serialized> {
    return ({
      snapshot: dump(source.value),
      timestamp: timestamp(),
    })
  }

  const last: Signal<UseSignalHistoryRecord<Serialized>> = useSignal(_createHistoryRecord()) as Signal<UseSignalHistoryRecord<Serialized>>

  const undoStack: Signal<UseSignalHistoryRecord<Serialized>[]> = useSignal([])
  const redoStack: Signal<UseSignalHistoryRecord<Serialized>[]> = useSignal([])

  const _setSource = (record: UseSignalHistoryRecord<Serialized>) => {
    setSource(source, parse(record.snapshot))
    last.value = record
  }

  const commit = () => {
    undoStack.value = [last.value, ...undoStack.value]
    last.value = _createHistoryRecord()

    if (options.capacity && undoStack.value.length > options.capacity) {
      undoStack.value = undoStack.value.slice(0, options.capacity)
    }
    if (redoStack.value.length) {
      redoStack.value = []
    }
  }

  const clear = () => {
    undoStack.value = []
    redoStack.value = []
  }

  const undo = () => {
    const state = undoStack.value[0]
    undoStack.value = undoStack.value.slice(1)

    if (state) {
      redoStack.value = [last.value, ...redoStack.value]
      _setSource(state)
    }
  }

  const redo = () => {
    const state = redoStack.value[0]
    redoStack.value = redoStack.value.slice(1)

    if (state) {
      undoStack.value = [last.value, ...undoStack.value]
      _setSource(state)
    }
  }

  const reset = () => {
    _setSource(last.value)
  }

  const history = useComputed(() => [last.value, ...undoStack.value])

  const canUndo = useComputed(() => undoStack.value.length > 0)
  const canRedo = useComputed(() => redoStack.value.length > 0)

  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,

    clear,
    commit,
    reset,
    undo,
    redo,
  }
}
