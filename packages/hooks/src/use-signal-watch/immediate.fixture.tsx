import { useSignal } from '@resignals/shared'
import { useSignalWatch } from '.'

export default function DemoUseSignalWatchImmediate() {
  const count1 = useSignal(0)
  const count2 = useSignal(0)

  useSignalWatch(count1, () => {
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
