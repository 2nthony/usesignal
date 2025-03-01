import { useIdle } from '.'
import { useComputed, useSignals } from '../signals'
import { useTimestamp } from '../use-timestamp'

export default function DemoUseIdle() {
  useSignals()
  const { idle, lastActive } = useIdle(5000)
  const now = useTimestamp({ interval: 1000 })
  const idledFor = useComputed(() =>
    Math.floor((now.value - lastActive.value) / 1000),
  )

  return (
    <div>
      <div>
        For demonstration purpose, the idle timeout is set to
        {' '}
        <b>5s</b>
        {' '}
        in this
        demo (default 1min).
      </div>

      <div>
        Idle:
        {idle.toString()}
      </div>
      <div>
        Inactive:
        {' '}
        <b>
          {idledFor}
          s
        </b>
      </div>
    </div>
  )
}
