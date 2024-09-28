import { useCycleList } from '.'
import { useSignal } from '../signals'

export default function DemoUseCycleList() {
  const list = useSignal([
    'Dog',
    'Cat',
    'Lizard',
    'Shark',
    'Whale',
    'Dolphin',
    'Octopus',
    'Seal',
  ])

  const { state, next, prev } = useCycleList(list)

  return (
    <div>
      <div>
        { state }
      </div>
      <button
        onClick={() => {
          prev()
        }}
      >
        Prev
      </button>
      <button
        onClick={() => {
          next()
        }}
      >
        Next
      </button>
    </div>
  )
}
