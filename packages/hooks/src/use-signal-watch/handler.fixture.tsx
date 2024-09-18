import { useSignal } from '@resignals/shared'
import { useSignalWatch } from '.'

export default function DemoUseSignalWatchHandle() {
  const input = useSignal('')
  const log = useSignal('')
  const handle = useSignalWatch(input, () => {
    log.value = input.toString()
  })

  return (
    <div>
      <div>
        <input
          defaultValue={input.value}
          onChange={(e) => {
            input.value = (e.target as any).value
          }}
        />
      </div>
      <div>
        Log:
        {log}
      </div>
      <div>
        <button onClick={handle.pause}>pause</button>
        <button onClick={handle.resume}>resume</button>
      </div>
    </div>
  )
}
