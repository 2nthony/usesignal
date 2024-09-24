'use client'
import { useResizeObserver } from '.'
import { useSignal } from '../signals'

export default function DemoUseResizeObserver() {
  const ref = useSignal()
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
        ref={ref}
        value={text.value}
        readOnly
      />
    </div>
  )
}
