import type { ReadonlySignal } from '@preact/signals-react'
import type { MaybeSignal } from './types'

export type MaybeElementSignal<T extends MaybeElement = MaybeElement> = MaybeSignal<T>
export type MaybeElementReadonlySignal<T extends MaybeElement = MaybeElement> = ReadonlySignal<T>
export type MaybeElement = HTMLElement | SVGElement | undefined | null
