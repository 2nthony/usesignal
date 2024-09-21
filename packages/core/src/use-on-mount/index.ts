'use client'
import { useEffect } from 'react'

export function useOnMount(cb: () => void): void {
  useEffect(() => {
    cb()
  }, [])
}
