import type { ComputedSignal } from '../signals'
import type { AnyFn, Pausable } from '../utils'
import { effect } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useComputed, useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'

export interface WatchHandler extends Pausable {
  (): void // callable, same as stop
  isActive: ComputedSignal<boolean>
  stop: () => void
  pause: () => void
  resume: () => void
}

type OnCleanup = (cleanupFn: () => void) => void

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 */
export function useWatchEffect(
  cb: (onCleanup?: OnCleanup) => void,
): WatchHandler {
  useSignals()

  const isActive = useSignal(true)
  const readonlyIsActive = useComputed(() => isActive.value)
  const dispose = useSignal<AnyFn | null>(null)
  let cleanup: AnyFn | null = null

  function cleanupHandler() {
    if (cleanup) {
      cleanup()
      cleanup = null
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

  // BUG: in strict mode, after cleanup, this won't works
  useOnMount(() => {
    dispose.value = effect(() => {
      if (isActive.value) {
        cb((cleanupFn: AnyFn) => {
          cleanup = cleanupFn
        })
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
