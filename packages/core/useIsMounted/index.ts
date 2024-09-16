import { useSignal } from '@signals-use/shared'
import { useEffect } from 'react'

/**
 * Mounted state in signal
 */
export function useIsMounted() {
  const isMounted = useSignal(false)

  useEffect(() => {
    isMounted.value = true

    return () => {
      isMounted.value = false
    }
  }, [])

  return isMounted
}
