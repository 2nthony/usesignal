import { useSignal } from '@usesignal/shared'
import { useSignalWatch } from '.'

export default function DemoUseSignalWatchGetter() {
  const count1 = useSignal(0)
  const count2 = useSignal(0)
  const sum = useSignal(0)

  useSignalWatch(
    () => {
      return {
        count1: count1.value,
        count2: count2.value,
        sum: count1.value + count2.value,
      }
    },
    (value) => {
      sum.value = value.sum
    },
  )

  return (
    <div>
      <div>
        count1:
        {count1}
      </div>
      <div>
        count2:
        {count2}
      </div>
      <div>
        sum:
        {sum}
      </div>
      <button
        onClick={() => {
          count1.value++
        }}
      >
        Increment count1
      </button>
      <button
        onClick={() => {
          count2.value++
        }}
      >
        Increment count2
      </button>
    </div>
  )
}
