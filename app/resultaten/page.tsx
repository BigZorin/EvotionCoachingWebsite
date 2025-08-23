import type { Metadata } from "next"
import { ResultatenClientPage } from "./ResultatenClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Resultaten & Transformaties - Bewezen Succes | Evotion Coaching",
  description:
    "🏆 Bekijk de indrukwekkende transformaties van onze cliënten! ✅ Martin: -10.7kg in 11 weken ✅ Salim: -8.1kg in 26 weken ✅ Wouter: -2.1kg body recomp. Echte resultaten, echte mensen. Jij bent de volgende!",
  keywords: [
    "fitness resultaten nederland",
    "gewichtsverlies transformaties",
    "body transformation voorbeelden",
    "afvallen resultaten",
    "spieropbouw succes",
    "fitness voor en na",
    "coaching resultaten",
    "body recomposition",
    "vetverlies transformatie",
    "fitness success stories",
    "personal training resultaten",
    "online coaching succes",
  ],
  openGraph: {
    title: "Resultaten & Transformaties - Bewezen Succes | Evotion Coaching",
    description:
      "🏆 Bekijk de indrukwekkende transformaties van onze cliënten! Echte resultaten door bewezen coaching methodes.",
    url: "https://evotion-coaching.nl/resultaten",
    images: [
      {
        url: "/images/martin-transformation-professional.png",
        width: 1200,
        height: 630,
        alt: "Martin's transformatie - 10.7kg gewichtsverlies in 11 weken",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resultaten & Transformaties - Bewezen Succes | Evotion Coaching",
    description:
      "🏆 Bekijk de indrukwekkende transformaties van onze cliënten! Echte resultaten door bewezen coaching.",
    images: ["/images/martin-transformation-professional.png"],
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/resultaten",
  },
}

export default function ResultatenPage() {
  return (
    <>
      <Script
        id="schema-testimonials"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Client Transformations",
            description: "Successful client transformations at Evotion Coaching",
            itemListElement: [
              {
                "@type": "Review",
                position: 1,
                author: {
                  "@type": "Person",
                  name: "Martin",
                },
                reviewBody:
                  "Indrukwekkende transformatie van 10.7kg gewichtsverlies in slechts 11 weken door de begeleiding van Evotion Coaching.",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                itemReviewed: {
                  "@type": "Service",
                  name: "Online Coaching",
                  provider: {
                    "@type": "Organization",
                    name: "Evotion Coaching",
                  },
                },
              },
              {
                "@type": "Review",
                position: 2,
                author: {
                  "@type": "Person",
                  name: "Salim",
                },
                reviewBody:
                  "Succesvol 8.1kg afgevallen in 26 weken met duurzame resultaten door de professionele begeleiding.",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                itemReviewed: {
                  "@type": "Service",
                  name: "Personal Training",
                  provider: {
                    "@type": "Organization",
                    name: "Evotion Coaching",
                  },
                },
              },
              {
                "@type": "Review",
                position: 3,
                author: {
                  "@type": "Person",
                  name: "Wouter",
                },
                reviewBody:
                  "Perfecte body recomposition met 2.1kg gewichtsverlies in 8 weken terwijl ik spiermassa behield.",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                itemReviewed: {
                  "@type": "Service",
                  name: "Premium Coaching",
                  provider: {
                    "@type": "Organization",
                    name: "Evotion Coaching",
                  },
                },
              },
            ],
          }),
        }}
      />
      <Script
        id="schema-breadcrumb-resultaten"
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
                name: "Resultaten",
                item: "https://evotion-coaching.nl/resultaten",
              },
            ],
          }),
        }}
      />
      <ResultatenClientPage />
    </>
  )
}
