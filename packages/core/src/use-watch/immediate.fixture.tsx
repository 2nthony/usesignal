import { useWatch } from '.'
import { useSignal } from '../signals'

export default function DemoUseWatchImmediate() {
  const count1 = useSignal(1)
  const count2 = useSignal(0)

  useWatch(count1, () => {
    count2.value = count1.value
    // eslint-disable-next-line no-console
    console.log('count1', count1.value, 'count2', count2.value)
  }, { immediate: true })

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
