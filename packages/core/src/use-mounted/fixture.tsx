import { useMounted } from '.'
import { useSignals } from '../signals'

export default function DemoUseMounted() {
  useSignals()

  const isMounted = useMounted()

  return <div>{isMounted.value ? 'Mounted' : 'Unmount'}</div>
}
