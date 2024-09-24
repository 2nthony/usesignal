import type { Signal } from '@preact/signals-react'
import type { ConfigurableDocument } from '../_configurable'
import type { ComputedSignal } from '../signals'
import type { MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { defaultDocument } from '../_configurable'
import { useSignal } from '../signals'
import { useMounted } from '../use-mounted'
import { useOnCleanup } from '../use-on-cleanup'
import { useWatch } from '../use-watch'
import { toValue } from '../utils'

export type UseTitleOptionsBase = {
  /**
   * Restore the original title when unmounted
   * @param originTitle original title
   * @returns restored title
   */
  restoreOnUnmount?: false | ((originalTitle: string, currentTitle: string) => string | null | undefined)
} & (
  {
    /**
     * The template string to parse the title (e.g., '%s | My Website')
     * Cannot be used together with `observe` option.
     *
     * @default '%s'
     */
    titleTemplate?: MaybeSignal<string> | ((title: string) => string)
  }
)

export type UseTitleOptions = ConfigurableDocument & UseTitleOptionsBase

export type UseTitleReturn = ReturnType<typeof useTitle>

export function useTitle(
  newTitle: MaybeSignalOrGetter<string | null | undefined>,
  options?: UseTitleOptions,
): ComputedSignal<string | null | undefined>

export function useTitle(
  newTitle?: MaybeSignal<string | null | undefined>,
  options?: UseTitleOptions,
): Signal<string | null | undefined>

/**
 * Reactive document title.
 *
 * @see https://vueuse.org/useTitle
 * @param newTitle
 * @param options
 */
export function useTitle(
  newTitle: MaybeSignalOrGetter<string | null | undefined> = null,
  options: UseTitleOptions = {},
) {
  /*
    `titleTemplate` that returns the modified input string will make
    the `document.title` to be different from the `title.value`,
    causing the title to update infinitely if `observe` is set to `true`.
  */
  const {
    document = defaultDocument,
    restoreOnUnmount = t => t,
  } = options
  const originalTitle = document?.title ?? ''

  const title = useSignal(newTitle ?? document?.title ?? null) as Signal<string | null | undefined>

  function format(t: string) {
    if (!('titleTemplate' in options)) {
      return t
    }
    const template = options.titleTemplate || '%s'
    return typeof template === 'function'
      ? template(t)
      : toValue(template).replace(/%s/g, t)
  }

  const isMounted = useMounted()
  useWatch(
    () => isMounted.value ? title.value : null,
    (t, o) => {
      if (t !== o && document) {
        document.title = format(typeof t === 'string' ? t : '')
      }
    },
    { immediate: true },
  )

  useOnCleanup(() => {
    if (restoreOnUnmount) {
      const restoredTitle = restoreOnUnmount(originalTitle, title.value || '')
      if (restoredTitle != null && document) {
        document.title = restoredTitle
      }
    }
  })

  return title
}
