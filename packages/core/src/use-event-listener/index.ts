/* eslint-disable ts/no-unsafe-function-type */

import type { Arrayable, Fn, MaybeGetter, MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { useMemo } from 'react'
import { defaultWindow } from '../_configurable'
import { useSignal } from '../signals'
import { useWatch } from '../use-watch'
import { isObject, toValue } from '../utils'
import { toSignal } from '../utils/to-signal'

interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any
  removeEventListener: (event: Events, fn?: any, options?: any) => any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

function register(el: any, event: string, listener: any, options: any) {
  el.addEventListener(event, listener, options)
  return () => el.removeEventListener(event, listener, options)
}

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see https://vueuse.org/useEventListener
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
  event: MaybeGetter<Arrayable<E>>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
  target: MaybeGetter<Window>,
  event: MaybeGetter<Arrayable<E>>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof DocumentEventMap>(
  target: MaybeGetter<DocumentOrShadowRoot>,
  event: MaybeGetter<Arrayable<E>>,
  listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Explicitly HTMLElement target
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeGetter<MaybeSignal<HTMLElement | null | undefined>>,
  event: MaybeGetter<Arrayable<E>>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => any,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): () => void

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target with event type infer
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<Names extends string, EventType = Event>(
  target: MaybeGetter<MaybeSignal<InferEventTarget<Names> | null | undefined>>,
  event: MaybeGetter<Arrayable<Names>>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 6: Custom event target fallback
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<EventType = Event>(
  target: MaybeGetter<MaybeSignal<EventTarget | null | undefined>>,
  event: MaybeGetter<Arrayable<string>>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener(...args: any) {
  let _target: MaybeSignalOrGetter<EventTarget | null | undefined>
  let events: MaybeGetter<Arrayable<string>>
  let listeners: Arrayable<Function>
  let _options: MaybeSignal<boolean | AddEventListenerOptions | undefined>

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, _options] = args
    _target = defaultWindow
  }
  else {
    [_target, events, listeners, _options] = args
  }

  if (!Array.isArray(events)) {
    events = [toValue(events)] as string[]
  }
  if (!Array.isArray(listeners)) {
    listeners = [listeners]
  }

  const target = useMemo(
    () => toSignal(_target),
    [],
  )
  const options = useSignal(_options)

  const cleanups: Function[] = []
  function cleanup() {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  }

  const stopWatch = useWatch(
    [target, options] as [typeof _target, typeof _options],
    ([el, options]) => {
      cleanup()

      if (!el) {
        return
      }

      // create a clone of options, to avoid it being changed reactively on removal
      const optionsClone = isObject(options) ? { ...options } : options
      cleanups.push(
        ...(events as string[]).flatMap((event) => {
          return (listeners as Function[]).map((listener) => {
            return register(el, event, listener, optionsClone)
          })
        }),
      )
    },
    { immediate: true },
  )

  function stop() {
    stopWatch()
    cleanup()
  }

  return stop
}
