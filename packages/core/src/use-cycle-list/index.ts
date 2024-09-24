'use client'
import type { Signal } from '@preact/signals-react'
import type { MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { useComputed } from '../signals'
import { useOnMount } from '../use-on-mount'
import { useWatch } from '../use-watch'
import { toValue, useSignal } from '../utils'

export interface UseCycleListReturn<T> {
  state: Signal<T>
  index: Signal<number>
  next: (n?: number) => T
  prev: (n?: number) => T
  /**
   * Go to a specific index
   */
  go: (i: number) => T
}

export interface UseCycleListOptions<T> {
  /**
   * The initial value of the state.
   * A ref can be provided to reuse.
   */
  initialValue?: MaybeSignal<T>

  /**
   * The default index when
   */
  fallbackIndex?: number

  /**
   * Custom function to get the index of the current value.
   */
  getIndexOf?: (value: T, list: T[]) => number
}

/**
 * Cycle through a list of items
 *
 * @see https://vueuse.org/useCycleList
 */
export function useCycleList<T>(list: MaybeSignalOrGetter<T[]>, options?: UseCycleListOptions<T>): UseCycleListReturn<T> {
  const state = useSignal(getInitialValue()) as Signal<T>
  const listRef = useSignal(list) as Signal<T[]>

  useOnMount(() => {
    state.value = getInitialValue() as T
  })

  const index = useComputed<number>({
    get() {
      const targetList = toValue(listRef)

      let index = options?.getIndexOf
        ? options.getIndexOf(state.value, targetList)
        : targetList.indexOf(state.value)

      if (index < 0) {
        index = options?.fallbackIndex ?? 0
      }

      return index
    },
    set(v) {
      set(v)
    },
  })

  function set(i: number) {
    const targetList = toValue(listRef)
    const length = targetList.length
    const index = (i % length + length) % length

    const value = targetList[index]
    state.value = value
    return value
  }

  function shift(delta = 1) {
    return set(index.value + delta)
  }

  function next(n = 1) {
    return shift(n)
  }

  function prev(n = 1) {
    return shift(-n)
  }

  function getInitialValue() {
    return toValue(options?.initialValue ?? toValue<T[]>(list)[0]) ?? undefined
  }

  useWatch(listRef, () => set(index.value))

  return {
    state,
    index,
    next,
    prev,
    go: set,
  }
}
