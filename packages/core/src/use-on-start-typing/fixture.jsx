import { useOnStartTyping } from '.'
import { useSignal } from '../signals'

export default function DemoUseOnStartTyping() {
  const input = useSignal(null)

  useOnStartTyping(() => {
    if (input.value && input.value !== document.activeElement) {
      input.value.focus()
    }
  })

  return (
    <div>
      <p>Type anything</p>

      <div>
        <input ref={input} type="text" placeholder="Start typing to focus" />
      </div>
      <div>
        <input type="text" placeholder="Start typing has no effect here" />
      </div>
    </div>
  )
}
