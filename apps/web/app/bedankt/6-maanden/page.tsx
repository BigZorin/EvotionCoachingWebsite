import type { Metadata } from "next"
import Bedankt6MaandenClientPage from "./Bedankt6MaandenClientPage"

export const metadata: Metadata = {
  title: "Bedankt voor je aankoop! - Evotion Coaching",
  description: "Welkom bij het 6 Maanden Online Coaching Traject van Evotion Coaching. Je transformatie begint nu!",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Bedankt6MaandenPage() {
  return <Bedankt6MaandenClientPage />
}
