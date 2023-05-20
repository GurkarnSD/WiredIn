import './globals.css'

export const metadata = {
  title: 'WiredIn',
  description: 'WiredIn is a social media platform for developers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
