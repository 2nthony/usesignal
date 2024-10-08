import { useCloned } from '.'

export default function DemoUseCloned() {
  const template = { fruit: 'banana', drink: 'water' }
  const { cloned, sync } = useCloned(template, { manual: true })

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
