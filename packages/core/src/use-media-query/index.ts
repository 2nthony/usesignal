import type { ConfigurableWindow } from '../_configurable'
import type { MaybeSignal } from '../utils'
import { defaultWindow } from '../_configurable'
import { useSignal } from '../signals'
import { useOnCleanup } from '../use-on-cleanup'
import { useSupported } from '../use-supported'
import { useWatchEffect } from '../use-watch-effect'
import { toValue } from '../utils'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: MaybeSignal<string>, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'matchMedia' in window && typeof window.matchMedia === 'function')

  let mediaQuery: MediaQueryList | undefined
  const matches = useSignal(false)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  const cleanup = () => {
    if (!mediaQuery) {
      return
    }
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', handler)
    }
    else {
      // @ts-expect-error deprecated API
      mediaQuery.removeListener(handler)
    }
  }

  const watchHandler = useWatchEffect(() => {
    if (!isSupported.value) {
      return
    }

    cleanup()

    mediaQuery = window!.matchMedia(toValue(query))

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handler)
    }
    else {
      // @ts-expect-error deprecated API
      mediaQuery.addListener(handler)
    }

    matches.value = mediaQuery.matches
  })

  useOnCleanup(() => {
    watchHandler()
    cleanup()
    mediaQuery = undefined
  })

  return matches
}
