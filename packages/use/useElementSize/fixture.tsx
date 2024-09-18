import { useSignal } from '@resignals/shared'
import type { LegacyRef } from 'react'
import { useElementSize } from '.'

export default function DemoUseElementSize() {
  const ref = useSignal<HTMLTextAreaElement | null>(null)
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
