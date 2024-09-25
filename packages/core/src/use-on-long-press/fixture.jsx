'use client'
import { useOnLongPress } from '.'
import { useSignal } from '../signals'

export default function DemoUseOnLongPress() {
  const el1 = useSignal(null)
  const elOptions = useSignal(null)
  const elMouseUp = useSignal(null)

  const longPressed = useSignal(false)
  const clicked = useSignal(false)

  function onLongPressCallback() {
    longPressed.value = true
  }

  function onMouseUpCallback(duration, distance, isLongPress) {
    if (!isLongPress) {
      clicked.value = true
    }

    // eslint-disable-next-line no-console
    console.log({ distance, duration, isLongPress })
  }

  function reset() {
    longPressed.value = false
    clicked.value = false
  }

  useOnLongPress(el1, onLongPressCallback)
  useOnLongPress(elOptions, onLongPressCallback, { delay: 1000 })
  useOnLongPress(
    elMouseUp,
    onLongPressCallback,
    {
      distanceThreshold: 24,
      delay: 1000,
      onMouseUp: onMouseUpCallback,
    },
  )

  return (
    <div>
      <p>
        Long Pressed:
        {longPressed.toString()}
      </p>
      <p>
        Clicked:
        {clicked.toString()}
      </p>
      <button ref={el1}>
        Press long (500ms)
      </button>
      <button ref={elOptions}>
        Press long (1000ms)
      </button>
      <button ref={elMouseUp}>
        Press long (1000ms) or click
      </button>
      <button onClick={reset}>
        Reset
      </button>
    </div>
  )
}
