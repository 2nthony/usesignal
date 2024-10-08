import { useEventListener } from '.'
import { useSignal } from '../signals'

export default function Demo() {
  const ref = useSignal()
  useEventListener(
    ref,
    'click',
    () => {
      // eslint-disable-next-line no-alert
      alert('hello')
    },
  )

  return (
    <div>
      <div
        ref={ref}
      >
        Alert hello
      </div>
    </div>
  )
}
