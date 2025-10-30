'use client'
import type { Metadata } from 'next'

import { ThemeProvider } from 'next-theme'
import './globals.css'

// export const metadata: Metadata = {
//   title: 'Create Next App',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
