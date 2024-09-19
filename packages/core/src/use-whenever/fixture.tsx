import { useWhenever } from '.'
import { useToggle } from '../use-toggle'
import { useSignal } from '../utils'

export default function DemoUseWhenever() {
  const [value, toggle] = useToggle(false)
  const text = useSignal('')

  useWhenever(value, () => {
    text.value = 'triggered!'
  })
  useWhenever(
    () => !value.value,
    () => {
      text.value = ''
    },
  )

  return (
    <div>
      <div>
        {value.toString()}
        {' '}
        {text}
      </div>

      <button
        onClick={() => {
          toggle()
        }}
      >
        toggle
      </button>
    </div>
  )
}
