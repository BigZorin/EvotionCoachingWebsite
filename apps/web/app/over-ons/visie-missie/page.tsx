import type { Metadata } from "next"
import { VisieEnMissieClientPage } from "./VisieEnMissieClientPage"

export const metadata: Metadata = {
  title: "Visie & Missie - Evotion Coaching",
  description:
    "Ontdek de visie en missie van Evotion Coaching. Wij geloven in bewustwording, persoonlijke groei en het leven vanuit universele waarden van liefde en vertrouwen.",
  keywords: "visie, missie, bewustwording, persoonlijke groei, coaching filosofie, universele waarden, transformatie",
  openGraph: {
    title: "Visie & Missie - Evotion Coaching",
    description:
      "Ontdek de visie en missie van Evotion Coaching. Wij geloven in bewustwording, persoonlijke groei en het leven vanuit universele waarden.",
    url: "https://evotion-coaching.nl/over-ons/visie-missie",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/over-ons/visie-missie",
  },
}

export default function VisieEnMissiePage() {
  return <VisieEnMissieClientPage />
}
