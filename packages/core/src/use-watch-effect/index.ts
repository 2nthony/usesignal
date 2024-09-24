import { useSignalEffect } from '@preact/signals-react'

/**
 * Rename export useSignalEffect to useWatchEffect
 */
export function useWatchEffect(...args: Parameters<typeof useSignalEffect>) {
  return useSignalEffect(...args)
}
