import type { ReadonlySignal, Signal } from '@preact/signals-react'
import { computed as _computed } from '@preact/signals-react'
import { useMemo } from 'react'

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter
}

export type ComputedGetter<T> = () => T
export type ComputedSetter<T = any> = (value: T) => void

export interface ComputedSignal<T> extends ReadonlySignal<T> {}

export function computed<T>(getter: () => T): ComputedSignal<T>
export function computed<T>(options: WritableComputedOptions<T>): Signal<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T> | undefined

  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions
  }
  else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const signal = _computed(getter) as ComputedSignal<T>

  return new Proxy(signal, {
    get(target, key) {
      return Reflect.get(target, key)
    },
    set(_target, _key, value) {
      if (setter) {
        setter(value)
      }

      return true
    },
  })
}

export function useComputed<T>(getter: () => T): ComputedSignal<T>
export function useComputed<T>(options: WritableComputedOptions<T>): Signal<T>
export function useComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  return useMemo(() => computed<T>(getterOrOptions as any), [])
}
