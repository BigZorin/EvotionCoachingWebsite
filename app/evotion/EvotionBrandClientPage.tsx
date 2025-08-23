"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Users, Trophy, CheckCircle, ArrowRight, MapPin, Award } from "lucide-react"
import Link from "next/link"

export default function EvotionBrandClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: "500+", label: "Tevreden Klanten", icon: Users },
    { number: "2000+", label: "Transformaties", icon: Trophy },
    { number: "4.9/5", label: "Gemiddelde Review", icon: Star },
    { number: "95%", label: "Succesvol Vetverlies" },
  ]

  const uniquePoints = [
    "Unieke Evotion App met AI-gestuurde vetverlies coaching",
    "Bewezen Evotion Methode voor duurzaam afvallen",
    "24/7 toegang tot je persoonlijke Evotion coach",
    "Exclusieve Evotion Community van gelijkgestemden",
    "Wetenschappelijk onderbouwde Evotion programma's voor vet verliezen",
    "Gepersonaliseerde Evotion voedingsschema's voor vetverlies",
  ]

  const locationHighlights = [
    "Personal Training Sneek - Professionele begeleiding",
    "Fitness Coach Friesland - Regionale expertise",
    "Online Coaching Nederland - Flexibele begeleiding",
    "12 Weken Vetverlies Programma - Bewezen resultaten",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-[#1e1839] text-white px-6 py-2 text-lg">#1 Fitness Brand Friesland</Badge>
            <h1
              className={`text-5xl md:text-6xl font-bold mb-8 text-[#1e1839] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              EVOTION
            </h1>
            <div className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              <span className="text-[#1e1839]">Evolution</span> + <span className="text-[#1e1839]">Motion</span> ={" "}
              <span className="text-gray-900">Evotion</span>
            </div>
            <p className="text-xl text-[#1e1839] font-semibold mb-8">It is time to bring your evolution in motion</p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Ontdek waarom <strong>Evotion</strong> de toonaangevende fitness en coaching brand van Nederland is. Van
              revolutionaire <strong>Evotion app</strong> tot bewezen <strong>Evotion methodes voor vetverlies</strong>{" "}
              - wij transformeren levens door evolution en motion.
            </p>

            <div className="flex items-center justify-center gap-6 mb-12 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#1e1839]" />
                <span className="font-medium">Personal Training Sneek</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#1e1839]" />
                <span className="font-medium">Fitness Coach Friesland</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-[#1e1839] hover:bg-[#2a2147] text-white px-8 py-4 text-lg">
                  Start Je Evotion Vetverlies Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/over-ons/coaches">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#bad4e1] px-8 py-4 text-lg bg-transparent"
                >
                  Ontmoet De Evotion Coaches
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white"
              >
                <CardContent className="p-0">
                  {stat.icon && <stat.icon className="h-8 w-8 mx-auto mb-4 text-[#1e1839]" />}
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is Evotion Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Wat is <span className="text-[#1e1839]">Evotion</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evotion is meer dan een fitness brand - het is een filosofie voor vetverlies, een beweging voor
              transformatie, een manier van leven.
            </p>
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">De Evotion Filosofie voor Vetverlies</h3>
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                <strong>Evotion</strong> ontstond uit de combinatie van twee krachtige concepten:
                <span className="text-[#1e1839] font-semibold"> Evolution</span> en
                <span className="text-[#1e1839] font-semibold"> Motion</span>.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Wij geloven dat echte <strong>vetverlies transformatie</strong> ontstaat wanneer je jezelf continu
                ontwikkelt (evolution) en deze ontwikkeling in beweging brengt (motion). Deze{" "}
                <strong>Evotion mindset</strong> vormt de basis van al onze coaching programma's en de unieke{" "}
                <strong>Evotion app voor afvallen</strong>.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                <strong>It is time to bring your evolution in motion</strong> - dit is onze kernboodschap. Sinds 2020
                hebben we meer dan 500 mensen geholpen hun droomlichaam te bereiken met de bewezen{" "}
                <strong>Evotion methode voor vet verliezen</strong>. Van <strong>personal training Sneek</strong> tot{" "}
                <strong>online coaching</strong> - wij maken het verschil in jouw vetverlies journey.
              </p>
            </div>
          </div>

          {/* Location Highlights */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Evotion in Friesland</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locationHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#1e1839] mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evotion Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Evolution</h4>
                <p className="text-gray-600">Voortdurende groei en ontwikkeling in alles wat we doen</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Motion</h4>
                <p className="text-gray-600">Je ontwikkeling in beweging brengen voor echte verandering</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Innovatie</h4>
                <p className="text-gray-600">Cutting-edge methodes en technologie voor optimaal afvallen</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Integriteit</h4>
                <p className="text-gray-600">Eerlijkheid en transparantie in al onze coaching relaties</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Evotion */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Waarom Kiezen Voor <span className="text-[#1e1839]">Evotion</span> Vetverlies?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek wat Evotion uniek maakt in de Nederlandse fitness en vetverlies coaching wereld.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {uniquePoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* Evotion App Showcase */}
          <Card className="p-8 bg-gray-50 border border-gray-200">
            <div className="text-center">
              <Badge className="mb-4 bg-[#1e1839] text-white">Exclusief</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">De Evotion App voor Vetverlies</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                Onze revolutionaire <strong>Evotion app</strong> combineert AI-technologie met persoonlijke vetverlies
                coaching. Krijg toegang tot:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Gepersonaliseerde Evotion trainingsschema's voor afvallen</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>AI-gestuurde Evotion voedingsadvies voor vetverlies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>24/7 chat met je Evotion vetverlies coach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Exclusieve Evotion community voor afvallen</span>
                </div>
              </div>
              <Link href="/over-ons/evotion-app">
                <Button className="bg-[#1e1839] hover:bg-[#2a2147] text-white">
                  Ontdek De Evotion App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Evotion Services */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-[#1e1839]">Evotion</span> Vetverlies Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek alle Evotion coaching programma's voor vetverlies en vind de perfecte match voor jouw afval doelen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Evotion Personal Training Sneek</h3>
                <p className="text-gray-600 mb-4">1-op-1 Evotion coaching voor maximaal vetverlies</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Persoonlijke Evotion trainer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Evotion app toegang</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Vetverlies voedingsschema</span>
                  </li>
                </ul>
                <Link href="/personal-training">
                  <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Evotion Online Coaching</h3>
                <p className="text-gray-600 mb-4">Flexibele Evotion begeleiding voor online vetverliezen</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Evotion app premium</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">24/7 coach contact</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Wekelijkse vetverlies check-ins</span>
                  </li>
                </ul>
                <Link href="/online-coaching">
                  <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Evotion 12 Weken Vetverlies</h3>
                <p className="text-gray-600 mb-4">Intensief programma voor maximaal vet verliezen</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Alles van Online</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">2x/week PT sessies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">VIP vetverlies support</span>
                  </li>
                </ul>
                <Link href="/12-weken-vetverlies">
                  <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-[#1e1839]">Evotion</span> Vetverlies Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Echte mensen, echte Evotion vetverlies transformaties, echte afval resultaten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Martin</h3>
                <div className="text-lg font-semibold text-[#1e1839] mb-3">-10.7kg vetverlies in 11 weken</div>
                <p className="text-gray-600 italic">"De Evotion methode voor afvallen heeft mijn leven veranderd!"</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Salim</h3>
                <div className="text-lg font-semibold text-[#1e1839] mb-3">-8.1kg vet verliezen in 26 weken</div>
                <p className="text-gray-600 italic">"Evotion coaching gaf me de tools voor succesvol vetverlies."</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wouter</h3>
                <div className="text-lg font-semibold text-[#1e1839] mb-3">-2.1kg body recomp vetverlies</div>
                <p className="text-gray-600 italic">"De Evotion app maakte het verschil in mijn afval journey."</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/resultaten">
              <Button size="lg" className="bg-[#1e1839] hover:bg-[#2a2147] text-white px-8 py-4">
                Bekijk Alle Evotion Vetverlies Transformaties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ontmoet De <span className="text-[#1e1839]">Evotion</span> Coaches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leer kennen wie jou gaat begeleiden in jouw vetverlies journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Martin Langenberg</h3>
                <p className="text-[#1e1839] font-semibold mb-4">Personal Training Sneek & Fitness Coach Friesland</p>
                <p className="text-gray-600 mb-6">
                  Specialist in vetverlies coaching en body transformations. Martin helpt je met bewezen methodes voor
                  afvallen en heeft al meer dan 200 mensen geholpen met succesvol vet verliezen.
                </p>
                <Link href="/over-ons/coaches/martin">
                  <Button
                    variant="outline"
                    className="border-[#1e1839] text-[#1e1839] hover:bg-[#bad4e1] bg-transparent"
                  >
                    Leer Martin Kennen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Zorin Wijnands</h3>
                <p className="text-[#1e1839] font-semibold mb-4">Powerlifting Coach & Online Coaching</p>
                <p className="text-gray-600 mb-6">
                  Expert in krachttraining en body recomposition. Zorin combineert spieropbouw met effectief vet
                  verliezen en heeft meer dan 300 online coaching klanten begeleid.
                </p>
                <Link href="/over-ons/coaches/zorin">
                  <Button
                    variant="outline"
                    className="border-[#1e1839] text-[#1e1839] hover:bg-[#bad4e1] bg-transparent"
                  >
                    Leer Zorin Kennen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#1e1839] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar Voor Jouw <span className="text-[#bad4e1]">Evotion</span> Vetverlies Journey?
          </h2>
          <p className="text-xl mb-4 opacity-90">
            <strong>It is time to bring your evolution in motion</strong>
          </p>
          <p className="text-lg mb-8 opacity-90">
            Sluit je aan bij de Evotion community en start vandaag nog je vetverlies transformatie. Van personal
            training Sneek tot online coaching - evolution en motion wachten op jou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-[#1e1839] hover:bg-[#bad4e1] px-8 py-4 text-lg font-semibold">
                Start Nu Met Evotion Vetverlies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/gratis/caloriebehoefte">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-8 py-4 text-lg bg-transparent"
              >
                Gratis Evotion Vetverlies Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
