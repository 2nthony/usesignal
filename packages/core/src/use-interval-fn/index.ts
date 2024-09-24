import type { Fn, MaybeSignalOrGetter, Pausable } from '../utils'
import { useComputed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
import { useWatch } from '../use-watch'
import { isClient, toValue } from '../utils'

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @default false
   */
  immediateCallback?: boolean
}

/**
 * Wrapper for `setInterval` with controls
 *
 * @see https://vueuse.org/useIntervalFn
 * @param cb
 * @param interval
 * @param options
 */
export function useIntervalFn(cb: Fn, interval: MaybeSignalOrGetter<number> = 1000, options: UseIntervalFnOptions = {}): Pausable {
  useSignals()

  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const timer = useSignal<ReturnType<typeof setInterval> | null>(null)
  const isActive = useSignal(false)
  const readonlyIsActive = useComputed(() => isActive.value)

  function clean() {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    const intervalValue = toValue(interval)
    if (intervalValue <= 0) {
      return
    }
    isActive.value = true
    if (immediateCallback) {
      cb()
    }
    clean()
    timer.value = setInterval(cb, intervalValue)
  }

  useWatch(interval, () => {
    if (isActive.value && isClient) {
      resume()
    }
  }, { immediate })

  useOnMount(() => {
    if (immediate && isClient) {
      resume()
    }
  })

  useOnCleanup(pause)

  return {
    isActive: readonlyIsActive,
    pause,
    resume,
  }
}
