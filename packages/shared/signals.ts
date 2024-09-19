import type { ReadonlySignal, Signal } from '@preact/signals-react'
import type { MaybeSignal } from './utils/types'
import { computed as _computed, signal as _signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useMemo } from 'react'
import { toValue } from './to-value'

export { useSignals }

export function isSignal(s: any): s is Signal {
  return !!s?.brand
}

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

export function computed<T>(v?: MaybeSignal<T> | ReadonlySignal<T>) {
  return _computed(
    () => toValue(v),
  ) as ReadonlySignal<T>
}

export function useSignal<T>(v?: MaybeSignal<T>) {
  // NOTE: not sure call this here is ok
  useSignals()

  return useMemo(() => signal(v), [])
}

export function useComputed<T>(v?: MaybeSignal<T> | ReadonlySignal<T>) {
  return useMemo(() => computed(v), [])
}
