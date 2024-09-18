import { useSignal } from '@resignals/shared'
import { useSignalWatchOnce } from '.'

export default function DemoUseSignalWatchOnce() {
  const count = useSignal(0)
  const changedCount = useSignal(0)

  useSignalWatchOnce(count, (countVal) => {
    changedCount.value = countVal
  })

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