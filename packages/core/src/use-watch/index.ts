import type { ComputedSignal } from '../signals'
import type { WatchHandler } from '../use-watch-effect'
import type { Arrayable, MaybeSignal } from '../utils'
import { useSignals } from '@preact/signals-react/runtime'
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
  useSignals()

  value = useMemo(
    () => typeof value === 'function' ? computed(value) : value,
    [value],
  )

  const { immediate = false, once = false } = options ?? {}
  const isActive = useSignal(true)
  let isFirst = true

  const isArrayValues = Array.isArray(value)
  const values = (isArrayValues ? value : [value]) as ComputedSignal[]

  let prevValues = values.map(toValue)

  function effectFn(force = false) {
    const newValues = values.map(toValue)

    function execute() {
      const cbNewValues = isArrayValues ? newValues : newValues[0]
      const cbPrevValues = isArrayValues ? prevValues : prevValues[0]
      cb?.(cbNewValues, cbPrevValues)
      prevValues = newValues

      isFirst = false
    }

    if (force) {
      execute()
      return
    }

    if (
      isActive.peek()
      && newValues.some((v, i) => hasChanged(v, prevValues[i]))
    ) {
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
