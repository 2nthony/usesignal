import { useEffect } from 'react'

export function useOnCleanup(fn: () => void) {
  useEffect(() => {
    return fn
  }, [])
}
