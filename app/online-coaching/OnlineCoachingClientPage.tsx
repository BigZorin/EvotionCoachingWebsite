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
  GraduationCap,
  Video,
  Puzzle,
  Layers,
  Calendar,
  Dumbbell,
  Apple,
  LineChart,
  RotateCcw,
  Clock,
  Star,
} from "lucide-react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

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
      phase: "1",
      title: "A: Onboarding",
      duration: "±1 week",
      icon: <Play className="w-5 h-5" />,
      description: "Intake, kennismaking en opzetten van je volledige programma",
      features: ["Volledige doorloop van het 5-fasen programma", "Toegang tot de Evotion Coaching App"],
      highlight: false,
    },
    {
      phase: "2",
      title: "B: Herstel",
      duration: "4-8 weken",
      icon: <Heart className="w-5 h-5" />,
      description: "Metabolisme herstellen en gezonde gewoontes opbouwen",
      features: ["Toegang tot e-learning portal (12weken.evotion-coaching.nl)", "Toegang tot klanten support portal"],
      highlight: false,
    },
    {
      phase: "3",
      title: "C: Voorbereiding",
      duration: "2-4 weken",
      icon: <Target className="w-5 h-5" />,
      description: "Mentaal en fysiek klaarstomen voor de intensieve doelfase",
      features: ["Wekelijkse persoonlijke check-ins", "Op maat gemaakt trainings- en voedingsplan"],
      highlight: false,
    },
    {
      phase: "4",
      title: "D: Doelfase",
      duration: "8-12 weken",
      icon: <Zap className="w-5 h-5" />,
      description: "Intensief werken aan jouw specifieke doel (kan cyclisch herhaald)",
      features: ["Voortgangsanalyses met foto's en metingen", "Onbeperkte coach support via app"],
      highlight: true,
    },
    {
      phase: "5",
      title: "E: Optimalisatie",
      duration: "4-8 weken",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Resultaten verankeren en onderhoudsplan ontwikkelen",
      features: ["Meerdere doelfases mogelijk (cyclisch)", "Extra tijd voor duurzame gewoontevorming"],
      highlight: false,
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

      {/* Hero Section - #1e1839 donkerpaars achtergrond */}
      <section className="relative py-12 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image src="/images/dscf2364.jpg" alt="Gym background" fill className="object-cover" priority />
        </div>
        {/* Purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1839]/95 via-[#1e1839]/85 to-[#1e1839]/80"></div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 lg:space-8">
            <Badge className="bg-[#bad4e1]/20 text-white hover:bg-[#bad4e1]/30 backdrop-blur-sm text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 inline-flex border-0">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
              Modulair Coachingprogramma
            </Badge>

            <h1 className="text-3xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Online Coaching
              <span className="block text-[#bad4e1]">Op Jouw Tempo</span>
            </h1>

            <p className="text-base lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto px-2">
              Een persoonlijk 5-fasen programma dat zich aanpast aan jouw lichaam, doelen en tempo. Geen standaard
              schema's, maar maatwerk voor duurzame resultaten.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center pt-2 lg:pt-4 px-4">
              <Button
                size="lg"
                onClick={handleEmail}
                className="bg-white text-[#1e1839] hover:bg-gray-100 px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Stuur een E-mail
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleWhatsApp("online coaching traject")}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                WhatsApp Bericht
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-4 lg:pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-white mb-1">5</div>
                <div className="text-xs lg:text-sm text-white/80">Flexibele Fases</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs lg:text-sm text-white/80">Op Maat Gemaakt</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-white mb-1">6-12</div>
                <div className="text-xs lg:text-sm text-white/80">Maanden Traject</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformaties Section - Witte achtergrond */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Star className="w-4 h-4 mr-2" />
              Resultaten
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">
              Echte <span className="text-[#bad4e1]">Transformaties</span>
            </h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Bekijk de resultaten van onze klanten die met de Evotion App en online coaching hun doelen hebben bereikt.
            </p>
          </div>

          {/* Transformations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-6xl mx-auto mb-12 lg:mb-20">
            {[
              {
                image: "/images/vrouw-20transformatie.png",
                result: "-9.5kg",
              },
              {
                image: "/images/salim-20transformatie.png",
                result: "-8.1kg",
              },
              {
                image: "/images/martin-20transformatie.png",
                result: "-10.7kg",
              },
            ].map((transformation, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <Image
                    src={transformation.image || "/placeholder.svg"}
                    alt={`Transformatie ${transformation.result}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom Modulair Section - Lichtgrijze achtergrond */}
      <section className="py-12 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Puzzle className="w-4 h-4 mr-2" />
              Onze Aanpak
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">
              Waarom een Modulair Programma?
            </h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Geen standaard schema's of one-size-fits-all aanpak. Jouw lichaam is uniek en verdient een programma dat
              zich aanpast.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
            {[
              {
                icon: Puzzle,
                title: "Flexibel",
                description: "Elke fase wordt aangepast aan jouw voortgang en feedback",
              },
              {
                icon: Target,
                title: "Doelgericht",
                description: "Specifieke doelen per fase voor meetbare resultaten",
              },
              {
                icon: TrendingUp,
                title: "Progressief",
                description: "Geleidelijke opbouw voor duurzame transformatie",
              },
              { icon: RotateCcw, title: "Veilig", description: "Wetenschappelijk onderbouwde methodes" },
            ].map((item, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-all duration-300 text-center bg-white"
              >
                <CardContent className="p-4 lg:p-8 space-y-2 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-[#1e1839]/10 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto">
                    <item.icon className="w-5 h-5 lg:w-8 lg:h-8 text-[#1e1839]" />
                  </div>
                  <h3 className="text-sm lg:text-xl font-bold text-[#1e1839]">{item.title}</h3>
                  <p className="text-xs lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Fases Section - #1e1839 donkerpaars achtergrond */}
      <section className="py-12 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 lg:mb-6 inline-flex">
              <Layers className="w-4 h-4 mr-2" />
              Het Programma
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-6">De 5 Fases van Jouw Reis</h2>
            <p className="text-sm lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-2">
              Een gestructureerd maar flexibel programma dat jou stap voor stap naar je doelen begeleidt.
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6 max-w-4xl mx-auto">
            {phases.map((phase, index) => (
              <Card
                key={index}
                className={`border-2 transition-all duration-300 hover:shadow-lg bg-white ${
                  phase.highlight ? "border-[#bad4e1]" : "border-gray-200"
                }`}
              >
                <CardContent className="p-4 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                    <div
                      className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0 ${
                        phase.highlight ? "bg-[#1e1839] text-white" : "bg-[#1e1839]/10 text-[#1e1839]"
                      }`}
                    >
                      {phase.icon}
                    </div>
                    <div className="flex-grow text-center lg:text-left">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 mb-2">
                        <h3 className="text-lg lg:text-2xl font-bold text-[#1e1839]">{phase.title}</h3>
                        <Badge
                          variant="outline"
                          className={`text-xs lg:text-sm w-fit mx-auto lg:mx-0 ${
                            phase.highlight
                              ? "border-[#bad4e1] text-[#1e1839] bg-[#bad4e1]/20"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {phase.duration}
                        </Badge>
                      </div>
                      <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">{phase.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {phase.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs lg:text-sm bg-gray-100 text-gray-700 px-2 lg:px-3 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trajecten Section - Witte achtergrond */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Calendar className="w-4 h-4 mr-2" />
              Trajecten
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">Kies Jouw Traject</h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Twee opties voor verschillende doelen en situaties. Beide trajecten omvatten het volledige 5-fasen
              programma.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular ? "border-[#1e1839] shadow-xl lg:scale-105" : "border-gray-200 hover:border-[#bad4e1]"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 lg:-top-4 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-4 md:h-6 bg-[#1e1839] rounded-b-xl"></div>
                )}

                <CardContent className="p-5 lg:p-8 space-y-4 lg:space-y-6">
                  <div className="text-center space-y-2 lg:space-y-4 pt-2 lg:pt-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-[#1e1839]">{pkg.title}</h3>
                    <div className="space-y-1 lg:space-y-2">
                      <div className="text-2xl lg:text-3xl font-bold text-[#1e1839]">Op Aanvraag</div>
                      <div className="text-sm lg:text-lg font-medium text-gray-600">{pkg.duration}</div>
                      <div className="text-xs lg:text-sm font-medium text-[#bad4e1] text-[rgba(30,24,57,1)]">{pkg.note}</div>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 lg:gap-3">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-xs lg:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 lg:space-y-3 pt-2 lg:pt-4">
                    <Button
                      onClick={handleEmail}
                      className="w-full py-2.5 lg:py-3 text-sm lg:text-lg font-semibold bg-[#1e1839] hover:bg-[#1e1839]/90 text-white"
                    >
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      Stuur E-mail
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsApp(pkg.title)}
                      className="w-full py-2.5 lg:py-3 text-sm lg:text-lg font-semibold border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839] hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wat Je Krijgt Section - Donkerpaarse achtergrond met App */}
      <section className="py-12 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#bad4e1]/20 text-[#bad4e1] border-[#bad4e1]/30 mb-4 lg:mb-6 inline-flex">
              <Award className="w-4 h-4 mr-2" />
              Alles Voor Jouw Succes
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-6">Wat Je Krijgt</h2>
            <p className="text-sm lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-2">
              Alle tools en ondersteuning die je nodig hebt voor een succesvolle transformatie.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="relative flex justify-center order-1 lg:order-1">
              <div className="relative w-64 lg:w-96">
                <Image
                  src="/images/evotion-20app-20mock-up.png"
                  alt="Evotion Coaching App"
                  width={384}
                  height={768}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="order-2 lg:order-2">
              <h3 className="text-xl lg:text-3xl font-bold text-white mb-6 lg:mb-8 text-center lg:text-left">
                De Evotion Coaching App
              </h3>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {[
                  { icon: Dumbbell, title: "Trainingsschema's", desc: "100% op maat" },
                  { icon: Apple, title: "Voedingsplan", desc: "Flexibel & praktisch" },
                  { icon: MessageCircle, title: "Direct Contact", desc: "Met je coach" },
                  { icon: Video, title: "Loom Videos", desc: "Persoonlijke uitleg" },
                  { icon: LineChart, title: "Voortgang", desc: "Tracking & inzichten" },
                  { icon: RotateCcw, title: "Aanpassingen", desc: "Wanneer nodig" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-5 text-center border border-white/20 hover:border-[#bad4e1]/50 transition-all"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#bad4e1]/20 rounded-xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
                      <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#bad4e1]" />
                    </div>
                    <h4 className="text-sm lg:text-base font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs lg:text-sm text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Witte achtergrond */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Layers className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-4 lg:mb-6">
              Veelgestelde <span className="text-[#bad4e1]">Vragen</span>
            </h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Heb je vragen over online coaching of het modulaire programma? Hieronder vind je antwoorden op de meest
              gestelde vragen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-all duration-300 bg-white ${
                  expandedFaq === index ? "border-[#1e1839]" : "border-gray-200"
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left gap-3"
                  >
                    <h3 className="font-bold text-sm lg:text-lg text-[#1e1839]">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-[#1e1839] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-[#1e1839] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-3 md:mt-4 text-gray-600 border-t border-gray-200 pt-3 md:pt-4 text-xs lg:text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-4 md:mb-6 text-xs lg:text-base">
              Heb je een andere vraag die hier niet beantwoord wordt?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={handleEmail}
                className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white text-sm lg:text-base"
              >
                <Mail className="w-4 h-4 mr-2" />
                E-mail Je Vraag
              </Button>
              <Button
                variant="outline"
                onClick={() => handleWhatsApp("online coaching")}
                className="border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839] hover:text-white text-sm lg:text-base"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Stuur WhatsApp Bericht
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - #1e1839 gradient */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1e1839] to-[#1e1839]/80 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-6">Klaar voor Jouw Transformatie?</h2>
          <p className="text-sm lg:text-xl text-white/90 max-w-2xl mx-auto mb-6 lg:mb-8 px-2">
            Start vandaag met een programma dat écht bij jou past. Neem contact op voor een vrijblijvend gesprek.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={handleEmail}
              className="bg-white text-[#1e1839] hover:bg-gray-100 px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold"
            >
              <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Stuur een E-mail
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleWhatsApp("online coaching")}
              className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold bg-transparent"
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              WhatsApp Bericht
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
