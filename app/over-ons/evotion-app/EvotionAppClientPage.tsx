"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useTypewriter } from "@/hooks/use-text-animation"
import {
  Smartphone,
  Star,
  Users,
  Calendar,
  BarChart3,
  Utensils,
  Dumbbell,
  MessageCircle,
  CheckCircle,
  Play,
  Apple,
  Trophy,
  Heart,
  Shield,
  Lock,
  Crown,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

// Custom App Mockup Components - less rounded corners
const AppMockup = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative w-80 h-[640px] mx-auto ${className}`}>
    {/* Phone Frame - reduced border radius */}
    <div className="absolute inset-0 bg-gray-900 rounded-[2rem] p-1 shadow-2xl">
      <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden relative">
        {/* Content - no fake status bar */}
        <div className="h-full">{children}</div>
      </div>
    </div>
  </div>
)

const RealAppScreenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full h-full relative">
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill
      className="object-cover rounded-[1.7rem]"
      sizes="(max-width: 768px) 100vw, 320px"
    />
  </div>
)

export default function EvotionAppClientPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [activeMockup, setActiveMockup] = useState(0)
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.2 })
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.1 })
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation({ threshold: 0.1 })
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 })
  const { ref: downloadRef, isVisible: downloadVisible } = useScrollAnimation({ threshold: 0.2 })

  const titleText = useTypewriter("De Evotion Coaching App", 50)
  const subtitleText = useTypewriter("Jouw personal trainer in je zak", 50)

  const mockupScreens = [
    {
      src: "/images/app-screenshots/evotion-welkom.jpg",
      title: "Welkom & Login",
      description: "Eenvoudige en veilige toegang",
      details: "Veilige inlogfunctionaliteit met biometrische authenticatie en wachtwoord herstel opties.",
    },
    {
      src: "/images/app-screenshots/evotion-dashboard.jpg",
      title: "Dashboard",
      description: "Overzicht & dagelijkse check-in",
      details: "Complete overzicht van je voortgang, dagelijkse check-ins, streak tracking en water intake monitoring.",
    },
    {
      src: "/images/app-screenshots/evotion-workout.jpg",
      title: "Workouts",
      description: "Gepersonaliseerde trainingen",
      details:
        "Gedetailleerde workout programma's met oefening illustraties, sets, reps en RPE tracking voor optimale resultaten.",
    },
    {
      src: "/images/app-screenshots/evotion-voeding.jpg",
      title: "Voeding",
      description: "Macro & calorie tracking",
      details:
        "Uitgebreide voedingslog met macro tracking, calorie monitoring en gedetailleerde voedingsinformatie per maaltijd.",
    },
    {
      src: "/images/app-screenshots/evotion-coach-chat.jpg",
      title: "Coach Chat",
      description: "Directe communicatie",
      details:
        "Rechtstreekse chat met je persoonlijke coach voor vragen, motivatie en begeleiding wanneer je het nodig hebt.",
    },
    {
      src: "/images/app-screenshots/evotion-extra.jpg",
      title: "Extra Features",
      description: "Uitgebreide functionaliteiten",
      details:
        "Toegang tot goals, supplements tracking, cardio monitoring, progress foto's en uitgebreide content library.",
    },
  ]

  const features = [
    {
      icon: Dumbbell,
      title: "Persoonlijke Workouts",
      description: "Op maat gemaakte trainingsschema's aangepast aan jouw doelen en niveau",
      details:
        "Krijg dagelijks nieuwe workouts die perfect aansluiten bij jouw fitnessdoelen. Van beginners tot gevorderden, elke training is persoonlijk voor jou samengesteld.",
    },
    {
      icon: Utensils,
      title: "Voedingsschema's",
      description: "Gepersonaliseerde maaltijdplannen en recepten voor optimale resultaten",
      details:
        "Ontdek heerlijke en gezonde recepten die passen bij jouw lifestyle. Complete voedingsschema's met boodschappenlijsten en prep-tips.",
    },
    {
      icon: BarChart3,
      title: "Voortgang Tracking",
      description: "Volg je progressie met gedetailleerde statistieken en grafieken",
      details:
        "Zie je vooruitgang in real-time met uitgebreide analytics. Track gewicht, metingen, kracht en cardio prestaties.",
    },
    {
      icon: MessageCircle,
      title: "Directe Coaching",
      description: "Chat rechtstreeks met je coach voor support en motivatie",
      details:
        "Krijg persoonlijke begeleiding wanneer je het nodig hebt. Stel vragen, deel je uitdagingen en ontvang motivatie van je coach.",
    },
    {
      icon: Calendar,
      title: "Planning & Schema's",
      description: "Organiseer je trainingen en maaltijden in een overzichtelijke agenda",
      details: "Plan je week vooruit met slimme scheduling. Krijg herinneringen voor trainingen en maaltijden.",
    },
    {
      icon: Trophy,
      title: "Achievements & Goals",
      description: "Behaal doelen en unlock achievements voor extra motivatie",
      details:
        "Stel persoonlijke doelen en vier je successen. Verdien badges en achievements terwijl je vooruitgang boekt.",
    },
  ]

  const appStats = [
    { number: "500+", label: "Actieve Gebruikers", icon: Users },
    { number: "5.0", label: "App Store Rating", icon: Star },
    { number: "10,000+", label: "Workouts Voltooid", icon: Dumbbell },
    { number: "98%", label: "Gebruikerstevredenheid", icon: Heart },
  ]

  const benefits = [
    "24/7 toegang tot je persoonlijke coach",
    "Offline workouts - geen internet nodig",
    "Synchronisatie tussen alle apparaten",
    "Wekelijkse voortgangsrapportages",
    "Exclusieve content en challenges",
    "Integratie met fitness trackers",
    "Persoonlijke notificaties en herinneringen",
    "Veilige en private data opslag",
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Hero Section */}
        <section ref={heroRef} className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div
                className={`space-y-8 transform transition-all duration-1000 ease-out ${
                  heroVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                }`}
              >
                <div className="space-y-6">
                  <Badge
                    variant="secondary"
                    className={`bg-primary/10 text-primary border-primary/20 px-4 py-2 transform transition-all duration-700 ${
                      heroVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                    style={{ transitionDelay: "200ms" }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Exclusief voor Coaching Klanten
                  </Badge>

                  <h1
                    className={`text-4xl lg:text-6xl font-bold text-primary leading-tight transform transition-all duration-1000 ${
                      heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "400ms" }}
                  >
                    {titleText}
                  </h1>

                  <p
                    className={`text-xl lg:text-2xl text-gray-600 leading-relaxed transform transition-all duration-1000 ${
                      heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "600ms" }}
                  >
                    {subtitleText}
                  </p>

                  <p
                    className={`text-lg text-gray-600 leading-relaxed transform transition-all duration-1000 ${
                      heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "800ms" }}
                  >
                    Transformeer je fitness journey met onze geavanceerde coaching app. Krijg toegang tot persoonlijke
                    workouts, voedingsschema's en directe begeleiding van gecertificeerde coaches - allemaal in één app.
                  </p>

                  {/* Access Notice */}
                  <div
                    className={`bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 transform transition-all duration-1000 ${
                      heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "900ms" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-primary mb-3">App Toegang Inbegrepen Bij:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>Online Coaching</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>Premium Coaching</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>12-Weken Vetverlies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>Personal Training Pakketten</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 ${
                    heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "1000ms" }}
                >
                  <Link href="/online-coaching">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                    >
                      <Crown className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Bekijk Coaching Programma's
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 group bg-transparent w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110" />
                    Bekijk Demo
                  </Button>
                </div>

                {/* App Store Info */}
                <div
                  className={`flex flex-col sm:flex-row gap-4 pt-4 transform transition-all duration-1000 ${
                    heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "1200ms" }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Apple className="w-5 h-5" />
                    <span>Beschikbaar op iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform duration-200"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">5.0 sterren</span>
                  </div>
                </div>
              </div>

              <div
                className={`relative transform transition-all duration-1000 ease-out ${
                  heroVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <AppMockup className="transform transition-all duration-500">
                  <RealAppScreenshot
                    src="/images/app-screenshots/evotion-welkom.jpg"
                    alt="Evotion App Welcome Screen"
                  />
                </AppMockup>

                {/* Floating Elements */}
                <div
                  className={`absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-1000 z-20 ${
                    heroVisible ? "translate-y-0 opacity-100 animate-bounce" : "-translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: "1400ms" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live Coaching</span>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-1000 z-20 ${
                    heroVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: "1600ms" }}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">Doel Behaald!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {appStats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-700 ${
                    statsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Screens Showcase */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6">Ontdek de App</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bekijk hoe de Evotion Coaching App jou helpt bij elke stap van je fitness journey
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Mockup Selector */}
              <div className="space-y-6">
                {mockupScreens.map((screen, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${
                      activeMockup === index
                        ? "ring-2 ring-primary shadow-xl scale-105"
                        : "hover:ring-1 hover:ring-primary/50"
                    }`}
                    onClick={() => setActiveMockup(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            activeMockup === index ? "bg-primary text-white scale-110" : ""
                          }`}
                        >
                          <Smartphone className={`w-6 h-6 ${activeMockup === index ? "text-white" : "text-primary"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-primary mb-2">{screen.title}</h3>
                          <p className="text-gray-600 mb-3">{screen.description}</p>
                          {activeMockup === index && (
                            <p className="text-sm text-gray-500 leading-relaxed animate-fadeIn">{screen.details}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Active Mockup */}
              <div className="relative">
                <AppMockup className="transform transition-all duration-500">
                  <RealAppScreenshot src={mockupScreens[activeMockup].src} alt={mockupScreens[activeMockup].title} />
                </AppMockup>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6">Alles wat je nodig hebt</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ontdek de krachtige features die jouw fitness journey naar het volgende niveau tillen
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${
                    featuresVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 ${
                benefitsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6">Waarom kiezen voor onze app?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ontdek alle voordelen die onze app jou biedt voor een succesvolle fitness journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 transform ${
                    benefitsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coaching Programs CTA Section */}
        <section ref={downloadRef} className="py-20 bg-gradient-to-br from-primary to-secondary">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="text-center text-white">
              <div
                className={`transform transition-all duration-700 ${
                  downloadVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <h2 className="text-3xl lg:text-5xl font-bold mb-6">Krijg Toegang Tot De App</h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Kies een van onze coaching programma's en krijg direct toegang tot de Evotion Coaching App met alle
                  premium features.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center mb-8">
                  <Link href="/online-coaching">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100 px-6 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <Dumbbell className="w-5 h-5 mr-2" />
                      Online Coaching
                    </Button>
                  </Link>
                  <Link href="/premium-coaching">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100 px-6 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Premium Coaching
                    </Button>
                  </Link>
                  <Link href="/12-weken-vetverlies">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100 px-6 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      12-Weken Vetverlies
                    </Button>
                  </Link>
                  <Link href="/personal-training">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100 px-6 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Personal Training
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>100% Veilig</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span>Premium Toegang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>5.0 Sterren</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">Vragen over de app?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Ons team staat klaar om je te helpen. Neem contact op voor meer informatie over de Evotion Coaching App
                en hoe deze jou kan helpen.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Neem Contact Op
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
