import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
import { useSignal } from '../utils'

/**
 * Mounted state in signal
 */
export function useIsMounted() {
  const isMounted = useSignal(false)

  useOnMount(() => {
    isMounted.value = true
  })

  useOnCleanup(() => {
    isMounted.value = false
  })

  return isMounted
}
