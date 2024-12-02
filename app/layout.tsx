import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Greg's Chatbot",
  description: 'An AI-powered chatbot using Next.js 15 and Turbopack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body className={inter.className}>
          <ThemeProvider defaultTheme="light">
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </UserProvider>
    </html>
  )
}

