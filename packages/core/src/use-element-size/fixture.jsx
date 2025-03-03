import { useElementSize } from '.'
import { useSignal, useSignals } from '../signals'

export default function DemoUseElementSize() {
  useSignals()

  const ref = useSignal()
  const text = useSignal('')

  const { width, height } = useElementSize(
    ref,
    { width: 0, height: 0 },
    { box: 'border-box' },
  )

  text.value = `width: ${width}\nheight: ${height}`

  return (
    <div>
      <p>Resize the box to see changes</p>

      <textarea
        ref={ref}
        value={text.value}
        readOnly
      />
    </div>
  )
}
