import type { Metadata } from "next"
import EvotionBrandClientPage from "./EvotionBrandClientPage"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Evotion - Fitness & Coaching Brand uit Sneek | Personal Training & Online Coaching",
  description:
    "Evotion - Dé fitness en coaching brand uit Sneek, Friesland. Personal Training, Duo Training en Online Coaching met de unieke Evotion app en het modulaire 5-fasen programma. Evolution + Motion = Evotion.",
  keywords: [
    "evotion",
    "evotion coaching",
    "evotion fitness",
    "evotion sneek",
    "evotion friesland",
    "evotion app",
    "evotion training",
    "evotion personal training",
    "evotion online coaching",
    "evotion duo training",
    "fitness brand sneek",
    "coaching sneek",
    "personal training sneek",
    "fitness coach friesland",
  ],
  openGraph: {
    title: "Evotion - Fitness & Coaching Brand uit Sneek",
    description:
      "Ontdek Evotion - Dé fitness en coaching brand uit Sneek. Personal Training, Duo Training en Online Coaching met de unieke Evotion app.",
    url: "https://evotion-coaching.nl/evotion",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "https://evotion-coaching.nl/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion - Fitness & Coaching Brand",
        type: "image/png",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@evotioncoaching",
    title: "Evotion - Fitness & Coaching Brand uit Sneek",
    description: "Ontdek Evotion - Personal Training, Duo Training en Online Coaching met de unieke Evotion app.",
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
            description: "Fitness en coaching brand uit Sneek, Friesland",
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
                jobTitle: "Co-founder & Personal Trainer",
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
              ratingValue: "5.0",
              reviewCount: "10",
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
            description: "Alles over Evotion - fitness en coaching brand uit Sneek, Friesland",
            url: "https://evotion-coaching.nl/evotion",
            mainEntity: {
              "@type": "Organization",
              name: "Evotion",
              description: "Fitness en coaching brand uit Sneek, Friesland",
              foundingDate: "2020",
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
                  text: "Evotion is een fitness en coaching brand uit Sneek, Friesland. De naam ontstond uit de combinatie van Evolution en Motion. Wij helpen mensen hun fitnessdoelen te bereiken door middel van persoonlijke coaching, een unieke app en een bewezen aanpak rondom 6 pijlers.",
                },
              },
              {
                "@type": "Question",
                name: "Wat maakt Evotion uniek?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion combineert persoonlijke coaching met een eigen app. We bieden directe toegang tot je coach, gepersonaliseerde trainingsschema's, voedingsbegeleiding en een exclusieve community. Onze aanpak rondom 6 pijlers (Voeding, Training, Mindset, Herstel & Rust, Ritme & Structuur en Verantwoordelijkheid) zorgt voor duurzame resultaten.",
                },
              },
              {
                "@type": "Question",
                name: "Waar is Evotion gevestigd?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion biedt Personal Training en Duo Training in Sneek, Friesland. Daarnaast bieden we Online Coaching aan door heel Nederland via de Evotion app.",
                },
              },
              {
                "@type": "Question",
                name: "Welke services biedt Evotion aan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evotion biedt drie hoofdservices: Personal Training met 1-op-1 begeleiding in Sneek, Duo Training om samen met een partner te trainen, en Online Coaching met trajecten van 6 of 12 maanden inclusief volledige app toegang.",
                },
              },
              {
                "@type": "Question",
                name: "Hoe werkt de Evotion aanpak?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Onze aanpak is gebaseerd op 6 pijlers: Voeding, Training, Mindset, Herstel & Rust, Ritme & Structuur en Verantwoordelijkheid. Door al deze gebieden aan te pakken, bereiken we duurzame verandering in plaats van tijdelijke resultaten.",
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
