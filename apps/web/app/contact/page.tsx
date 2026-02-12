import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"

export const metadata: Metadata = {
  title: "Contact - Evotion Coaching",
  description:
    "Neem contact op met Evotion Coaching. Bel ons op 06 10 93 50 77, mail naar info@evotion-coaching.nl of start een WhatsApp chat. We helpen je graag verder!",
  openGraph: {
    title: "Contact - Evotion Coaching",
    description:
      "Neem contact op met Evotion Coaching. Bel ons op 06 10 93 50 77, mail naar info@evotion-coaching.nl of start een WhatsApp chat.",
    url: "https://evotion-coaching.nl/contact",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
  },
  alternates: {
    canonical: "https://evotion-coaching.nl/contact",
  },
}

export default function ContactPage() {
  return <ContactClientPage />
}
