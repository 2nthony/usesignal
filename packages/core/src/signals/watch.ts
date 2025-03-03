import type { ComputedSignal } from '../signals'
import type { Arrayable, MaybeSignal } from '../utils'
import type { WatchHandler } from './watch-effect'
import { computed, signal } from '../signals'
import { hasChanged, toValue } from '../utils'
import { watchEffect } from './watch-effect'

export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  once?: boolean
}

export type WatchSource<T = any> = Arrayable<MaybeSignal<T> | ComputedSignal<T>>

export type WatchCallback<V = any, OV = any> = (value: V, oldValue: OV) => any

export function watch<T>(
  value: Arrayable<MaybeSignal<T>>,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function watch<T>(
  value: () => T,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

/**
 * @see https://vuejs.org/api/reactivity-core.html#watch
 */
export function watch(
  value: any,
  cb?: any,
  options?: any,
): WatchHandler {
  value = typeof value === 'function' ? computed(value) : value

  const { immediate = false, once = false } = options ?? {}
  const isActive = signal(true)
  let isFirst = true
  const effected = signal(false)

  const isArrayValues = Array.isArray(value)
  const values = (isArrayValues ? value : [value]) as ComputedSignal[]

  // NOTE: oldValues must be equal to newValues at first time,
  // otherwise will trigger the effectFn immediately by `watchEffect(effectFn)`
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

  let stop: WatchHandler
  // eslint-disable-next-line prefer-const
  stop = watchEffect(() => {
    if (isFirst && immediate) {
      effectFn(true)
    }
    else {
      effectFn()
    }

    effected.value = true

    if (once && !isFirst && stop) {
      stop()
    }
  })

  return stop
}
