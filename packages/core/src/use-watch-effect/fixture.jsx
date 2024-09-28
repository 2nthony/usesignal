'use client'
import { useWatchEffect } from '.'
import { useSignal } from '../signals'
import { toValue } from '../utils'

export default function DemoUseWatchEffect() {
  const input = useSignal('Hello World!')
  const text = useSignal(toValue(input))

  const { stop, pause, resume } = useWatchEffect(() => {
    text.value = input.value

    // eslint-disable-next-line no-console
    console.log(input.value)

    return () => {
      // eslint-disable-next-line no-console
      console.log('cleanup')
    }
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
          onClick={() => pause()}
        >
          pause
        </button>
        <button
          onClick={() => resume()}
        >
          resume
        </button>
        <button
          onClick={() => stop()}
        >
          stop
        </button>
      </div>
    </div>
  )
}
