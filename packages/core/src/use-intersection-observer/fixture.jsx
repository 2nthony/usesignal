import { useIntersectionObserver } from '.'
import { useSignal } from '../signals'

export default function DemoUseIntersectionObserver() {
  const root = useSignal(null)
  const target = useSignal(null)
  const isVisible = useSignal(false)

  const { isActive, pause, resume } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      isVisible.value = isIntersecting
    },
    { root },
  )

  return (
    <div>
      <div>
        <label>
          <input
            checked={isActive.value}
            type="checkbox"
            name="enabled"
            onChange={(event) => {
              if (event.target.checked) {
                resume()
              }
              else {
                pause()
              }
            }}
          />
          <span>Enable</span>
        </label>
      </div>

      <div
        ref={root}
        style={{
          height: 200,
          overflowY: 'scroll',
          border: '2px dashed #ccc',
        }}
      >
        <p
          style={{
            textAlign: 'center',
            marginBottom: 300,
          }}
        >
          Scroll me down!
        </p>
        <div
          ref={target}
          style={{
            maxHeight: 150,
            margin: '0 2rem 400px',
            border: '2px solid #ccc',
            textAlign: 'center',
          }}
        >
          <p>Hello world!</p>
        </div>
      </div>
      <div>
        <span style={{ color: isVisible.value ? 'green' : 'red' }}>
          {isVisible.value ? 'inside' : 'outside'}
        </span>
        { ' ' }
        the viewport
      </div>
    </div>
  )
}
