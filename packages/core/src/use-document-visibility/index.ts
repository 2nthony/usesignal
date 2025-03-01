import type { ConfigurableDocument } from '../_configurable'
import type { Signal } from '../signals'
import { defaultDocument } from '../_configurable'
import { useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'
import { useMounted } from '../use-mounted'

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
    () => isMounted.value ? document : null,
    'visibilitychange',
    () => {
      if (document) {
        visibility.value = document.visibilityState
      }
    },
  )

  return visibility
}
