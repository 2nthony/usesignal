'use client'
import type { ConfigurableWindow } from '../_configurable'
import type { StorageLike } from '../ssr-handlers'
import type { Awaitable, MaybeSignal, MaybeSignalOrGetter, RemovableSignal } from '../utils'
import { defaultWindow } from '../_configurable'
import { getSSRHandler } from '../ssr-handlers'
import { useEventListener } from '../use-event-listener'
import { useIsMounted } from '../use-is-mounted'
import { useOnMount } from '../use-on-mount'
import { useWatch } from '../use-watch'
import { nextTick, toValue, useSignal } from '../utils'
import { guessSerializerType } from './guess'

export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>
  write: (value: T) => Awaitable<string>
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', Serializer<any>> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

export const customStorageEventName = 'usesignal-storage'

export interface StorageEventLike {
  storageArea: StorageLike | null
  key: StorageEvent['key']
  oldValue: StorageEvent['oldValue']
  newValue: StorageEvent['newValue']
}

export interface UseStorageOptions<T> extends ConfigurableWindow {
  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects.
   * You can pass a function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)

  /**
   * Custom data serialization
   */
  serializer?: Serializer<T>

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void

  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default true
   */
  initOnMounted?: boolean
}

export function useStorage(key: string, defaults: MaybeSignalOrGetter<string>, storage?: StorageLike, options?: UseStorageOptions<string>): RemovableSignal<string>
export function useStorage(key: string, defaults: MaybeSignalOrGetter<boolean>, storage?: StorageLike, options?: UseStorageOptions<boolean>): RemovableSignal<boolean>
export function useStorage(key: string, defaults: MaybeSignalOrGetter<number>, storage?: StorageLike, options?: UseStorageOptions<number>): RemovableSignal<number>
export function useStorage<T>(key: string, defaults: MaybeSignalOrGetter<T>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableSignal<T>
export function useStorage<T = unknown>(key: string, defaults: MaybeSignalOrGetter<null>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableSignal<T>

/**
 * Reactive LocalStorage/SessionStorage.
 */
export function useStorage<T extends (string | number | boolean | object | null)>(
  key: string,
  initialValue: MaybeSignalOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions<T> = {},
): RemovableSignal<T> {
  const {
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    window = defaultWindow,
    onError = (e) => {
      console.error(e)
    },
    initOnMounted = true,
  } = options

  const data = useSignal(toValue(initialValue) as MaybeSignal<T>) as RemovableSignal<T>

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)()
    }
    catch (e) {
      onError(e)
    }
  }

  const rawInit: T = toValue(initialValue)
  const type = guessSerializerType<T>(rawInit)
  const serializer = options.serializer ?? StorageSerializers[type]

  const { pause: pauseWatch, resume: resumeWatch } = useWatch(
    data,
    () => {
      write(data.value)
    },
  )

  const isMounted = useIsMounted()
  useEventListener(
    () => isMounted.value ? window : null,
    () => {
      return listenToStorageChanges ? 'storage' : customStorageEventName
    },
    (event?: StorageEventLike) => {
      return listenToStorageChanges ? update(event) : updateFromCustomEvent(event as unknown as CustomEvent<StorageEventLike>)
    },
  )

  useOnMount(() => {
    if (initOnMounted) {
      update()
    }
  })

  function dispatchWriteEvent(oldValue: string | null, newValue: string | null) {
    // send custom event to communicate within same page
    if (window) {
      const payload = {
        key,
        oldValue,
        newValue,
        storageArea: storage as Storage,
      }
      // We also use a CustomEvent since StorageEvent cannot
      // be constructed with a non-built-in storage area
      window.dispatchEvent(storage instanceof Storage
        ? new StorageEvent('storage', payload)
        : new CustomEvent<StorageEventLike>(customStorageEventName, {
          detail: payload,
        }))
    }
  }

  function write(v: unknown) {
    try {
      const oldValue = storage!.getItem(key)

      if (v == null) {
        dispatchWriteEvent(oldValue, null)
        storage!.removeItem(key)
      }
      else {
        const serialized = serializer.write(v as any)
        if (oldValue !== serialized) {
          storage!.setItem(key, serialized)
          dispatchWriteEvent(oldValue, serialized)
        }
      }
    }
    catch (e) {
      onError(e)
    }
  }

  function read(event?: StorageEventLike) {
    const rawValue = event
      ? event.newValue
      : storage!.getItem(key)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null) {
        storage!.setItem(key, serializer.write(rawInit))
      }

      return rawInit
    }
    else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue)
      if (typeof mergeDefaults === 'function') {
        return mergeDefaults(value, rawInit)
      }
      else if (type === 'object' && !Array.isArray(value)) {
        return { ...rawInit as any, ...value }
      }

      return value
    }
    else if (typeof rawValue !== 'string') {
      return rawValue
    }
    else {
      return serializer.read(rawValue)
    }
  }

  function update(event?: StorageEventLike) {
    if (event && event.storageArea !== storage) {
      return
    }

    if (event && event.key == null) {
      data.value = rawInit
      return
    }

    if (event && event.key !== key) {
      return
    }

    pauseWatch()
    try {
      if (event?.newValue !== serializer.write(data.value)) {
        data.value = read(event)
      }
    }
    catch (e) {
      onError(e)
    }
    finally {
      // use nextTick to avoid infinite loop
      if (event) {
        nextTick(resumeWatch)
      }
      else {
        resumeWatch()
      }
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail)
  }

  return data
}
