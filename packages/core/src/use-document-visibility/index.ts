'use client'
import type { Signal } from '@preact/signals-react'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../use-event-listener'
import { useIsMounted } from '../use-is-mounted'
import { useSignal } from '../utils'

export function useDocumentVisibility(options: ConfigurableDocument = {}): Signal<DocumentVisibilityState> {
  const { document = defaultDocument } = options

  const visibility = useSignal(document?.visibilityState || 'visible')
  const isMounted = useIsMounted()

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
