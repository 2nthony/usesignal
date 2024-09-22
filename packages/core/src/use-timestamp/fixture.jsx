'use client'

import { useTimestamp } from '.'

export default function UseTimestamp() {
  const timestamp = useTimestamp()

  return (
    <div>
      Timestamp:
      {timestamp}
    </div>
  )
}
