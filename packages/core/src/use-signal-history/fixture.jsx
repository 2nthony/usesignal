import { useSignalHistory } from '.'
import { useCounter } from '../use-counter'
import { formatDate } from '../use-date-format'

function format(ts) {
  return formatDate(new Date(ts), 'YYYY-MM-DD HH:mm:ss')
}

export default function DemoUseSignalHistory() {
  const { inc, dec, count } = useCounter()
  const { canUndo, canRedo, history, undo, redo } = useSignalHistory(count, { capacity: 10 })

  return (
    <div>
      <div>
        Count:
        {count}
      </div>

      <button
        onClick={() => {
          inc()
        }}
      >
        Increment
      </button>
      <button
        onClick={() => {
          dec()
        }}
      >
        Decrement
      </button>
      <span>/</span>
      <button
        disabled={!canUndo.value}
        style={{
          color: !canUndo.value ? 'gray' : 'inherit',
        }}
        onClick={() => {
          undo()
        }}
      >
        Undo
      </button>
      <button
        disabled={!canRedo.value}
        style={{
          color: !canRedo.value ? 'gray' : 'inherit',
        }}
        onClick={() => {
          redo()
        }}
      >
        Redo
      </button>

      <br />
      <br />

      <p>History (limited to 10 records for demo)</p>

      <div>
        {history.value.map(i => (
          <div key={i.timestamp}>
            <span style={{ color: 'gray' }}>{format(i.timestamp)}</span>
            <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{`{ value: ${i.snapshot} }`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
