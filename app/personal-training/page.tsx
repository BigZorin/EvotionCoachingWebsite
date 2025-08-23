import type { Metadata } from "next"
import PersonalTrainingClientPage from "./PersonalTrainingClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Personal Training Nederland - 1-op-1 Begeleiding | Evotion Coaching",
  description:
    "🏆 Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers. ✅ Persoonlijke schema's ✅ Voedingsadvies ✅ Bewezen resultaten. €70 per sessie. Boek nu je gratis consult!",
  keywords: [
    "personal training nederland",
    "personal trainer friesland",
    "1-op-1 training",
    "fitness begeleiding",
    "krachttraining coach",
    "gewichtsverlies personal trainer",
    "spieropbouw begeleiding",
    "Martin Langenberg personal trainer",
    "Zorin Wijnands trainer",
    "personal training sessie",
    "fitness coaching nederland",
    "body transformation trainer",
  ],
  openGraph: {
    title: "Personal Training Nederland - 1-op-1 Begeleiding | Evotion Coaching",
    description:
      "🏆 Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers. Persoonlijke schema's, voedingsadvies en bewezen resultaten.",
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
    title: "Personal Training Nederland - 1-op-1 Begeleiding | Evotion Coaching",
    description: "🏆 Personal Training bij Evotion Coaching - 1-op-1 begeleiding door ervaren trainers.",
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
                telephone: "+31-6-10935077",
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
                  addressRegion: "Friesland",
                  addressCountry: "NL",
                },
              },
            },
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
              availability: "https://schema.org/InStock",
              validFrom: "2024-01-01",
              seller: {
                "@type": "Organization",
                name: "Evotion Coaching",
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "89",
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
