import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { Metadata } from 'next';

import { ThemeProvider } from '@components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Greg's Chatbot",
  description: 'An AI-powered chatbot using Next.js 15 and Turbopack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider defaultTheme="light">
            {children}
            <SpeedInsights/>
            <Analytics />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
