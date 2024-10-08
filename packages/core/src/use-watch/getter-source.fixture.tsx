import { useWatch } from '.'
import { useSignal } from '../signals'

export default function DemoUseWatchGetter() {
  const count1 = useSignal(0)
  const count2 = useSignal(0)
  const sum = useSignal(0)

  useWatch(
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
