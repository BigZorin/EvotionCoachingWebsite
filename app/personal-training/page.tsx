import type { Metadata } from "next"
import PersonalTrainingClientPage from "./PersonalTrainingClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Personal Training | Evotion Coaching",
  description:
    "1-op-1 personal training bij Evotion Coaching. Persoonlijke schema's, voedingsadvies en bewezen resultaten door ervaren trainers. Vanaf 60 euro per sessie.",
  keywords: [
    "personal training",
    "personal trainer",
    "1-op-1 training",
    "fitness begeleiding",
    "personal training sneek",
    "fitness coaching",
  ],
  openGraph: {
    title: "Personal Training | Evotion Coaching",
    description:
      "1-op-1 personal training met persoonlijke schema's, voedingsadvies en bewezen resultaten.",
    url: "https://evotion-coaching.nl/personal-training",
    siteName: "Evotion Coaching",
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
        id="schema-service-personal-training"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Personal Training",
            provider: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotion-coaching.nl",
              logo: "https://evotion-coaching.nl/images/evotion-logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+31-6-43-65-571",
                contactType: "customer service",
              },
            },
            serviceType: "Personal Training",
            description:
              "1-op-1 personal training begeleiding voor maximale resultaten. Gepersonaliseerde trainingsschema's, voedingsadvies en professionele coaching.",
            areaServed: {
              "@type": "Country",
              name: "Netherlands",
            },
            availableChannel: {
              "@type": "ServiceChannel",
              serviceLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "NL",
                },
              },
            },
            offers: [
              {
                "@type": "Offer",
                name: "10 Sessies Pakket",
                price: "750.00",
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "75.00",
                  priceCurrency: "EUR",
                  unitText: "per sessie",
                },
              },
              {
                "@type": "Offer",
                name: "20 Sessies Pakket",
                price: "1400.00",
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "70.00",
                  priceCurrency: "EUR",
                  unitText: "per sessie",
                },
              },
              {
                "@type": "Offer",
                name: "40 Sessies Pakket",
                price: "2400.00",
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "60.00",
                  priceCurrency: "EUR",
                  unitText: "per sessie",
                },
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "15",
            },
            category: "Health & Fitness",
          }),
        }}
      />
      <Script
        id="schema-breadcrumb-personal-training"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://evotion-coaching.nl",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Personal Training",
                item: "https://evotion-coaching.nl/personal-training",
              },
            ],
          }),
        }}
      />
      <PersonalTrainingClientPage />
    </>
  )
}
