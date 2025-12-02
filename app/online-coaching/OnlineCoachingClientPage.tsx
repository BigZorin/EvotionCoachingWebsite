"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Smartphone,
  User,
  Trophy,
  Zap,
  BarChart,
  TrendingUp,
  Award,
  MapPin,
  Mail,
  MessageCircle,
  Play,
  Heart,
  Settings,
  Repeat,
  GraduationCap,
  Video,
  Users,
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
      icon: <Smartphone className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "De Evotion Coaching App",
      description:
        "Krijg toegang tot onze geavanceerde coaching app met gepersonaliseerde trainingsschema's, voedingsplannen en directe communicatie met je coach.",
    },
    {
      icon: <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "E-Learning Portal",
      description:
        "Toegang tot 12weken.evotion-coaching.nl met uitgebreide educatie over training, voeding en mindset om zelfkennis op te doen.",
    },
    {
      icon: <Video className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "Klanten Support Portal",
      description:
        "Via klanten.evotion-coaching.nl krijg je antwoord op al je vragen, meestal in video-format door Martin persoonlijk beantwoord.",
    },
    {
      icon: <User className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "Wekelijkse Check-ins",
      description:
        "Elke week een persoonlijke check-in met je coach om voortgang te bespreken, vragen te beantwoorden en je programma bij te sturen.",
    },
    {
      icon: <BarChart className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "Voortgangsanalyses",
      description:
        "Regelmatige metingen en foto's om je transformatie te documenteren en je programma data-gedreven te optimaliseren.",
    },
    {
      icon: <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />,
      title: "Modulair & Flexibel",
      description:
        "Het programma past zich aan jou aan, niet andersom. Elke fase duurt precies zo lang als jij nodig hebt voor optimaal resultaat.",
    },
  ]

  const phases = [
    {
      name: "A: Onboarding",
      duration: "±1 week",
      icon: <Play className="w-5 h-5" />,
      description: "Intake, kennismaking en opzetten van je volledige programma",
    },
    {
      name: "B: Herstel",
      duration: "4-8 weken",
      icon: <Heart className="w-5 h-5" />,
      description: "Metabolisme herstellen en gezonde gewoontes opbouwen",
    },
    {
      name: "C: Voorbereiding",
      duration: "2-4 weken",
      icon: <Target className="w-5 h-5" />,
      description: "Mentaal en fysiek klaarstomen voor de intensieve doelfase",
    },
    {
      name: "D: Doelfase",
      duration: "8-12 weken",
      icon: <Zap className="w-5 h-5" />,
      description: "Intensief werken aan jouw specifieke doel (kan cyclisch herhaald)",
    },
    {
      name: "E: Optimalisatie",
      duration: "4-8 weken",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Resultaten verankeren en onderhoudsplan ontwikkelen",
    },
  ]

  const packages = [
    {
      title: "6 Maanden Traject",
      duration: "24 weken begeleiding",
      features: [
        "Volledige doorloop van het 5-fasen programma",
        "Toegang tot de Evotion Coaching App",
        "Toegang tot e-learning portal (12weken.evotion-coaching.nl)",
        "Toegang tot klanten support portal",
        "Wekelijkse persoonlijke check-ins",
        "Op maat gemaakt trainings- en voedingsplan",
        "Voortgangsanalyses met foto's en metingen",
        "Onbeperkte coach support via app",
      ],
      popular: false,
      note: "Ideaal voor een complete transformatie",
    },
    {
      title: "12 Maanden Traject",
      duration: "52 weken begeleiding",
      features: [
        "Alle voordelen van het 6 maanden traject",
        "Meerdere doelfases mogelijk (cyclisch)",
        "Extra tijd voor duurzame gewoontevorming",
        "Seizoensgebonden aanpassingen",
        "Diepgaande lange termijn strategie",
        "Maximale flexibiliteit in je reis",
        "Uitgebreide educatie en zelfstandigheid",
        "Langdurige ondersteuning en begeleiding",
      ],
      popular: true,
      note: "Aanbevolen voor maximale en duurzame resultaten",
    },
  ]

  const faqs = [
    {
      question: "Wat houdt het modulaire programma precies in?",
      answer:
        "Ons modulaire coachingprogramma bestaat uit 5 flexibele fases: Onboarding, Herstel, Voorbereiding, Doelfase en Optimalisatie. Het verschil met standaard programma's is dat elke fase precies zo lang duurt als jij nodig hebt. Het programma past zich aan jou aan, niet andersom. Binnen een 6 of 12 maanden traject kun je zelfs meerdere doelen bereiken door cyclisch terug te keren naar de doelfase.",
    },
    {
      question: "Wat is het verschil tussen 6 en 12 maanden?",
      answer:
        "Het 6 maanden traject is perfect voor een complete doorloop van alle fases en het bereiken van één hoofddoel. Het 12 maanden traject biedt extra tijd voor meerdere doelen (bijvoorbeeld eerst vetverlies, dan spieropbouw), diepere gewoontevorming en meer flexibiliteit. Bij 12 maanden kun je de doelfase cyclisch herhalen voor verschillende doelstellingen.",
    },
    {
      question: "Hoe werken de wekelijkse check-ins?",
      answer:
        "Elke week heb je een persoonlijk check-in moment met je coach. Je deelt je voortgang, metingen en eventuele uitdagingen via de app. Je coach bekijkt alles en geeft uitgebreide feedback, vaak in video-format. Zo blijf je altijd op koers en wordt je programma continu geoptimaliseerd op basis van jouw resultaten.",
    },
    {
      question: "Wat krijg ik allemaal met de Evotion Coaching App?",
      answer:
        "Via de app krijg je toegang tot je gepersonaliseerde trainingsschema's met video-instructies, je voedingsplan, directe communicatie met je coach, voortgangsmonitoring met foto's en metingen, en alle tools die je nodig hebt voor je transformatie. Daarnaast krijg je toegang tot het e-learning portal voor educatie en het klanten support portal voor al je vragen.",
    },
    {
      question: "Kan ik ook thuis trainen of moet ik naar de sportschool?",
      answer:
        "Je kunt zowel thuis als in de sportschool trainen. Je coach stelt een programma samen dat past bij jouw beschikbare apparatuur en situatie. Of je nu thuis traint met minimale uitrusting, of in een volledig uitgeruste sportschool - je programma wordt volledig aangepast aan jouw mogelijkheden.",
    },
    {
      question: "Hoe neem ik contact op om te starten?",
      answer:
        "Je kunt ons bereiken via e-mail op info@evotion-coaching.nl of stuur een bericht via WhatsApp. We plannen dan een vrijblijvend kennismakingsgesprek om je doelen te bespreken en te kijken welk traject het beste bij jou past.",
    },
  ]

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleEmail = () => {
    window.location.href = "mailto:info@evotion-coaching.nl?subject=Interesse%20in%20Online%20Coaching"
  }

  const handleWhatsApp = (pakket: string) => {
    const message = encodeURIComponent(
      `Hoi Martin, ik heb interesse in het ${pakket} voor online coaching. Kunnen we een kennismakingsgesprek plannen?`,
    )
    window.open(`https://wa.me/31612345678?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-28 lg:py-32 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70"></div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8">
            <Badge className="bg-secondary/20 text-white hover:bg-secondary/30 backdrop-blur-sm text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Modulair Coachingprogramma
            </Badge>

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Online Coaching
              <span className="block text-secondary">Op Jouw Tempo</span>
            </h1>

            <p className="text-sm md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto px-2">
              Een persoonlijk 5-fasen programma dat zich aanpast aan jouw lichaam, doelen en tempo. Geen standaard
              schema's, maar maatwerk voor duurzame resultaten.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4">
              <Button
                size="lg"
                onClick={handleEmail}
                className="bg-white text-primary hover:bg-gray-100 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Stuur een E-mail
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleWhatsApp("online coaching traject")}
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                WhatsApp Bericht
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6 md:pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-lg md:text-3xl font-bold text-white mb-0.5 md:mb-1">5</div>
                <div className="text-[10px] md:text-sm text-white/80">Flexibele Fases</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-3xl font-bold text-white mb-0.5 md:mb-1">100%</div>
                <div className="text-[10px] md:text-sm text-white/80">Op Maat Gemaakt</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-3xl font-bold text-white mb-0.5 md:mb-1">6-12</div>
                <div className="text-[10px] md:text-sm text-white/80">Maanden Traject</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modular Program Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <Badge className="bg-primary/10 text-primary mb-3 md:mb-4 text-xs md:text-sm">
              Het Modulaire Programma
            </Badge>
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              5 Fases naar <span className="text-primary">Jouw Doel</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-600 px-2">
              Geen standaard kalender, maar een programma dat zich aanpast aan jouw unieke reis. Elke fase duurt precies
              zo lang als jij nodig hebt.
            </p>
          </div>

          {/* Why Modular */}
          <div className="max-w-4xl mx-auto mb-10 md:mb-16">
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-lg">
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Waarom Modulair?</h3>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-3 md:p-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Iedereen is Uniek</h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Jouw lichaam, doelen en uitgangsituatie zijn anders. Een standaard programma werkt daarom niet.
                  </p>
                </div>
                <div className="text-center p-3 md:p-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Settings className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Aanpasbaar aan Jou</h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Het programma past zich aan jou aan, niet andersom. Geen haast, geen druk.
                  </p>
                </div>
                <div className="text-center p-3 md:p-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Repeat className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Cyclisch & Flexibel</h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Bereik een doel, consolideer het, en start aan een nieuw doel binnen je traject.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phases */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-3 md:space-y-4">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    {phase.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 mb-1 md:mb-2">
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg">{phase.name}</h3>
                      <Badge className="bg-primary/10 text-primary w-fit text-[10px] md:text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
            <Badge className="bg-primary/10 text-primary mb-3 md:mb-4 text-xs md:text-sm">Wat Je Krijgt</Badge>
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Alles voor Jouw <span className="text-primary">Succes</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-600 px-2">
              Volledige ondersteuning met de beste tools, persoonlijke begeleiding en educatie voor duurzame resultaten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 overflow-hidden border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-bold text-base md:text-xl text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="bg-primary/10 text-primary mb-3 md:mb-4 text-xs md:text-sm">De Evotion App</Badge>
              <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Jouw Coach <span className="text-primary">Altijd Bij De Hand</span>
              </h2>
              <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8">
                De app is het centrale punt van je coaching ervaring. Al je schema's, communicatie en voortgang op één
                plek.
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">
                      Trainingsschema's & Video's
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      Gepersonaliseerde schema's met video-instructies voor elke oefening.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">Voortgangsmonitoring</h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      Houd je voortgang bij met foto's, metingen en grafieken.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">Directe Communicatie</h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      Stel vragen en ontvang feedback van je coach via de ingebouwde chat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[60px] blur-xl"></div>
                <div className="relative w-[200px] h-[400px] md:w-[280px] md:h-[560px] bg-gradient-to-br from-primary via-primary to-primary/90 rounded-[30px] md:rounded-[40px] p-2 md:p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-4 md:h-6 bg-primary rounded-b-xl"></div>
                  <div className="w-full h-full bg-white rounded-[24px] md:rounded-[32px] overflow-hidden">
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

      {/* Packages Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-primary/10 text-primary mb-4 md:mb-6 text-xs md:text-sm">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Trajecten
            </Badge>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Kies Jouw <span className="text-primary">Traject</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Twee opties voor jouw transformatie. Beide trajecten bieden volledige toegang tot het modulaire programma.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular ? "border-primary shadow-xl md:scale-105" : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm">
                      <Award className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      AANBEVOLEN
                    </Badge>
                  </div>
                )}

                <CardContent className="p-5 md:p-8 space-y-4 md:space-y-6">
                  <div className="text-center space-y-2 md:space-y-4 pt-2 md:pt-0">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{pkg.title}</h3>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-3xl font-bold text-primary">Op Aanvraag</div>
                      <div className="text-sm md:text-lg font-medium text-gray-700">{pkg.duration}</div>
                      <div className="text-xs md:text-sm font-medium text-primary">{pkg.note}</div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 md:gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
                    <Button
                      onClick={handleEmail}
                      className={`w-full py-2.5 md:py-3 text-sm md:text-lg font-semibold ${
                        pkg.popular
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Stuur E-mail
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsApp(pkg.title)}
                      className="w-full py-2.5 md:py-3 text-sm md:text-lg font-semibold border-2"
                    >
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <Badge className="bg-primary/10 text-primary mb-3 md:mb-4 text-xs md:text-sm">FAQ</Badge>
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Veelgestelde <span className="text-primary">Vragen</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-600 px-2">
              Heb je vragen over online coaching of het modulaire programma? Hieronder vind je antwoorden op de meest
              gestelde vragen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-all duration-300 ${
                  expandedFaq === index ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left gap-3"
                  >
                    <h3 className="font-bold text-sm md:text-lg text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-3 md:mt-4 text-gray-600 border-t pt-3 md:pt-4 text-xs md:text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-base">
              Heb je een andere vraag die hier niet beantwoord wordt?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button onClick={handleEmail} className="bg-primary hover:bg-primary/90 text-sm md:text-base">
                <Mail className="w-4 h-4 mr-2" />
                E-mail Je Vraag
              </Button>
              <Button
                variant="outline"
                onClick={() => handleWhatsApp("online coaching")}
                className="border-2 text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h2 className="text-xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Klaar Om Te <span className="text-secondary">Starten?</span>
            </h2>
            <p className="text-sm md:text-xl text-white/90 leading-relaxed px-2">
              Neem contact op voor een vrijblijvend gesprek. We bespreken je doelen en kijken samen welk traject het
              beste bij jou past.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
              <Button
                size="lg"
                onClick={handleEmail}
                className="bg-white text-primary hover:bg-gray-100 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                info@evotion-coaching.nl
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleWhatsApp("online coaching")}
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Stuur WhatsApp Bericht
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
