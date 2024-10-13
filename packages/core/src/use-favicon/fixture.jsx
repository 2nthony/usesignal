import { useFavicon } from '.'
import { useComputed, useSignal } from '../signals'

export default function DemoUseFavicon() {
  const type = useSignal('react')

  const favicon = useComputed(() =>
    type.value === 'react' ? 'react.svg' : 'vite.svg')

  useFavicon(favicon, {
    baseUrl: '/',
    rel: 'icon',
  })

  return (
    <div>
      <div>NOTE: go the fullscreen(f) to see favicon effect</div>

      <hr />

      <div>
        Change favicon to
      </div>
      <button
        onClick={() => {
          type.value = 'react'
        }}
      >
        React
      </button>
      <button
        onClick={() => {
          type.value = 'vite'
        }}
      >
        Vite
      </button>
    </div>
  )
}
