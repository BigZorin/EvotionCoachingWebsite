import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://evotion-coaching.nl"),
  title: {
    default: "Evotion Coaching - Personal Training & Online Coaching",
    template: "%s | Evotion Coaching",
  },
  description:
    "Evotion Coaching biedt personal training, online coaching en voedingsadvies om jouw fitnessdoelen te bereiken. Ervaren coaches Martin & Zorin begeleiden je naar succes.",
  keywords:
    "personal training, online coaching, fitness, voeding, Nederland, Friesland, Martin Langenberg, Zorin Wijnands",
  authors: [{ name: "Evotion Coaching" }],
  creator: "Evotion Coaching",
  publisher: "Evotion Coaching",
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
    title: "Evotion Coaching - Personal Training & Online Coaching",
    description:
      "Evotion Coaching biedt personal training, online coaching en voedingsadvies om jouw fitnessdoelen te bereiken.",
    images: [
      {
        url: "/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evotion Coaching - Personal Training & Online Coaching",
    description:
      "Evotion Coaching biedt personal training, online coaching en voedingsadvies om jouw fitnessdoelen te bereiken.",
    images: ["/images/evotion-logo.png"],
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="canonical" href="https://evotion-coaching.nl" />
        <meta name="theme-color" content="#1e1839" />
        <meta name="msapplication-TileColor" content="#1e1839" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
