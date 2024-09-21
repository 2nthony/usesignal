import { useWatch } from '.'
import { useSignal } from '../utils'

export default function DemoUseWatchOnce() {
  const count = useSignal(0)
  const changedCount = useSignal(0)

  useWatch(count, (countVal) => {
    changedCount.value = countVal
  }, { once: true })

  return (
    <div>
      <div>
        count:
        {count}
      </div>
      <div>
        change once:
        {changedCount}
      </div>
      <div>
        <button
          onClick={() => {
            count.value++
          }}
        >
          Increment count
        </button>
      </div>
    </div>
  )
}
