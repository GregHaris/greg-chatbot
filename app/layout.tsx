import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { auth } from '@/auth';
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Greg's Chatbot",
  description: 'An AI-powered chatbot using Next.js 15 and Turbopack',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider defaultTheme="light">
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
