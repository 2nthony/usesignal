import type { AnyFn, Fn, Pausable } from '../utils'
import { effect } from '@preact/signals-react'
import { useComputed, useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'

export interface WatchHandler extends Fn, Pausable {
  stop: Fn
}

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 */
export function useWatchEffect(
  cb: Fn | (() => Fn),
): WatchHandler {
  const isActive = useSignal(true)
  const readonlyIsActive = useComputed(() => isActive.value)
  const dispose = useSignal<AnyFn | null>()
  let cleanupFn: Fn | void | null

  function cleanupHandler() {
    if (cleanupFn) {
      cleanupFn()
      cleanupFn = null
    }
  }

  function watchHandler() {
    cleanupHandler()

    if (dispose.value) {
      dispose.value()
      dispose.value = null
    }
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

  watchHandler.stop = watchHandler
  watchHandler.isActive = readonlyIsActive
  watchHandler.pause = pause
  watchHandler.resume = resume

  useOnMount(() => {
    dispose.value = effect(() => {
      if (isActive.value) {
        cleanupFn = cb()
      }

      return () => {
        if (isActive.value) {
          cleanupHandler()
        }
      }
    })
  })

  useOnCleanup(watchHandler)

  return watchHandler
}
