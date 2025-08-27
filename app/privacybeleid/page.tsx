import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PrivacybeleidClientPage from "./PrivacybeleidClientPage"

export const metadata: Metadata = {
  title: "Privacybeleid | Evotion Coaching",
  description:
    "Lees ons privacybeleid en ontdek hoe wij omgaan met jouw persoonlijke gegevens bij het gebruik van onze caloriebehoefte calculator en coaching diensten.",
  keywords: "privacybeleid, gegevensbescherming, AVG, GDPR, caloriebehoefte calculator, Evotion Coaching",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacybeleid | Evotion Coaching",
    description: "Transparantie over hoe wij jouw gegevens beschermen en gebruiken.",
    type: "website",
  },
}

export default function PrivacybeleidPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <PrivacybeleidClientPage />
        </div>
      </main>

      <Footer />
    </div>
  )
}
