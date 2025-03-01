import { useTimeout } from '.'
import { useSignals } from '../signals'

export default function DemoUseTimeout() {
  useSignals()

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
