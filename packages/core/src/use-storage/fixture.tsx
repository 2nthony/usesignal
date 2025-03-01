import { useStorage } from '.'
import { useSignals } from '../signals'

export default function DemoUseStorage() {
  useSignals()

  const data = useStorage(
    'demo-use-storage',
    {
      name: 'usesignal',
      lib: 'core',
      good: true,
    },
  )

  return (
    <div>
      <pre>{JSON.stringify(data.value, null, 2)}</pre>

      <input
        value={data.value.name}
        onChange={(e) => {
          data.value = {
            ...data.value,
            name: e.target.value,
          }
        }}
      />

      <input
        value={data.value.lib}
        onChange={(e) => {
          data.value = {
            ...data.value,
            lib: e.target.value,
          }
        }}
      />

      <label>
        <input
          checked={data.value.good}
          type="checkbox"
          onChange={(e) => {
            data.value = {
              ...data.value,
              good: e.target.checked,
            }
          }}
        />
        good
      </label>

      <br />

      <button
        onClick={() => {
          data.value = null
        }}
      >
        delete data
      </button>
    </div>
  )
}
