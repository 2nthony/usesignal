'use client'
import { useSignals } from '@preact/signals-react/runtime'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
import { useSignal } from '../utils'

/**
 * Mounted state in signal
 */
export function useIsMounted() {
  useSignals()

  const isMounted = useSignal(false)

  useOnMount(() => {
    isMounted.value = true
  })

  useOnCleanup(() => {
    isMounted.value = false
  })

  return isMounted
}
