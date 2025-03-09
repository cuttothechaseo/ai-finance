import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WaitlistProvider } from './contexts/WaitlistContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wall Street AI',
  description: 'Get instant feedback on your answers, improve technical & behavioral skills, and land your dream finance job.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/wallstreetai-logo.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
    shortcut: '/favicon.ico',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/wallstreetai-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <WaitlistProvider>
          {children}
        </WaitlistProvider>
      </body>
    </html>
  );
} 