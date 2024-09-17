/* eslint-disable ts/no-unsafe-function-type */

import { type Arrayable, type Fn, isObject, type MaybeSignal, useSignal } from '@signals-use/shared'
import { defaultWindow } from '../_configurable'
import { useSignalWatch } from '../useSignalWatch'

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

export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener<E extends keyof DocumentEventMap>(
  target: DocumentOrShadowRoot,
  event: Arrayable<E>,
  listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeSignal<HTMLElement | null | undefined>,
  event: Arrayable<E>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => any,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): () => void

export function useEventListener<Names extends string, EventType = Event>(
  target: MaybeSignal<InferEventTarget<Names> | null | undefined>,
  event: Arrayable<Names>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener<EventType = Event>(
  target: MaybeSignal<EventTarget | null | undefined>,
  event: Arrayable<string>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeSignal<boolean | AddEventListenerOptions | undefined>
): Fn

export function useEventListener(...args: any) {
  let _target: MaybeSignal<EventTarget | null | undefined>
  let events: Arrayable<string>
  let listeners: Arrayable<Function>
  let _options: MaybeSignal<boolean | AddEventListenerOptions | undefined>

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, _options] = args
    _target = defaultWindow
  }
  else {
    [_target, events, listeners, _options] = args
  }

  if (!Array.isArray(events))
    events = [events]
  if (!Array.isArray(listeners))
    listeners = [listeners]

  const target = useSignal(_target)
  const options = useSignal(_options)

  const cleanups: Function[] = []
  function cleanup() {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  }

  const stopWatch = useSignalWatch(
    // @ts-expect-error watch signals
    [target, options],
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
