'use client'
import { useWatchEffect } from '.'
import { useSignal } from '../signals'
import { toValue } from '../utils'

export default function DemoUseWatchEffect() {
  const input = useSignal('Hello World!')
  const text = useSignal(toValue(input))

  const handler = useWatchEffect((onCleanup) => {
    text.value = input.value

    // eslint-disable-next-line no-console
    console.log(input.value)

    onCleanup(() => {
      // eslint-disable-next-line no-console
      console.log('cleanup')
    })
  })

  return (
    <div>
      <h1>{text}</h1>
      <input
        type="text"
        value={input}
        onInput={(e) => {
          input.value = e.target.value
        }}
      />
      <div>
        <button
          onClick={() => handler.pause()}
        >
          pause
        </button>
        <button
          onClick={() => handler.resume()}
        >
          resume
        </button>
        <button
          onClick={() => handler()}
        >
          stop
        </button>
      </div>
    </div>
  )
}
