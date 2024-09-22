'use client'
import type { Signal } from '@preact/signals-react'
import { useWatch } from '../use-watch'

type Direction = 'ltr' | 'rtl' | 'both'

interface Transform<L, R> {
  ltr: (left: L) => R
  rtl: (right: R) => L
}

interface TransformType<D extends Direction, L, R> {
  transform?: Partial<Pick<Transform<L, R>, D extends 'both' ? 'ltr' | 'rtl' : D>>
}

export type SyncSignalOptions<L, R, D extends Direction> = {
  immediate?: boolean
  direction?: D
} & TransformType<D, L, R>

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

  const transformLTR = (('ltr' in transform && transform.ltr) || (v => v)) as ((v: L) => R)
  const transformRTL = (('rtl' in transform && transform.rtl) || (v => v)) as ((v: R) => L)

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
