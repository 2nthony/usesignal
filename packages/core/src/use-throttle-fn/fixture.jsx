import { useThrottleFn } from '.'
import { useSignal } from '../utils'

export default function DemoUseThrottleFn() {
  const clicked = useSignal(0)
  const updated = useSignal(0)
  const throttledFn = useThrottleFn(() => {
    updated.value++
  }, 1000)

  function clickedFn() {
    clicked.value++
    throttledFn()
  }

  return (
    <div>
      <button onClick={clickedFn}>
        Smash me!
      </button>
      <p>Delay is set to 1000ms for this demo.</p>

      <p>
        Button clicked:
        {clicked}
      </p>
      <p>
        Event handler called:
        {updated}
      </p>
    </div>
  )
}
