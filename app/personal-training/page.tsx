import type { Metadata } from "next"
import PersonalTrainingClientPage from "./PersonalTrainingClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Personal Training - Evotion Coaching",
  description:
    "Ontdek de voordelen van personal training bij Evotion Coaching. 1-op-1 begeleiding, persoonlijke schema's en voedingsadvies voor maximale resultaten.",
  openGraph: {
    title: "Personal Training - Evotion Coaching",
    description:
      "Ontdek de voordelen van personal training bij Evotion Coaching. 1-op-1 begeleiding, persoonlijke schema's en voedingsadvies voor maximale resultaten.",
    url: "https://evotion-coaching.nl/personal-training",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Personal Training bij Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/personal-training",
  },
}

export default function PersonalTrainingPage() {
  return (
    <>
      <Script
        id="schema-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Personal Training",
            provider: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotion-coaching.nl",
            },
            serviceType: "Personal Training",
            description: "1-op-1 begeleiding voor maximale resultaten. Gepersonaliseerde trainingsschema's en voeding.",
            offers: {
              "@type": "Offer",
              price: "70.00",
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "70.00",
                priceCurrency: "EUR",
                unitText: "per sessie",
              },
            },
          }),
        }}
      />
      <PersonalTrainingClientPage />
    </>
  )
}
