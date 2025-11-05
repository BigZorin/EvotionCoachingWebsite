import type { Metadata } from "next"
import CoachesClientPage from "./CoachesClientPage"

export const metadata: Metadata = {
  title: "Onze Coaches | Martin & Zorin | Evotion Coaching Sneek",
  description:
    "Ontmoet Martin Langenberg (25+ jaar ervaring) en Zorin Wijnands (6x Nederlands kampioen powerlifting), de ervaren personal trainers en coaches achter Evotion Coaching in Sneek, Friesland.",
  keywords:
    "Martin Langenberg, Zorin Wijnands, personal trainer Sneek, powerlifting coach Nederland, fitness coach Friesland, Evotion Coaching, krachttraining expert, gecertificeerde coach",
  openGraph: {
    title: "Onze Coaches | Martin & Zorin | Evotion Coaching",
    description: "Ontmoet Martin Langenberg en Zorin Wijnands, de ervaren coaches achter Evotion Coaching.",
    type: "website",
    url: "https://evotioncoaching.nl/over-ons/coaches",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onze Coaches | Martin & Zorin | Evotion Coaching",
    description: "Ontmoet Martin Langenberg en Zorin Wijnands, de ervaren coaches achter Evotion Coaching.",
  },
  alternates: {
    canonical: "https://evotioncoaching.nl/over-ons/coaches",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CoachesPage() {
  return <CoachesClientPage />
}
