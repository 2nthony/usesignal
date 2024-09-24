import type { ConfigurableWindow } from '../_configurable'
import { useMediaQuery } from '../use-media-query'

/**
 * Reactive dark theme preference.
 *
 * @see https://vueuse.org/usePreferredDark
 */
export function usePreferredDark(options?: ConfigurableWindow) {
  return useMediaQuery('(prefers-color-scheme: dark)', options)
}
