import { useIntervalFn } from '.'
import { useSignal } from '../signals'
import { rand } from '../utils'

export default function DemoUseIntervalFn() {
  const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好', 'Привет']
  const word = useSignal('Hello')
  const interval = useSignal(500)

  const { pause, resume, isActive } = useIntervalFn(
    () => {
      word.value = greetings[rand(0, greetings.length - 1)]
    },
    interval,
  )

  return (
    <div>
      <p>{ word }</p>
      <p>
        interval:
        <input
          type="number"
          placeholder="interval"
          value={interval.value}
          onChange={e => interval.value = e.target.value}
        />
      </p>
      {isActive.value && (
        <button onClick={pause}>
          Pause
        </button>
      )}
      {!isActive.value && (
        <button onClick={resume}>
          Resume
        </button>
      )}
    </div>
  )
}
