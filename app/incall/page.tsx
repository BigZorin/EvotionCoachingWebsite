import type { Metadata } from "next"
import IncallClientPage from "./IncallClientPage"

export const metadata: Metadata = {
  title: "Discovery Call | Evotion Coaching",
  description: "Discovery en adviescall voor meer helderheid over jouw volgende stappen",
  robots: {
    index: false,
    follow: false,
  },
}

export default function IncallPage() {
  return <IncallClientPage />
}
