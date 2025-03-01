import { useNow } from '.'
import { useSignal, useSignals } from '../signals'

export default function DemoUseNow() {
  const interval = useSignal(1000)
  const { now, pause, resume } = useNow({ interval, controls: true })

  return (
    <div>
      <DisplayNow now={now} />

      <div>
        <button
          onClick={() => {
            interval.value = 'requestAnimationFrame'
          }}
        >
          requestAnimationFrame
        </button>
        <button
          onClick={() => {
            interval.value = 1000
          }}
        >
          1s
        </button>
        <button
          onClick={() => {
            interval.value = 2000
          }}
        >
          2s
        </button>
        <button onClick={pause}>pause</button>
        <button onClick={resume}>resume</button>
      </div>
    </div>
  )
}

function DisplayNow({ now }) {
  useSignals()

  return (
    <div>
      <div>
        Now:
        {now.toString()}
      </div>
    </div>
  )
}
