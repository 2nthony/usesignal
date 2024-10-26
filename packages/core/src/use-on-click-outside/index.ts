import type { ConfigurableWindow } from '../_configurable'
import type { Fn, MaybeElementSignal, MaybeSignalOrGetter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../use-event-listener'
import { useOnMount } from '../use-on-mount'
import { isIOS, noop, toValue } from '../utils'

export interface OnClickOutsideOptions extends ConfigurableWindow {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeSignalOrGetter<(MaybeElementSignal | string)[]>
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
  /**
   * Run handler function if focus moves to an iframe.
   * @default false
   */
  detectIframe?: boolean
}

export type OnClickOutsideHandler<T extends { detectIframe: OnClickOutsideOptions['detectIframe'] } = { detectIframe: false }> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void

let _iOSWorkaround = false

export const useClickOutSide = useOnClickOutside

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside/
 * @param target
 * @param handler
 * @param options
 */
export function useOnClickOutside<T extends OnClickOutsideOptions>(
  target: MaybeElementSignal,
  handler: OnClickOutsideHandler<{ detectIframe: T['detectIframe'] }>,
  options: T = {} as T,
) {
  const {
    window = defaultWindow,
    ignore = [],
    capture = true,
    detectIframe = false,
  } = options

  useOnMount(() => {
    if (!window) {
      return
    }

    // Fixes: https://github.com/vueuse/vueuse/issues/1520
    // How it works: https://stackoverflow.com/a/39712411
    if (isIOS && !_iOSWorkaround) {
      _iOSWorkaround = true
      Array.from(window.document.body.children)
        .forEach((el) => {
          el.addEventListener('click', noop)
        })
      window.document.documentElement.addEventListener('click', noop)
    }
  })

  let shouldListen = true

  const shouldIgnore = (event: PointerEvent) => {
    return toValue(ignore).some((target) => {
      if (typeof target === 'string') {
        return Array.from(window!.document.querySelectorAll(target))
          .some(el => el === event.target || event.composedPath().includes(el))
      }
      else {
        const el = toValue(target)
        return el && (event.target === el || event.composedPath().includes(el))
      }
    })
  }

  const listener = (event: PointerEvent) => {
    const el = toValue(target)

    if (!el || el === event.target || event.composedPath().includes(el)) {
      return
    }

    if (event.detail === 0) {
      shouldListen = !shouldIgnore(event)
    }

    if (!shouldListen) {
      shouldListen = true
      return
    }

    handler(event)
  }

  let isProcessingClick = false

  const cleanup = [
    useEventListener(window, 'click', (event: PointerEvent) => {
      if (!isProcessingClick) {
        isProcessingClick = true
        setTimeout(() => {
          isProcessingClick = false
        }, 0)
        listener(event)
      }
    }, { passive: true, capture }),
    useEventListener(window, 'pointerdown', (e: PointerEvent) => {
      const el = toValue(target)
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el))
    }, { passive: true }),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    detectIframe && useEventListener(window, 'blur', (event) => {
      setTimeout(() => {
        const el = toValue(target)
        if (
          window!.document.activeElement?.tagName === 'IFRAME'
          && !el?.contains(window!.document.activeElement)
        ) {
          handler(event as any)
        }
      }, 0)
    }),
  ].filter(Boolean) as Fn[]

  const stop = () => {
    cleanup.forEach(fn => fn())
  }

  return stop
}
