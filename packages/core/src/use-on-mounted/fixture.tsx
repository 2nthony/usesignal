import { useSignal } from '@usesignal/shared'
import { useOnMounted } from '.'

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
