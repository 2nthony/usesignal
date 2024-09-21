'use client'
import type { UseStorageOptions } from '../use-storage'
import type { MaybeSignalOrGetter, RemovableSignal } from '../utils'
import { defaultWindow } from '../_configurable'
import { useStorage } from '../use-storage'

export function useSessionStorage(key: string, initialValue: MaybeSignalOrGetter<string>, options?: UseStorageOptions<string>): RemovableSignal<string>
export function useSessionStorage(key: string, initialValue: MaybeSignalOrGetter<boolean>, options?: UseStorageOptions<boolean>): RemovableSignal<boolean>
export function useSessionStorage(key: string, initialValue: MaybeSignalOrGetter<number>, options?: UseStorageOptions<number>): RemovableSignal<number>
export function useSessionStorage<T>(key: string, initialValue: MaybeSignalOrGetter<T>, options?: UseStorageOptions<T>): RemovableSignal<T>
export function useSessionStorage<T = unknown>(key: string, initialValue: MaybeSignalOrGetter<null>, options?: UseStorageOptions<T>): RemovableSignal<T>

export function useSessionStorage<T extends(string | number | boolean | object | null)>(
  key: string,
  initialValue: MaybeSignalOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableSignal<any> {
  const { window = defaultWindow } = options ?? {}

  return useStorage(key, initialValue, window?.sessionStorage, options)
}
