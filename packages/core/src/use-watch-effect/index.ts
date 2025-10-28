import type { Fn } from '../utils'
import { useEffect } from 'react'
import { createWatchEffectHandlerWrapper, watchEffect } from '../signals'

export * from '../signals/watch-effect'

/**
 * @see https://vuejs.org/api/reactivity-core.html#watcheffect
 * @type {typeof watchEffect}
 */
export function useWatchEffect(
  cb: Fn | (() => Fn),
) {
  const [handler, handlerWrapper] = createWatchEffectHandlerWrapper()

  useEffect(() => {
    handler.value = watchEffect(cb)

    return () => {
      handler.value()
    }
  }, [cb])

  return handlerWrapper
}
