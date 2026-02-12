import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AlgemeneVoorwaardenClientPage from "./AlgemeneVoorwaardenClientPage"

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Evotion Coaching",
  description:
    "Lees onze algemene voorwaarden voor het gebruik van de caloriebehoefte calculator en onze coaching diensten.",
  keywords: "algemene voorwaarden, gebruiksvoorwaarden, caloriebehoefte calculator, coaching, Evotion Coaching",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Algemene Voorwaarden | Evotion Coaching",
    description: "Voorwaarden voor het gebruik van onze diensten en calculator.",
    type: "website",
  },
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <AlgemeneVoorwaardenClientPage />
        </div>
      </main>

      <Footer />
    </div>
  )
}
