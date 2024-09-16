import { useIsMounted } from '.'

export default function UseIsMounted() {
  const isMounted = useIsMounted()

  return <div>{isMounted.value ? 'Mounted' : 'Unmount'}</div>
}
