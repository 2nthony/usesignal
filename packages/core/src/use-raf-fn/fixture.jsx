import { useRafFn } from '.'
import { useSignal } from '../utils'

export default function DemoUseRafFn() {
  const fpsLimit = 60
  const count = useSignal(0)
  const deltaMs = useSignal(0)

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      deltaMs.value = delta
      count.value += 1
    },
    { fpsLimit },
  )

  return (
    <div>
      <div>
        Frames:
        {' '}
        {count}
      </div>
      <div>
        Delta:
        {' '}
        { deltaMs.toJSON().toFixed(0) }
        ms
      </div>
      <div>
        FPS Limit:
        {' '}
        { fpsLimit }
      </div>
      <button onClick={pause}>
        pause
      </button>
      <button onClick={resume}>
        resume
      </button>
    </div>
  )
}