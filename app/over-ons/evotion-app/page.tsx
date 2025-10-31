import type { Metadata } from "next"
import EvotionAppClientPage from "./EvotionAppClientPage"

export const metadata: Metadata = {
  title: "Evotion Coaching App — Jouw Personal Trainer in je Zak",
  description:
    "Ontdek de Evotion Coaching App: persoonlijke workouts, voedingstracking, directe coach contact en voortgangsinzichten. Exclusief voor coaching klanten.",
  keywords: [
    "evotion coaching app",
    "fitness app nederland",
    "personal training app",
    "workout tracking app",
    "voeding app",
    "coaching app",
    "fitness begeleiding",
  ],
  alternates: { canonical: "/over-ons/evotion-app" },
  openGraph: {
    title: "Evotion Coaching App — Jouw Personal Trainer in je Zak",
    description:
      "Persoonlijke workouts, voedingstracking, directe coach contact en voortgangsinzichten — alles in één krachtige app.",
    url: "https://www.evotion-coaching.nl/over-ons/evotion-app",
    type: "website",
    images: [
      {
        url: "/images/evotion-app-login.jpg",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching App Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evotion Coaching App",
    description: "Jouw personal trainer altijd binnen handbereik. Exclusief voor coaching klanten.",
    images: ["/images/evotion-app-login.jpg"],
  },
}

export default function Page() {
  return <EvotionAppClientPage />
}
