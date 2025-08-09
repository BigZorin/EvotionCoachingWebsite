import type { Metadata } from "next"
import ZorinProfileClientPage from "./ZorinProfileClientPage"

export const metadata: Metadata = {
  title: "Zorin Wijnands | 6x Nederlands Kampioen Powerlifting | Evotion Coaching",
  description:
    "Ontmoet Zorin Wijnands, 6-voudig Nederlands kampioen powerlifting (790kg total). Combineert topsport expertise met mentale coaching.",
  keywords: "Zorin Wijnands, powerlifting, Nederlands kampioen, mental coach, 790kg total, Evotion Coaching",
  openGraph: {
    title: "Zorin Wijnands | 6x Nederlands Kampioen Powerlifting | Evotion Coaching",
    description: "Ontmoet Zorin Wijnands, 6-voudig Nederlands kampioen powerlifting met expertise in mentale coaching.",
    type: "website",
  },
}

export default function ZorinProfilePage() {
  return <ZorinProfileClientPage />
}
