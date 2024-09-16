import { usePreferredDark } from '.'

export default function Demo() {
  const preferredDark = usePreferredDark()

  return (
    <div>
      Preferred Dark:
      {preferredDark.toString()}
    </div>
  )
}
