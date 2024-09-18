import { useMounted } from '../mounted'
import { useSignalWatchOnce } from '../useSignalWatchOnce'

export function useOnMounted(cb: () => void): void {
  const isMounted = useMounted()

  useSignalWatchOnce(isMounted, cb)
}
