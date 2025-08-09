import type { Metadata } from "next"
import EvotionCoachingClient from "./EvotionCoachingClient"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion Coaching - Personal Training & Online Coaching",
  description:
    "Bereik jouw droomlichaam met Evotion Coaching. Persoonlijke en online training, voedingsadvies en meer. Start vandaag nog jouw transformatie!",
  openGraph: {
    title: "Evotion Coaching - Personal Training & Online Coaching",
    description:
      "Bereik jouw droomlichaam met Evotion Coaching. Persoonlijke en online training, voedingsadvies en meer. Start vandaag nog jouw transformatie!",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Evotion Coaching",
            url: "https://evotion-coaching.nl",
            logo: "https://evotion-coaching.nl/images/evotion-logo.png",
            description: "Personal Training & Online Coaching voor jouw droomlichaam",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Friesland",
              addressRegion: "FR",
              addressCountry: "NL",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+31-6-10935077",
              contactType: "customer service",
              email: "info@evotion-coaching.nl",
            },
            sameAs: [
              "https://www.facebook.com/evotioncoaching",
              "https://www.instagram.com/evotioncoaching",
              "https://wa.me/31610935077",
            ],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://evotion-coaching.nl",
            },
          }),
        }}
      />
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthAndBeautyBusiness",
            name: "Evotion Coaching",
            image: "https://evotion-coaching.nl/images/evotion-logo.png",
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
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Coaching Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Personal Training",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Online Coaching",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Premium Coaching",
                  },
                },
              ],
            },
          }),
        }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Evotion Coaching",
            url: "https://evotion-coaching.nl",
            description: "Personal Training & Online Coaching voor jouw droomlichaam",
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
          }),
        }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
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
