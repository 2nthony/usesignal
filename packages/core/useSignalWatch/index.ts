import { effect } from '@preact/signals-react'
import { toValue, useSignal } from '@signals-use/shared'
import { useEffect } from 'react'
import type { AnyFn, Arrayable, MaybeSignal } from '@signals-use/shared'

interface SignalWatchOptions {
  immediate?: boolean
}

export function useSignalWatch<T>(
  value: Arrayable<MaybeSignal<T>>,
  // FIXME: fix cb type
  cb: AnyFn,
  options?: SignalWatchOptions,
) {
  const { immediate = false } = options ?? {}

  const disposeEffect = useSignal<(() => void) | null>()
  const isArrayValues = Array.isArray(value)
  const values = isArrayValues ? value : [value]

  let prevValues = values.map(toValue)

  function dispose() {
    disposeEffect.value?.()
    disposeEffect.value = null
  }

  function effectFn(force = false) {
    const newValues = values.map(v => toValue(v))
    let changed = force

    if (!changed) {
      for (let i = 0; i < values.length; i++) {
        if (newValues[i] !== prevValues[i]) {
          changed = true
          break
        }
      }
    }

    if (changed) {
      const cbNewValues = isArrayValues ? newValues : newValues[0]
      const cbPrevValues = isArrayValues ? prevValues : prevValues[0]
      cb(cbNewValues, cbPrevValues)
      prevValues = newValues
    }
  }

  useEffect(() => {
    if (immediate) {
      effectFn(true)
    }

    disposeEffect.value = effect(effectFn)

    return () => {
      dispose()
    }
  }, [])

  return dispose
}
