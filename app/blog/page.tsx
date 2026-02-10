import type { Metadata } from "next"
import { BlogClientPage } from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Blog | Evotion Coaching",
  description: "Evidence-based artikelen over voeding, training, mindset en meer. Kennis en inzichten van Evotion Coaching.",
  openGraph: {
    title: "Blog | Evotion Coaching",
    description: "Evidence-based artikelen over voeding, training, mindset en meer.",
    url: "https://evotioncoaching.nl/blog",
    siteName: "Evotion Coaching",
    locale: "nl_NL",
    type: "website",
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}
