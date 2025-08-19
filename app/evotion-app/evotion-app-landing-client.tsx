"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Play,
  CheckCircle2,
  Smartphone,
  Dumbbell,
  UtensilsCrossed,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"
import { DeviceMockup } from "../over-ons/evotion-app/device-mockup"

const SCREENS = [
  { src: "/images/app-screenshots/evotion-welkom.jpg", alt: "Evotion App — Welkom & Login" },
  { src: "/images/app-screenshots/evotion-dashboard.jpg", alt: "Evotion App — Dashboard Overzicht" },
  { src: "/images/app-screenshots/evotion-workout.jpg", alt: "Evotion App — Workouts" },
  { src: "/images/app-screenshots/evotion-voeding.jpg", alt: "Evotion App — Voeding & Macro's" },
  { src: "/images/app-screenshots/evotion-coach-chat.jpg", alt: "Evotion App — Coach Chat" },
  { src: "/images/app-screenshots/evotion-extra.jpg", alt: "Evotion App — Extra Features" },
]

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.6, delay },
})

export default function EvotionAppLandingClient() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* HERO */}
        <section className="relative py-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70rem 30rem at 10% -10%, rgba(0,0,0,0.04), transparent 40%), radial-gradient(50rem 30rem at 90% 0%, rgba(0,0,0,0.03), transparent 35%)",
            }}
          />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              <motion.div {...fadeIn(0.05)} className="md:col-span-6 space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 w-fit"
                >
                  <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                  Evotion Coaching App
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                  Alles-in-één coaching. Waar je ook traint.
                </h1>
                <p className="text-lg lg:text-xl text-gray-700 max-w-2xl">
                  Persoonlijke workouts, voedingsbegeleiding, voortgangstracking en directe coach-feedback, allemaal in
                  één krachtige app.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/online-coaching">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-7 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <Crown className="w-5 h-5 mr-2" aria-hidden="true" />
                      Start met Online Coaching
                    </Button>
                  </Link>

                  <Link href="/contact" aria-label="Plan een gratis intake">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-7 py-4 text-lg rounded-xl transition-all bg-transparent"
                    >
                      <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                      Plan een gratis intake
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm">iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                    <span className="text-sm ml-2">5.0 rating</span>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeIn(0.15)} className="md:col-span-6">
                <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-md">
                  <DeviceMockup images={SCREENS.slice(0, 3)} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-14 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeIn(0.05)} className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">Waarom onze app?</h2>
              <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
                Ontworpen voor resultaat en gebruiksgemak, met alles wat je nodig hebt om consistent te blijven.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Slimme Workouts",
                  desc: "Op maat gemaakte schema’s met progressie en instructies.",
                  Icon: Dumbbell,
                },
                {
                  title: "Voeding zonder gedoe",
                  desc: "Heldere macro- en caloriedoelen, recepten en tips.",
                  Icon: UtensilsCrossed,
                },
                {
                  title: "Directe coach-chat",
                  desc: "Stel vragen en krijg feedback wanneer je die nodig hebt.",
                  Icon: MessageSquare,
                },
                {
                  title: "Veilig & betrouwbaar",
                  desc: "Privacy-by-design en stabiele prestaties.",
                  Icon: ShieldCheck,
                },
              ].map(({ title, desc, Icon }, i) => (
                <motion.div
                  key={title}
                  {...fadeIn(0.07 + i * 0.05)}
                  className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{title}</h3>
                  <p className="text-gray-700 mt-1">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              <motion.div {...fadeIn(0.05)} className="md:col-span-6 order-2 md:order-1">
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-md">
                  <DeviceMockup images={SCREENS.slice(2, 6)} />
                </div>
              </motion.div>

              <motion.div {...fadeIn(0.1)} className="md:col-span-6 order-1 md:order-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 w-fit"
                >
                  Zo werkt het
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mt-4">Binnen 3 stappen aan de slag</h2>
                <ul className="mt-6 space-y-4">
                  {[
                    {
                      title: "1. Kies je programma",
                      desc: "Selecteer het coaching traject dat past bij jouw doel en niveau.",
                    },
                    {
                      title: "2. Ontvang je schema’s",
                      desc: "Wij zetten je workouts en voedingsrichtlijnen klaar in de app.",
                    },
                    {
                      title: "3. Check in & groei",
                      desc: "Train, log je voortgang en chat met je coach voor scherpe bijsturing.",
                    },
                  ].map((item, i) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                      <div>
                        <div className="font-semibold text-primary">{item.title}</div>
                        <p className="text-gray-700">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeIn(0.05)} className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">Screenshots</h2>
              <p className="text-gray-700 mt-2">Een blik op workouts, voeding, chat en dashboards binnen de app.</p>
            </motion.div>

            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-6 min-w-max">
                {SCREENS.map((s, i) => (
                  <motion.div
                    key={s.alt}
                    {...fadeIn(0.08 + i * 0.04)}
                    className="shrink-0 w-[240px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm"
                  >
                    <div className="relative w-full aspect-[1/2]">
                      <Image
                        src={s.src || "/placeholder.svg?height=520&width=260&query=evotion%20app%20screenshot"}
                        alt={s.alt}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 70vw, 240px"
                        priority={false}
                      />
                    </div>
                    <div className="mt-3 text-sm text-gray-700">{s.alt.replace("Evotion App — ", "")}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeIn(0.05)} className="text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Klaar om te starten?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Kies een coaching traject en krijg direct toegang tot de Evotion Coaching App.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/online-coaching">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-gray-100 px-7 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Bekijk Online Coaching
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-primary/10 hover:bg-white hover:text-primary border-2 border-white text-white px-7 py-4 text-lg font-semibold rounded-xl transition-all"
                  >
                    Plan een gratis intake
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
