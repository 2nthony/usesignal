import type { MaybeReadonlySignal, MaybeSignal } from './types'

export type MaybeElementSignal<T extends MaybeElement = MaybeElement> = MaybeSignal<T>
export type MaybeElementReadonlySignal<T extends MaybeElement = MaybeElement> = MaybeReadonlySignal<T>
export type MaybeElement = HTMLElement | SVGElement | undefined | null
