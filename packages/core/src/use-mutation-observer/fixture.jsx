'use client'
import { useMutationObserver } from '.'
import { useSignal } from '../signals'
import { useOnMount } from '../use-on-mount'

export default function DemoUseMutationObserver() {
  const ref = useSignal()
  const messages = useSignal([])
  const className = useSignal('')
  const style = useSignal({})

  useMutationObserver(
    ref,
    (mutations) => {
      const mutation = mutations[0]

      if (!mutation) {
        return
      }

      messages.value = [...messages.value, mutation.attributeName]
    },
    { attributes: true },
  )

  useOnMount(() => {
    setTimeout(() => {
      className.value = 'test test2'
    }, 1000)

    setTimeout(() => {
      style.value = {
        color: 'red',
      }
    }, 1550)
  })

  return (
    <div>
      <div ref={ref} className={className.value} style={style.value}>
        {messages.value.map((text, index) => (
          <div key={index}>
            Mutation Attribute:
            {' '}
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
