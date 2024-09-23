'use client'
import type { Signal } from '@preact/signals-react'
import type { MaybeSignal } from '../utils'
import { useSignals } from '@preact/signals-react/runtime'
import { isSignal, useSignal } from '../utils'

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Signal<T>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T): [Signal<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 */
export function useToggle(initialValue: MaybeSignal<boolean> = false) {
  useSignals()

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
