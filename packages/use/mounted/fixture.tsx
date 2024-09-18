import { useMounted } from '.'

export default function DemoUseIsMounted() {
  const isMounted = useMounted()

  return <div>{isMounted.value ? 'Mounted' : 'Unmount'}</div>
}
