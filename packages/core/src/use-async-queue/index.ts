'use client'
import type { Signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useOnMount } from '../use-on-mount'
import { noop, useSignal } from '../utils'

export type UseAsyncQueueTask<T> = (...args: any[]) => T | Promise<T>

type MapQueueTask<T extends any[]> = {
  [K in keyof T]: UseAsyncQueueTask<T[K]>
}
export interface UseAsyncQueueResult<T> {
  state: 'aborted' | 'fulfilled' | 'pending' | 'rejected'
  data: T | null
}

export interface UseAsyncQueueReturn<T> {
  activeIndex: Signal<number>
  result: Signal<T>
}

export interface UseAsyncQueueOptions {
  /**
   * Interrupt tasks when current task fails.
   *
   * @default true
   */
  interrupt?: boolean

  /**
   * Trigger it when the tasks fails.
   *
   */
  onError?: () => void

  /**
   * Trigger it when the tasks ends.
   *
   */
  onFinished?: () => void

  /**
   * A AbortSignal that can be used to abort the task.
   */
  signal?: AbortSignal
}

/**
 * Asynchronous queue task controller.
 *
 * @param tasks
 * @param options
 */
export function useAsyncQueue<T extends any[], S = MapQueueTask<T>>(
  tasks: S & Array<UseAsyncQueueTask<any>>,
  options?: UseAsyncQueueOptions,
): UseAsyncQueueReturn<{ [P in keyof T]: UseAsyncQueueResult<T[P]> }> {
  useSignals()

  const {
    interrupt = true,
    onError = noop,
    onFinished = noop,
    signal,
  } = options || {}

  const promiseState: Record<
    UseAsyncQueueResult<T>['state'],
    UseAsyncQueueResult<T>['state']
  > = {
    aborted: 'aborted',
    fulfilled: 'fulfilled',
    pending: 'pending',
    rejected: 'rejected',
  }

  const initialResult = Array.from(
    Array.from({ length: tasks.length }),
    () => ({ state: promiseState.pending, data: null }),
  ) as { [P in keyof T]: UseAsyncQueueResult<T[P]> }

  const result = useSignal(initialResult)

  const activeIndex = useSignal<number>(-1)

  useOnMount(() => {
    if (!tasks || tasks.length === 0) {
      onFinished()
      return
    }

    tasks.reduce((prev, curr) => {
      return prev
        .then((prevRes) => {
          if (signal?.aborted) {
            updateResult(promiseState.aborted, new Error('aborted'))
            return
          }

          if (
            result.value[activeIndex.value]?.state === promiseState.rejected
            && interrupt
          ) {
            onFinished()
            return
          }

          const done = curr(prevRes).then((currentRes: any) => {
            updateResult(promiseState.fulfilled, currentRes)
            if (activeIndex.value === tasks.length - 1)
              onFinished()
            return currentRes
          })

          if (!signal)
            return done

          return Promise.race([done, whenAborted(signal)])
        })
        .catch((e) => {
          if (signal?.aborted) {
            updateResult(promiseState.aborted, e)
            return e
          }

          updateResult(promiseState.rejected, e)
          onError()
          return e
        })
    }, Promise.resolve())
  })

  function updateResult(state: UseAsyncQueueResult<T>['state'], res: unknown) {
    activeIndex.value++
    result.value[activeIndex.value].data = res as T
    result.value[activeIndex.value].state = state
    // eslint-disable-next-line no-self-assign
    result.value = result.value
  }

  return {
    activeIndex,
    result,
  }
}

function whenAborted(signal: AbortSignal): Promise<never> {
  return new Promise((_resolve, reject) => {
    const error = new Error('aborted')

    if (signal.aborted)
      reject(error)
    else
      signal.addEventListener('abort', () => reject(error), { once: true })
  })
}
