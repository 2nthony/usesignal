import { useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'

/**
 * Mounted state in signal
 *
 * @see https://vueuse.org/useMounted
 */
export function useMounted() {
  const isMounted = useSignal(false)

  useOnMount(() => {
    isMounted.value = true
  })

  useOnCleanup(() => {
    isMounted.value = false
  })

  return isMounted
}
