"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Brain,
  Smartphone,
  User,
  Trophy,
  Zap,
  BarChart,
  Flame,
  TrendingUp,
  ArrowRight,
  Award,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function OnlineCoachingClientPage() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "De Evotion Coaching App",
      description:
        "Krijg toegang tot onze geavanceerde coaching app met gepersonaliseerde trainingsschema's, voedingsplannen en directe communicatie met je coach.",
    },
    {
      icon: <User className="w-8 h-8 text-primary" />,
      title: "Persoonlijke Coach",
      description:
        "Ondanks dat het online is, werk je nog steeds met een persoonlijke coach die je programma aanpast aan jouw behoeften en voortgang.",
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "Educatie & Kennis",
      description:
        "Leer de principes achter effectief trainen en voeding, zodat je uiteindelijk zelfstandig keuzes kunt maken die bij jouw doelen passen.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Flexibiliteit",
      description:
        "Train wanneer en waar het jou uitkomt, terwijl je nog steeds professionele begeleiding krijgt. Perfect voor drukke schema's.",
    },
    {
      icon: <BarChart className="w-8 h-8 text-primary" />,
      title: "Voortgangsmonitoring",
      description:
        "Volg je voortgang met gedetailleerde statistieken en analyses. Zie je verbeteringen in kracht, uithoudingsvermogen en lichaamssamenstelling.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Bewezen Resultaten",
      description:
        "Onze online coaching methode heeft al honderden klanten geholpen hun fitnessdoelen te bereiken, ongeacht hun startniveau.",
    },
  ]

  const roadmapSteps = [
    {
      step: "1",
      title: "Intake & Doelstellingen",
      description:
        "We beginnen met een uitgebreide intake om je huidige situatie, doelen en voorkeuren te begrijpen. Op basis hiervan stellen we een persoonlijk plan op.",
      duration: "Week 1",
      icon: <Target className="w-6 h-6 text-white" />,
    },
    {
      step: "2",
      title: "App Onboarding",
      description:
        "Je krijgt toegang tot de Evotion Coaching App en leert hoe je deze optimaal kunt gebruiken voor je trainingen, voeding en communicatie met je coach.",
      duration: "Week 1",
      icon: <Smartphone className="w-6 h-6 text-white" />,
    },
    {
      step: "3-4",
      title: "Basis Opbouwen",
      description:
        "Je start met je gepersonaliseerde trainings- en voedingsplan. Je coach monitort je voortgang en geeft feedback om je programma te optimaliseren.",
      duration: "Week 2-4",
      icon: <Zap className="w-6 h-6 text-white" />,
    },
    {
      step: "5-8",
      title: "Progressie & Aanpassingen",
      description:
        "Naarmate je sterker wordt en vordert, passen we je programma aan om je uitgedaagd te houden en verdere vooruitgang te stimuleren.",
      duration: "Week 5-8",
      icon: <BarChart className="w-6 h-6 text-white" />,
    },
    {
      step: "9-12",
      title: "Verfijning & Optimalisatie",
      description:
        "We verfijnen je programma verder op basis van je feedback en resultaten. Je begint de principes te begrijpen die je helpen je doelen te bereiken.",
      duration: "Week 9-12",
      icon: <Flame className="w-6 h-6 text-white" />,
    },
    {
      step: "12+",
      title: "Langetermijn Succes",
      description:
        "Je hebt nu de kennis en vaardigheden om je doelen te blijven nastreven. We helpen je een duurzame aanpak te ontwikkelen voor blijvend succes.",
      duration: "Week 12+",
      icon: <Trophy className="w-6 h-6 text-white" />,
    },
  ]

  const packages = [
    {
      title: "3 Maanden Coaching",
      sessions: "12 weken begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Maandelijks betalen mogelijk",
      features: [
        "Gepersonaliseerd trainingsschema",
        "Basis voedingsadvies",
        "Wekelijkse check-ins",
        "Toegang tot Evotion App",
        "Onbeperkte coach support",
        "Voortgangsanalyses",
      ],
      popular: false,
      note: "Ideaal voor kennismaking",
    },
    {
      title: "6 Maanden Coaching",
      sessions: "24 weken begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Beste prijs-kwaliteit verhouding",
      features: [
        "Gepersonaliseerd trainingsschema",
        "Uitgebreid voedingsplan",
        "Onbeperkte coach support",
        "Wekelijkse video check-ins",
        "Toegang tot Evotion App",
        "Voortgangsanalyses",
        "Seizoensgebonden aanpassingen",
        "Volledige roadmap doorlopen (Week 1-12+)",
        "Optimalisatie & verfijning fase",
        "Langetermijn gewoontes opbouwen",
      ],
      popular: true,
      note: "Volledige transformatie cyclus",
    },
    {
      title: "12 Maanden Coaching",
      sessions: "52 weken begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Maximale transformatie",
      features: [
        "Volledig op maat gemaakt programma",
        "Geavanceerd voedingsplan",
        "Prioriteit coach support",
        "Wekelijkse video calls",
        "Toegang tot Evotion App",
        "Gedetailleerde voortgangsanalyses",
        "Supplementadvies",
        "Lange termijn strategie",
      ],
      popular: false,
      note: "Voor maximale resultaten",
    },
  ]

  const faqs = [
    {
      question: "Hoe verschilt online coaching van personal training?",
      answer:
        "Online coaching biedt flexibiliteit qua tijd en locatie, terwijl personal training directe, hands-on begeleiding biedt. Bij online coaching krijg je nog steeds een gepersonaliseerd programma en regelmatige feedback van je coach, maar je voert de trainingen zelfstandig uit. Dit maakt het ideaal voor mensen met een druk schema of die liever in hun eigen omgeving trainen. De Evotion Coaching App zorgt ervoor dat je altijd verbonden blijft met je coach en je voortgang kunt bijhouden.",
    },
    {
      question: "Heb ik speciale apparatuur nodig voor online coaching?",
      answer:
        "Nee, we passen je programma aan op basis van de apparatuur die je tot je beschikking hebt. Of je nu thuis traint met minimale uitrusting, toegang hebt tot een volledig uitgeruste sportschool, of ergens daartussenin zit, we kunnen een effectief programma voor je samenstellen. Tijdens de intake bespreken we welke apparatuur je hebt en hoe we dit optimaal kunnen benutten voor je doelen. We kunnen ook alternatieven suggereren als je bepaalde apparatuur niet hebt.",
    },
    {
      question: "Hoe vaak heb ik contact met mijn coach?",
      answer:
        "Dit hangt af van het pakket dat je kiest. Bij het Basis pakket heb je wekelijkse check-ins, terwijl Premium en Elite pakketten frequenter contact bieden, inclusief video calls en onbeperkte chat support. Alle pakketten geven je toegang tot de Evotion Coaching App, waar je direct vragen kunt stellen en feedback kunt ontvangen op je trainingen en voeding. We streven ernaar om binnen 24 uur te reageren op alle vragen, en Premium en Elite klanten krijgen vaak nog snellere reacties.",
    },
    {
      question: "Kan ik overstappen van online coaching naar personal training of andersom?",
      answer:
        "Absoluut! Veel van onze klanten wisselen tussen online coaching en personal training, afhankelijk van hun schema en behoeften. We maken deze overgang naadloos door al je gegevens en voortgang bij te houden in ons systeem. Je kunt bijvoorbeeld beginnen met personal training om de basis te leggen en later overstappen naar online coaching als je meer zelfvertrouwen hebt. Of je kunt online coaching combineren met occasionele personal training sessies voor extra begeleiding. We bieden ook hybride pakketten aan die beide diensten combineren.",
    },
    {
      question: "Is online coaching effectief voor beginners?",
      answer:
        "Ja, online coaching kan zeer effectief zijn voor beginners. We besteden extra aandacht aan het leren van de juiste techniek via video-instructies, feedback op je eigen opnames, en gedetailleerde uitleg. Beginners krijgen vaak meer frequente check-ins om ervoor te zorgen dat ze op het juiste spoor zitten. We raden beginners aan om te starten met ons Premium pakket voor extra ondersteuning in de eerste maanden. Als je je zorgen maakt over techniek, kunnen we ook een combinatie van personal training en online coaching aanbevelen om je op weg te helpen.",
    },
  ]

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70"></div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <Badge className="bg-secondary/20 text-white hover:bg-secondary/30 backdrop-blur-sm text-sm px-4 py-2">
              <Smartphone className="w-4 h-4 mr-2" />
              Flexibele Coaching Via Onze App
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Online Coaching
              <span className="block text-secondary">Voor Maximale Flexibiliteit</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Professionele coaching waar en wanneer het jou uitkomt. Krijg gepersonaliseerde trainingsschema's,
              voedingsadvies en directe feedback van je coach via onze geavanceerde app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Nu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Bekijk Prijzen
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs md:text-sm text-white/80">Coach toegang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs md:text-sm text-white/80">Op maat gemaakt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-xs md:text-sm text-white/80">Succesratio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Voordelen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Waarom Kiezen Voor <span className="text-primary">Online Coaching?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Online coaching biedt flexibiliteit en persoonlijke begeleiding, perfect voor mensen met een druk schema
              die toch professionele ondersteuning willen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  expandedFeature === index ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl text-gray-900">{feature.title}</h3>
                      <p
                        className={`text-gray-600 transition-all duration-300 ${
                          expandedFeature === index ? "" : "line-clamp-2"
                        }`}
                      >
                        {feature.description}
                      </p>
                      <button
                        onClick={() => toggleFeature(index)}
                        className="text-primary font-medium flex items-center gap-1 text-sm"
                      >
                        {expandedFeature === index ? (
                          <>
                            Minder tonen <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Meer tonen <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="bg-primary/10 text-primary mb-4">De Evotion App</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Jouw Coach <span className="text-primary">Altijd Bij De Hand</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Onze geavanceerde app is het centrale punt van je online coaching ervaring. Krijg toegang tot je
                trainingsschema's, voedingsplannen en directe communicatie met je coach.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Trainingsschema's & Video's</h3>
                    <p className="text-gray-600">
                      Toegang tot je gepersonaliseerde trainingsschema's met video-instructies voor elke oefening.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Voortgangsmonitoring</h3>
                    <p className="text-gray-600">
                      Houd je voortgang bij met foto's, metingen en grafieken om je ontwikkeling te visualiseren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Directe Coach Communicatie</h3>
                    <p className="text-gray-600">
                      Stel vragen, deel updates en ontvang feedback van je coach via de ingebouwde chat functie.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button className="bg-primary hover:bg-primary/90">Download De App</Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[60px] blur-xl"></div>
                <div className="relative w-[280px] h-[560px] bg-gradient-to-br from-primary via-primary to-primary/90 rounded-[40px] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-primary rounded-b-xl"></div>
                  <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
                    <Image
                      src="/images/evotion-app-login.jpg"
                      alt="Evotion Coaching App"
                      width={280}
                      height={560}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Jouw Reis
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Hoe werkt <span className="text-primary">Online Coaching?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Van intake tot langetermijn succes - zo begeleiden we je stap voor stap naar je doelen.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {roadmapSteps.map((step, index) => (
                <div key={index} className="flex gap-6 md:gap-8 group">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl md:text-2xl">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 group-hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                        <Badge className="bg-primary/10 text-primary w-fit">{step.duration}</Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Summary */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold text-gray-900">Jouw Succes is Ons Doel</h3>
                </div>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Met deze bewezen aanpak hebben we al honderden mensen geholpen hun fitnessdoelen te bereiken. Jij bent
                  de volgende!
                </p>
                <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                  Begin Nu Je Transformatie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sweet Spot Highlight */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              De Perfecte Duur
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Waarom <span className="text-primary">6 Maanden</span> de Ideale Keuze is
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Volledige Roadmap</h3>
                <p className="text-gray-600">
                  Doorloop alle fasen van onze bewezen roadmap: van intake tot langetermijn succes (Week 1-12+)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Gewoontes Vormen</h3>
                <p className="text-gray-600">
                  6 maanden is wetenschappelijk bewezen de ideale tijd om blijvende gewoontes te ontwikkelen
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Optimale Resultaten</h3>
                <p className="text-gray-600">
                  Tijd voor echte verfijning en optimalisatie van je programma voor maximale effectiviteit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Pakketten
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kies het <span className="text-primary">Pakket</span> dat bij je Past
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van een kennismaking tot een complete transformatie - we hebben voor iedereen het juiste pakket.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular ? "border-primary shadow-xl scale-105" : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-2">
                      <Award className="w-4 h-4 mr-1" />
                      MEEST POPULAIR
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                      <div className="text-sm text-gray-500">{pkg.pricePerSession}</div>
                      <div className="text-lg font-medium text-gray-700">{pkg.sessions}</div>
                      <div className="text-sm font-medium text-primary">{pkg.note}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full py-3 text-lg font-semibold ${
                      pkg.popular
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Selecteer Pakket
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Niet zeker welk pakket het beste bij je past? We helpen je graag bij het maken van de juiste keuze.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Neem Contact Op
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Veelgestelde <span className="text-primary">Vragen</span>
            </h2>
            <p className="text-lg text-gray-600">
              Heb je vragen over online coaching? Hieronder vind je antwoorden op de meest gestelde vragen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-all duration-300 ${
                  expandedFaq === index ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-bold text-lg text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </button>
                  {expandedFaq === index && <div className="mt-4 text-gray-600 border-t pt-4">{faq.answer}</div>}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">Heb je een andere vraag die hier niet beantwoord wordt?</p>
            <Button className="bg-primary hover:bg-primary/90">Stel Je Vraag</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klaar Om Je <span className="text-secondary">Transformatie</span> Te Starten?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Begin vandaag nog met online coaching en ervaar hoe professionele begeleiding, gecombineerd met maximale
              flexibiliteit, je kan helpen je doelen te bereiken.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Nu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Bekijk Alle Diensten
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
