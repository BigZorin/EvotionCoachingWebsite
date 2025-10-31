import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Martin - Evotion Coaching",
  description: "Jouw persoonlijke fitness & voedingscoach. Samen werken we aan jouw gezondheid, energie en doelen.",
  generator: "v0.app",
  openGraph: {
    title: "Martin - Evotion Coaching",
    description: "Jouw persoonlijke fitness & voedingscoach",
    type: "profile",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
