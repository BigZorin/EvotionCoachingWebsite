"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Star,
  Users,
  Trophy,
  Heart,
  Target,
  Smartphone,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EvotionBrandClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: "500+", label: "Tevreden Klanten", icon: Users },
    { number: "2000+", label: "Transformaties", icon: Trophy },
    { number: "4.9/5", label: "Gemiddelde Review", icon: Star },
    { number: "95%", label: "Succesvol Resultaat", icon: Target },
  ]

  const evotionValues = [
    {
      title: "Evolutie",
      description: "Voortdurende groei en ontwikkeling in alles wat we doen",
      icon: TrendingUp,
    },
    {
      title: "Devotie",
      description: "Volledige toewijding aan jouw succes en transformatie",
      icon: Heart,
    },
    {
      title: "Innovatie",
      description: "Cutting-edge methodes en technologie voor optimale resultaten",
      icon: Smartphone,
    },
    {
      title: "Integriteit",
      description: "Eerlijkheid en transparantie in al onze coaching relaties",
      icon: Shield,
    },
  ]

  const uniquePoints = [
    "Unieke Evotion App met AI-gestuurde coaching",
    "Bewezen Evotion Methode voor duurzame resultaten",
    "24/7 toegang tot je persoonlijke Evotion coach",
    "Exclusieve Evotion Community van gelijkgestemden",
    "Wetenschappelijk onderbouwde Evotion programma's",
    "Gepersonaliseerde Evotion voedingsschema's",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-blue-900/5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-lg">
              #1 Fitness Brand Nederland
            </Badge>
            <h1
              className={`text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              EVOTION
            </h1>
            <div className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              <span className="text-purple-600">Evolutie</span> + <span className="text-blue-600">Devotie</span> ={" "}
              <span className="text-gray-900">Transformatie</span>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Ontdek waarom <strong>Evotion</strong> de toonaangevende fitness en coaching brand van Nederland is. Van
              revolutionaire <strong>Evotion app</strong> tot bewezen <strong>Evotion methodes</strong> - wij
              transformeren levens door evolutie en devotie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  Start Je Evotion Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/over-ons/coaches">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg bg-transparent"
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
                className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-purple-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is Evotion Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Wat is <span className="text-purple-600">Evotion</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evotion is meer dan een fitness brand - het is een filosofie, een beweging, een manier van leven.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">De Evotion Filosofie</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <strong>Evotion</strong> ontstond uit de combinatie van twee krachtige concepten:
                <span className="text-purple-600 font-semibold"> Evolutie</span> en
                <span className="text-blue-600 font-semibold"> Devotie</span>.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Wij geloven dat echte transformatie ontstaat wanneer je jezelf continu ontwikkelt (evolutie) met
                volledige toewijding (devotie). Deze <strong>Evotion mindset</strong> vormt de basis van al onze
                coaching programma's en de unieke <strong>Evotion app</strong>.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sinds 2020 hebben we meer dan 500 mensen geholpen hun droomlichaam te bereiken met de bewezen{" "}
                <strong>Evotion methode</strong>. Van <strong>Evotion fitness</strong> programma's tot persoonlijke{" "}
                <strong>Evotion coaching</strong> - wij maken het verschil.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/evotion-logo.png"
                alt="Evotion Brand Logo"
                width={500}
                height={300}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Evotion Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {evotionValues.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-blue-50"
              >
                <CardContent className="p-0">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Evotion */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Waarom Kiezen Voor <span className="text-purple-600">Evotion</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek wat Evotion uniek maakt in de Nederlandse fitness en coaching wereld.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {uniquePoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* Evotion App Showcase */}
          <Card className="p-8 bg-white shadow-xl border-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">Exclusief</Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">De Evotion App</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Onze revolutionaire <strong>Evotion app</strong> combineert AI-technologie met persoonlijke coaching.
                  Krijg toegang tot:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Gepersonaliseerde Evotion trainingsschema's</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>AI-gestuurde Evotion voedingsadvies</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>24/7 chat met je Evotion coach</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Exclusieve Evotion community</span>
                  </li>
                </ul>
                <Link href="/over-ons/evotion-app">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Ontdek De Evotion App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/images/app-screenshots/evotion-dashboard.jpg"
                  alt="Evotion App Dashboard"
                  width={400}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Evotion Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Evotion</span> Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek alle Evotion coaching programma's en vind de perfecte match voor jouw doelen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Evotion Personal Training",
                description: "1-op-1 Evotion coaching voor maximale resultaten",
                price: "€70/sessie",
                link: "/personal-training",
                features: ["Persoonlijke Evotion trainer", "Evotion app toegang", "Voedingsschema"],
              },
              {
                title: "Evotion Online Coaching",
                description: "Flexibele Evotion begeleiding via onze app",
                price: "€97/maand",
                link: "/online-coaching",
                features: ["Evotion app premium", "24/7 coach contact", "Wekelijkse check-ins"],
              },
              {
                title: "Evotion Premium",
                description: "Combinatie van personal training en online coaching",
                price: "€147/maand",
                link: "/premium-coaching",
                features: ["Alles van Online", "2x/week PT sessies", "VIP support"],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50"
              >
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-purple-600 mb-4">{service.price}</div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={service.link}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Meer Info
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Evotion</span> Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Echte mensen, echte Evotion transformaties, echte resultaten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Martin",
                result: "-10.7kg in 11 weken",
                image: "/images/martin-transformation-professional.png",
                quote: "De Evotion methode heeft mijn leven veranderd!",
              },
              {
                name: "Salim",
                result: "-8.1kg in 26 weken",
                image: "/images/salim-transformation-professional.png",
                quote: "Evotion coaching gaf me de tools voor succes.",
              },
              {
                name: "Wouter",
                result: "-2.1kg body recomp",
                image: "/images/wouter-transformation-professional.png",
                quote: "De Evotion app maakte het verschil.",
              },
            ].map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                <div className="relative h-64">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={`${story.name} Evotion transformatie`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                  <div className="text-lg font-semibold text-purple-600 mb-3">{story.result}</div>
                  <p className="text-gray-600 italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/resultaten">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4"
              >
                Bekijk Alle Evotion Transformaties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar Voor Jouw <span className="text-yellow-300">Evotion</span> Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij de Evotion community en start vandaag nog je transformatie. Evolutie en devotie wachten op
            jou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Start Nu Met Evotion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/gratis/caloriebehoefte">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Gratis Evotion Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
