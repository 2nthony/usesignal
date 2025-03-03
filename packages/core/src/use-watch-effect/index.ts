import type { Fn } from '../utils'
import { useMemo } from 'react'
import { watchEffect } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'

export * from '../signals/watch-effect'

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 * @type {typeof watchEffect}
 */
export function useWatchEffect(
  cb: Fn | (() => Fn),
) {
  const watchHandler = useMemo(() => watchEffect(cb), [])

  useOnCleanup(watchHandler)

  return watchHandler
}
