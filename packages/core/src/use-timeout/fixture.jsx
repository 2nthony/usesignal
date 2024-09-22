'use client'
import { useTimeout } from '.'

export default function DemoUseTimeout() {
  const { ready, start } = useTimeout(1000, { controls: true })

  return (
    <div>
      <p>
        Ready:
        { ready.toString() }
      </p>
      <button disabled={!ready.value} onClick={start}>
        Start Again
      </button>
    </div>
  )
}
