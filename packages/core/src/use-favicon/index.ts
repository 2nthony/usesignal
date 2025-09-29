import type { ConfigurableDocument } from '../_configurable'
import type { ComputedSignal, Signal } from '../signals'
import type { MaybeSignal, MaybeSignalOrGetter, ReadonlySignalOrGetter } from '../utils'
import { defaultDocument } from '../_configurable'
import { useSignal } from '../signals'
import { useWatch } from '../use-watch'

export interface UseFaviconOptions extends ConfigurableDocument {
  baseUrl?: string
  rel?: string
}

/**
 * Reactive favicon.
 *
 * @see https://vueuse.org/useFavicon
 * @param newIcon
 * @param options
 */
export function useFavicon(
  newIcon: ReadonlySignalOrGetter<string | null | undefined>,
  options?: UseFaviconOptions
): ComputedSignal<string | null | undefined>
export function useFavicon(
  newIcon?: MaybeSignal<string | null | undefined>,
  options?: UseFaviconOptions
): Signal<string | null | undefined>
export function useFavicon(
  newIcon: MaybeSignalOrGetter<string | null | undefined> = null,
  options: UseFaviconOptions = {},
) {
  const {
    baseUrl = '',
    rel = 'icon',
    document = defaultDocument,
  } = options

  const favicon = useSignal(newIcon)

  const applyIcon = (icon: string) => {
    const elements = document?.head
      .querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)

    if (!elements || elements.length === 0) {
      const link = document?.createElement('link')

      if (link) {
        link.rel = rel
        link.href = `${baseUrl}${icon}`
        link.type = `image/${icon.split('.').pop()}`
        document?.head.append(link)
      }
      return
    }

    elements?.forEach(el => el.href = `${baseUrl}${icon}`)
  }

  useWatch(
    favicon,
    (i, o) => {
      if (typeof i === 'string' && i !== o) {
        applyIcon(i)
      }
    },
    { immediate: true },
  )

  return favicon
}

export type UseFaviconReturn = ReturnType<typeof useFavicon>
