import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rooftop Analyzer',
  description: 'AI-Powered Solar Rooftop Analyzer',
  generator: 'JAI SONI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
