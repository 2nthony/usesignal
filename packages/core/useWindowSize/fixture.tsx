import { useWindowSize } from '.'

export default function DemoUseWindowSize() {
  const { width, height } = useWindowSize()

  return (
    <div>
      {width}
      {' '}
      x
      {' '}
      {height}
    </div>
  )
}
