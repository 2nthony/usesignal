'use client'
import type { Signal } from '@preact/signals-react'
import type { MaybeSignal } from '../utils'
import { signal as _signal } from '@preact/signals-react'
import { useMemo } from 'react'

export function isSignal(s: any): s is Signal {
  return !!s?.brand
}

/**
 * Create a signal, compat `useRef.current` and `signal` itself
 */
export function signal<T>(v?: MaybeSignal<T>) {
  const valueIsSignal = isSignal(v)
  const value = valueIsSignal ? v : _signal(v)

  // useRef compat
  if (!('current' in value)) {
    Object.defineProperty(value, 'current', {
      get() {
        return value.value
      },
      set(newValue) {
        value.value = newValue
      },
    })
  }

  return value as Signal<T>
}

/**
 * Create a new side effect signal, compat `useRef.current` and `useSignal` itself
 */
export function useSignal<T>(v?: MaybeSignal<T>) {
  return useMemo(() => signal(v), [])
}
