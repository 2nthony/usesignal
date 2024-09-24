'use client'
import { useWatch } from '.'
import { useSignal } from '../signals'

export default function DemoUseWatchBase() {
  const count1 = useSignal(0)
  const count2 = useSignal(0)

  useWatch(count1, (count1Val) => {
    // eslint-disable-next-line no-console
    console.log('count1', count1Val, 'count2', count2.value)
  })

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
