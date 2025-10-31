import type { Metadata } from "next"
import { BlogClientPage } from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Fitness & Voeding Expert Blog | Evotion Coaching",
  description:
    "Ontdek bewezen strategieën voor afvallen, spieropbouw en een gezonde levensstijl. Expert tips van gecertificeerde coaches voor jouw transformatie.",
  keywords: [
    "fitness blog",
    "voeding tips",
    "afvallen",
    "spieropbouw",
    "gezonde levensstijl",
    "personal training",
    "supplementen",
    "creatine",
    "workout",
    "coaching",
    "transformatie",
    "gewichtsverlies",
    "krachttraining",
    "cardio",
    "voedingsadvies",
    "fitness tips",
  ],
  authors: [{ name: "Evotion Coaches" }],
  creator: "Evotion Coaching",
  publisher: "Evotion Coaching",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://evotioncoaching.nl"),
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Fitness & Voeding Expert Blog | Evotion Coaching",
    description:
      "Ontdek bewezen strategieën voor afvallen, spieropbouw en een gezonde levensstijl. Expert tips van gecertificeerde coaches.",
    url: "https://evotioncoaching.nl/blog",
    siteName: "Evotion Coaching",
    images: [
      {
        url: "/images/evotion-logo.png",
        width: 1200,
        height: 630,
        alt: "Evotion Coaching Blog",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness & Voeding Expert Blog | Evotion Coaching",
    description:
      "Ontdek bewezen strategieën voor afvallen, spieropbouw en een gezonde levensstijl. Expert tips van gecertificeerde coaches.",
    images: ["/images/evotion-logo.png"],
    creator: "@evotioncoaching",
  },
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
  verification: {
    google: "your-google-verification-code",
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}
