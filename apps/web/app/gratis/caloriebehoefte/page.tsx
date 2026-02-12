import type { Metadata } from "next"
import CaloriebehoefteClientPage from "./CaloriebehoefteClientPage"

export const metadata: Metadata = {
  title: "Gratis Caloriebehoefte Berekenen | Evotion Coaching",
  description:
    "Bereken je dagelijkse caloriebehoefte met onze gratis calculator. BMR, TDEE en macronutrienten advies voor afvallen of spieropbouw.",
  keywords: [
    "caloriebehoefte berekenen",
    "calorie calculator",
    "BMR berekenen",
    "TDEE berekenen",
    "dagelijkse caloriebehoefte",
    "macronutrienten berekenen",
  ],
  openGraph: {
    title: "Gratis Caloriebehoefte Berekenen | Evotion Coaching",
    description: "Bereken je dagelijkse caloriebehoefte met onze gratis calculator. BMR, TDEE en macronutrienten advies.",
    url: "https://evotion-coaching.nl/gratis/caloriebehoefte",
    siteName: "Evotion Coaching",
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
