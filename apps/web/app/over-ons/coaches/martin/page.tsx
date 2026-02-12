import type { Metadata } from "next"
import MartinProfileClientPage from "./MartinProfileClientPage"

export const metadata: Metadata = {
  title: "Martin Langenberg | Personal Trainer & Coach | Evotion Coaching",
  description:
    "Ontmoet Martin Langenberg, personal trainer met 25+ jaar ervaring. Gespecialiseerd in duurzame transformaties voor drukke ondernemers en ouders in Sneek en Friesland.",
  keywords:
    "Martin Langenberg, personal trainer Sneek, coach Friesland, krachttraining, voeding, mindset, Evotion Coaching, Menno Henselmans, N1 Education",
  openGraph: {
    title: "Martin Langenberg | Personal Trainer & Coach | Evotion Coaching",
    description:
      "Ontmoet Martin Langenberg, personal trainer met 25+ jaar ervaring in krachttraining en coaching voor drukke professionals.",
    type: "profile",
    url: "https://evotion-coaching.nl/over-ons/coaches/martin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Martin Langenberg | Personal Trainer & Coach",
    description: "25+ jaar ervaring in krachttraining en coaching voor drukke professionals.",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/over-ons/coaches/martin",
  },
}

export default function MartinProfilePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Martin Langenberg",
            jobTitle: "Personal Trainer & Coach",
            worksFor: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotion-coaching.nl",
            },
            description:
              "Personal trainer met 25+ jaar ervaring, gespecialiseerd in duurzame transformaties voor drukke ondernemers en ouders.",
            knowsAbout: [
              "Krachttraining",
              "Voeding",
              "Personal Training",
              "Coaching",
              "Fitness",
              "Vetverlies",
              "Spieropbouw",
            ],
            alumniOf: ["Menno Henselmans", "N1 Education"],
          }),
        }}
      />
      <MartinProfileClientPage />
    </>
  )
}
