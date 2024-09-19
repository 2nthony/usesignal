import { useOnMounted } from '.'
import { useSignal } from '../utils'

export default function DemoUseOnMounted() {
  const mounted = useSignal(false)

  useOnMounted(() => {
    mounted.value = true
  })

  return (
    <div>
      Mounted:
      {mounted.toString()}
    </div>
  )
}
