import { signal as _signal, type Signal, useSignal as usePreactSignal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import type { MaybeSignal } from './utils/types'

export { useSignals }

export function isSignal(s: any): s is Signal {
  return !!s?.brand
}

export function signal<T>(value?: MaybeSignal<T>): Signal<T> {
  const valueIsSignal = isSignal(value)
  const _value = valueIsSignal ? value : _signal(value)

  return _value as Signal<T>
}

export function useSignal<T>(value?: MaybeSignal<T>) {
  // NOTE: not sure call this here is ok
  useSignals()

  const valueIsSignal = isSignal(value)
  const valueSignal = usePreactSignal(value)

  const signal = (valueIsSignal ? value : valueSignal) as Signal<T>

  // useRef compat
  if (!('current' in signal)) {
    Object.defineProperty(signal, 'current', {
      get() {
        return signal.value
      },
      set(value) {
        signal.value = value
      },
    })
  }

  return signal
}
