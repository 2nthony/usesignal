import { useOnCleanup } from '.'
import { useToggle } from '../use-toggle'

function Component() {
  useOnCleanup(() => {
    // eslint-disable-next-line no-console
    console.log('unmounted')
  })

  return <div>Hello</div>
}

export default function DemoUseOnUnmounted() {
  const [show, toggle] = useToggle(true)

  return (
    <div>
      <button
        onClick={() => {
          toggle()
        }}
      >
        Toggle
      </button>

      {show.value && <Component />}
    </div>
  )
}
