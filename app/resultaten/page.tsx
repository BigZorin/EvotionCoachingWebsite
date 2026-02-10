import type { Metadata } from "next"
import { ResultatenClientPage } from "./ResultatenClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Resultaten & Transformaties | Evotion Coaching",
  description: "Bekijk de transformaties van onze cliënten. Echte resultaten door persoonlijke begeleiding en bewezen methodes.",
  openGraph: {
    title: "Resultaten & Transformaties | Evotion Coaching",
    description: "Echte transformaties door persoonlijke begeleiding en bewezen methodes.",
    url: "https://evotioncoaching.nl/resultaten",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
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
