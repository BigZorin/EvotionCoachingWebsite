import type { Metadata } from "next"
import { ResultatenClientPage } from "./ResultatenClientPage"

export const metadata: Metadata = {
  title: "Resultaten - Evotion Coaching",
  description:
    "Bekijk de indrukwekkende transformaties en succesverhalen van onze cliënten bij Evotion Coaching. Laat je inspireren door echte resultaten.",
  keywords:
    "resultaten, transformaties, succesverhalen, cliënten, fitness resultaten, gewichtsverlies, spieropbouw, Evotion Coaching",
  openGraph: {
    title: "Resultaten - Evotion Coaching",
    description: "Bekijk de indrukwekkende transformaties en succesverhalen van onze cliënten bij Evotion Coaching.",
    url: "https://evotion-coaching.nl/resultaten",
    images: [
      {
        url: "/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching Resultaten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resultaten - Evotion Coaching",
    description: "Bekijk de indrukwekkende transformaties en succesverhalen van onze cliënten bij Evotion Coaching.",
    images: ["/images/evotion-logo.png"],
  },
}

export default function ResultatenPage() {
  return <ResultatenClientPage />
}
