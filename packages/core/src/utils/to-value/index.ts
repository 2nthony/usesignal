import type { MaybeSignal } from '..'
import { isSignal } from '../signals'

export function toValue<T>(s: MaybeSignal<T>): T {
  return isSignal(s) ? s.value : s
}
