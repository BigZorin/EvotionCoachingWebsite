import type { Metadata } from "next"
import MartinProfileClientPage from "./MartinProfileClientPage"

export const metadata: Metadata = {
  title: "Martin Langenberg | Personal Trainer & Coach | Evotion Coaching",
  description:
    "Ontmoet Martin Langenberg, personal trainer met 25+ jaar ervaring. Gespecialiseerd in duurzame transformaties voor drukke ondernemers en ouders.",
  keywords: "Martin Langenberg, personal trainer, coach, krachttraining, voeding, mindset, Evotion Coaching",
  openGraph: {
    title: "Martin Langenberg | Personal Trainer & Coach | Evotion Coaching",
    description: "Ontmoet Martin Langenberg, personal trainer met 25+ jaar ervaring in krachttraining en coaching.",
    type: "website",
  },
}

export default function MartinProfilePage() {
  return <MartinProfileClientPage />
}
