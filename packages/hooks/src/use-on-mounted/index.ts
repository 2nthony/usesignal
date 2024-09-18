import { useMounted } from '../use-mounted'
import { useSignalWatch } from '../use-signal-watch'

export function useOnMounted(cb: () => void): void {
  const isMounted = useMounted()

  useSignalWatch(isMounted, cb, { once: true })
}
