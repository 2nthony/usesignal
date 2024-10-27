import type { ComputedSignal } from '../signals'
import type { WatchHandler } from '../use-watch-effect'
import type { Arrayable, MaybeSignal } from '../utils'
import { useMemo } from 'react'
import { computed, useSignal } from '../signals'
import { useWatchEffect } from '../use-watch-effect'
import { hasChanged, toValue } from '../utils'

export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  once?: boolean
}

export type WatchSource<T = any> = Arrayable<MaybeSignal<T> | ComputedSignal<T>>

export type WatchCallback<V = any, OV = any> = (value: V, oldValue: OV) => any

export function useWatch<T>(
  value: Arrayable<MaybeSignal<T>>,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function useWatch<T>(
  value: () => T,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function useWatch(
  value: any,
  cb?: any,
  options?: any,
): WatchHandler {
  value = useMemo(
    () => typeof value === 'function' ? computed(value) : value,
    [value],
  )

  const { immediate = false, once = false } = options ?? {}
  const isActive = useSignal(true)
  let isFirst = true

  const isArrayValues = Array.isArray(value)
  const values = (isArrayValues ? value : [value]) as ComputedSignal[]

  // NOTE: oldValues must be equal to newValues at first time,
  // otherwise will trigger the effectFn immediately by `useWatchEffect(effectFn)`
  // because the `isChanged`
  let oldValues = values.map(toValue)

  function effectFn(force = false) {
    const newValues = values.map(toValue)
    const isChanged = newValues.some((v, i) => hasChanged(v, oldValues[i]))

    function execute() {
      const cbNewValues = isArrayValues ? newValues : newValues[0]
      let cbOldValues
      if (!isFirst && isChanged) {
        cbOldValues = isArrayValues ? oldValues : oldValues[0]
      }

      cb?.(cbNewValues, cbOldValues)
      oldValues = newValues

      isFirst = false
    }

    if (force) {
      execute()
      return
    }

    if (isActive.peek() && isChanged) {
      execute()
    }
  }

  const stop = useWatchEffect(() => {
    if (isFirst && immediate) {
      effectFn(true)
    }
    else {
      effectFn()
    }

    if (once && !isFirst) {
      stop()
    }
  })

  return stop
}
