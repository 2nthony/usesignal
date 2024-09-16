import { useIsMounted } from '.'

export default function DemoUseIsMounted() {
  const isMounted = useIsMounted()

  return <div>{isMounted.value ? 'Mounted' : 'Unmount'}</div>
}
