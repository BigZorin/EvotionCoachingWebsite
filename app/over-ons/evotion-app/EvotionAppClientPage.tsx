"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  CheckCircle,
  Dumbbell,
  Smartphone,
  MessageCircle,
  TrendingUp,
  Utensils,
  BookOpen,
  ArrowRight,
  RefreshCw,
  BarChart3,
  Heart,
} from "lucide-react"

const features = [
  {
    title: "Persoonlijk Trainingsschema",
    desc: "Op maat gemaakte trainingsschema's, afgestemd op jouw doelen, niveau en beschikbaarheid.",
    icon: Dumbbell,
  },
  {
    title: "Voedingsplan & Macro's",
    desc: "Gestructureerd voedingsplan met macro-tracking en een voedingsvervanger voor flexibiliteit.",
    icon: Utensils,
  },
  {
    title: "Direct Contact met Coach",
    desc: "Chat rechtstreeks met je coach voor vragen, feedback en persoonlijke begeleiding.",
    icon: MessageCircle,
  },
  {
    title: "Voortgang & Inzichten",
    desc: "Houd je progressie bij met check-ins, foto's en gedetailleerde statistieken.",
    icon: TrendingUp,
  },
  {
    title: "E-learning Modules",
    desc: "Leer over voeding, training en mindset via onze educatieve content in de app.",
    icon: BookOpen,
  },
  {
    title: "Supplementenadvies",
    desc: "Persoonlijk advies over supplementen die passen bij jouw doelen en situatie.",
    icon: Heart,
  },
]

const howItWorks = [
  { step: "01", title: "Kies een programma", desc: "Selecteer het coaching programma dat bij je past." },
  { step: "02", title: "Download de app", desc: "Ontvang je inloggegevens en download de Evotion App." },
  { step: "03", title: "Start je traject", desc: "Alles staat klaar: trainingsschema, voedingsplan en coach support." },
]

export default function EvotionAppClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* HERO - Paars */}
        <section className="relative bg-[#1e1839] pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 mb-6">
                  <Crown className="w-4 h-4 mr-2" />
                  Exclusief voor coaching klanten
                </Badge>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  De Evotion
                  <span className="block text-white/80">Coaching App</span>
                </h1>

                <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                  Jouw personal trainer altijd binnen handbereik. Training, voeding, voortgang en directe coaching — alles in een app.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    className="bg-white text-[#1e1839] hover:bg-white/90 rounded-xl h-12 px-6 text-base font-semibold"
                    asChild
                  >
                    <Link href="/online-coaching">
                      Start met Coaching
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-6 text-base bg-transparent"
                    asChild
                  >
                    <Link href="/contact">
                      Gratis Kennismaking
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Inbegrepen bij coaching</span>
                  </div>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className={`flex justify-center transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="relative w-56 md:w-64 lg:w-72">
                  <div className="absolute -inset-8 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/19] relative">
                      <Image
                        src="/images/evotion-logo-mockup-desktop.png"
                        alt="Evotion App"
                        fill
                        className="object-contain p-6"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES - Wit */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
                Alles in een app
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Van trainingsschema tot voedingsplan, van check-ins tot directe coaching — alles wat je nodig hebt.
              </p>
            </div>

            {/* Mobile: Fade Carousel */}
            <div className="lg:hidden">
              <div className="relative h-52 mb-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className={`absolute inset-0 bg-gray-50 rounded-2xl p-6 transition-all duration-500 ${
                        index === activeFeature ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1e1839] mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  )
                })}
              </div>
              {/* Progress dots */}
              <div className="flex justify-center gap-2">
                {features.map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeFeature ? 'bg-[#1e1839] w-8' : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group bg-gray-50 rounded-2xl p-8 hover:bg-[#1e1839] transition-all duration-300 cursor-default"
                  >
                    <div className="w-14 h-14 bg-[#1e1839] group-hover:bg-white rounded-xl flex items-center justify-center mb-5 transition-colors">
                      <Icon className="w-7 h-7 text-white group-hover:text-[#1e1839] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1e1839] group-hover:text-white mb-3 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 group-hover:text-white/80 leading-relaxed transition-colors">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Paars */}
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Hoe het werkt
              </h2>
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                In drie stappen aan de slag met de Evotion App.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute">
                      <ArrowRight className="w-5 h-5 text-white/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INCLUDED - Wit */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
                Inbegrepen bij elk programma
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Ongeacht welk coaching programma je kiest, de app is altijd inbegrepen.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { name: "Online Coaching", href: "/online-coaching", icon: Smartphone },
                { name: "Premium Coaching", href: "/premium-coaching", icon: Crown },
                { name: "12-Weken Vetverlies", href: "/12-weken-vetverlies", icon: RefreshCw },
                { name: "Personal Training", href: "/personal-training", icon: Dumbbell },
              ].map((program) => {
                const Icon = program.icon
                return (
                  <Link
                    key={program.name}
                    href={program.href}
                    className="group flex items-center gap-4 bg-gray-50 rounded-2xl p-5 hover:bg-[#1e1839] transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-[#1e1839] group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-5 h-5 text-white group-hover:text-[#1e1839] transition-colors" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1e1839] group-hover:text-white transition-colors">{program.name}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white/60 inline-block ml-2 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
              {[
                { number: "500+", label: "Gebruikers", icon: BarChart3 },
                { number: "5.0", label: "Beoordeling", icon: Heart },
                { number: "98%", label: "Tevredenheid", icon: CheckCircle },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <div className="w-10 h-10 bg-[#1e1839]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-[#1e1839]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA - Paars */}
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Klaar om te beginnen?
              </h2>
              <p className="text-base md:text-lg text-white/70 mb-10 leading-relaxed">
                Kies een coaching programma en krijg direct toegang tot de Evotion App met alle premium functies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-white text-[#1e1839] hover:bg-white/90 rounded-xl h-12 px-8 text-base font-semibold"
                  asChild
                >
                  <Link href="/online-coaching">
                    Bekijk Programma's
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8 text-base bg-transparent"
                  asChild
                >
                  <Link href="/contact">
                    Neem Contact Op
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
