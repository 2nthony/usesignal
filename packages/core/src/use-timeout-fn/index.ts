'use client'
import type { AnyFn, MaybeSignalOrGetter, Stoppable } from '../utils'
import { useComputed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
import { isClient, toValue } from '../utils'

export interface UseTimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @see https://vueuse.org/useTimeoutFn
 * @param cb
 * @param interval
 * @param options
 */
export function useTimeoutFn<CallbackFn extends AnyFn>(
  cb: CallbackFn,
  interval: MaybeSignalOrGetter<number>,
  options: UseTimeoutFnOptions = {},
): Stoppable<Parameters<CallbackFn> | []> {
  useSignals()

  const {
    immediate = true,
  } = options

  const isPending = useSignal(false)
  const readonlyIsPending = useComputed(() => isPending.value)

  let timer: ReturnType<typeof setTimeout> | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isPending.value = false
    clear()
  }

  function start(...args: Parameters<CallbackFn> | []) {
    clear()
    isPending.value = true
    timer = setTimeout(() => {
      isPending.value = false
      timer = null

      cb(...args)
    }, toValue(interval))
  }

  useOnMount(() => {
    if (immediate) {
      isPending.value = true

      if (isClient) {
        start()
      }
    }
  })

  useOnCleanup(stop)

  return {
    isPending: readonlyIsPending,
    start,
    stop,
  }
}
