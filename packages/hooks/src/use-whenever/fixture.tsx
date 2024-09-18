import { useSignal } from '@resignals/shared'
import { useWhenever } from '.'
import { useSignalWatch } from '../use-signal-watch'
import { useToggle } from '../use-toggle'

export default function DemoUseWhenever() {
  const [value, toggle] = useToggle(false)
  const text = useSignal('')

  useWhenever(value, () => {
    text.value = 'triggered!'
  })
  useSignalWatch(value, (val) => {
    if (!val) {
      text.value = ''
    }
  })

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
