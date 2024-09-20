import type { AnyFn, MaybeSignalOrGetter } from '..'
import { isSignal } from '../signals'

export function toValue<T>(s: MaybeSignalOrGetter<T>): T {
  return typeof s === 'function'
    ? (s as AnyFn)()
    : isSignal(s)
      ? s.value
      : s
}
