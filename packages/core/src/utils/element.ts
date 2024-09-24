import type { MaybeComputedSignal, MaybeReadonlySignal, MaybeSignal } from './types'
import { toValue } from './to-value'

export type MaybeElementSignal<T extends MaybeElement = MaybeElement> = MaybeSignal<T>
export type MaybeElementReadonlySignal<T extends MaybeElement = MaybeElement> = MaybeReadonlySignal<T>
export type MaybeElement = HTMLElement | SVGElement | undefined | null
export type MaybeComputedElementSignal<T extends MaybeElement = MaybeElement> = MaybeComputedSignal<T>

export type UnSignalElementReturn<T extends MaybeElement = MaybeElement> = T

/**
 * Get the dom element of a signal of element
 *
 * @param el
 */
export function toElement<T extends MaybeElement>(el: MaybeComputedElementSignal<T>): UnSignalElementReturn<T> {
  return toValue(el)
}
