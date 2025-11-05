"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Crown,
  Play,
  Lock,
  CheckCircle,
  Users,
  Star,
  Dumbbell,
  Heart,
  Smartphone,
  MessageCircle,
  Calendar,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Award,
} from "lucide-react"
import { DeviceMockup } from "./device-mockup"

const APP_SCREENS = [
  { src: "/images/app-screenshots/evotion-welkom.jpg", alt: "Welkom scherm" },
  { src: "/images/app-screenshots/evotion-dashboard.jpg", alt: "Dashboard overzicht" },
  { src: "/images/app-screenshots/evotion-workout.jpg", alt: "Workout interface" },
  { src: "/images/app-screenshots/evotion-voeding.jpg", alt: "Voeding tracker" },
  { src: "/images/app-screenshots/evotion-coach-chat.jpg", alt: "Coach chat" },
  { src: "/images/app-screenshots/evotion-extra.jpg", alt: "Extra features" },
]

const FEATURES = [
  {
    title: "Persoonlijke Workouts",
    description: "Trainingsschema's op maat, aangepast aan jouw niveau en doelen. Elke oefening met video-instructies.",
    icon: Dumbbell,
    screenIndex: 2,
    highlights: ["Video instructies", "Progressie tracking", "RPE monitoring"],
  },
  {
    title: "Voeding & Macro's",
    description: "Houd je voeding bij met slimme macro-tracking. Inclusief recepten en maaltijdplannen.",
    icon: Target,
    screenIndex: 3,
    highlights: ["Macro berekening", "Recepten database", "Voortgang grafieken"],
  },
  {
    title: "Directe Coach Contact",
    description: "Chat rechtstreeks met je coach. Stel vragen, deel foto's en ontvang persoonlijke feedback.",
    icon: MessageCircle,
    screenIndex: 4,
    highlights: ["Real-time chat", "Foto's delen", "Snelle feedback"],
  },
  {
    title: "Voortgang Inzichten",
    description: "Gedetailleerde analytics van je prestaties. Zie je vooruitgang in grafieken en statistieken.",
    icon: TrendingUp,
    screenIndex: 1,
    highlights: ["Prestatie grafieken", "Doelen tracking", "Wekelijkse rapporten"],
  },
]

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function EvotionAppClientPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Intersection observer for features
  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveFeature(index)
          }
        },
        { threshold: 0.6, rootMargin: "-20% 0px" },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const heroScreens = useMemo(() => APP_SCREENS.slice(0, 3), [])
  const featureScreens = useMemo(() => FEATURES.map((f) => APP_SCREENS[f.screenIndex]).filter(Boolean), [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* HERO SECTION */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-primary/5">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                    <Crown className="w-4 h-4 mr-2" />
                    Exclusief voor coaching klanten
                  </Badge>

                  <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    De Evotion
                    <span className="text-primary block">Coaching App</span>
                  </h1>

                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                    Jouw personal trainer altijd binnen handbereik. Persoonlijke workouts, voedingsadvies,
                    voortgangstracking en directe coaching — alles in één krachtige app.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/online-coaching">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Start met Coaching
                    </Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl bg-transparent"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Bekijk Demo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Evotion App Demo</DialogTitle>
                      </DialogHeader>
                      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500">Demo video wordt binnenkort toegevoegd</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    <span>iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2">5.0 sterren</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>500+ gebruikers</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Mockup */}
              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <DeviceMockup images={heroScreens} />

                  {/* Floating badges */}
                  <motion.div
                    className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Live
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  >
                    <Award className="w-4 h-4 inline mr-1" />
                    Premium
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ACCESS INFO */}
        <section className="py-12 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20"
              {...fadeIn()}
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    App toegang inbegrepen bij alle coaching programma's
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6">
                    Krijg direct toegang tot de Evotion App wanneer je start met een van onze coaching programma's.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Online Coaching", "Premium Coaching", "12-Weken Vetverlies", "Personal Training"].map(
                      (program) => (
                        <div key={program} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="font-medium text-gray-900">{program}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div className="text-center mb-16" {...fadeIn()}>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Alles wat je nodig hebt voor succes</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                De Evotion App combineert alle essentiële tools voor jouw fitness journey in één intuïtieve interface.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Sticky Mockup */}
              <div className="lg:sticky lg:top-24">
                <motion.div
                  className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <DeviceMockup images={featureScreens} activeIndex={activeFeature} autoRotateMs={5000} />
                </motion.div>
              </div>

              {/* Right: Features */}
              <div className="space-y-8">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    ref={(el) => (featureRefs.current[index] = el)}
                    className={`rounded-3xl p-8 transition-all duration-500 ${
                      activeFeature === index
                        ? "bg-white shadow-xl border-2 border-primary/20"
                        : "bg-white/50 hover:bg-white hover:shadow-lg border border-gray-200"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          activeFeature === index ? "bg-primary text-white shadow-lg" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 text-lg mb-4 leading-relaxed">{feature.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Actieve Gebruikers", icon: Users },
                { number: "5.0", label: "App Store Rating", icon: Star },
                { number: "10k+", label: "Workouts Voltooid", icon: Dumbbell },
                { number: "98%", label: "Tevredenheid", icon: Heart },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  {...fadeIn(index * 0.1)}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SCREENSHOTS GALLERY */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div className="text-center mb-12" {...fadeIn()}>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Bekijk de app in actie</h2>
              <p className="text-base md:text-lg text-gray-600">
                Een overzicht van alle belangrijke functies en schermen in de Evotion App.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {APP_SCREENS.map((screen, index) => (
                <motion.div key={screen.alt} className="group" {...fadeIn(index * 0.1)}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-0">
                      <div className="relative aspect-[9/16] bg-gray-100">
                        <Image
                          src={screen.src || "/placeholder.svg"}
                          alt={screen.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-center">{screen.alt}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
            <motion.div className="text-center max-w-4xl mx-auto" {...fadeIn()}>
              <h2 className="text-3xl lg:text-6xl font-bold mb-6">Start vandaag met de Evotion App</h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                Kies een coaching programma en krijg direct toegang tot alle premium functies. Jouw transformatie begint
                nu.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/online-coaching">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-gray-100 px-10 py-5 text-xl font-bold rounded-2xl shadow-xl"
                  >
                    <Calendar className="w-6 h-6 mr-3" />
                    Bekijk Coaching Opties
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-5 text-xl font-bold rounded-2xl"
                  >
                    <Clock className="w-6 h-6 mr-3" />
                    Gratis Kennismaking
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Direct toegang</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Geen setup kosten</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Premium support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
