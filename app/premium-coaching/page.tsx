import type { Metadata } from "next"
import PremiumCoachingClientPage from "./PremiumCoachingClientPage"

export const metadata: Metadata = {
  title: "Premium Coaching - Evotion Coaching",
  description:
    "Ervaar de meest exclusieve vorm van coaching bij Evotion Coaching. Personal training en online coaching gecombineerd voor maximale resultaten.",
  openGraph: {
    title: "Premium Coaching - Evotion Coaching",
    description:
      "Ervaar de meest exclusieve vorm van coaching bij Evotion Coaching. Personal training en online coaching gecombineerd voor maximale resultaten.",
    url: "https://evotion-coaching.nl/premium-coaching",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Premium Coaching bij Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/premium-coaching",
  },
}

export default function PremiumCoachingPage() {
  return <PremiumCoachingClientPage />
}
