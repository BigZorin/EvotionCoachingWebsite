import type { Metadata } from "next"
import OnlineCoachingClientPage from "./OnlineCoachingClientPage"

export const metadata: Metadata = {
  title: "Online Coaching - Evotion Coaching",
  description:
    "Ervaar flexibele en persoonlijke online coaching bij Evotion Coaching. Bereik je fitnessdoelen met onze app, trainingsschema's en voedingsadvies.",
  openGraph: {
    title: "Online Coaching - Evotion Coaching",
    description:
      "Ervaar flexibele en persoonlijke online coaching bij Evotion Coaching. Bereik je fitnessdoelen met onze app, trainingsschema's en voedingsadvies.",
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
