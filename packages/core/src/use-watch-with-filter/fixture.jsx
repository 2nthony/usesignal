import { useWatchWithFilter } from '.'
import { useSignal } from '../signals'
import { debounceFilter } from '../utils/filter'

export default function DemoUseWatchWithFilter() {
  const input = useSignal('hello')
  const text = useSignal(input.value)

  useWatchWithFilter(
    input,
    (val) => {
      text.value = val
    },
    {
      eventFilter: debounceFilter(500),
    },
  )

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          input.value = e.target.value
        }}
      />
      <div>{text}</div>
    </div>
  )
}
