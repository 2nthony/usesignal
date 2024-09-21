'use client'
import { useAsyncState } from '.'
import { useSignal } from '../utils'

export default function DemoUseAsyncState() {
  const id = useSignal(1)

  const { state, isReady, isLoading, execute } = useAsyncState(
    (params: { id: number }) => {
      const id = params?.id ?? 1

      return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then(resp => resp.json())
    },
    { id: null },
    {
      delay: 2000,
      resetOnExecute: false,
    },
  )

  return (
    <div>
      <div>
        Ready:
        {isReady.toString()}
      </div>
      <div>
        Loading:
        {isLoading.toString()}
      </div>
      <div>
        <pre>{JSON.stringify(state.value, null, 2)}</pre>
      </div>
      <button
        onClick={() => {
          id.value += 1
          execute(2000, { id: id.value })
        }}
      >
        Execute
      </button>
    </div>
  )
}
