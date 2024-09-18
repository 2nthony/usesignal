import { useMounted } from '../use-mounted'
import { useSignalWatchOnce } from '../use-signal-watch-once'

export function useOnMounted(cb: () => void): void {
  const isMounted = useMounted()

  useSignalWatchOnce(isMounted, cb)
}
