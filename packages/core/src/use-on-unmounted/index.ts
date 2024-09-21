import { useEffect } from 'react'
import { useMounted } from '../use-mounted'

// TODO: use signal watch
export function useOnUnmounted(fn: () => void) {
  const isMounted = useMounted()

  useEffect(() => {
    return () => {
      if (!isMounted.value) {
        fn()
      }
    }
  }, [])
}
