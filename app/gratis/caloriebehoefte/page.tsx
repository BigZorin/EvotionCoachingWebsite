import type { Metadata } from "next"
import CaloriebehoefteClientPage from "./CaloriebehoefteClientPage"

export const metadata: Metadata = {
  title: "Caloriebehoefte Berekenen - Gratis Calculator voor Afvallen & Vetverlies",
  description:
    "🔥 Bereken je caloriebehoefte voor afvallen en vetverlies! Gratis calculator voor dagelijkse calorieën, BMR en TDEE. Inclusief macronutriënten advies. Start vandaag met effectief afvallen!",
  keywords: [
    "caloriebehoefte berekenen",
    "vetverlies berekenen",
    "afvallen berekenen",
    "caloriebehoefte calculator",
    "hoeveel calorieën per dag afvallen",
    "BMR berekenen",
    "TDEE berekenen",
    "dagelijkse caloriebehoefte",
    "calorieën tellen afvallen",
    "vetverlies calculator",
    "afvallen hoeveel calorieën",
    "caloriebehoefte vrouw",
    "caloriebehoefte man",
    "macronutriënten berekenen",
    "eiwitten koolhydraten vetten berekenen",
    "metabolisme berekenen",
    "calorie deficit berekenen",
    "gewichtsverlies calculator",
    "fitness calculator",
    "voeding berekenen",
  ],
  openGraph: {
    title: "Caloriebehoefte Berekenen - Gratis Calculator voor Afvallen & Vetverlies",
    description:
      "🔥 Bereken je caloriebehoefte voor afvallen en vetverlies! Gratis calculator voor dagelijkse calorieën, BMR en TDEE. Inclusief macronutriënten advies.",
    url: "https://evotion-coaching.nl/gratis/caloriebehoefte",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Caloriebehoefte Berekenen - Gratis Calculator voor Afvallen & Vetverlies",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caloriebehoefte Berekenen - Gratis Calculator voor Afvallen & Vetverlies",
    description:
      "🔥 Bereken je caloriebehoefte voor afvallen en vetverlies! Gratis calculator voor dagelijkse calorieën, BMR en TDEE.",
    images: ["/images/evotion-logo.png"],
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/gratis/caloriebehoefte",
  },
}

export default function CaloriebehoeftePage() {
  return <CaloriebehoefteClientPage />
}
