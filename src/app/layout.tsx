// Core imports
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

// Styles
import "./globals.css";

// Contexts
import { WaitlistProvider } from "./contexts/WaitlistContext";
import AuthProvider from "@/components/AuthProvider";

// Font configuration
const inter = Inter({ subsets: ["latin"] });

// Environment variables
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7QXXKWRKSK";

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://wallstreetai.app"),
  title: "WallStreetAI - AI-Powered Finance Recruiting Tool",
  description:
    "Your AI assistant for breaking into finance — polish your resume, master mock interviews, and send outreach that gets noticed.",
  keywords:
    "finance interview, AI interview prep, Wall Street, investment banking, financial analyst, resume analysis, mock interviews",
  authors: [{ name: "WallStreetAI Team" }],
  creator: "WallStreetAI",
  publisher: "WallStreetAI",
  openGraph: {
    title: "WallStreetAI - AI-Powered Finance Recruiting Tool",
    description:
      "Your AI assistant for breaking into finance — polish your resume, master mock interviews, and send outreach that gets noticed.",
    url: "https://wallstreetai.app",
    siteName: "WallStreetAI",
    images: [
      {
        url: "/assets/logos/wallstreetai-logo.svg",
        width: 1200,
        height: 630,
        alt: "WallStreetAI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WallStreetAI - AI-Powered Finance Recruiting Tool",
    description:
      "Your AI assistant for breaking into finance — polish your resume, master mock interviews, and send outreach that gets noticed.",
    images: ["/assets/logos/wallstreetai-logo.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/icons/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/logos/wallstreetai-logo.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/assets/icons/apple-icon.png", sizes: "180x180" },
    shortcut: "/favicon.ico",
  },
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  return (
    <html lang="en">
      <head>
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/assets/icons/icon.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/assets/logos/wallstreetai-logo.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/icons/apple-icon.png"
          sizes="180x180"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rrfer8t0yb");
          `}
        </Script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <WaitlistProvider>{children}</WaitlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
