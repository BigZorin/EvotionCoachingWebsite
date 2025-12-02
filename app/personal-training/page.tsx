import type { Metadata } from "next"
import PersonalTrainingClientPage from "./PersonalTrainingClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Personal Training - 1-op-1 Begeleiding | Evotion Coaching",
  description:
    "Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers. Persoonlijke schema's, voedingsadvies en bewezen resultaten. Vanaf €60 per sessie. Neem contact op via WhatsApp.",
  keywords: [
    "personal training",
    "personal trainer",
    "fitness coach",
    "1-op-1 training",
    "fitness begeleiding",
    "krachttraining coach",
    "afvallen personal trainer",
    "spieropbouw",
    "personal training sessie",
    "fitness coaching",
    "body transformation",
    "vetverlies coaching",
  ],
  openGraph: {
    title: "Personal Training - 1-op-1 Begeleiding | Evotion Coaching",
    description:
      "Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers. Persoonlijke schema's, voedingsadvies en professionele coaching.",
    url: "https://evotion-coaching.nl/personal-training",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/personal-training-session.jpeg",
        width: 1200,
        height: 630,
        alt: "Personal Training sessie bij Evotion Coaching",
        type: "image/jpeg",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training - 1-op-1 Begeleiding | Evotion Coaching",
    description: "Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers.",
    images: ["https://evotion-coaching.nl/images/personal-training-session.jpeg"],
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
