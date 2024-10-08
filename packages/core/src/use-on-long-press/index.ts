import { useComputed } from '../signals'
import { useEventListener } from '../use-event-listener'
import { type MaybeElementSignal, type Position, toElement } from '../utils'

const DEFAULT_DELAY = 500
const DEFAULT_THRESHOLD = 10

export interface OnLongPressOptions {
  /**
   * Time in ms till `longpress` gets called
   *
   * @default 500
   */
  delay?: number

  modifiers?: OnLongPressModifiers

  /**
   * Allowance of moving distance in pixels,
   * The action will get canceled When moving too far from the pointerdown position.
   * @default 10
   */
  distanceThreshold?: number | false

  /**
   * Function called when the signal element is released.
   * @param duration how long the element was pressed in ms
   * @param distance distance from the pointerdown position
   * @param isLongPress whether the action was a long press or not
   */
  onMouseUp?: (duration: number, distance: number, isLongPress: boolean) => void
}

export interface OnLongPressModifiers {
  stop?: boolean
  once?: boolean
  prevent?: boolean
  capture?: boolean
  self?: boolean
}

export function useOnLongPress(
  target: MaybeElementSignal,
  handler: (evt: PointerEvent) => void,
  options?: OnLongPressOptions,
) {
  const elementSignal = useComputed(() => toElement(target))

  let timeout: ReturnType<typeof setTimeout> | undefined
  let posStart: Position | undefined
  let startTimestamp: number | undefined
  let hasLongPressed = false

  function clear() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    posStart = undefined
    startTimestamp = undefined
    hasLongPressed = false
  }

  function onRelease(ev: PointerEvent) {
    const [_startTimestamp, _posStart, _hasLongPressed] = [startTimestamp, posStart, hasLongPressed]
    clear()

    if (!options?.onMouseUp || !_posStart || !_startTimestamp)
      return

    if (options?.modifiers?.self && ev.target !== elementSignal.value)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.x - _posStart.x
    const dy = ev.y - _posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    options.onMouseUp(ev.timeStamp - _startTimestamp, distance, _hasLongPressed)
  }

  function onDown(ev: PointerEvent) {
    if (options?.modifiers?.self && ev.target !== elementSignal.value)
      return

    clear()

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    posStart = {
      x: ev.x,
      y: ev.y,
    }
    startTimestamp = ev.timeStamp
    timeout = setTimeout(
      () => {
        hasLongPressed = true
        handler(ev)
      },
      options?.delay ?? DEFAULT_DELAY,
    )
  }

  function onMove(ev: PointerEvent) {
    if (options?.modifiers?.self && ev.target !== elementSignal.value)
      return

    if (!posStart || options?.distanceThreshold === false)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.x - posStart.x
    const dy = ev.y - posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= (options?.distanceThreshold ?? DEFAULT_THRESHOLD))
      clear()
  }

  const listenerOptions: AddEventListenerOptions = {
    capture: options?.modifiers?.capture,
    once: options?.modifiers?.once,
  }

  const cleanup = [
    useEventListener(elementSignal, 'pointerdown', onDown, listenerOptions),
    useEventListener(elementSignal, 'pointermove', onMove, listenerOptions),
    useEventListener(elementSignal, ['pointerup', 'pointerleave'], onRelease, listenerOptions),
  ]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
