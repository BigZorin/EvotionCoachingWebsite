import type { Metadata } from "next"
import OnlineCoachingClientPage from "./OnlineCoachingClientPage"

export const metadata: Metadata = {
  title: "Online Coaching | Evotion Coaching",
  description:
    "Online coaching met persoonlijke begeleiding op basis van 6 pijlers. Voeding, training, mindset en meer. 6 maanden traject met app, wekelijkse check-ins en directe coaching.",
  keywords: [
    "online coaching",
    "online personal trainer",
    "fitness coaching online",
    "online begeleiding",
    "fitness coaching op afstand",
  ],
  openGraph: {
    title: "Online Coaching | Evotion Coaching",
    description:
      "Online coaching met persoonlijke begeleiding op basis van 6 pijlers. Voeding, training, mindset en meer.",
    url: "https://evotion-coaching.nl/online-coaching",
    siteName: "Evotion Coaching",
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
