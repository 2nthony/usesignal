'use client'
import { useStorage } from '.'

export default function DemoUseStorage() {
  const data = useStorage(
    'demo-use-storage',
    {
      name: 'usesignal',
      lib: 'core',
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
