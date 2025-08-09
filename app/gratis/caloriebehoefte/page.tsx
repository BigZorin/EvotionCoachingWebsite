import type { Metadata } from "next"
import CaloriebehoefteClientPage from "./CaloriebehoefteClientPage"

export const metadata: Metadata = {
  title: "Caloriebehoefte Calculator - Evotion Coaching",
  description:
    "Bereken je dagelijkse caloriebehoefte met onze gratis calculator. Krijg inzicht in hoeveel calorieën je nodig hebt om je doelen te bereiken.",
  openGraph: {
    title: "Caloriebehoefte Calculator - Evotion Coaching",
    description:
      "Bereken je dagelijkse caloriebehoefte met onze gratis calculator. Krijg inzicht in hoeveel calorieën je nodig hebt om je doelen te bereiken.",
    url: "https://evotion-coaching.nl/gratis/caloriebehoefte",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Caloriebehoefte Calculator van Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/gratis/caloriebehoefte",
  },
}

export default function CaloriebehoeftePage() {
  return <CaloriebehoefteClientPage />
}
