import { useMounted } from '../mounted'
import { useSignalWatchOnce } from '../signal-watch-once'

export function useOnMounted(cb: () => void): void {
  const isMounted = useMounted()

  useSignalWatchOnce(isMounted, cb)
}
