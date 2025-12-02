"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Users, CheckCircle, ArrowRight, MapPin, Award, HelpCircle, Smartphone, Dumbbell } from "lucide-react"
import Link from "next/link"

export default function EvotionBrandClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: "5.0", label: "Google Review Score", icon: Star },
    { number: "100%", label: "Persoonlijke Aandacht", icon: Users },
    { number: "3", label: "Coaching Opties", icon: Dumbbell },
    { number: "1", label: "Unieke App", icon: Smartphone },
  ]

  const uniquePoints = [
    "Unieke Evotion App met persoonlijke coaching",
    "Modulair 5-fasen programma voor duurzame resultaten",
    "Directe toegang tot je persoonlijke Evotion coach",
    "Exclusieve Evotion Community",
    "Wetenschappelijk onderbouwde trainings- en voedingsschema's",
    "Flexibele trajecten van 6 tot 12 maanden",
  ]

  const locationHighlights = [
    "Personal Training Sneek - 1-op-1 begeleiding",
    "Duo Training - Samen trainen, samen groeien",
    "Online Coaching - Flexibel door heel Nederland",
    "Evotion App - 24/7 toegang tot je programma",
  ]

  const faqs = [
    {
      question: "Wat is Evotion?",
      answer:
        "Evotion is een fitness en coaching brand uit Sneek, Friesland. De naam ontstond uit de combinatie van Evolution en Motion. Wij helpen mensen hun fitnessdoelen te bereiken door middel van persoonlijke coaching, een unieke app en het modulaire 5-fasen programma.",
    },
    {
      question: "Wat maakt Evotion uniek?",
      answer:
        "Evotion combineert persoonlijke coaching met een eigen app. We bieden directe toegang tot je coach, gepersonaliseerde trainingsschema's, voedingsbegeleiding en een exclusieve community. Ons modulaire programma met 5 fases zorgt voor duurzame resultaten.",
    },
    {
      question: "Waar is Evotion gevestigd?",
      answer:
        "Evotion biedt Personal Training en Duo Training in Sneek, Friesland. Daarnaast bieden we Online Coaching aan door heel Nederland via de Evotion app.",
    },
    {
      question: "Welke services biedt Evotion aan?",
      answer:
        "Evotion biedt drie hoofdservices: Personal Training met 1-op-1 begeleiding in Sneek, Duo Training om samen met een partner te trainen, en Online Coaching met trajecten van 6 of 12 maanden inclusief volledige app toegang.",
    },
    {
      question: "Hoe werkt het modulaire programma?",
      answer:
        "Ons programma bestaat uit 5 fases: Fundament (gewoontes en mindset), Voeding (macro's en maaltijdplanning), Training (gepersonaliseerde schema's), Optimalisatie (verfijning en aanpassing) en Lifestyle (duurzame integratie). Elke fase bouwt voort op de vorige.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <Badge className="mb-8 bg-[#1e1839] text-white px-8 py-3 text-lg">Fitness & Coaching Sneek</Badge>
              <h1
                className={`text-5xl md:text-7xl font-bold mb-10 text-[#1e1839] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                EVOTION
              </h1>
              <div className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
                <span className="text-[#1e1839]">Evolution</span> + <span className="text-[#1e1839]">Motion</span> ={" "}
                <span className="text-gray-900">Evotion</span>
              </div>
              <p className="text-xl text-[#1e1839] font-semibold mb-10 leading-relaxed">
                It is time to bring your evolution in motion
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-loose">
                Ontdek <strong>Evotion</strong> - dé fitness en coaching brand uit Sneek. Van onze revolutionaire{" "}
                <strong>Evotion app</strong> tot het bewezen <strong>modulaire 5-fasen programma</strong> - wij helpen
                jou je fitnessdoelen bereiken.
              </p>

              <div className="flex items-center justify-center gap-8 mb-14 text-gray-600 flex-wrap">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#1e1839]" />
                  <span className="font-medium text-base">Personal Training Sneek</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#1e1839]" />
                  <span className="font-medium text-base">Fitness Coach Friesland</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-[#1e1839] hover:bg-[#2a2147] text-white px-10 py-6 text-lg">
                    Start Je Evotion Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/over-ons/coaches">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839] hover:text-white px-10 py-6 text-lg bg-transparent"
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
                  className="text-center p-8 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white"
                >
                  <CardContent className="p-0">
                    {stat.icon && <stat.icon className="h-10 w-10 mx-auto mb-5 text-[#1e1839]" />}
                    <div className="text-4xl font-bold text-gray-900 mb-3">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What is Evotion Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Wat is <span className="text-[#1e1839]">Evotion</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Evotion is meer dan een fitness brand - het is een filosofie, een beweging voor transformatie, een
                manier van leven.
              </p>
            </div>

            <div className="mb-24 bg-gray-50 p-12 md:p-16 rounded-2xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">De Evotion Filosofie</h3>
              <div className="max-w-3xl mx-auto space-y-8">
                <p className="text-lg text-gray-600 leading-loose">
                  <strong>Evotion</strong> ontstond uit de combinatie van twee krachtige concepten:
                  <span className="text-[#1e1839] font-semibold"> Evolution</span> en
                  <span className="text-[#1e1839] font-semibold"> Motion</span>.
                </p>
                <p className="text-lg text-gray-600 leading-loose">
                  Wij geloven dat echte <strong>transformatie</strong> ontstaat wanneer je jezelf continu ontwikkelt
                  (evolution) en deze ontwikkeling in beweging brengt (motion). Deze <strong>Evotion mindset</strong>{" "}
                  vormt de basis van al onze coaching programma's en de unieke <strong>Evotion app</strong>.
                </p>
                <p className="text-lg text-gray-600 leading-loose">
                  <strong>It is time to bring your evolution in motion</strong> - dit is onze kernboodschap. Vanuit
                  Sneek, Friesland helpen we mensen hun droomlichaam te bereiken met het bewezen{" "}
                  <strong>modulaire 5-fasen programma</strong>. Van <strong>personal training</strong> tot{" "}
                  <strong>online coaching</strong> - wij maken het verschil in jouw fitness journey.
                </p>
              </div>
            </div>

            {/* Location Highlights */}
            <div className="mb-24">
              <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Evotion Services</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {locationHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-100 hover:border-[#1e1839] rounded-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-6 w-6 text-[#1e1839] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evotion Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Evolution</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Voortdurende groei en ontwikkeling in alles wat we doen
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Motion</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Je ontwikkeling in beweging brengen voor echte verandering
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Innovatie</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Cutting-edge methodes en technologie via de Evotion app
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Integriteit</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Eerlijkheid en transparantie in al onze coaching relaties
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Evotion */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Waarom Kiezen Voor <span className="text-[#1e1839]">Evotion</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ontdek wat Evotion uniek maakt in de Nederlandse fitness en coaching wereld.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {uniquePoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-8 bg-white rounded-xl border-2 border-gray-100 hover:border-[#1e1839] transition-all duration-300"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-medium leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            {/* Evotion App Showcase */}
            <Card className="p-12 bg-white border-2 border-gray-100 hover:border-[#1e1839] transition-all duration-300">
              <div className="text-center">
                <Badge className="mb-6 bg-[#1e1839] text-white px-6 py-2 text-base">Exclusief</Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">De Evotion App</h3>
                <p className="text-lg text-gray-600 mb-10 leading-loose max-w-2xl mx-auto">
                  Onze <strong>Evotion app</strong> combineert technologie met persoonlijke coaching. Krijg toegang tot:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-3 text-left">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="leading-relaxed">Gepersonaliseerde Evotion trainingsschema's</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="leading-relaxed">Evotion voedingsbegeleiding op maat</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="leading-relaxed">Direct contact met je Evotion coach</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="leading-relaxed">Exclusieve Evotion community</span>
                  </div>
                </div>
                <Link href="/over-ons/evotion-app">
                  <Button size="lg" className="bg-[#1e1839] hover:bg-[#2a2147] text-white px-8 py-4">
                    Ontdek De Evotion App
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Evotion Services - CHANGED: Removed 12 weken, added Duo Training */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                <span className="text-[#1e1839]">Evotion</span> Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ontdek alle Evotion coaching programma's en vind de perfecte match voor jouw doelen.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">Evotion Personal Training</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">1-op-1 Evotion coaching in Sneek</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Persoonlijke Evotion trainer</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Evotion app toegang</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Voedingsschema op maat</span>
                    </li>
                  </ul>
                  <Link href="/personal-training">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">Evotion Duo Training</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Samen trainen, samen groeien</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Train met een partner</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Evotion app voor beiden</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Extra motivatie en support</span>
                    </li>
                  </ul>
                  <Link href="/duo-training">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">Evotion Online Coaching</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Flexibele Evotion begeleiding online</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Evotion app premium</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Direct coach contact</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">Wekelijkse check-ins</span>
                    </li>
                  </ul>
                  <Link href="/online-coaching">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#2a2147] text-white">Meer Info</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Modulair Programma Section - NEW */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Het <span className="text-[#1e1839]">Evotion</span> Modulaire Programma
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ons bewezen 5-fasen programma voor duurzame resultaten.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {[
                { fase: "1", title: "Fundament", desc: "Gewoontes & Mindset" },
                { fase: "2", title: "Voeding", desc: "Macro's & Planning" },
                { fase: "3", title: "Training", desc: "Gepersonaliseerde Schema's" },
                { fase: "4", title: "Optimalisatie", desc: "Verfijning & Aanpassing" },
                { fase: "5", title: "Lifestyle", desc: "Duurzame Integratie" },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white"
                >
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-[#1e1839] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {item.fase}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coaches Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Ontmoet De <span className="text-[#1e1839]">Evotion</span> Coaches
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Leer kennen wie jou gaat begeleiden in jouw fitness journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <Card className="p-10 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Martin Langenberg</h3>
                  <p className="text-[#1e1839] font-semibold mb-6 leading-relaxed">Head Coach & Online Coaching</p>
                  <p className="text-gray-600 mb-8 leading-loose">
                    Specialist in online coaching en body transformations. Martin begeleidt je via de Evotion app met
                    het modulaire 5-fasen programma naar duurzame resultaten.
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

              <Card className="p-10 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white">
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Zorin Wijnands</h3>
                  <p className="text-[#1e1839] font-semibold mb-6 leading-relaxed">
                    Personal Training & Duo Training Sneek
                  </p>
                  <p className="text-gray-600 mb-8 leading-loose">
                    Expert in krachttraining en personal training. Zorin begeleidt je in de gym met 1-op-1 of duo
                    sessies voor maximale resultaten.
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

        {/* FAQ Section */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <HelpCircle className="h-14 w-14 mx-auto mb-6 text-[#1e1839]" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Veelgestelde Vragen Over <span className="text-[#1e1839]">Evotion</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Alles wat je wilt weten over Evotion coaching.
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="p-8 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#1e1839] bg-white"
                >
                  <CardContent className="p-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                    <p className="text-gray-600 leading-loose">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">Heb je nog meer vragen over Evotion?</p>
              <Link href="/contact">
                <Button size="lg" className="bg-[#1e1839] hover:bg-[#2a2147] text-white px-10 py-6">
                  Neem Contact Op
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-[#1e1839] text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Klaar Voor Jouw <span className="text-[#bad4e1]">Evotion</span> Journey?
            </h2>
            <p className="text-xl mb-6 opacity-90 leading-relaxed">
              <strong>It is time to bring your evolution in motion</strong>
            </p>
            <p className="text-lg mb-12 opacity-90 leading-loose max-w-3xl mx-auto">
              Sluit je aan bij Evotion en start vandaag nog je transformatie. Van personal training in Sneek tot online
              coaching door heel Nederland - evolution en motion wachten op jou.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-[#1e1839] hover:bg-[#bad4e1] px-10 py-6 text-lg font-semibold"
                >
                  Start Nu Met Evotion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/gratis/caloriebehoefte">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-10 py-6 text-lg bg-transparent"
                >
                  Gratis Evotion Calculator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
