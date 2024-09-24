'use client'
import { useComputed } from '@preact/signals-react'
import { useTimeAgo } from '.'
import { useSignal } from '../signals'

export default function DemoUseTimeAgo() {
  const slider = useSignal(0)
  const sliderMS = useComputed(() => slider.value ** 3)
  const time = useComputed(() => Date.now() + sliderMS.value)
  const timeAgo = useTimeAgo(time)

  return (
    <div>
      <div>
        { timeAgo }
      </div>
      <input
        value={slider}
        onChange={e => slider.value = e.target.value}
        type="range"
        min="-3800"
        max="3800"
      />
      <div>
        { sliderMS }
        ms
      </div>
    </div>
  )
}
