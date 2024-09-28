import { useOnMount } from '.'
import { useToggle } from '../use-toggle'

function Component() {
  useOnMount(() => {
    // eslint-disable-next-line no-console
    console.log('mount')
  })

  return <div>Hello</div>
}

export default function DemoUseOnMounted() {
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
