import { useWindowScroll } from '.'

export default function DemoUseWindowScroll() {
  const { x, y } = useWindowScroll({ behavior: 'smooth' })

  return (
    <div style={{ width: 2000, height: 2000, margin: '250px 0 0 250px' }}>
      demo
      <div>
        <button
          onClick={() => {
            x.value += 100
          }}
        >
          scroll x
        </button>
        <button
          onClick={() => {
            y.value += 100
          }}
        >
          scroll y
        </button>
      </div>

      <div style={{ position: 'fixed', top: 0, right: 0, width: 100, height: 100, border: '1px solid gray' }}>
        <div>
          x:
          {' '}
          {x.value}
        </div>

        <div>
          y:
          {' '}
          {y}
        </div>
      </div>
    </div>
  )
}
