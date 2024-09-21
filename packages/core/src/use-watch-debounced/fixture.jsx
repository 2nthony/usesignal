import { useWatchDebounced } from '.'
import { useSignal } from '../utils'

export default function DemoUseWatchDebounced() {
  const input = useSignal('')
  const text = useSignal(input.value)
  const count = useSignal(0)

  useWatchDebounced(
    input,
    () => {
      text.value = input.value
      count.value += 1
    },
    {
      debounce: 1000,
      maxWait: 5000,
    },
  )
  return (
    <div>
      <div>
        <input type="text" value={input} onChange={e => input.value = e.target.value} />
        <p>Delay is set to 1000ms and maxWait is set to 5000ms for this demo.</p>
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
