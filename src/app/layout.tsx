'use client'

import { useSignals } from '@preact/signals-react/runtime'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useSignals()

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
