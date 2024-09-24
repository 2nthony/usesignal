'use client'
import { useSyncSignal } from '.'
import { useSignal } from '../signals'

export default function DemoUseSyncSignal() {
  const a = useSignal('')
  const b = useSignal('')

  useSyncSignal(a, b)

  const ltrA = useSignal('')
  const ltrB = useSignal('')

  useSyncSignal(ltrA, ltrB, { direction: 'ltr' })

  const rtlA = useSignal('')
  const rtlB = useSignal('')

  useSyncSignal(rtlA, rtlB, { direction: 'rtl' })

  return (
    <div>
      <div>sync both</div>
      <div>
        <input
          type="text"
          value={a}
          placeholder="A"
          onChange={e => a.value = e.target.value}
        />
      </div>
      <div>
        <input
          type="text"
          value={b}
          placeholder="B"
          onChange={e => b.value = e.target.value}
        />
      </div>
      <div>sync ltr</div>
      <div>
        <input
          type="text"
          value={ltrA}
          placeholder="A"
          onChange={e => ltrA.value = e.target.value}
        />
      </div>
      <div>
        <input
          type="text"
          value={ltrB}
          placeholder="B"
          onChange={e => ltrB.value = e.target.value}
        />
      </div>
      <div>sync rtl</div>
      <div>
        <input
          type="text"
          value={rtlA}
          placeholder="A"
          onChange={e => rtlA.value = e.target.value}
        />
      </div>
      <div>
        <input
          type="text"
          value={rtlB}
          placeholder="B"
          onChange={e => rtlB.value = e.target.value}
        />
      </div>
    </div>
  )
}
