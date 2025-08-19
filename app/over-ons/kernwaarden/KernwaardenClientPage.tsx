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
  Quote,
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
      subtitle: "De basis van alle groei",
      description:
        "Groei begint bij bewustwording – weten wie je bent, wat je beweegt en hoe je keuzes invloed hebben op jouw leven en dat van anderen.",
      details: "Door reflectie en eerlijk inzicht in jezelf ontstaat ruimte voor authentieke ontwikkeling.",
      impact: "Leidt tot dieper begrip, openheid en verbinding – essentieel voor duurzame verandering.",
      quote: "Zelfkennis is de sleutel tot transformatie",
    },
    {
      icon: Target,
      title: "Verantwoordelijkheid en Eigenaarschap",
      subtitle: "Neem de regie over je leven",
      description:
        "Echte transformatie begint wanneer je verantwoordelijkheid neemt voor je eigen keuzes en resultaten.",
      details: "Eigenaarschap betekent: zelf je koers bepalen, doelgericht handelen en trouw blijven aan je intenties.",
      impact: "Stimuleert toewijding, kracht en een gevoel van autonomie.",
      quote: "Jij bent de architect van je eigen succes",
    },
    {
      icon: HandHeart,
      title: "Dienstbaarheid",
      subtitle: "Samen sterker worden",
      description:
        "Elke interactie is een kans om te helpen. Vanuit oprechte betrokkenheid staan we klaar om anderen te ondersteunen.",
      details: "Door echt te luisteren en af te stemmen op individuele doelen, ontstaat begeleiding die ertoe doet.",
      impact: "Creëert diepe verbinding en blijvende impact – mensen voelen zich gezien, gehoord en geholpen.",
      quote: "Echte kracht ligt in het helpen van anderen",
    },
    {
      icon: Lightbulb,
      title: "Continue Ontwikkeling en Innovatie",
      subtitle: "Altijd in beweging blijven",
      description:
        "Groei stopt nooit. Door te blijven leren en vernieuwen ontstaat vooruitgang, zowel fysiek als mentaal.",
      details: "Kennis, tools en methodes worden voortdurend aangescherpt om jou zo goed mogelijk te ondersteunen.",
      impact: "Houdt trajecten fris, inspirerend en effectief – altijd in beweging, net als jij.",
      quote: "Stilstand is achteruitgang",
    },
    {
      icon: MessageSquare,
      title: "Transparantie en Eerlijkheid",
      subtitle: "Helderheid in alles wat we doen",
      description: "Helderheid in communicatie en intentie is de basis van vertrouwen.",
      details: "We zijn open over wat we doen, waarom we het doen en wat je kunt verwachten.",
      impact: "Maakt relaties betrouwbaar en veilig – essentieel voor langdurige samenwerking en persoonlijke groei.",
      quote: "Eerlijkheid bouwt bruggen",
    },
    {
      icon: UserCheck,
      title: "Empathie en Respect voor Individuele Groei",
      subtitle: "Jouw unieke pad respecteren",
      description: "Ieder mens bewandelt zijn eigen pad. Er is geen one-size-fits-all.",
      details: "We stemmen af op de unieke behoeften, ritmes en uitdagingen van ieder individu.",
      impact:
        "Zorgt voor een omgeving waarin mensen zich gerespecteerd en gesteund voelen – ongeacht waar ze staan in hun reis.",
      quote: "Diversiteit is onze kracht",
    },
    {
      icon: Activity,
      title: "Gezondheid en Welzijn",
      subtitle: "Balans in lichaam en geest",
      description: "Gezondheid draait om balans – fysiek, mentaal én emotioneel.",
      details: "Evotion integreert training, voeding, mindset en herstel in één allesomvattende aanpak.",
      impact:
        "Versterkt niet alleen het lichaam, maar ook het leven. Gezondheid wordt een levensstijl, geen tijdelijke fase.",
      quote: "Een gezond lichaam herbergt een gezonde geest",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-white text-[#1e1839] px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm border border-gray-200">
              <Star className="w-4 h-4" />
              Onze Kern. Jouw Groei.
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Kernwaarden</h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Deze waarden vormen de basis van onze coaching filosofie en bepalen hoe we jou begeleiden in jouw
              transformatie naar een sterker, vrijer en gezonder leven.
            </p>
            <div className="bg-gradient-to-r from-[#1e1839] to-[#bad4e1] bg-clip-text text-transparent text-base md:text-lg font-semibold">
              "It is time to bring your evolution in motion"
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div
            ref={valuesAnimation.ref}
            className={`animate-on-scroll ${valuesAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {/* Desktop: 2 columns, Mobile: 1 column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group h-full"
                >
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a2147] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                      {React.createElement(value.icon, {
                        className: "w-8 h-8 text-white",
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-2 leading-tight">{value.title}</h3>
                      <p className="text-base md:text-lg text-[#bad4e1] font-medium">{value.subtitle}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Main Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#1e1839] uppercase tracking-wide mb-3">Essentie</h4>
                      <p className="text-gray-700 leading-relaxed text-base">{value.description}</p>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#1e1839] uppercase tracking-wide mb-3">Toepassing</h4>
                      <p className="text-gray-600 leading-relaxed text-base">{value.details}</p>
                    </div>

                    {/* Impact */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#1e1839] uppercase tracking-wide mb-3">Impact</h4>
                      <p className="text-gray-600 leading-relaxed text-base">{value.impact}</p>
                    </div>

                    {/* Quote */}
                    <div className="bg-gradient-to-r from-[#bad4e1]/10 to-[#1e1839]/5 rounded-xl p-4 border border-[#bad4e1]/20">
                      <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-[#1e1839] flex-shrink-0 mt-0.5" />
                        <p className="text-[#1e1839] italic font-medium text-base">{value.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-4">Onze Kernwaarden in Cijfers</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Deze waarden zijn niet alleen woorden, maar vormen de basis van alles wat we doen
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-[#1e1839] mb-2">7</div>
              <div className="text-sm text-gray-600 font-medium">Kernwaarden</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-[#1e1839] mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">Transparantie</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-[#1e1839] mb-2">∞</div>
              <div className="text-sm text-gray-600 font-medium">Groei Mogelijkheden</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-[#1e1839] mb-2">1</div>
              <div className="text-sm text-gray-600 font-medium">Jouw Unieke Pad</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center">
          <div
            ref={ctaAnimation.ref}
            className={`bg-gradient-to-r from-primary to-secondary rounded-2xl md:rounded-3xl p-8 md:p-12 text-white animate-on-scroll-scale ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Ervaar onze kernwaarden in actie</h3>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Ontdek hoe onze waarden jouw transformatie kunnen ondersteunen. Laten we samen werken aan een sterker,
              vrijer en gezonder leven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4" asChild>
                <Link href="/#contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-secondary/20 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-semibold px-8 py-4 transition-all duration-300"
                asChild
              >
                <Link href="/over-ons/visie-missie">Lees Onze Visie & Missie</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
