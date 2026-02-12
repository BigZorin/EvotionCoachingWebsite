import type { Metadata } from "next"
import { KernwaardenClientPage } from "./KernwaardenClientPage"

export const metadata: Metadata = {
  title: "Kernwaarden - Evotion Coaching",
  description:
    "Ontdek de kernwaarden van Evotion Coaching: Liefde, Vertrouwen, Bewustwording, Verantwoordelijkheid en Groei. Deze waarden vormen de basis van onze coaching filosofie.",
  keywords: "kernwaarden, liefde, vertrouwen, bewustwording, verantwoordelijkheid, groei, coaching waarden, filosofie",
  openGraph: {
    title: "Kernwaarden - Evotion Coaching",
    description:
      "Ontdek de kernwaarden van Evotion Coaching: Liefde, Vertrouwen, Bewustwording, Verantwoordelijkheid en Groei.",
    url: "https://evotion-coaching.nl/over-ons/kernwaarden",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/over-ons/kernwaarden",
  },
}

export default function KernwaardenPage() {
  return <KernwaardenClientPage />
}
