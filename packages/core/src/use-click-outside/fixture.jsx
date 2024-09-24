'use client'

import { useClickOutside } from '.'
import { useSignal } from '../signals'

export default function DemoUseClickOutside() {
  const ref = useSignal()
  const ignoreRef = useSignal()
  const show = useSignal(false)

  useClickOutside(
    ref,
    () => {
      show.value = false
    },
    { ignore: [ignoreRef] },
  )

  return (
    <div>
      <div ref={ref}>
        <button
          onClick={() => {
            show.value = true
          }}
        >
          show
        </button>

        {show.value && <div>Outside content</div>}
      </div>

      <div ref={ignoreRef} style={{ margin: '8px 0' }}>
        This line will IGNORE the click outside
      </div>

      <div>👇 below will hide the content</div>
    </div>
  )
}
