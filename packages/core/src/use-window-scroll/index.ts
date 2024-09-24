import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useComputed, useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'
import { useOnMount } from '../use-on-mount'

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

  const internalX = useSignal(0)
  const internalY = useSignal(0)

  const x = useComputed({
    get() {
      return internalX.value
    },
    set(x: number) {
      scrollTo({ left: x, behavior })
    },
  })

  const y = useComputed({
    get() {
      return internalY.value
    },
    set(y: number) {
      scrollTo({ top: y, behavior })
    },
  })

  const target = useSignal<Window>()
  useOnMount(() => {
    if (window) {
      target.value = window

      internalX.value = window.scrollX
      internalY.value = window.scrollY
    }
  })

  useEventListener(
    target,
    'scroll',
    () => {
      internalX.value = window!.scrollX
      internalY.value = window!.scrollY
    },
    {
      capture: false,
      passive: true,
    },
  )

  return { x, y }
}
