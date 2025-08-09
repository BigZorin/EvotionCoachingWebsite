import type { Metadata } from "next"
import CoachesClientPage from "./CoachesClientPage"

export const metadata: Metadata = {
  title: "Onze Coaches | Martin & Zorin | Evotion Coaching",
  description:
    "Ontmoet Martin Langenberg en Zorin Wijnands, de ervaren coaches achter Evotion Coaching. 25+ jaar ervaring en 6x Nederlands kampioen powerlifting.",
  keywords: "Martin Langenberg, Zorin Wijnands, personal trainer, powerlifting coach, Nederland, Evotion Coaching",
  openGraph: {
    title: "Onze Coaches | Martin & Zorin | Evotion Coaching",
    description: "Ontmoet Martin Langenberg en Zorin Wijnands, de ervaren coaches achter Evotion Coaching.",
    type: "website",
  },
}

export default function CoachesPage() {
  return <CoachesClientPage />
}
