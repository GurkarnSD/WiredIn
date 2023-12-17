import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
