import type { ConfigurableWindow } from '../_configurable'
import { useMediaQuery } from '../use-media-query'

export function usePreferredDark(options?: ConfigurableWindow) {
  return useMediaQuery('(prefers-color-scheme: dark)', options)
}
