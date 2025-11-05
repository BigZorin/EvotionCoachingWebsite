"use client"

import React from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Star,
  Brain,
  Target,
  HandHeart,
  Lightbulb,
  MessageSquare,
  UserCheck,
  Activity,
  Sparkles,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function KernwaardenClientPage() {
  // Scroll animations
  const heroAnimation = useScrollAnimation({ threshold: 0.2 })
  const valuesAnimation = useScrollAnimation({ threshold: 0.1 })
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 })

  const coreValues = [
    {
      icon: Brain,
      title: "Bewustzijn en Zelfinzicht",
      description:
        "Groei begint bij bewustwording – weten wie je bent, wat je beweegt en hoe je keuzes invloed hebben. Door reflectie en eerlijk inzicht ontstaat ruimte voor authentieke ontwikkeling.",
      quote: "Zelfkennis is de sleutel tot transformatie",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: Target,
      title: "Verantwoordelijkheid en Eigenaarschap",
      description:
        "Echte transformatie begint wanneer je verantwoordelijkheid neemt voor je eigen keuzes en resultaten. Eigenaarschap betekent: zelf je koers bepalen en trouw blijven aan je intenties.",
      quote: "Jij bent de architect van je eigen succes",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: HandHeart,
      title: "Dienstbaarheid",
      description:
        "Elke interactie is een kans om te helpen. Vanuit oprechte betrokkenheid staan we klaar om anderen te ondersteunen. Door echt te luisteren ontstaat begeleiding die ertoe doet.",
      quote: "Echte kracht ligt in het helpen van anderen",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: Lightbulb,
      title: "Continue Ontwikkeling en Innovatie",
      description:
        "Groei stopt nooit. Door te blijven leren en vernieuwen ontstaat vooruitgang. Kennis en methodes worden voortdurend aangescherpt om jou zo goed mogelijk te ondersteunen.",
      quote: "Stilstand is achteruitgang",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: MessageSquare,
      title: "Transparantie en Eerlijkheid",
      description:
        "Helderheid in communicatie en intentie is de basis van vertrouwen. We zijn open over wat we doen, waarom we het doen en wat je kunt verwachten.",
      quote: "Eerlijkheid bouwt bruggen",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: UserCheck,
      title: "Empathie en Respect",
      description:
        "Ieder mens bewandelt zijn eigen pad. Er is geen one-size-fits-all. We stemmen af op de unieke behoeften, ritmes en uitdagingen van ieder individu.",
      quote: "Diversiteit is onze kracht",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
    {
      icon: Activity,
      title: "Gezondheid en Welzijn",
      description:
        "Gezondheid draait om balans – fysiek, mentaal én emotioneel. Evotion integreert training, voeding, mindset en herstel in één allesomvattende aanpak.",
      quote: "Een gezond lichaam herbergt een gezond lichaam",
      gradient: "from-[#1e1839] to-[#2a1f4d]",
      bgGradient: "from-[#1e1839]/5 to-[#2a1f4d]/5",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] py-20 md:py-32 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative z-10">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Sparkles className="w-4 h-4" />
              Onze Kern. Jouw Groei.
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">Kernwaarden</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Deze waarden vormen de basis van onze coaching filosofie en bepalen hoe we jou begeleiden in jouw
              transformatie naar een sterker, vrijer en gezonder leven.
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <p className="text-white font-semibold text-lg italic">"It is time to bring your evolution in motion"</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div
            ref={valuesAnimation.ref}
            className={`space-y-16 md:space-y-24 animate-on-scroll ${valuesAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {coreValues.map((value, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-12 items-center group`}
              >
                {/* Icon side with gradient background */}
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className={`relative`}>
                    {/* Gradient background blob */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                    />

                    {/* Icon container */}
                    <div
                      className={`relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br ${value.gradient} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-500`}
                    >
                      {React.createElement(value.icon, {
                        className: "w-20 h-20 md:w-24 md:h-24 text-white",
                        strokeWidth: 1.5,
                      })}
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{value.description}</p>
                  </div>

                  {/* Quote with gradient accent */}
                  <div
                    className={`bg-gradient-to-r ${value.bgGradient} rounded-2xl p-6 border-l-4 border-gradient-to-b ${value.gradient}`}
                  >
                    <p className="text-gray-900 font-semibold text-lg italic flex items-start gap-3">
                      <Star
                        className={`w-5 h-5 flex-shrink-0 mt-1 bg-gradient-to-br ${value.gradient} bg-clip-text text-transparent`}
                        fill="currentColor"
                      />
                      {value.quote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Waarden in Actie</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Deze waarden zijn niet alleen woorden, maar vormen de basis van alles wat we doen
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group text-center bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold text-white mb-3">7</div>
              <div className="text-sm text-white/90 font-medium">Kernwaarden</div>
            </div>
            <div className="group text-center bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold text-white mb-3">100%</div>
              <div className="text-sm text-white/90 font-medium">Transparantie</div>
            </div>
            <div className="group text-center bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold text-white mb-3">∞</div>
              <div className="text-sm text-white/90 font-medium">Groei Mogelijkheden</div>
            </div>
            <div className="group text-center bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold text-white mb-3">1</div>
              <div className="text-sm text-white/90 font-medium">Jouw Unieke Pad</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative z-10">
          <div
            ref={ctaAnimation.ref}
            className={`text-center animate-on-scroll ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 md:p-16">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Ervaar onze kernwaarden in actie
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Ontdek hoe onze waarden jouw transformatie kunnen ondersteunen. Laten we samen werken aan een sterker,
                vrijer en gezonder leven.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                  className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm font-semibold px-10 py-6 text-lg transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/over-ons/visie-missie">
                    Lees Onze Visie & Missie
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
