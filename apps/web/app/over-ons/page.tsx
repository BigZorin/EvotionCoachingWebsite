import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Over Ons - Evotion Coaching",
  description:
    "Leer meer over het team van Evotion Coaching. Ontdek onze visie, missie, kernwaarden en maak kennis met onze ervaren coaches.",
  keywords: ["over ons", "team", "coaches", "visie", "missie", "kernwaarden", "evotion coaching"],
  openGraph: {
    title: "Over Ons - Evotion Coaching",
    description:
      "Leer meer over het team van Evotion Coaching. Ontdek onze visie, missie, kernwaarden en maak kennis met onze ervaren coaches.",
    url: "https://evotion-coaching.nl/over-ons",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching Logo",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over Ons - Evotion Coaching",
    description:
      "Leer meer over het team van Evotion Coaching. Ontdek onze visie, missie, kernwaarden en maak kennis met onze ervaren coaches.",
    images: ["https://evotion-coaching.nl/images/evotion-logo.png"],
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/over-ons",
  },
}

export default function OverOnsPage() {
  redirect("/over-ons/coaches")
}
