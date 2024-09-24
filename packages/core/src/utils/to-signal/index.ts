import type { MaybeSignalOrGetter } from '../types'
import { computed } from '@preact/signals-react'
import { signal } from '../../signals'

export function toSignal<T>(r: MaybeSignalOrGetter<T>) {
  return (typeof r === 'function' ? computed : signal)(r as any)
}
