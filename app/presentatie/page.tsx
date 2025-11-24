import type { Metadata } from "next"
import PresentatieClientPage from "./PresentatieClientPage"

export const metadata: Metadata = {
  title: "Klantenpresentatie | Evotion Coaching",
  description: "Ontdek het modulaire 5-fasen coachingprogramma van Evotion Coaching",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PresentatiePage() {
  return <PresentatieClientPage />
}
