import { useSignal } from '@usesignal/shared'
import { useEffect } from 'react'

/**
 * Mounted state in signal
 */
export function useMounted() {
  const isMounted = useSignal(false)

  useEffect(() => {
    isMounted.value = true

    return () => {
      isMounted.value = false
    }
  }, [])

  return isMounted
}
