import { useToggle } from '.'
import { useSignals } from '../signals'

export default function DemoUseToggle() {
  useSignals()

  const [value, toggle] = useToggle(false)

  return (
    <div>
      <p>
        Value:
        { value.value ? 'ON' : 'OFF' }
      </p>

      <button
        onClick={() => {
          toggle()
        }}
      >
        Toggle
      </button>

      <button
        onClick={() => {
          value.value = true
        }}
      >
        Set ON
      </button>
      <button
        onClick={() => {
          value.value = false
        }}
      >
        Set OFF
      </button>
    </div>
  )
}
