import type { Signal } from '@preact/signals-react'
import type { ComputedSignal } from '../signals'
import type { StorageLike } from '../ssr-handlers'
import type { UseStorageOptions } from '../use-storage'
import type { MaybeElementSignal, MaybeSignalOrGetter } from '../utils'
import { defaultWindow } from '../_configurable'
import { useComputed, useSignal } from '../signals'
import { getSSRHandler } from '../ssr-handlers'
import { useOnCleanup } from '../use-on-cleanup'
import { usePreferredDark } from '../use-preferred-dark'
import { useStorage } from '../use-storage'
import { useWatch } from '../use-watch'
import { toValue } from '../utils'

export type BasicColorMode = 'light' | 'dark'
export type BasicColorSchema = BasicColorMode | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorMode> extends UseStorageOptions<T | BasicColorMode> {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string | MaybeElementSignal

  /**
   * HTML attribute applying the target element
   *
   * @default 'class'
   */
  attribute?: string

  /**
   * The initial color mode
   *
   * @default 'auto'
   */
  initialValue?: MaybeSignalOrGetter<T | BasicColorSchema>

  /**
   * Prefix when adding value to the attribute
   */
  modes?: Partial<Record<T | BasicColorSchema, string>>

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridden.
   *
   * @default undefined
   */
  onChanged?: (mode: T | BasicColorMode, defaultHandler:((mode: T | BasicColorMode) => void)) => void

  /**
   * Custom storage ref
   *
   * When provided, `useStorage` will be skipped
   */
  storageSignal?: Signal<T | BasicColorSchema>

  /**
   * Key to persist the data into localStorage/sessionStorage.
   *
   * Pass `null` to disable persistence
   *
   * @default 'usesignal-color-scheme'
   */
  storageKey?: string | null

  /**
   * Storage object, can be localStorage or sessionStorage
   *
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Disable transition on switch
   *
   * @see https://paco.me/writing/disable-theme-transitions
   * @default true
   */
  disableTransition?: boolean
}

export type UseColorModeReturn<T extends string = BasicColorMode> =
  Signal<T | BasicColorSchema> & {
    store: Signal<T | BasicColorSchema>
    system: ComputedSignal<BasicColorMode>
    state: ComputedSignal<T | BasicColorMode>
  }

const CSS_DISABLE_TRANS = '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
const STORAGE_KEY = 'usesignal-color-scheme'

/**
 * Reactive color mode with auto data persistence.
 *
 * @see https://vueuse.org/useColorMode
 * @param options
 */
export function useColorMode<T extends string = BasicColorMode>(
  options: UseColorModeOptions<T> = {},
): UseColorModeReturn<T> {
  const {
    selector = 'html',
    attribute = 'class',
    initialValue = 'auto',
    window = defaultWindow,
    storage,
    storageKey = STORAGE_KEY,
    listenToStorageChanges = true,
    storageSignal,
    disableTransition = true,
  } = options

  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...options.modes || {},
  } as Record<BasicColorSchema | T, string>

  const preferredDark = usePreferredDark({ window })
  const system = useComputed(() => preferredDark.value ? 'dark' : 'light')

  const _valueSignal = useSignal(initialValue) as Signal<T | BasicColorSchema>
  const _storageSignal = useStorage<T | BasicColorSchema>(storageKey || STORAGE_KEY, initialValue, storage, { window, listenToStorageChanges })

  const store = storageSignal || (storageKey == null ? _valueSignal : _storageSignal)

  const state = useComputed<T | BasicColorMode>(() =>
    store.value === 'auto'
      ? system.value
      : store.value)

  const updateHTMLAttrs = getSSRHandler(
    'updateHTMLAttrs',
    (selector, attribute, value) => {
      const el = typeof selector === 'string'
        ? window?.document.querySelector(selector)
        : toValue(selector)
      if (!el) {
        return
      }

      const classesToAdd = new Set<string>()
      const classesToRemove = new Set<string>()
      let attributeToChange: { key: string, value: string } | null = null

      if (attribute === 'class') {
        const current = value.split(/\s/g)
        Object.values(modes)
          .flatMap(i => (i || '').split(/\s/g))
          .filter(Boolean)
          .forEach((v) => {
            if (current.includes(v)) {
              classesToAdd.add(v)
            }
            else {
              classesToRemove.add(v)
            }
          })
      }
      else {
        attributeToChange = { key: attribute, value }
      }

      if (classesToAdd.size === 0 && classesToRemove.size === 0 && attributeToChange === null) {
        // Nothing changed so we can avoid reflowing the page
        return
      }

      let style: HTMLStyleElement | undefined
      if (disableTransition) {
        style = window!.document.createElement('style')
        style.appendChild(document.createTextNode(CSS_DISABLE_TRANS))
        window!.document.head.appendChild(style)
      }

      for (const c of classesToAdd) {
        el.classList.add(c)
      }
      for (const c of classesToRemove) {
        el.classList.remove(c)
      }
      if (attributeToChange) {
        el.setAttribute(attributeToChange.key, attributeToChange.value)
      }

      if (disableTransition) {
        // Calling getComputedStyle forces the browser to redraw
        // @ts-expect-error unused variable
        const _ = window!.getComputedStyle(style!).opacity
        document.head.removeChild(style!)
      }
    },
  )

  function defaultOnChanged(mode: T | BasicColorMode) {
    updateHTMLAttrs(selector, attribute, modes[mode] ?? mode)
  }

  function onChanged(mode: T | BasicColorMode) {
    if (options.onChanged) {
      options.onChanged(mode, defaultOnChanged)
    }
    else {
      defaultOnChanged(mode)
    }
  }

  useWatch(state, onChanged, { immediate: true })

  useOnCleanup(() => {
    onChanged(state.value)
  })

  return Object.assign(store, { system, state }) as UseColorModeReturn<T>
}
