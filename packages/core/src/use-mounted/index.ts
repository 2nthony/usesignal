import { useEffect } from 'react'
import { useSignal } from '../utils'

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
