import type { Signal as _Signal } from '@preact/signals-react'
import type { AnyFn, MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { signal as _signal } from '@preact/signals-react'
import { useMemo } from 'react'
import { SignalFlags } from '../utils/constants'

export interface Signal<T = any> extends _Signal<T> {
  current?: T
  [SignalFlags.IS_SIGNAL]?: true
}

export function isSignal(s: any): s is Signal {
  return (
    s
      ? (
          // @usesignal/core
          s[SignalFlags.IS_SIGNAL]
          // @preact/signals-react
          || !!s.brand
        )
      : false
  )
}

/**
 * Create a proxy signal, compat `useRef.current` and `signal` itself
 */
export function signal<T>(v?: MaybeSignalOrGetter<T>) {
  if (typeof v === 'function') {
    v = (v as AnyFn)()
  }

  const valueIsSignal = isSignal(v)
  const value = (valueIsSignal ? v : _signal(v)) as Signal<T>

  if (value[SignalFlags.IS_SIGNAL]) {
    return v as Signal<T>
  }

  // compat `useRef`
  value.current = undefined
  value[SignalFlags.IS_SIGNAL] = true

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
 * Create a new side effect proxy signal, compat `useRef.current` and `useSignal` itself
 */
export function useSignal<T>(v?: MaybeSignal<T>) {
  return useMemo(() => signal(v), [])
}
