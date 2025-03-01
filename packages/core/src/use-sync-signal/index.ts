import type { Signal } from '../signals'
import { useWatch } from '../use-watch'

type Direction = 'ltr' | 'rtl' | 'both'

interface Transform<L, R> {
  ltr?: (left: L) => R
  rtl?: (right: R) => L
}

export interface SyncSignalOptions<L, R, D extends Direction> {
  immediate?: boolean
  direction?: D
  transform?: Transform<L, R>
}

/**
 * Two-way signals synchronization.
 *
 * @see https://vueuse.org/syncRef
 * @param left
 * @param right
 * @param options
 */
export function useSyncSignal<L, R, D extends Direction = 'both'>(
  left: Signal<L>,
  right: Signal<R>,
  options?: SyncSignalOptions<L, R, D>,
) {
  const {
    immediate = true,
    direction = 'both',
    transform = {},
  } = options ?? {}

  const transformLTR = ((transform?.ltr) || (v => v))
  const transformRTL = ((transform?.rtl) || (v => v))

  const stopLTR = useWatch(
    left,
    (val) => {
      if (direction === 'both' || direction === 'ltr') {
        right.value = transformLTR(val) as R
      }
    },
    { immediate },
  )

  const stopRTL = useWatch(
    right,
    (val) => {
      if (direction === 'both' || direction === 'rtl') {
        left.value = transformRTL(val) as L
      }
    },
    { immediate },
  )

  function stop() {
    stopLTR()
    stopRTL()
  }

  return stop
}
