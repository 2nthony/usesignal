import { useMouse } from '.'
import { useSignal } from '../signals'

function extractor(event) {
  if (typeof Touch !== 'undefined' && event instanceof Touch) {
    return null
  }
  else {
    return [event.offsetX, event.offsetY]
  }
}

export default function DemoUseMouse() {
  const mouse = useMouse()

  const el = useSignal()
  const mouseWithExtractor = useMouse({ target: el, type: extractor })

  return (
    <div ref={el} style={{ border: '1px solid gray', borderRadius: 4, padding: 8 }}>
      <p>Basic Usage</p>
      <pre lang="yaml">
        x:
        {' '}
        {mouse.x}
        <br />
        y:
        {' '}
        {mouse.y}
        <br />
        sourceType:
        {' '}
        {mouse.sourceType}
      </pre>
      <p>Extractor Usage</p>
      <pre lang="yaml">
        x:
        {' '}
        {mouseWithExtractor.x}
        <br />
        y:
        {' '}
        {mouseWithExtractor.y}
        <br />
        sourceType:
        {' '}
        {mouseWithExtractor.sourceType}
      </pre>
    </div>
  )
}
