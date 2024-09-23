'use client'
import type { ReadonlySignal, Signal } from '@preact/signals-react'
import type { AnyFn, MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { computed as _computed, signal as _signal } from '@preact/signals-react'
import { useMemo } from 'react'

export function isSignal(s: any): s is Signal {
  return !!s?.brand
}

/**
 * Create a signal, compat `useRef.current` and `signal` itself
 */
export function signal<T>(v?: MaybeSignalOrGetter<T>) {
  if (typeof v === 'function') {
    v = (v as AnyFn)()
  }

  const valueIsSignal = isSignal(v)
  const value = (valueIsSignal ? v : _signal(v)) as Signal<T>

  ;(value as any).current = (value as any).current || null

  return new Proxy(value, {
    get(target, key) {
      if (key === 'current') {
        return Reflect.get(target, 'value')
      }

      return Reflect.get(target, key)
    },
    set(target, key, value) {
      if (key === 'current') {
        return Reflect.set(target, 'value', value)
      }

      return Reflect.set(target, key, value)
    },
  })
}

/**
 * Create a new side effect signal, compat `useRef.current` and `useSignal` itself
 */
export function useSignal<T>(v?: MaybeSignal<T>) {
  return useMemo(() => signal(v), [])
}

interface ComputedOptions<T> {
  get: () => T
  set: (value: any) => void
}
export interface ComputedSignal<T> extends ReadonlySignal<T> {}
export function computed<T>(getter: () => T): ComputedSignal<T>
export function computed<T>(options: ComputedOptions<T>): ComputedSignal<T>
export function computed<T>(val: (() => T) | ComputedOptions<T>) {
  let setter: ComputedOptions<T>['set'] | undefined
  let getter

  if (typeof val === 'function') {
    getter = val
  }
  else {
    getter = val.get
    setter = val.set
  }

  const signal = _computed(getter) as ComputedSignal<T>

  return new Proxy(signal, {
    get(target, key) {
      return Reflect.get(target, key)
    },
    set(_target, _key, value) {
      if (setter) {
        setter(value)

        return true
      }

      return false
    },
  })
}
