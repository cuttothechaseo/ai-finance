import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Finance - Ace Your Finance Interviews',
  description: 'Get instant feedback on your answers, improve technical & behavioral skills, and land your dream finance job.',
  icons: {
    icon: [
      { url: '/logos/wallstreetai-logo.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: { url: '/logos/wallstreetai-logo.png', type: 'image/png' },
    shortcut: '/logos/wallstreetai-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/wallstreetai-logo.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logos/wallstreetai-logo.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
} 