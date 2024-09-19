import type { LegacyRef } from 'react'
import { useEventListener } from '.'
import { useSignal } from '../utils'

export default function Demo() {
  const ref = useSignal<HTMLDivElement>()
  useEventListener(
    ref,
    'click',
    () => {
      // eslint-disable-next-line no-alert
      alert('hello')
    },
  )

  return (
    <div>
      <div
        ref={ref as unknown as LegacyRef<HTMLDivElement>}
      >
        Alert hello
      </div>
    </div>
  )
}
