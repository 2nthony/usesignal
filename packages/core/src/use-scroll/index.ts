import type { ConfigurableWindow } from '../_configurable'
import type { MaybeSignalOrGetter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useComputed, useSignal } from '../signals'
import { useDebounceFn } from '../use-debounce-fn'
import { useEventListener } from '../use-event-listener'
import { useOnMount } from '../use-on-mount'
import { useThrottleFn } from '../use-throttle-fn'
import { noop, toValue } from '../utils'

export type UseScrollReturn = ReturnType<typeof useScroll>

export interface UseScrollOptions extends ConfigurableWindow {
  /**
   * Throttle time for scroll event, it’s disabled by default.
   *
   * @default 0
   */
  throttle?: number

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
   *
   * @default 200
   */
  idle?: number

  /**
   * Offset arrived states by x pixels
   *
   */
  offset?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }

  /**
   * Trigger it when scrolling.
   *
   */
  onScroll?: (e: Event) => void

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: (e: Event) => void

  /**
   * Listener options for scroll event.
   *
   * @default {capture: false, passive: true}
   */
  eventListenerOptions?: boolean | AddEventListenerOptions

  /**
   * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
   * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
   *
   * @default 'auto'
   */
  behavior?: MaybeSignalOrGetter<ScrollBehavior>

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void
}

/**
 * We have to check if the scroll amount is close enough to some threshold in order to
 * more accurately calculate arrivedState.value. This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

/**
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScroll
 * @param element
 * @param options
 */

export function useScroll(
  element: MaybeSignalOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollOptions = {},
) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    behavior = 'auto',
    window = defaultWindow,
    onError = (e) => { console.error(e) },
  } = options

  const internalX = useSignal(0)
  const internalY = useSignal(0)

  // Use a computed for x and y because we want to write the value to the refs
  // during a `scrollTo()` without firing additional `scrollTo()`s in the process.
  const x = useComputed({
    get() {
      return internalX.value
    },
    set(x: number) {
      scrollTo(x, undefined)
    },
  })

  const y = useComputed({
    get() {
      return internalY.value
    },
    set(y: number) {
      scrollTo(undefined, y)
    },
  })

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    if (!window)
      return

    const _element = toValue(element)
    if (!_element)
      return

    (_element instanceof Document ? window.document.body : _element)?.scrollTo({
      top: toValue(_y) ?? y.value,
      left: toValue(_x) ?? x.value,
      behavior: toValue(behavior),
    })
    const scrollContainer
      = (_element as Window)?.document?.documentElement
      || (_element as Document)?.documentElement
      || (_element as Element)
    if (x != null)
      internalX.value = scrollContainer.scrollLeft
    if (y != null)
      internalY.value = scrollContainer.scrollTop
  }

  const isScrolling = useSignal(false)
  const arrivedState = useSignal({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const directions = useSignal({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })

  const onScrollEnd = (e: Event) => {
    // dedupe if support native scrollend event
    if (!isScrolling.value)
      return

    isScrolling.value = false
    directions.value.left = false
    directions.value.right = false
    directions.value.top = false
    directions.value.bottom = false
    onStop(e)
  }
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle)

  const setArrivedState = (target: HTMLElement | SVGElement | Window | Document | null | undefined) => {
    if (!window)
      return

    const el: Element = (
      (target as Window)?.document?.documentElement
      || (target as Document)?.documentElement
      || toValue(target as HTMLElement | SVGElement)
    ) as Element

    const { display, flexDirection } = getComputedStyle(el)

    const scrollLeft = el.scrollLeft
    directions.value.left = scrollLeft < internalX.value
    directions.value.right = scrollLeft > internalX.value

    const left = Math.abs(scrollLeft) <= (offset.left || 0)
    const right = Math.abs(scrollLeft)
      + el.clientWidth >= el.scrollWidth
      - (offset.right || 0)
      - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.value.left = right
      arrivedState.value.right = left
    }
    else {
      arrivedState.value.left = left
      arrivedState.value.right = right
    }

    internalX.value = scrollLeft

    let scrollTop = el.scrollTop

    // patch for mobile compatible
    if (target === window.document && !scrollTop)
      scrollTop = window.document.body.scrollTop

    directions.value.top = scrollTop < internalY.value
    directions.value.bottom = scrollTop > internalY.value
    const top = Math.abs(scrollTop) <= (offset.top || 0)
    const bottom = Math.abs(scrollTop)
      + el.clientHeight >= el.scrollHeight
      - (offset.bottom || 0)
      - ARRIVED_STATE_THRESHOLD_PIXELS

    /**
     * reverse columns and rows behave exactly the other way around,
     * bottom is treated as top and top is treated as the negative version of bottom
     */
    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.value.top = bottom
      arrivedState.value.bottom = top
    }
    else {
      arrivedState.value.top = top
      arrivedState.value.bottom = bottom
    }

    internalY.value = scrollTop
  }

  const onScrollHandler = (e: Event) => {
    if (!window)
      return

    const eventTarget = (
      (e.target as Document).documentElement ?? e.target
    ) as HTMLElement

    setArrivedState(eventTarget)

    isScrolling.value = true
    onScrollEndDebounced(e)
    onScroll(e)
  }

  useOnMount(() => {
    try {
      const _element = toValue(element)
      if (!_element)
        return
      setArrivedState(_element)
    }
    catch (e) {
      onError(e)
    }
  })

  const onScrollHandlerThrottled = useThrottleFn(onScrollHandler, throttle, true, false)
  useEventListener(
    element,
    'scroll',
    (event) => {
      if (throttle)
        onScrollHandlerThrottled(event)
      else
        onScrollHandler(event)
    },
    eventListenerOptions,
  )

  useEventListener(
    element,
    'scrollend',
    onScrollEnd,
    eventListenerOptions,
  )

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element)

      if (window && _element)
        setArrivedState(_element)
    },
  }
}
