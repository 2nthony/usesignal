'use client'
import { useLastChanged } from '.'
import { useTimeAgo } from '../use-time-ago'
import { useSignal } from '../utils'

export default function DemoUseLastChanged() {
  const input = useSignal('')
  const ms = useLastChanged(
    input,
    { initialValue: Date.now() - 1000 * 60 * 5 },
  )
  const timeAgo = useTimeAgo(ms)

  return (
    <div>
      <input type="text" value={input} onChange={e => input.value = e.target.value} />
      <p>
        Last changed:
        {' '}
        {timeAgo}
        {' '}
        (
        {ms}
        )
      </p>
    </div>
  )
}
