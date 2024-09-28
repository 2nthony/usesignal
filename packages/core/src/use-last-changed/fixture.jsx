import { useLastChanged } from '.'
import { useSignal } from '../signals'
import { useTimeAgo } from '../use-time-ago'

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
