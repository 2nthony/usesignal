import { usePreferredDark } from '.'

export default function DemoUsePreferredDark() {
  const preferredDark = usePreferredDark()

  return (
    <div>
      Preferred Dark:
      {preferredDark.toString()}
    </div>
  )
}
