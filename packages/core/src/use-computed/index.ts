'use client'
import type { Signal } from '@preact/signals-react'
import type { ComputedGetter, ComputedSignal, WritableComputedOptions } from '../utils'
import { useMemo } from 'react'
import { computed } from '../utils'

export function useComputed<T>(getter: () => T): ComputedSignal<T>
export function useComputed<T>(options: WritableComputedOptions<T>): Signal<T>
export function useComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  return useMemo(() => computed<T>(getterOrOptions as any), [])
}
