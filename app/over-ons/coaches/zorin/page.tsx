import type { Metadata } from "next"
import ZorinProfileClientPage from "./ZorinProfileClientPage"

export const metadata: Metadata = {
  title: "Zorin Wijnands | 6x Nederlands Kampioen Powerlifting | BigZorin Coaching",
  description:
    "Van 6x Nederlands Kampioen Powerlifting tot jouw persoonlijke coach. Met jarenlange ervaring op het hoogste niveau help ik jou je doelen te bereiken. 260kg squat, 193kg bench, 340kg deadlift.",
  keywords:
    "Zorin Wijnands, BigZorin Coaching, powerlifting coach, Nederlands kampioen, powerlifting training, krachtsport, squat, bench press, deadlift, EK powerlifting, transformatie coaching",
  openGraph: {
    title: "Zorin Wijnands | 6x Nederlands Kampioen Powerlifting | BigZorin Coaching",
    description:
      "Van 6x Nederlands Kampioen tot jouw persoonlijke coach. Powerlifting expertise op het hoogste niveau.",
    type: "profile",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/over-ons/coaches/zorin",
  },
}

export default function ZorinProfilePage() {
  return <ZorinProfileClientPage />
}
