import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: "Greg's ChatBot",
  description:
    'Converting my existing Chatbot app from VITE React app to Next.js React app and implementing Authentication using Auth0.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
