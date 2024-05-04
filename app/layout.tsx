import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'WiredIn',
  description: 'WiredIn is a social media platform for developers.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/dark-favicon.ico',
        href: '/dark-favicon.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/light-favicon.ico',
        href: '/light-favicon.ico',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position='top-right' />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
