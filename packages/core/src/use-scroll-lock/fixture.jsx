import { useScrollLock } from '.'
import { useSignal } from '../signals'
import { useToggle } from '../use-toggle'

export default function DemoUseScrollLock() {
  const ref = useSignal()

  const isLocked = useScrollLock(ref)
  const toggleLock = useToggle(isLocked)

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 300, height: 300, overflow: 'scroll', border: '1px solid gray' }}
      >
        <div style={{ width: 600, height: 600, margin: '200px 0 0 200px' }}>
          scroll me
        </div>
      </div>

      <button
        onClick={() => {
          toggleLock()
        }}
      >
        toggle lock
      </button>
    </div>
  )
}
