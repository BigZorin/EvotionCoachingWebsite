import type { Metadata } from "next"
import EvotionAppClientPage from "./EvotionAppClientPage"

export const metadata: Metadata = {
  title: "Evotion Coaching App - Jouw Personal Trainer in je Zak | Evotion Coaching",
  description:
    "Ontdek de Evotion Coaching App: jouw persoonlijke fitness companion met workouts, voedingsschema's, voortgang tracking en directe coaching. Download nu gratis!",
  keywords: "Evotion app, fitness app, personal training app, workout app, voeding app, coaching app, fitness tracking",
  openGraph: {
    title: "Evotion Coaching App - Jouw Personal Trainer in je Zak",
    description: "De complete fitness app met persoonlijke coaching, workouts en voedingsschema's. Download nu gratis!",
    images: [
      {
        url: "/images/evotion-app-login.jpg",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching App Interface",
      },
    ],
  },
}

export default function EvotionAppPage() {
  return <EvotionAppClientPage />
}
