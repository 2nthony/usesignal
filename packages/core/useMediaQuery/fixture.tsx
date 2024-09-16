import { useMediaQuery } from '.'

export default function Demo() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <div>
      <div>
        isLargeScreen:
        {' '}
        {isLargeScreen.toString()}
      </div>
      <div>
        isPreferredDark:
        {' '}
        {isPreferredDark.toString()}
      </div>
    </div>
  )
}
