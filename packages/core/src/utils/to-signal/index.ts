import type { ComputedSignal, Signal } from '../../signals'
import type { MaybeSignal } from '../types'
import { computed, signal } from '../../signals'

export function toSignal<T>(r: MaybeSignal<T>): Signal<T>
export function toSignal<T>(r: () => T): ComputedSignal<T>
export function toSignal(r: any) {
  return (typeof r === 'function' ? computed : signal)(r)
}
