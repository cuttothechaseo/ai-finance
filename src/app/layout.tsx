import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WaitlistProvider } from './contexts/WaitlistContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// Google Analytics ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: 'WallStreetAI - AI-Powered Finance Interview Prep',
  description: 'Ace your finance interviews with AI-powered mock interviews, resume analysis, and personalized coaching. Land your dream finance job with WallStreetAI.',
  keywords: 'finance interview, AI interview prep, Wall Street, investment banking, financial analyst, resume analysis, mock interviews',
  authors: [{ name: 'WallStreetAI Team' }],
  creator: 'WallStreetAI',
  publisher: 'WallStreetAI',
  openGraph: {
    title: 'WallStreetAI - AI-Powered Finance Interview Prep',
    description: 'Ace your finance interviews with AI-powered mock interviews, resume analysis, and personalized coaching.',
    url: 'https://wallstreetai.app',
    siteName: 'WallStreetAI',
    images: [
      {
        url: '/assets/logos/wallstreetai-logo.svg',
        width: 1200,
        height: 630,
        alt: 'WallStreetAI Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WallStreetAI - AI-Powered Finance Interview Prep',
    description: 'Ace your finance interviews with AI-powered mock interviews, resume analysis, and personalized coaching.',
    images: ['/assets/logos/wallstreetai-logo.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/icons/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/logos/wallstreetai-logo.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/assets/icons/apple-icon.png', sizes: '180x180' },
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
        <link rel="icon" href="/assets/icons/icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/assets/logos/wallstreetai-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/icons/apple-icon.png" sizes="180x180" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Google Analytics */}
        {GA_ID && (
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
        )}
        {GA_ID && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <WaitlistProvider>
          {children}
        </WaitlistProvider>
      </body>
    </html>
  );
} 