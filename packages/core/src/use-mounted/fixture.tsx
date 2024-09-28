import { useMounted } from '.'

export default function DemoUseMounted() {
  const isMounted = useMounted()

  return <div>{isMounted.value ? 'Mounted' : 'Unmount'}</div>
}
