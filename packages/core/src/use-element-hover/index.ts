import type { Signal } from '@preact/signals-react'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeSignalOrGetter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'

export interface UseElementHoverOptions extends ConfigurableWindow {
  delayEnter?: number
  delayLeave?: number
}

export function useElementHover(el: MaybeSignalOrGetter<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): Signal<boolean> {
  const {
    delayEnter = 0,
    delayLeave = 0,
    window = defaultWindow,
  } = options

  const isHovered = useSignal(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const toggle = (entering: boolean) => {
    const delay = entering ? delayEnter : delayLeave
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }

    if (delay) {
      timer = setTimeout(() => isHovered.value = entering, delay)
    }
    else {
      isHovered.value = entering
    }
  }

  const target = window ? el : null
  useEventListener(target, 'mouseenter', () => toggle(true), { passive: true })
  useEventListener(target, 'mouseleave', () => toggle(false), { passive: true })

  return isHovered
}
