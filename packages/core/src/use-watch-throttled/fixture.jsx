import { useWatchThrottled } from '.'
import { useSignal } from '../signals'

export default function DemoUseWatchThrottled() {
  const input = useSignal('')
  const text = useSignal(input.value)
  const count = useSignal(0)

  useWatchThrottled(
    input,
    () => {
      text.value = input.value
      count.value += 1
    },
    {
      throttle: 1000,
    },
  )
  return (
    <div>
      <div>
        <input type="text" value={input} onChange={e => input.value = e.target.value} />
        <p>Delay is set to 1000ms for this demo.</p>
        <p>
          input:
          {text}
        </p>
        <p>
          Times updated:
          {count}
        </p>
      </div>
    </div>
  )
}
