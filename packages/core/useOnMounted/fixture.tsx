import { useOnMounted } from '.'
import { useSignal } from '../../shared/signals'

export default function UseOnMounted() {
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
