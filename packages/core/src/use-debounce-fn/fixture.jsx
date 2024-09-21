import { useDebounceFn } from '.'
import { useSignal } from '../utils'

export default function DemoUseDebounceFn() {
  const clicked = useSignal(0)
  const updated = useSignal(0)
  const debouncedFn = useDebounceFn(() => {
    updated.value++
  }, 1000, { maxWait: 5000 })

  function clickedFn() {
    clicked.value++
    debouncedFn()
  }

  return (
    <div>
      <button onClick={clickedFn}>
        Smash me!
      </button>
      <p>Delay is set to 1000ms and maxWait is set to 5000ms for this demo.</p>

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
