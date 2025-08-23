import type { Metadata } from "next"
import EvotionBrandClientPage from "./EvotionBrandClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion - De Toonaangevende Fitness & Coaching Brand in Nederland",
  description:
    "🏆 Evotion - Dé fitness en coaching brand van Nederland. Ontdek waarom duizenden mensen kiezen voor Evotion coaching, training en begeleiding. ✅ Bewezen methodes ✅ Ervaren coaches ✅ Unieke app ✅ Resultaat gegarandeerd.",
  keywords: [
    "evotion",
    "evotion fitness",
    "evotion brand",
    "evotion nederland",
    "evotion coaching methode",
    "evotion app",
    "evotion training",
    "evotion resultaten",
    "evotion coaches",
    "evotion filosofie",
    "fitness brand nederland",
    "coaching merk",
    "evotion community",
    "evotion lifestyle",
    "evotion transformatie",
  ],
  openGraph: {
    title: "Evotion - De Toonaangevende Fitness & Coaching Brand in Nederland",
    description:
      "🏆 Ontdek Evotion - Dé fitness en coaching brand van Nederland. Bewezen methodes, ervaren coaches en unieke app voor jouw transformatie.",
    url: "https://evotion-coaching.nl/evotion",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion - De Toonaangevende Fitness & Coaching Brand",
        type: "image/png",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@evotioncoaching",
    title: "Evotion - De Toonaangevende Fitness & Coaching Brand",
    description: "🏆 Ontdek waarom duizenden mensen kiezen voor Evotion coaching en training.",
    images: ["https://evotion-coaching.nl/images/evotion-logo.png"],
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/evotion",
  },
}

export default function EvotionBrandPage() {
  return (
    <>
      <Script
        id="schema-brand"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            name: "Evotion",
            alternateName: "Evotion Coaching",
            url: "https://evotion-coaching.nl/evotion",
            logo: {
              "@type": "ImageObject",
              url: "https://evotion-coaching.nl/images/evotion-logo.png",
              width: 1200,
              height: 630,
            },
            description: "Toonaangevende fitness en coaching brand in Nederland",
            foundingDate: "2020",
            founder: [
              {
                "@type": "Person",
                name: "Martin Langenberg",
                jobTitle: "Co-founder & Head Coach",
              },
              {
                "@type": "Person",
                name: "Zorin Wijnands",
                jobTitle: "Co-founder & Powerlifting Coach",
              },
            ],
            parentOrganization: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotion-coaching.nl",
            },
            sameAs: [
              "https://www.facebook.com/evotioncoaching",
              "https://www.instagram.com/evotioncoaching",
              "https://wa.me/31610935077",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "500+",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
      <Script
        id="schema-about-page"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Over Evotion - De Fitness & Coaching Brand",
            description: "Alles over Evotion - van ontstaan tot toonaangevende fitness brand in Nederland",
            url: "https://evotion-coaching.nl/evotion",
            mainEntity: {
              "@type": "Organization",
              name: "Evotion",
              description: "Toonaangevende fitness en coaching brand in Nederland",
              foundingDate: "2020",
              numberOfEmployees: "10-50",
              industry: "Health & Fitness",
            },
          }),
        }}
      />
      <EvotionBrandClientPage />
    </>
  )
}
