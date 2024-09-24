import type { Signal } from '@preact/signals-react'
import type { MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { useSignals } from '@preact/signals-react/runtime'
import { isSignal, useSignal } from '../signals'
import { toValue } from '../utils'

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeSignalOrGetter<Truthy>
  falsyValue?: MaybeSignalOrGetter<Falsy>
}

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Signal<T>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T): [Signal<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 */
export function useToggle(
  initialValue: MaybeSignal<boolean> = false,
  options: UseToggleOptions<true, false> = {},
) {
  useSignals()

  const {
    truthyValue = true,
    falsyValue = false,
  } = options

  const valueIsSignal = isSignal(initialValue)
  const _value = useSignal(initialValue)

  function toggle(value?: boolean) {
    if (arguments.length) {
      _value.value = value!
      return _value.value
    }
    else {
      const truthy = toValue(truthyValue)
      _value.value = _value.value === truthy
        ? toValue(falsyValue)
        : truthy
      return _value.value
    }
  }

  if (valueIsSignal) {
    return toggle
  }
  else {
    return [_value, toggle]
  }
}
