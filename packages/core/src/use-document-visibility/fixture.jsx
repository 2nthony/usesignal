'use client'
import { useDocumentVisibility } from '.'
import { useTimeoutFn } from '../use-timeout-fn'
import { useWatch } from '../use-watch'
import { useSignal } from '../utils'

export default function DemoUseDocumentVisibility() {
  const startMessage = '💡 Minimize the page or switch tab then return'
  const message = useSignal(startMessage)

  const visibility = useDocumentVisibility()

  const timeout = useTimeoutFn(() => {
    message.value = startMessage
  }, 3000)

  useWatch(visibility, (current, previous) => {
    if (current === 'visible' && previous === 'hidden') {
      message.value = '🎉 Welcome back!'
      timeout.start()
    }
  })

  return (
    <div>{message}</div>
  )
}
