'use client'
import { useTitle } from '.'

export default function DemoUseTitle() {
  const title = useTitle('useTitle | usesignal')

  return (
    <div>
      <input
        value={title}
        onChange={e => title.value = e.target.value}
      />
    </div>
  )
}
