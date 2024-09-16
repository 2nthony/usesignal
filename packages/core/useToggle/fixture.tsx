import { useToggle } from '.'

export default function UseToggle() {
  const [value, toggle] = useToggle(false)

  return (
    <div>
      <div>
        {value.value ? 'Open' : 'Closed'}
      </div>

      <button
        onClick={() => {
          toggle()
        }}
      >
        toggle
      </button>
    </div>
  )
}
