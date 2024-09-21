'use client'
import { useComputed } from '@preact/signals-react'
import { useScroll } from '.'
import { useSignal } from '../utils'

export default function DemoUseScroll() {
  const ref = useSignal()
  const smooth = useSignal(false)
  const behavior = useComputed(() => smooth.value ? 'smooth' : 'auto')

  const { x, y, isScrolling, arrivedState, directions } = useScroll(ref, { behavior })
  const { top, right, bottom, left } = arrivedState.value
  const { top: toTop, right: toRight, bottom: toBottom, left: toLeft } = directions.value

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div
        ref={ref}
        style={{ width: 300, height: 300, overflow: 'scroll', border: '1px solid gray' }}
      >
        <div style={{ width: 600, height: 600, margin: '200px 0 0 200px' }}>
          scroll me
        </div>
      </div>

      <div>
        <div>
          <input
            type="number"
            value={x}
            onChange={(e) => {
              x.value = e.target.value
            }}
          />
        </div>
        <div>
          <input
            type="number"
            value={y}
            onChange={(e) => {
              y.value = e.target.value
            }}
          />
        </div>
        <div>
          <label>
            smooth scrolling
            <input
              type="checkbox"
              value={behavior.value}
              onChange={(e) => {
                smooth.value = e.target.checked
              }}
            />
          </label>
        </div>
        <div>
          x:
          {x}
        </div>
        <div>
          y:
          {y}
        </div>
        <div>
          isScrolling:
          {isScrolling.toString()}
        </div>
        <div>
          Top arrivedState:
          {top.toString()}
        </div>
        <div>
          Right arrivedState:
          {right.toString()}
        </div>
        <div>
          Bottom arrivedState:
          {bottom.toString()}
        </div>
        <div>
          Left arrivedState:
          {left.toString()}
        </div>
        <div>
          Top directions:
          {toTop.toString()}
        </div>
        <div>
          Right directions:
          {toRight.toString()}
        </div>
        <div>
          Bottom directions:
          {toBottom.toString()}
        </div>
        <div>
          Left directions:
          {toLeft.toString()}
        </div>
      </div>
    </div>
  )
}
