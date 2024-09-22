'use client'
import { useTimeoutFn } from '.'
import { useSignal } from '../utils'

export default function DemoUseTimeoutFn() {
  const defaultText = 'Please wait for 3 seconds'
  const text = useSignal(defaultText)
  const { start, isPending } = useTimeoutFn(() => {
    text.value = 'Fired!'
  }, 3000)

  function restart() {
    text.value = defaultText
    start()
  }

  return (
    <div>
      <p>{ text }</p>
      <button onClick={restart} disabled={isPending.value}>
        Restart
      </button>
    </div>
  )
}
