import type { ConfigurableDocument } from '../_configurable'
import type { ComputedSignal, Signal } from '../signals'
import type { MaybeElement, MaybeSignal, MaybeSignalOrGetter } from '../utils'
import { defaultDocument } from '../_configurable'
import { useSignal } from '../signals'
import { useMounted } from '../use-mounted'
import { useMutationObserver } from '../use-mutation-observer'
import { useOnCleanup } from '../use-on-cleanup'
import { useOnMount } from '../use-on-mount'
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
     * Observe `document.title` changes using MutationObserve
     * Cannot be used together with `titleTemplate` option.
     *
     * @default false
     */
    observe?: boolean
  }
  | {
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
  const isReadonly = newTitle && typeof newTitle === 'function'

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

  const observerTarget = useSignal<MaybeElement>()
  useOnMount(() => {
    if ((options as any).observe && !(options as any).titleTemplate && document && !isReadonly) {
      observerTarget.value = document.head?.querySelector('title')
    }
  })
  useMutationObserver(
    observerTarget,
    () => {
      if (document && document.title !== title.value) {
        title.value = format(document.title)
      }
    },
    { childList: true },
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
