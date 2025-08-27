import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CookieConsent from "@/components/cookie-consent"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://evotion-coaching.nl"),
  title: {
    default: "Evotion Coaching - Personal Training & Online Coaching Nederland",
    template: "%s | Evotion Coaching",
  },
  description:
    "🏆 Evotion Coaching - Personal Training & Online Coaching in Nederland. Ervaren coaches Martin & Zorin begeleiden je naar jouw droomlichaam. ✅ Bewezen resultaten ✅ Persoonlijke begeleiding ✅ App toegang. Start vandaag!",
  keywords: [
    "personal training sneek",
    "online coaching",
    "vetverlies",
    "online vetverliezen",
    "fitness coach friesland",
    "evotion coaching",
    "evotion",
    "Martin Langenberg",
    "Zorin Wijnands",
    "12 weken vetverlies",
    "body transformation",
    "powerlifting coach",
    "afvallen",
    "vet verliezen",
    "fitness app",
    "personal trainer friesland",
    "online fitness coaching",
    "vetverlies coaching",
    "krachttraining",
    "voedingsschema",
    "fitness begeleiding",
    "body recomposition",
  ],
  authors: [{ name: "Evotion Coaching", url: "https://evotion-coaching.nl" }],
  creator: "Evotion Coaching",
  publisher: "Evotion Coaching",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/evotion-favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/evotion-favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/evotion-favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/images/evotion-favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://evotion-coaching.nl",
    siteName: "Evotion Coaching",
    title: "Evotion Coaching - Personal Training & Online Coaching Nederland",
    description:
      "🏆 Bereik jouw droomlichaam met Evotion Coaching. Personal training & online coaching door ervaren coaches Martin & Zorin. Bewezen resultaten, persoonlijke begeleiding en app toegang.",
    images: [
      {
        url: "/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching - Personal Training & Online Coaching Nederland",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@evotioncoaching",
    creator: "@evotioncoaching",
    title: "Evotion Coaching - Personal Training & Online Coaching Nederland",
    description:
      "🏆 Bereik jouw droomlichaam met Evotion Coaching. Personal training & online coaching door ervaren coaches Martin & Zorin.",
    images: ["/images/evotion-logo.png"],
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    yandex: "your-yandex-verification-code", // Replace with actual verification code
    yahoo: "your-yahoo-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: "https://evotion-coaching.nl",
    languages: {
      "nl-NL": "https://evotion-coaching.nl",
    },
  },
  category: "Health & Fitness",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://evotion-coaching.nl" />
        <meta name="theme-color" content="#1e1839" />
        <meta name="msapplication-TileColor" content="#1e1839" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Evotion Coaching" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Evotion Coaching" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://evotion-coaching.nl" />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
