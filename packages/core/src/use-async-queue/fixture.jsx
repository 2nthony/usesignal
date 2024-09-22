'use client'
import { useAsyncQueue } from '.'

export default function DemoUseAsyncQueue() {
  function p1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000)
      }, 1000)
    })
  }

  function p2(result) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 2000)
    })
  }

  function p3(result) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 1500)
    })
  }

  const { activeIndex, result } = useAsyncQueue([p1, p2, p3])

  return (
    <div>
      <p>
        activeIndex:
        {activeIndex.toJSON()}
      </p>
      <p>
        result:
        {JSON.stringify(result.toJSON())}
      </p>
    </div>
  )
}
