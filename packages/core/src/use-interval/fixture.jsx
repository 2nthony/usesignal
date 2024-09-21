'use client'
import { useInterval } from '.'

export default function DemoUseInterval() {
  const counter = useInterval(200)

  return (
    <div>
      <p>
        Interval fired:
        { counter }
      </p>
    </div>
  )
}
