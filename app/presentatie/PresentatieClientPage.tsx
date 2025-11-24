"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Target,
  Zap,
  TrendingUp,
  Heart,
  Smartphone,
  GraduationCap,
  MessageCircle,
  Video,
  BarChart3,
  Clock,
  Users,
  Repeat,
  Settings,
} from "lucide-react"

const slides = [
  {
    id: 0,
    title: "Welkom bij Evotion Coaching",
    subtitle: "Jouw Transformatiereis van 6-12 Maanden",
    type: "intro",
  },
  {
    id: 1,
    title: "Ons Modulair Coachingprogramma",
    subtitle: "5 Flexibele Fases naar Jouw Doel",
    type: "overview",
    phases: [
      { name: "A: Onboarding", duration: "±1 week", icon: Play },
      { name: "B: Herstel", duration: "4-8 weken", icon: Heart },
      { name: "C: Voorbereiding", duration: "2-4 weken", icon: Target },
      { name: "D: Doelfase", duration: "8-12 weken", icon: Zap },
      { name: "E: Optimalisatie", duration: "4-8 weken", icon: TrendingUp },
    ],
    modularExplanation: {
      title: "Waarom Modulair?",
      subtitle: "Jouw Unieke Reis, Geen Standaard Kalender",
      points: [
        {
          icon: Users,
          title: "Iedereen is Uniek",
          description:
            "Jouw lichaam, doelen en uitgangsituatie zijn anders dan die van een ander. Een standaard 8-weken programma werkt daarom niet voor iedereen.",
        },
        {
          icon: Settings,
          title: "Het Programma Past zich aan Jou Aan",
          description:
            "Niet andersom. Elke fase duurt precies zo lang als jij nodig hebt om optimaal resultaat te behalen. Geen haast, geen druk.",
        },
        {
          icon: Repeat,
          title: "Cyclisch & Flexibel",
          description:
            "Bereik een doel, consolideer het resultaat, en start daarna aan een nieuw doel. Alles binnen jouw 6-12 maanden traject.",
        },
      ],
      vision:
        "Onze visie: Duurzame transformatie ontstaat niet door iedereen in hetzelfde keurslijf te persen, maar door een programma te creëren dat zich aanpast aan jouw persoonlijke situatie, tempo en ambities. Zo bereik je niet alleen je doel, maar leer je ook hoe je dit voor altijd kunt behouden.",
    },
  },
  {
    id: 2,
    title: "Wat Je Krijgt Tijdens het Traject",
    subtitle: "Volledige Ondersteuning voor Jouw Transformatie",
    type: "benefits",
    benefits: [
      {
        icon: Smartphone,
        title: "De Evotion Coaching App",
        description:
          "Jouw persoonlijke trainingsschema's, voedingsplannen en directe communicatie met je coach. Alles in één app.",
        features: [
          "Gepersonaliseerde workouts met video-instructies",
          "Voedingsplannen en macro-tracking",
          "Real-time voortgangsmonitoring",
          "Direct contact met je coach via chat",
        ],
      },
      {
        icon: GraduationCap,
        title: "E-Learning Portal (12weken.evotion-coaching.nl)",
        description:
          "Toegang tot onze complete kennisbank met lessen over training, voeding, mindset en meer. Bouw zelfkennis op.",
        features: [
          "Gestructureerde lessen per onderwerp",
          "Video-tutorials en handleidingen",
          "Wetenschappelijk onderbouwde informatie",
          "Op je eigen tempo leren",
        ],
      },
      {
        icon: MessageCircle,
        title: "Klanten Support Portal (klanten.evotion-coaching.nl)",
        description:
          "Stel je vragen en krijg antwoorden in video-format. Persoonlijk en uitgebreid beantwoord door je coach.",
        features: [
          "Video-antwoorden op al je vragen",
          "Persoonlijke uitleg en voorbeelden",
          "Toegang tot eerdere Q&A's",
          "Snelle reactietijd van je coach",
        ],
      },
      {
        icon: Video,
        title: "Wekelijkse Check-ins",
        description:
          "Regelmatige evaluaties van je voortgang met je persoonlijke coach. Bijsturen waar nodig, vieren van successen.",
        features: [
          "Wekelijkse video-gesprekken of voice notes",
          "Bespreking van voortgang en uitdagingen",
          "Aanpassingen aan programma indien nodig",
          "Motivatie en accountability",
        ],
      },
      {
        icon: BarChart3,
        title: "Voortgangsanalyses",
        description:
          "Gedetailleerde inzichten in je ontwikkeling. Van gewicht en omvang tot kracht en uithoudingsvermogen.",
        features: [
          "Wekelijkse metingen en analyses",
          "Visuele grafieken en trends",
          "Voor-en-na vergelijkingen",
          "Data-gedreven bijsturingen",
        ],
      },
      {
        icon: Clock,
        title: "Volledige Flexibiliteit",
        description:
          "Train wanneer en waar het jou uitkomt. Geen vaste tijden of locaties, maar wel professionele begeleiding.",
        features: [
          "Pas trainingen aan op jouw schema",
          "Train thuis, in de sportschool of buiten",
          "Coach bereikbaar op flexibele tijden",
          "Perfect voor drukke levens",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Fase A: Onboarding",
    duration: "±1 week",
    icon: Play,
    type: "phase",
    content: {
      goal: "Een sterke basis leggen en kennismaken met de coach en alle tools",
      highlights: [
        "Uitgebreide intake en persoonlijk gesprek",
        "Op maat gemaakt trainings- en voedingsschema",
        "Toegang tot de Evotion Coaching App",
        "Toegang tot e-learning portal en klanten support",
        "Beginmetingen: gewicht, omvang, conditietest",
        "Duidelijk plan van aanpak voor de komende maanden",
      ],
      result: "Je weet precies wat te doen en hoe je vooruitgang wordt bijgehouden",
    },
  },
  {
    id: 4,
    title: "Fase B: Herstel / Restoration",
    duration: "4-8 weken",
    icon: Heart,
    type: "phase",
    content: {
      goal: "Metabolisme en gezonde gewoontes herstellen na eerdere diëten of ongezonde leefstijl",
      highlights: [
        "Reverse dieting: calorie-inname geleidelijk verhogen",
        "Herstel van hormonale balans en stofwisseling",
        "Opbouwen van gezonde eet- en beweeggewoonten",
        "Focus op slaapritme en stressreductie",
        "Lichte training met nadruk op techniek",
        "Wekelijkse check-ins voor monitoring en support",
      ],
      result: "Je lichaam is uit de 'spaarstand' en je voelt je energiek en gemotiveerd",
    },
  },
  {
    id: 5,
    title: "Fase C: Voorbereiding",
    duration: "2-4 weken",
    icon: Target,
    type: "phase",
    content: {
      goal: "Mentaal en fysiek klaarstomen voor de naderende intensieve doelgerichte fase",
      highlights: [
        "Trainingsintensiteit geleidelijk opschalen",
        "Voedingsregime aanscherpen richting specifieke doel",
        "Concrete subdoelen en realistische verwachtingen stellen",
        "Strategieën leren voor mogelijke plateaus via e-learning",
        "Mentale voorbereiding op de komende uitdaging",
        "Intensievere check-ins en coach feedback",
      ],
      result: "Je bent lichamelijk optimaal belastbaar en mentaal scherp aan de start",
    },
  },
  {
    id: 6,
    title: "Fase D: Doelfase",
    duration: "8-12 weken (kan cyclisch herhaald worden)",
    icon: Zap,
    type: "phase-goals",
    goals: [
      {
        title: "Vetverlies",
        description: "Afslanken op een verantwoorde, duurzame manier",
        details: [
          "Gematigd calorisch tekort (~20% onder onderhoud)",
          "Gezond tempo: ~0,5 kg per week",
          "Krachttraining om spiermassa te behouden",
          "Verhoogde activiteit en cardio",
          "Wekelijkse monitoring en bijsturing",
        ],
      },
      {
        title: "Spieropbouw",
        description: "Toename in spiermassa en kracht",
        details: [
          "Calorisch overschot (10-20% boven onderhoud)",
          "Intensieve krachttraining met progressive overload",
          "1,6-2g eiwit per kg lichaamsgewicht",
          "Focus op hypertrofie-range (6-12 reps)",
          "Voldoende rust voor spiergroei",
        ],
      },
      {
        title: "Herstel",
        description: "Actief herstel van blessure of overbelasting",
        details: [
          "Specifieke fysiotherapie-oefeningen",
          "Mobiliteitstraining en core-stability",
          "Optimale voeding voor weefselherstel",
          "Anti-inflammatoire voedingsmiddelen",
          "Stressmanagement en slaapoptimalisatie",
        ],
      },
      {
        title: "Energie & Vitaliteit",
        description: "Dagelijks energieniveau verhogen",
        details: [
          "Slaappatronen verbeteren (7-8 uur)",
          "Stabiele bloedsuikerspiegel door juiste voeding",
          "Matig-intensieve cardio voor conditie",
          "Balans tussen activiteit en ontspanning",
          "Focus op duurzame leefstijl-aanpassingen",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Fase E: Optimalisatie",
    duration: "4-8 weken",
    icon: TrendingUp,
    type: "phase",
    content: {
      goal: "Behaalde resultaten verankeren en verdere fine-tuning",
      highlights: [
        "Nieuwe balans vinden: gewicht stabiliseren",
        "Onderhoudsplan ontwikkelen voor lange termijn",
        "Evaluatie en zelfreflectie van het traject",
        "Verfijnen van techniek en gewoontes",
        "Zelfstandig kunnen handhaven van resultaten",
        "Afsluiting met complete transformatie-analyse",
      ],
      result: "Je hebt je doel bereikt én de vaardigheden om dit te behouden",
    },
  },
  {
    id: 8,
    title: "Flexibel & Cyclisch Programma",
    type: "flexibility",
    content: {
      title: "Maximale Flexibiliteit voor Jouw Reis",
      points: [
        {
          icon: Calendar,
          title: "Niet Kalendergebonden",
          description: "Je kunt op elk moment instromen en het programma past zich aan jouw tempo aan",
        },
        {
          icon: Target,
          title: "Meerdere Doelen Bereiken",
          description: "Na fase E kun je terugkeren naar fase C voor een nieuw doel binnen de 12 maanden",
        },
        {
          icon: CheckCircle2,
          title: "Gepersonaliseerd Traject",
          description: "Elke fase duurt zo lang als jij nodig hebt voor optimale resultaten",
        },
      ],
    },
  },
  {
    id: 9,
    title: "Jouw Transformatie Begint Nu",
    type: "cta",
    content: {
      title: "Klaar om te Starten?",
      subtitle: "Plan een gratis kennismakingsgesprek en ontdek wat Evotion Coaching voor jou kan betekenen",
      benefits: [
        "Persoonlijke intake en doelanalyse",
        "Op maat gemaakt plan voor jouw situatie",
        "Toegang tot de Evotion Coaching App",
        "Toegang tot e-learning en support portals",
        "Begeleiding door ervaren coaches",
        "Wekelijkse check-ins en voortgangsanalyses",
        "Duurzame resultaten die je leven veranderen",
      ],
    },
  },
]

export default function PresentatieClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Presentation Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Slide {currentSlide + 1} / {slides.length}
            </span>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="text-xs bg-transparent">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[70vh]">
          {/* Intro Slide */}
          {slide.type === "intro" && (
            <div className="h-full min-h-[70vh] flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#1e1839] via-[#2a2050] to-[#1e1839] text-white">
              <div className="max-w-4xl text-center space-y-8">
                <div className="inline-block px-6 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                  Evotion Coaching Programma
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">{slide.title}</h1>
                <p className="text-2xl md:text-3xl text-slate-200 text-balance">{slide.subtitle}</p>
                <div className="pt-8">
                  <Button
                    size="lg"
                    onClick={nextSlide}
                    className="bg-white text-[#1e1839] hover:bg-slate-100 px-8 py-6 text-lg rounded-xl"
                  >
                    Start Presentatie
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Overview Slide */}
          {slide.type === "overview" && (
            <div className="p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                <p className="text-xl text-slate-600 text-balance">{slide.subtitle}</p>
              </div>
              <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
                {slide.phases?.map((phase, idx) => {
                  const Icon = phase.icon
                  return (
                    <div key={idx} className="relative group">
                      <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 text-center space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 mx-auto bg-[#1e1839] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{phase.name}</h3>
                          <p className="text-sm text-slate-600 mt-2">{phase.duration}</p>
                        </div>
                      </div>
                      {idx < 4 && (
                        <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Modular Explanation Section */}
              <div className="mt-16 space-y-8 max-w-5xl mx-auto">
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-bold text-slate-900">{slide.modularExplanation?.title}</h3>
                  <p className="text-lg text-slate-600 text-balance">{slide.modularExplanation?.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {slide.modularExplanation?.points.map((point, idx) => {
                    const Icon = point.icon
                    return (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{point.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{point.description}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gradient-to-br from-[#1e1839] to-[#2a2050] rounded-2xl p-8 text-white">
                  <p className="text-lg leading-relaxed text-center">{slide.modularExplanation?.vision}</p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Slide */}
          {slide.type === "benefits" && (
            <div className="p-12 space-y-10 max-h-[70vh] overflow-y-auto">
              <div className="text-center space-y-4 pb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                <p className="text-xl text-slate-600 text-balance">{slide.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {slide.benefits?.map((benefit, idx) => {
                  const Icon = benefit.icon
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-[#1e1839] rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 ml-[72px]">
                        {benefit.features.map((feature, featureIdx) => (
                          <li key={featureIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#1e1839] shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              {/* App Mockup Preview */}
              <div className="mt-12 bg-gradient-to-br from-[#1e1839] to-[#2a2050] rounded-2xl p-8 text-white">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Bekijk de Evotion Coaching App</h3>
                  <p className="text-slate-200">Al deze tools en meer in één krachtige app</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    {
                      src: "/images/app-screenshots/evotion-dashboard.jpg",
                      alt: "Dashboard",
                    },
                    {
                      src: "/images/app-screenshots/evotion-workout.jpg",
                      alt: "Workouts",
                    },
                    {
                      src: "/images/app-screenshots/evotion-voeding.jpg",
                      alt: "Voeding",
                    },
                  ].map((screen, screenIdx) => (
                    <div key={screenIdx} className="rounded-xl overflow-hidden border-2 border-white/20">
                      <div className="relative w-full aspect-[9/19]">
                        <Image
                          src={screen.src || `/placeholder.svg?height=400&width=190&query=app%20${screen.alt}`}
                          alt={screen.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase Slide */}
          {slide.type === "phase" && (
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-6 pb-6 border-b-2 border-slate-200">
                <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center shrink-0">
                  {slide.icon && <slide.icon className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{slide.title}</h2>
                  <p className="text-lg text-slate-600 mt-2">{slide.duration}</p>
                </div>
              </div>

              <div className="space-y-8 max-w-4xl">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Doel van deze fase:</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">{slide.content?.goal}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Wat je krijgt:</h3>
                  <ul className="space-y-3">
                    {slide.content?.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#1e1839] shrink-0 mt-0.5" />
                        <span className="text-lg text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1e1839] rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Resultaat:</h3>
                  <p className="text-lg leading-relaxed text-slate-100">{slide.content?.result}</p>
                </div>
              </div>
            </div>
          )}

          {/* Phase Goals Slide */}
          {slide.type === "phase-goals" && (
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-6 pb-6 border-b-2 border-slate-200">
                <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center shrink-0">
                  {slide.icon && <slide.icon className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{slide.title}</h2>
                  <p className="text-lg text-slate-600 mt-2">{slide.duration}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {slide.goals?.map((goal, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{goal.title}</h3>
                      <p className="text-slate-600 mt-2">{goal.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {goal.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#1e1839] shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flexibility Slide */}
          {slide.type === "flexibility" && (
            <div className="p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                <p className="text-2xl text-slate-600 text-balance">{slide.content?.title}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {slide.content?.points.map((point, idx) => {
                  const Icon = point.icon
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="w-16 h-16 mx-auto bg-[#1e1839] rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{point.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{point.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA Slide */}
          {slide.type === "cta" && (
            <div className="h-full min-h-[70vh] flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#1e1839] via-[#2a2050] to-[#1e1839] text-white">
              <div className="max-w-4xl text-center space-y-10">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">{slide.content?.title}</h2>
                  <p className="text-xl md:text-2xl text-slate-200 text-balance">{slide.content?.subtitle}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
                  <h3 className="text-2xl font-bold mb-6 text-center">Wat je krijgt:</h3>
                  <ul className="space-y-4">
                    {slide.content?.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
                        <span className="text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-[#1e1839] hover:bg-slate-100 px-10 py-7 text-xl rounded-xl shadow-2xl hover:scale-105 transition-transform"
                  >
                    <a href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                      Plan Gratis Kennismakingsgesprek
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-[#1e1839] w-8" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Gebruik de pijltjestoetsen ← → of klik op de knoppen om te navigeren
        </p>
      </div>
    </div>
  )
}
