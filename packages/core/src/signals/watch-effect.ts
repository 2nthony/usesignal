import type { AnyFn, Fn, Pausable } from '../utils'
import { effect } from '@preact/signals-react'
import { computed, signal } from '../signals'
import { noop, toValue } from '../utils'

export interface WatchHandler extends Fn, Pausable {
  stop: Fn
}

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 */
export function watchEffect(
  cb: Fn | (() => Fn),
): WatchHandler {
  const isActive = signal(true)
  const readonlyIsActive = computed(() => isActive.value)
  const dispose = signal<AnyFn | null>()
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

  return watchHandler
}

// TODO: refactor this, hard to understand returned value
/**
 * @internal
 */
export function createWatchEffectHandlerWrapper() {
  const handler = signal<WatchHandler>(noop)

  function wrapper() {
    handler.value()
  }

  const isActive = computed(() => toValue(handler.value.isActive || false))
  function pause() {
    handler.value.pause()
  }
  function resume() {
    handler.value.resume()
  }

  wrapper.stop = wrapper
  wrapper.isActive = isActive
  wrapper.pause = pause
  wrapper.resume = resume

  return [handler, wrapper] as const
}
