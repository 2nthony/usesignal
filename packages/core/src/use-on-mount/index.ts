'use client'
import { useEffect } from 'react'

/**
 * Run a callback when the component mount.
 */
export function useOnMount(cb: () => void): void {
  useEffect(() => {
    cb()
  }, [])
}
