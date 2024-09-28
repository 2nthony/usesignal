import { useCloned } from '.'
import { useSignal } from '../signals'

export default function DemoUseCloned() {
  const template = useSignal({ fruit: 'banana', drink: 'water' })
  const { cloned, sync } = useCloned(template)

  return (
    <div>
      <div>
        <input
          value={cloned.value.fruit}
          onChange={(e) => {
            cloned.value = {
              ...cloned.value,
              fruit: e.target.value,
            }
          }}
        />
      </div>
      <div>
        <input
          value={cloned.value.drink}
          onChange={(e) => {
            cloned.value = {
              ...cloned.value,
              drink: e.target.value,
            }
          }}
        />
      </div>

      <div>
        <button
          onClick={() => {
            sync()
          }}
        >
          reset
        </button>
      </div>

      <div>
        <div>
          template:
          {' '}
          {JSON.stringify(template)}
        </div>
        <div>
          cloned:
          {' '}
          {JSON.stringify(cloned.toJSON())}
        </div>
      </div>
    </div>
  )
}
