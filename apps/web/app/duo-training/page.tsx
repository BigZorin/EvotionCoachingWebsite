import type { Metadata } from "next"
import DuoTrainingClientPage from "./DuoTrainingClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Duo Training - Train Samen met een Partner | Evotion Coaching",
  description:
    "Duo Training bij Evotion Coaching - Train samen met een vriend, partner of familielid. Gedeelde kosten, dubbele motivatie. Vanaf €45 per persoon per sessie.",
  keywords: [
    "duo training",
    "samen trainen",
    "koppel training",
    "partner training",
    "fitness duo",
    "personal training duo",
    "samen sporten",
    "duo fitness",
    "training met partner",
    "groepstraining klein",
  ],
  openGraph: {
    title: "Duo Training - Train Samen met een Partner | Evotion Coaching",
    description:
      "Duo Training bij Evotion Coaching - Train samen met een vriend, partner of familielid. Gedeelde kosten, dubbele motivatie.",
    url: "https://evotion-coaching.nl/duo-training",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/duo-training",
  },
}

export default function DuoTrainingPage() {
  return (
    <>
      <Script
        id="schema-service-duo-training"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Duo Training",
            provider: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotion-coaching.nl",
            },
            serviceType: "Duo Training",
            description:
              "Train samen met een partner, vriend of familielid. Gedeelde kosten en dubbele motivatie voor betere resultaten.",
            areaServed: {
              "@type": "Country",
              name: "Netherlands",
            },
            offers: {
              "@type": "Offer",
              price: "90.00",
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "90.00",
                priceCurrency: "EUR",
                unitText: "per sessie (2 personen)",
              },
            },
          }),
        }}
      />
      <DuoTrainingClientPage />
    </>
  )
}
