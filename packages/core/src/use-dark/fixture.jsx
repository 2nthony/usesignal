import { useDark } from '.'
import { useSignals } from '../signals'
import { useToggle } from '../use-toggle'

export default function DemoUseDark() {
  useSignals()
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  return (
    <div>
      <div>
        Is dark:
        {' '}
        {isDark.toString()}
      </div>

      <button
        onClick={() => {
          // isDark.value = !isDark.value
          toggleDark()
        }}
      >
        Toggle
      </button>
    </div>
  )
}
