'use client'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../use-event-listener'
import { useOnMount } from '../use-on-mount'
import { useWatch } from '../use-watch'
import { useSignal } from '../utils'

export interface UseWindowScrollOptions extends ConfigurableWindow {
  behavior?: ScrollBehavior
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 */
export function useWindowScroll(options: UseWindowScrollOptions = {}) {
  const { window = defaultWindow, behavior = 'auto' } = options

  let user = false
  let internal = false

  const x = useSignal(0)
  const y = useSignal(0)
  const internalX = useSignal(0)
  const internalY = useSignal(0)

  const target = useSignal<Window>()
  useOnMount(() => {
    if (window) {
      target.value = window

      internalX.value = window.scrollX
      internalY.value = window.scrollY
      x.value = window.scrollX
      y.value = window.scrollY
    }
  })

  useEventListener(
    target,
    ['scroll', 'scrollend'],
    (event) => {
      internalX.value = window!.scrollX
      internalY.value = window!.scrollY

      if (event.type === 'scrollend') {
        user = false
        internal = false
      }
    },
    {
      capture: false,
      passive: true,
    },
  )

  useWatch([internalX, internalY], ([xVal, yVal]) => {
    if (window) {
      if (user) {
        return
      }

      internal = true

      x.value = xVal
      y.value = yVal
    }
  })

  useWatch([x, y], ([xVal, yVal]) => {
    if (window) {
      if (internal) {
        return
      }

      user = true

      scrollTo({ left: xVal, top: yVal, behavior })
    }
  })

  return { x, y }
}
