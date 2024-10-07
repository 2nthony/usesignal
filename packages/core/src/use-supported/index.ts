import { useComputed } from '../signals'
import { useMounted } from '../use-mounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()

  return useComputed(() => {
    // to trigger the ref
    // eslint-disable-next-line ts/no-unused-expressions
    isMounted.value
    return Boolean(callback())
  })
}
