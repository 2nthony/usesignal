import type { ReadonlySignal, Signal } from '@preact/signals-react'
import type { Arrayable, MaybeSignal } from '@usesignal/shared'
import { computed, effect } from '@preact/signals-react'
import { toValue, useSignal } from '@usesignal/shared'
import { useEffect, useMemo } from 'react'

export interface SignalWatchOptions {
  immediate?: boolean
  once?: boolean
}

export type SignalWatchSource<T> = Arrayable<MaybeSignal<T> | ReadonlySignal<T>>

export type SignalWatchCallback<V = any, OV = any> = (value: V, oldValue: OV) => any

interface SignalWatchHandler {
  (): void // callable, same as stop
  isActive: Signal<boolean>
  pause: () => void
  resume: () => void
  stop: () => void
}

export function useSignalWatch<T>(
  value: Arrayable<MaybeSignal<T>>,
  cb?: SignalWatchCallback,
  options?: SignalWatchOptions,
): SignalWatchHandler

export function useSignalWatch<T>(
  value: () => T,
  cb?: SignalWatchCallback,
  options?: SignalWatchOptions,
): SignalWatchHandler

export function useSignalWatch(
  value: any,
  cb?: any,
  options?: any,
): SignalWatchHandler {
  value = useMemo(
    () => typeof value === 'function' ? computed(value) : value,
    [value],
  )

  const { immediate = false, once = false } = options ?? {}
  const isActive = useSignal(true)

  const dispose = useSignal<(() => void) | null>()
  const isArrayValues = Array.isArray(value)
  const values = (isArrayValues ? value : [value]) as ReadonlySignal[]

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
    const newValues = values.map(toValue)
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
