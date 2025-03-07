import type { Fn, MaybeSignalOrGetter, Pausable } from '../utils'
import { useComputed, useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
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
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const timer = useSignal<ReturnType<typeof setInterval> | null>(null)
  const isActive = useSignal(immediate)
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

  const stopWatch = useWatch(interval, () => {
    if (isActive.value && isClient) {
      resume()
    }
  }, { immediate })

  function stop() {
    stopWatch()
    pause()
  }

  useOnCleanup(stop)

  return {
    isActive: readonlyIsActive,
    pause,
    resume,
  }
}
