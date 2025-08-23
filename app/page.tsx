import type { Metadata } from "next"
import EvotionCoachingClient from "./EvotionCoachingClient"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion Coaching - Personal Training & Online Coaching Nederland",
  description:
    "🏆 Bereik jouw droomlichaam met Evotion Coaching! Personal training & online coaching door ervaren coaches Martin & Zorin. ✅ Bewezen resultaten ✅ Persoonlijke begeleiding ✅ App toegang ✅ Voedingsadvies. Start vandaag je transformatie!",
  keywords: [
    "personal training nederland",
    "online coaching",
    "fitness coach nederland",
    "gewichtsverlies coaching",
    "spieropbouw programma",
    "Martin Langenberg personal trainer",
    "Zorin Wijnands powerlifting",
    "fitness app nederland",
    "body transformation",
    "12 weken vetverlies",
    "voedingsschema afvallen",
    "krachttraining begeleiding",
  ],
  openGraph: {
    title: "Evotion Coaching - Personal Training & Online Coaching Nederland",
    description:
      "🏆 Bereik jouw droomlichaam met Evotion Coaching! Personal training & online coaching door ervaren coaches Martin & Zorin. Bewezen resultaten en persoonlijke begeleiding.",
    url: "https://evotion-coaching.nl",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching - Personal Training & Online Coaching Nederland",
        type: "image/png",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@evotioncoaching",
    title: "Evotion Coaching - Personal Training & Online Coaching Nederland",
    description: "🏆 Bereik jouw droomlichaam met Evotion Coaching! Bewezen resultaten door ervaren coaches.",
    images: ["https://evotion-coaching.nl/images/evotion-logo.png"],
  },
  alternates: {
    canonical: "https://evotion-coaching.nl",
  },
}

export default function EvotionCoaching() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Evotion Coaching",
            url: "https://evotion-coaching.nl",
            logo: {
              "@type": "ImageObject",
              url: "https://evotion-coaching.nl/images/evotion-logo.png",
              width: 1200,
              height: 630,
            },
            description: "Personal Training & Online Coaching voor jouw droomlichaam",
            foundingDate: "2020",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Friesland",
              addressRegion: "FR",
              addressCountry: "NL",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+31-6-10935077",
                contactType: "customer service",
                email: "info@evotion-coaching.nl",
                availableLanguage: "Dutch",
                areaServed: "NL",
              },
            ],
            sameAs: [
              "https://www.facebook.com/evotioncoaching",
              "https://www.instagram.com/evotioncoaching",
              "https://wa.me/31610935077",
            ],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://evotion-coaching.nl",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "127",
              bestRating: "5",
              worstRating: "1",
            },
            priceRange: "€€",
            serviceArea: {
              "@type": "Country",
              name: "Netherlands",
            },
          }),
        }}
      />
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthAndBeautyBusiness",
            name: "Evotion Coaching",
            image: {
              "@type": "ImageObject",
              url: "https://evotion-coaching.nl/images/evotion-logo.png",
              width: 1200,
              height: 630,
            },
            "@id": "https://evotion-coaching.nl",
            url: "https://evotion-coaching.nl",
            telephone: "+31-6-10935077",
            email: "info@evotion-coaching.nl",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Friesland",
              addressRegion: "FR",
              addressCountry: "NL",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 53.2012,
              longitude: 5.8086,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "21:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday"],
                opens: "10:00",
                closes: "17:00",
              },
            ],
            priceRange: "€€",
            paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "iDEAL"],
            currenciesAccepted: "EUR",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Coaching Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Personal Training",
                    description: "1-op-1 personal training sessies",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                  price: "70.00",
                  priceCurrency: "EUR",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Online Coaching",
                    description: "Persoonlijke online coaching met app begeleiding",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                  price: "97.00",
                  priceCurrency: "EUR",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Premium Coaching",
                    description: "Combinatie van personal training en online coaching",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                  price: "147.00",
                  priceCurrency: "EUR",
                },
              ],
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "127",
            },
          }),
        }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Evotion Coaching",
            url: "https://evotion-coaching.nl",
            description: "Personal Training & Online Coaching voor jouw droomlichaam",
            inLanguage: "nl-NL",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://evotion-coaching.nl/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Personal Training",
                  url: "https://evotion-coaching.nl/personal-training",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Online Coaching",
                  url: "https://evotion-coaching.nl/online-coaching",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Premium Coaching",
                  url: "https://evotion-coaching.nl/premium-coaching",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "12-Weken Vetverlies",
                  url: "https://evotion-coaching.nl/12-weken-vetverlies",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Resultaten",
                  url: "https://evotion-coaching.nl/resultaten",
                },
                {
                  "@type": "ListItem",
                  position: 6,
                  name: "Over Ons",
                  url: "https://evotion-coaching.nl/over-ons/coaches",
                },
                {
                  "@type": "ListItem",
                  position: 7,
                  name: "Contact",
                  url: "https://evotion-coaching.nl/contact",
                },
              ],
            },
            publisher: {
              "@type": "Organization",
              name: "Evotion Coaching",
              logo: {
                "@type": "ImageObject",
                url: "https://evotion-coaching.nl/images/evotion-logo.png",
              },
            },
          }),
        }}
      />
      <Script
        id="schema-breadcrumb"
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
            ],
          }),
        }}
      />
      <EvotionCoachingClient />
    </>
  )
}
