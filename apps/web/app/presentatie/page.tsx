import type { Metadata } from "next"
import PresentatieClientPage from "./PresentatieClientPage"

export const metadata: Metadata = {
  title: "Klantenpresentatie | Evotion Coaching",
  description: "Ontdek het coachingprogramma van Evotion Coaching met de 6-pijlers aanpak",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PresentatiePage() {
  return <PresentatieClientPage />
}
