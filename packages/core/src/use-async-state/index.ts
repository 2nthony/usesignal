'use client'
import type { Signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useOnMount } from '../use-on-mount'
import { noop, promiseTimeout, useSignal } from '../utils'

export interface UseAsyncStateReturn<Data, Params extends any[]> {
  state: Signal<Data>
  isReady: Signal<boolean>
  isLoading: Signal<boolean>
  error: Signal<unknown>
  execute: (delay?: number, ...args: Params) => Promise<Data>
}

export interface UseAsyncStateOptions<D = any> {
  /**
   * Delay for executing the promise. In milliseconds.
   *
   * @default 0
   */
  delay?: number

  /**
   * Execute the promise right after the function is invoked.
   * Will apply the delay if any.
   *
   * When set to false, you will need to execute it manually.
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void

  /**
   * Callback when success is caught.
   * @param {D} data
   */
  onSuccess?: (data: D) => void

  /**
   * Sets the state to initialState before executing the promise.
   *
   * This can be useful when calling the execute function more than once (for
   * example, to refresh data). When set to false, the current state remains
   * unchanged until the promise resolves.
   *
   * @default true
   */
  resetOnExecute?: boolean

  /**
   *
   * An error is thrown when executing the execute function
   *
   * @default false
   */
  throwError?: boolean
}

export function useAsyncState<Data, Params extends any[] = []>(
  promise: (...args: Params) => Promise<Data>,
  initialState: Data,
  options?: UseAsyncStateOptions<Data>,
): UseAsyncStateReturn<Data, Params> {
  const {
    delay = 0,
    immediate = true,
    onError = noop,
    onSuccess = noop,
    resetOnExecute = true,
    throwError = false,
  } = options ?? {}
  useSignals()

  const state = useSignal(initialState)
  const isReady = useSignal(false)
  const isLoading = useSignal(false)
  const error = useSignal<unknown>(null)

  async function execute(delay = 0, ...args: any[]) {
    if (resetOnExecute) {
      state.value = initialState
    }
    error.value = null
    isReady.value = false
    isLoading.value = true

    if (delay > 0) {
      await promiseTimeout(delay)
    }

    const _promise = promise(...args as Params)

    try {
      const data = await _promise
      state.value = data
      isReady.value = true
      onSuccess(data)
    }
    catch (e) {
      error.value = e
      onError(e)
      if (throwError) {
        throw e
      }
    }
    finally {
      isLoading.value = false
    }

    return state.value as Data
  }

  useOnMount(() => {
    if (immediate) {
      execute(delay)
    }
  })

  const result = {
    state,
    isReady,
    isLoading,
    error,
    execute,
  }

  return result
}
