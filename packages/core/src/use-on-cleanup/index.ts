import { useEffect } from 'react'

/**
 * Run a cleanup function when the component unmount.
 */
export function useOnCleanup(fn: () => void) {
  useEffect(() => {
    return () => {
      fn()
    }
  }, [])
}

/**
 * Run a cleanup function when the component unmount.
 */
export const useOnUnmount = useOnCleanup
