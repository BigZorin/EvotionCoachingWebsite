import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "@/components/cookie-consent"
import Script from "next/script"
import { AnalyticsTracker } from "@/components/analytics-tracker"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: "Evotion Coaching | Personal Training & Online Coaching",
    template: "%s | Evotion Coaching",
  },
  description:
    "Personal training en online coaching voor duurzame resultaten. Persoonlijke begeleiding door ervaren coaches Martin & Zorin vanuit Sneek, Friesland.",
  keywords: [
    "personal training",
    "online coaching",
    "fitness coaching",
    "voedingsbegeleiding",
    "personal trainer Friesland",
    "online personal trainer",
    "gewichtsverlies begeleiding",
    "fitness Sneek",
  ],
  authors: [{ name: "Evotion Coaching" }],
  creator: "Evotion Coaching",
  publisher: "Evotion Coaching",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://evotion-coaching.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Evotion Coaching | Personal Training & Online Coaching",
    description: "Personal training en online coaching voor duurzame resultaten. Persoonlijke begeleiding door ervaren coaches.",
    url: "https://evotion-coaching.nl",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evotion Coaching | Personal Training & Online Coaching",
    description: "Personal training en online coaching voor duurzame resultaten door ervaren coaches.",
    images: ["/images/evotion-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/images/evotion-favicon.png" />
        <link rel="apple-touch-icon" href="/images/evotion-app-icon.png" />
        <meta name="theme-color" content="#1e1839" />
      </head>
      <body className={inter.className}>
        {/* Suppress ResizeObserver loop error */}
        <Script id="resize-observer-fix" strategy="beforeInteractive">
          {`
            const resizeObserverErr = window.onerror;
            window.onerror = function(message, source, lineno, colno, error) {
              if (message === 'ResizeObserver loop completed with undelivered notifications.' || 
                  message === 'ResizeObserver loop limit exceeded') {
                return true;
              }
              return resizeObserverErr ? resizeObserverErr(message, source, lineno, colno, error) : false;
            };
          `}
        </Script>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MCL41XYPGM" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MCL41XYPGM');
          `}
        </Script>

        <AnalyticsTracker />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
