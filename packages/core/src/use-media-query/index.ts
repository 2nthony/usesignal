import type { ConfigurableWindow } from '../_configurable'
import type { MaybeSignal } from '../utils'
import { useSignalEffect } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { defaultWindow } from '../_configurable'
import { useSignal } from '../signals'
import { useSupported } from '../use-supported'
import { toValue } from '../utils'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: MaybeSignal<string>, options: ConfigurableWindow = {}) {
  useSignals()

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

  useSignalEffect(() => {
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

    return () => {
      cleanup()
      mediaQuery = undefined
    }
  })

  return matches
}
