import { isSignal } from '../signals'
import type { MaybeSignal } from '../utils/types'

export function toValue<T>(s: MaybeSignal<T>): T {
  return isSignal(s) ? s.value : s
}
