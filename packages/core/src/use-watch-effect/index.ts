import type { Fn } from '../utils'
import { watchEffect } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 * @type {typeof watchEffect}
 */
export function useWatchEffect(
  cb: Fn | (() => Fn),
) {
  const watchHandler = watchEffect(cb)

  useOnCleanup(watchHandler)

  return watchHandler
}
