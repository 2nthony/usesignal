import { useComputed, useSignal, useSignals } from '../signals'
import { useElementHover } from './index'

export default function DemoUseElementHover() {
  useSignals()
  const el = useSignal()
  const isHovered = useElementHover(
    el,
    { delayEnter: 200, delayLeave: 600 },
  )
  const text = useComputed(
    () => isHovered.value ? 'Thank you!' : 'Hover me',
  )

  return (
    <div>
      <button ref={el}>
        <span>{text.value}</span>
      </button>
    </div>
  )
}
