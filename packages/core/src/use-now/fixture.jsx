'use client'
import { useNow } from '.'

export default function DemoUseNow() {
  const now = useNow()

  return (
    <div>
      Now:
      { now.toJSON().toUTCString() }
    </div>
  )
}
