import { type MaybeSignal, useSignal } from '@signals-use/shared'

interface Props {
  when: MaybeSignal<boolean>
  children: React.ReactNode
}

export function Show({ when, children }: Props) {
  const value = useSignal(when)

  if (!value.value) {
    return null
  }

  return children
}
