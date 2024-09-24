'use client'
import { useColorMode } from '.'
import { useCycleList } from '../use-cycle-list'
import { useWatchEffect } from '../use-watch-effect'

export default function DemoUseColorMode() {
  const mode = useColorMode({
    modes: {
      contrast: 'dark contrast',
      cafe: 'cafe',
    },
  })

  const { state, next } = useCycleList(['dark', 'light', 'cafe', 'contrast', 'auto'], { initialValue: mode })

  useWatchEffect(() => {
    mode.value = state.value
  })

  return (
    <div>
      <button
        onClick={() => {
          next()
        }}
      >

        <span>
          { state }
        </span>
      </button>

      <span>← Click to change the color mode</span>
    </div>
  )
}
