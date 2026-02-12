import type { Metadata } from "next"
import EvotionCoachingClient from "./EvotionCoachingClient"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion Coaching | Personal Training & Online Coaching Friesland",
  description:
    "Personal training en online coaching door ervaren coaches Martin & Zorin. Bewezen resultaten met gemiddeld 10kg gewichtsverlies. Persoonlijke begeleiding vanuit Sneek, Friesland.",
  keywords: [
    "personal training sneek",
    "personal training friesland",
    "online coaching",
    "fitness coach friesland",
    "evotion coaching",
    "Martin Langenberg",
    "Zorin Wijnands",
    "afvallen begeleiding",
    "personal trainer sneek",
    "online begeleiding fitness",
  ],
  openGraph: {
    title: "Evotion Coaching | Personal Training & Online Coaching Friesland",
    description:
      "Personal training en online coaching door ervaren coaches. Bewezen resultaten met persoonlijke begeleiding vanuit Friesland.",
    url: "https://evotion-coaching.nl",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evotion Coaching | Personal Training & Online Coaching Friesland",
    description: "Personal training en online coaching met bewezen resultaten door ervaren coaches.",
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
            description: "Personal training, duo training en online coaching met persoonlijke begeleiding vanuit Friesland",
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
              ratingValue: "5.0",
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
                    description: "1-op-1 personal training sessies met gecertificeerde trainers",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Duo Training",
                    description: "Train samen met een partner of vriend voor gedeelde motivatie",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Online Coaching",
                    description: "Persoonlijke begeleiding op afstand met 6-pijlers aanpak via de Evotion app",
                    provider: {
                      "@type": "Organization",
                      name: "Evotion Coaching",
                    },
                  },
                },
              ],
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
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
            description: "Personal training, duo training en online coaching met persoonlijke begeleiding vanuit Friesland",
            inLanguage: "nl-NL",
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
                  name: "Duo Training",
                  url: "https://evotion-coaching.nl/duo-training",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Online Coaching",
                  url: "https://evotion-coaching.nl/online-coaching",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Resultaten",
                  url: "https://evotion-coaching.nl/resultaten",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Over Ons",
                  url: "https://evotion-coaching.nl/over-ons/coaches",
                },
                {
                  "@type": "ListItem",
                  position: 6,
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
