'use client'
import type { Signal } from '@preact/signals-react'
import type { WatchOptions, WatchSource } from '../use-watch'
import { useSignal } from '../signals'
import { useWatch } from '../use-watch'
import { timestamp } from '../utils'

export interface UseLastChangedOptions<
  Immediate extends boolean,
  InitialValue extends number | null | undefined = undefined,
> extends WatchOptions<Immediate> {
  initialValue?: InitialValue
}

/**
 * Records the timestamp of the last change
 *
 * @see https://vueuse.org/useLastChanged
 */
export function useLastChanged(source: WatchSource, options?: UseLastChangedOptions<false>): Signal<number | null>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<true> | UseLastChangedOptions<boolean, number>): Signal<number>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, any> = {}): Signal<number | null> | Signal<number> {
  const ms = useSignal<number | null>(options.initialValue ?? null)

  useWatch(
    source,
    () => ms.value = timestamp(),
    options,
  )

  return ms
}
