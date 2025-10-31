import TwaalfWekenVetverliesClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "12-Weken Vetverlies Programma - Evotion Coaching",
  description:
    "Transformeer je lichaam in 12 weken met het 12-weken vetverlies programma van Evotion Coaching. Persoonlijke begeleiding, app toegang en gegarandeerde resultaten.",
  openGraph: {
    title: "12-Weken Vetverlies Programma - Evotion Coaching",
    description:
      "Transformeer je lichaam in 12 weken met het 12-weken vetverlies programma van Evotion Coaching. Persoonlijke begeleiding, app toegang en gegarandeerde resultaten.",
    url: "https://evotion-coaching.nl/12-weken-vetverlies",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "12-Weken Vetverlies Programma bij Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/12-weken-vetverlies",
  },
}

export default function TwaalfWekenVetverliesPage() {
  return <TwaalfWekenVetverliesClientPage />
}
