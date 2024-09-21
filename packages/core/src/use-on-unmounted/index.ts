import { useSignalEffect } from '@preact/signals-react'
import { useMounted } from '../use-mounted'

export function useOnUnmounted(fn: () => void) {
  let flag: boolean | undefined
  const isMounted = useMounted()

  useSignalEffect(() => {
    if (flag) {
      return
    }

    if (!isMounted.value) {
      fn()
      flag = true
    }
  })
}
