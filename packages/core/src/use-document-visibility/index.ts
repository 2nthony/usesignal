'use client'
import type { Signal } from '@preact/signals-react'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../use-event-listener'
import { useMounted } from '../use-mounted'
import { useSignal } from '../utils'

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 * @param options
 */
export function useDocumentVisibility(options: ConfigurableDocument = {}): Signal<DocumentVisibilityState> {
  const { document = defaultDocument } = options

  const visibility = useSignal(document?.visibilityState || 'visible')
  const isMounted = useMounted()

  useEventListener(
    () => isMounted ? document : null,
    'visibilitychange',
    () => {
      if (document) {
        visibility.value = document.visibilityState
      }
    },
  )

  return visibility
}