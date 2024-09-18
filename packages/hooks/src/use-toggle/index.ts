import type { Signal } from '@preact/signals-react'
import type { MaybeSignal } from '@resignals/shared'
import { isSignal, useSignal } from '@resignals/shared'

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Signal<T>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T): [Signal<T>, (value?: T) => T]

export function useToggle(initialValue: MaybeSignal<boolean> = false) {
  const valueIsSignal = isSignal(initialValue)
  const _value = useSignal(initialValue)

  function toggle(value?: boolean): boolean {
    _value.value = value ?? !_value.value
    return _value.value
  }

  if (valueIsSignal) {
    return toggle
  }
  else {
    return [_value, toggle]
  }
}
