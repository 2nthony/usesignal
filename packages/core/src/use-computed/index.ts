'use client'
import type { ComputedSignal } from '../utils'
import { useMemo } from 'react'
import { computed } from '../utils'

export function useComputed<T>(val: Parameters<typeof computed>[0]) {
  return useMemo(() => computed(val), []) as ComputedSignal<T>
}
