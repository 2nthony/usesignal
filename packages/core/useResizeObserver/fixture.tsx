import { useSignal } from '@signals-use/shared'
import type { LegacyRef } from 'react'
import { useResizeObserver } from '.'

export default function DemoUseResizeObserver() {
  const ref = useSignal<HTMLTextAreaElement>(null)
  const text = useSignal('')

  useResizeObserver(ref, (entries) => {
    const [entry] = entries
    const { width, height } = entry.contentRect
    text.value = `width: ${width}\nheight: ${height}`
  })

  return (
    <textarea
      ref={ref as unknown as LegacyRef<HTMLTextAreaElement>}
      value={text.value}
    />
  )
}
