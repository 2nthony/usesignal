import { useOnMount } from '.'
import { useSignal } from '../utils'

export default function DemoUseOnMounted() {
  const mounted = useSignal(false)

  useOnMount(() => {
    mounted.value = true
  })

  return (
    <div>
      Mounted:
      {mounted.toString()}
    </div>
  )
}
