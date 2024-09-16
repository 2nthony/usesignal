import { useIsMounted } from '../useIsMounted'
import { useSignalWatchOnce } from '../useSignalWatchOnce'

export function useOnMounted(cb: () => void): void {
  const isMounted = useIsMounted()

  useSignalWatchOnce(isMounted, cb)
}
