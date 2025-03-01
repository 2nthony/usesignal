import type { ConfigurableWindow } from '../_configurable'
import type { Signal } from '../signals'
import type { WindowEventName } from '../use-event-listener'
import type { ConfigurableEventFilter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'
import { useOnMount } from '../use-on-mount'
import { createFilterWrapper, throttleFilter, timestamp } from '../utils'

const defaultEvents: WindowEventName[] = [
  'mousemove',
  'mousedown',
  'resize',
  'keydown',
  'touchstart',
  'wheel',
]
const oneMinute = 60 * 1000

export interface UseIdleOptions
  extends ConfigurableWindow,
  ConfigurableEventFilter {
  /**
   * Event names that listen to for detected user activity
   *
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[]
  /**
   * Listen for document visibility change
   *
   * @default true
   */
  listenForVisibilityChange?: boolean
  /**
   * Initial state of the ref idle
   *
   * @default false
   */
  initialState?: boolean
}

export interface useIdleReturn {
  idle: Signal<boolean>
  lastActive: Signal<number>
  reset: () => void
}

/**
 * Tracks whether the user is being inactive.
 *
 * @see https://vueuse.org/useIdle
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export function useIdle(
  timeout: number = oneMinute,
  options: UseIdleOptions = {},
): useIdleReturn {
  const {
    initialState = false,
    listenForVisibilityChange = true,
    events = defaultEvents,
    window = defaultWindow,
    eventFilter = throttleFilter(50),
  } = options
  const idle = useSignal(initialState)
  const lastActive = useSignal(timestamp())

  let timer: any

  function reset() {
    idle.value = false
    clearTimeout(timer)
    timer = setTimeout(() => (idle.value = true), timeout)
  }

  const listenerOptions = { passive: true }

  const onEvent = createFilterWrapper(eventFilter, () => {
    lastActive.value = timestamp()
    reset()
  })

  useEventListener(() => window, events, onEvent, listenerOptions)

  useEventListener(
    () => window?.document,
    'visibilitychange',
    () => {
      if (listenForVisibilityChange) {
        if (!document.hidden) {
          onEvent()
        }
      }
    },
    listenerOptions,
  )

  useOnMount(reset)

  return {
    idle,
    lastActive,
    reset,
  }
}
