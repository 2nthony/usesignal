import type { LegacyRef } from 'react'
import { useSignal } from '@resignals/shared'
import { useResizeObserver } from '.'

export default function DemoUseResizeObserver() {
  const ref = useSignal<HTMLTextAreaElement>()
  const text = useSignal('')

  useResizeObserver(ref, (entries) => {
    const [entry] = entries
    const { width, height } = entry.contentRect
    text.value = `width: ${width}\nheight: ${height}`
  })

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
