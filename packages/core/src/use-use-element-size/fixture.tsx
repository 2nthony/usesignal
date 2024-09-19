import type { LegacyRef } from 'react'
import { useElementSize } from '.'
import { useSignal } from '../utils'

export default function DemoUseElementSize() {
  const ref = useSignal<HTMLTextAreaElement >()
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
        ref={ref as unknown as LegacyRef<HTMLTextAreaElement>}
        value={text.value}
      />
    </div>
  )
}
