'use client'
import type { ReadonlySignal } from '@preact/signals-react'
import type { Arrayable, MaybeSignal, Pausable } from '../utils'
import { computed, effect, useComputed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useMemo } from 'react'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
import { toValue, useSignal } from '../utils'

export interface WatchOptions {
  immediate?: boolean
  once?: boolean
}

export type WatchSource<T> = Arrayable<MaybeSignal<T> | ReadonlySignal<T>>

export type WatchCallback<V = any, OV = any> = (value: V, oldValue: OV) => any

export interface WatchHandler extends Pausable {
  (): void // callable, same as stop
  stop: () => void
}

export function useWatch<T>(
  value: Arrayable<MaybeSignal<T>>,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function useWatch<T>(
  value: () => T,
  cb?: WatchCallback,
  options?: WatchOptions,
): WatchHandler

export function useWatch(
  value: any,
  cb?: any,
  options?: any,
): WatchHandler {
  useSignals()

  value = useMemo(
    () => typeof value === 'function' ? computed(value) : value,
    [value],
  )

  const { immediate = false, once = false } = options ?? {}
  const isActive = useSignal(true)
  const readonlyIsActive = useComputed(() => isActive.value)

  const dispose = useSignal<(() => void) | null>()
  const isArrayValues = Array.isArray(value)
  const values = (isArrayValues ? value : [value]) as ReadonlySignal[]

  let prevValues = values.map(toValue)

  function handler() {
    dispose.value?.()
    dispose.value = null
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
  handler.isActive = readonlyIsActive
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

  useOnMount(() => {
    if (immediate) {
      effectFn(true)
    }

    dispose.value = effect(effectFn)
  })

  useOnCleanup(handler)

  return handler
}
