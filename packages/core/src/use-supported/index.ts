'use client'
import { useComputed } from '@preact/signals-react'
import { useIsMounted } from '../use-is-mounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useIsMounted()

  return useComputed(() => {
    // to trigger the ref
    // eslint-disable-next-line ts/no-unused-expressions
    isMounted.value
    return Boolean(callback())
  })
}
