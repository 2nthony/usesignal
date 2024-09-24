'use client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <style jsx>
        {`
        .dark {
          background-color: #121212;
          color: white;
        }
      `}
      </style>
      <body>{children}</body>
    </html>
  )
}
