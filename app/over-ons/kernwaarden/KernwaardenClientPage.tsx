"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  Target,
  HandHeart,
  Lightbulb,
  MessageSquare,
  UserCheck,
  Activity,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export function KernwaardenClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeValue, setActiveValue] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    // Auto-rotate kernwaarden op mobiel
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const coreValues = [
    {
      icon: Brain,
      title: "Bewustzijn en Zelfinzicht",
      description: "Groei begint bij bewustwording – weten wie je bent, wat je beweegt en hoe je keuzes invloed hebben.",
    },
    {
      icon: Target,
      title: "Verantwoordelijkheid",
      description: "Echte transformatie begint wanneer je verantwoordelijkheid neemt voor je eigen keuzes en resultaten.",
    },
    {
      icon: HandHeart,
      title: "Dienstbaarheid",
      description: "Vanuit oprechte betrokkenheid staan we klaar om anderen te ondersteunen met begeleiding die ertoe doet.",
    },
    {
      icon: Lightbulb,
      title: "Continue Ontwikkeling",
      description: "Groei stopt nooit. Door te blijven leren en vernieuwen ontstaat vooruitgang.",
    },
    {
      icon: MessageSquare,
      title: "Transparantie",
      description: "Helderheid in communicatie en intentie is de basis van vertrouwen.",
    },
    {
      icon: UserCheck,
      title: "Empathie en Respect",
      description: "Ieder mens bewandelt zijn eigen pad. We stemmen af op unieke behoeften en uitdagingen.",
    },
    {
      icon: Activity,
      title: "Gezondheid en Welzijn",
      description: "Gezondheid draait om balans – fysiek, mentaal én emotioneel in één allesomvattende aanpak.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center bg-[#1e1839] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 pt-20 pb-16 lg:pt-0 lg:pb-0">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                Onze Kern. Jouw Groei.
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Kernwaarden
            </h1>
            
            <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              De basis van onze coaching filosofie en hoe we jou begeleiden naar een sterker leven
            </p>
            
            <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <p className="text-white font-medium text-base md:text-lg italic">
                  "It is time to bring your evolution in motion"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KERNWAARDEN OVERZICHT - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Waar We Voor Staan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              7 kernwaarden die onze aanpak definiëren
            </p>
          </div>

          {/* Mobile - Single card with fade */}
          <div className="lg:hidden">
            <div className="relative h-80 mb-6">
              {coreValues.map((value, index) => (
                <div
                  key={value.title}
                  onClick={() => setActiveValue((index + 1) % coreValues.length)}
                  className={`absolute inset-0 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-6 cursor-pointer transition-all duration-700 ${
                    index === activeValue ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      {React.createElement(value.icon, {
                        className: "w-8 h-8 text-white",
                        strokeWidth: 1.5,
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="flex gap-1">
              {coreValues.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveValue(i)}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    i === activeValue ? 'bg-[#1e1839]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop - Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coreValues.slice(0, 6).map((value, index) => (
              <div
                key={value.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {React.createElement(value.icon, {
                    className: "w-7 h-7 text-white",
                    strokeWidth: 1.5,
                  })}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
          
          {/* 7th value centered */}
          <div className="hidden lg:flex justify-center mt-6">
            <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                {React.createElement(coreValues[6].icon, {
                  className: "w-7 h-7 text-white",
                  strokeWidth: 1.5,
                })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{coreValues[6].title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">{coreValues[6].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WAARDEN IN ACTIE - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Waarden in Actie
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Niet alleen woorden, maar de basis van alles wat we doen
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">7</div>
              <div className="text-white/70 text-sm">Kernwaarden</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-white/70 text-sm">Transparantie</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-white/70 text-sm">Groei</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">1</div>
              <div className="text-white/70 text-sm">Jouw Pad</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOE WE WERKEN - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Hoe We Werken
              </h2>
              <p className="text-gray-600 text-lg">
                Onze waarden vertaald naar jouw traject
              </p>
            </div>

            <div className="space-y-6">
              {[
                { num: "01", title: "Luisteren en begrijpen", desc: "We nemen de tijd om jouw situatie, doelen en uitdagingen echt te begrijpen." },
                { num: "02", title: "Persoonlijke aanpak", desc: "Geen standaard programma, maar een plan dat past bij jouw leven en mogelijkheden." },
                { num: "03", title: "Samen groeien", desc: "We blijven naast je staan, passen aan waar nodig en vieren successen samen." },
              ].map((step, index) => (
                <div key={step.num} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ervaar Onze Waarden
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Ontdek hoe onze kernwaarden jouw transformatie kunnen ondersteunen. 
              Laten we samen werken aan een sterker, vrijer en gezonder leven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-8 py-6 text-lg"
                asChild
              >
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Plan een Gesprek
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-6 text-lg"
                asChild
              >
                <Link href="/over-ons/visie-missie">
                  Onze Visie & Missie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
