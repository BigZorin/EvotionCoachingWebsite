"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Shield,
  Target,
  Leaf,
  RotateCcw,
  Heart,
  Sprout,
  UserCheck,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export function KernwaardenClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeValue, setActiveValue] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 7)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const coreValues = [
    {
      icon: Shield,
      title: "Waarheid",
      description: "Echte vooruitgang begint bij eerlijkheid. Geen mooie verhalen of snelle beloftes, maar een aanpak die klopt met hoe lichaam en leven werkelijk functioneren.",
    },
    {
      icon: Target,
      title: "Verantwoordelijkheid",
      description: "Gezondheid is geen toeval. Het vraagt verantwoordelijkheid nemen voor keuzes, gedrag en leefstijl. Wij begeleiden, maar jij staat zelf aan het stuur.",
    },
    {
      icon: Leaf,
      title: "Duurzaamheid",
      description: "Wij bouwen niet op korte pieken, maar op resultaten die blijven. Fysiek, mentaal en praktisch. Wat vandaag werkt maar morgen schaadt, past niet bij Evotion.",
    },
    {
      icon: RotateCcw,
      title: "Consistentie boven motivatie",
      description: "Motivatie komt en gaat. Consistentie bouwt. Wij helpen structuren en ritmes ontwikkelen die ook werken op dagen dat motivatie ontbreekt.",
    },
    {
      icon: Heart,
      title: "Respect voor het lichaam",
      description: "Het lichaam is geen probleem dat opgelost moet worden, maar een systeem dat verzorgd mag worden. Training, voeding en herstel zijn middelen om te ondersteunen, niet te forceren.",
    },
    {
      icon: Sprout,
      title: "Groei zonder oordeel",
      description: "Terugval hoort bij verandering. Fouten zijn geen falen, maar informatie om bij te sturen. Groei ontstaat in een veilige omgeving waarin eerlijkheid mogelijk is.",
    },
    {
      icon: UserCheck,
      title: "Zelfstandigheid",
      description: "Ons doel is niet dat mensen ons nodig blijven hebben. Ons doel is dat mensen begrijpen wat ze doen en waarom, zodat ze zelfstandig verder kunnen.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
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
                Onze Kern
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Kernwaarden
            </h1>
            
            <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              De principes die onze coaching richting geven en jou sterker en zelfstandiger maken
            </p>
          </div>
        </div>
      </section>

      {/* KERNWAARDEN - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">
              Waar We Voor Staan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              7 kernwaarden als fundament van alles wat we doen
            </p>
          </div>

          {/* Mobile - Single card carousel */}
          <div className="lg:hidden">
            <div className="relative h-72 mb-6">
              {coreValues.map((value, index) => (
                <div
                  key={value.title}
                  onClick={() => setActiveValue((index + 1) % coreValues.length)}
                  className={`absolute inset-0 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-6 cursor-pointer transition-all duration-700 ${
                    index === activeValue ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      {React.createElement(value.icon, {
                        className: "w-7 h-7 text-white",
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

          {/* Desktop - Staggered grid */}
          <div className="hidden lg:block max-w-6xl mx-auto">
            {/* Top row - 3 cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {coreValues.slice(0, 3).map((value) => (
                <div
                  key={value.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-[#1e1839]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {React.createElement(value.icon, {
                      className: "w-7 h-7 text-white",
                      strokeWidth: 1.5,
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
            
            {/* Middle row - 2 wider cards, offset */}
            <div className="grid grid-cols-2 gap-6 mb-6 max-w-4xl mx-auto">
              {coreValues.slice(3, 5).map((value) => (
                <div
                  key={value.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-[#1e1839]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {React.createElement(value.icon, {
                        className: "w-7 h-7 text-white",
                        strokeWidth: 1.5,
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row - 2 wider cards, offset */}
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              {coreValues.slice(5, 7).map((value) => (
                <div
                  key={value.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-[#1e1839]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {React.createElement(value.icon, {
                        className: "w-7 h-7 text-white",
                        strokeWidth: 1.5,
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAMENVATTING - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Alles Komt Samen
              </h2>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
              <p className="text-white/90 text-lg md:text-xl leading-relaxed text-center">
                Bij Evotion staan waarheid, verantwoordelijkheid en duurzaamheid centraal. Wij kiezen voor een aanpak die mensen sterker en zelfstandiger maakt, zonder snelle oplossingen of loze beloftes. Alles wat we doen is gericht op blijvende gezondheid, rust en consistentie, zodat jouw evolution in motion komt op een manier die past bij wie je bent en hoe je leeft.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">7</div>
                <div className="text-white/60 text-sm">Kernwaarden</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-white/60 text-sm">Eerlijkheid</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">0</div>
                <div className="text-white/60 text-sm">Loze beloftes</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">1</div>
                <div className="text-white/60 text-sm">Jouw pad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
                Ervaar Onze Aanpak
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Ontdek hoe onze kernwaarden jouw transformatie ondersteunen
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
