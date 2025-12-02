import type { Metadata } from "next"
import OnlineCoachingClientPage from "./OnlineCoachingClientPage"

export const metadata: Metadata = {
  title: "Online Coaching - Modulair 5-Fasen Programma | Evotion Coaching",
  description:
    "Online coaching met een persoonlijk 5-fasen programma dat zich aanpast aan jouw tempo. 6 of 12 maanden traject met app, e-learning en wekelijkse check-ins.",
  keywords: [
    "online coaching",
    "online personal trainer",
    "fitness coaching online",
    "modulair coachingprogramma",
    "online begeleiding",
    "vetverlies coaching",
    "spieropbouw online",
  ],
  openGraph: {
    title: "Online Coaching - Modulair 5-Fasen Programma | Evotion Coaching",
    description:
      "Online coaching met een persoonlijk 5-fasen programma dat zich aanpast aan jouw tempo. 6 of 12 maanden traject met app, e-learning en wekelijkse check-ins.",
    url: "https://evotion-coaching.nl/online-coaching",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Online Coaching bij Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/online-coaching",
  },
}

export default function OnlineCoachingPage() {
  return <OnlineCoachingClientPage />
}
