import type { Metadata } from "next"
import EvotionBrandClientPage from "./EvotionBrandClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion - De Toonaangevende Fitness & Coaching Brand in Nederland",
  description:
    "🏆 Evotion - Dé fitness en coaching brand van Nederland. Ontdek waarom duizenden mensen kiezen voor Evotion coaching, training en begeleiding. ✅ Bewezen methodes ✅ Ervaren coaches ✅ Unieke app ✅ Resultaat gegarandeerd.",
  keywords: [
    "evotion",
    "evotion coaching",
    "evotion fitness",
    "evotion brand",
    "evotion nederland",
    "evotion coaching methode",
    "evotion app",
    "evotion training",
    "evotion resultaten",
    "evotion coaches",
    "evotion filosofie",
    "fitness brand friesland",
    "coaching merk",
    "evotion community",
    "evotion lifestyle",
    "evotion transformatie",
    "personal training sneek",
    "fitness coach friesland",
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
  authors: [{ name: "Evotion Coaching" }],
  creator: "Evotion Coaching",
  publisher: "Evotion Coaching",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function EvotionBrandPage() {
  return (
    <>
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Over Evotion",
                item: "https://evotion-coaching.nl/evotion",
              },
            ],
          }),
        }}
      />
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
              reviewCount: "500",
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
      <Script
        id="schema-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Wat is Evotion?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion is een toonaangevende fitness en coaching brand in Nederland die ontstond uit de combinatie van Evolution en Motion. Wij helpen mensen hun droomlichaam te bereiken door middel van bewezen coaching methodes, een unieke app en persoonlijke begeleiding.",
                },
              },
              {
                "@type": "Question",
                name: "Wat maakt Evotion uniek?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion combineert persoonlijke coaching met geavanceerde technologie via onze unieke Evotion app. We bieden 24/7 toegang tot je coach, AI-gestuurde voedingsadvies, gepersonaliseerde trainingsschema's en een exclusieve community. Onze bewezen methode heeft al meer dan 500 mensen geholpen met hun transformatie.",
                },
              },
              {
                "@type": "Question",
                name: "Waar is Evotion gevestigd?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion biedt personal training in Sneek, Friesland en online coaching door heel Nederland. We zijn specialist in fitness coaching in Friesland en bieden zowel fysieke als online begeleiding.",
                },
              },
              {
                "@type": "Question",
                name: "Welke services biedt Evotion aan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion biedt drie hoofdservices: Personal Training in Sneek met 1-op-1 begeleiding, Online Coaching met 24/7 app toegang, en het intensieve 12 Weken Vetverlies Programma dat beide combineert voor maximale resultaten.",
                },
              },
              {
                "@type": "Question",
                name: "Wat zijn de resultaten van Evotion coaching?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion heeft meer dan 2000 transformaties begeleid met een gemiddelde review van 4.9/5 sterren. 95% van onze klanten bereikt succesvol vetverlies. Voorbeelden zijn Martin met -10.7kg in 11 weken, Salim met -8.1kg in 26 weken, en Wouter met -2.1kg body recomp.",
                },
              },
            ],
          }),
        }}
      />
      <EvotionBrandClientPage />
    </>
  )
}
