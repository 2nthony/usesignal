import type { Signal } from '@preact/signals-react'
import type { AnyFn, Arrayable, MaybeSignal } from '@resignals/shared'
import { effect } from '@preact/signals-react'
import { toValue, useSignal } from '@resignals/shared'
import { useEffect } from 'react'

export interface SignalWatchOptions {
  immediate?: boolean
  once?: boolean
}

// FIXME: should support getter
export type SignalWatchSource<T> = Arrayable<MaybeSignal<T>>
// FIXME: fix cb type
export type SignalWatchCallback = AnyFn

interface SignalWatchHandler {
  (): void // callable, same as stop
  isActive: Signal<boolean>
  pause: () => void
  resume: () => void
  stop: () => void
}

export function useSignalWatch<T>(
  value: SignalWatchSource<T>,
  cb?: SignalWatchCallback,
  options?: SignalWatchOptions,
): SignalWatchHandler {
  const { immediate = false, once = false } = options ?? {}
  const isActive = useSignal(true)

  const dispose = useSignal<(() => void) | null>()
  const isArrayValues = Array.isArray(value)
  const values = isArrayValues ? value : [value]

  let prevValues = values.map(toValue)

  function handler() {
    dispose.value?.()
    dispose.value = null
    isActive.value = false
  }
  function pause() {
    if (dispose.value) {
      isActive.value = false
    }
  }
  function resume() {
    if (dispose.value) {
      isActive.value = true
    }
  }
  handler.stop = handler
  handler.isActive = isActive
  handler.pause = pause
  handler.resume = resume

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

    if (changed && isActive.peek()) {
      const cbNewValues = isArrayValues ? newValues : newValues[0]
      const cbPrevValues = isArrayValues ? prevValues : prevValues[0]
      cb?.(cbNewValues, cbPrevValues)
      prevValues = newValues

      if (once) {
        handler()
      }
    }
  }

  useEffect(() => {
    if (immediate) {
      effectFn(true)
    }

    dispose.value = effect(effectFn)

    return () => {
      handler()
    }
  }, [])

  return handler
}
