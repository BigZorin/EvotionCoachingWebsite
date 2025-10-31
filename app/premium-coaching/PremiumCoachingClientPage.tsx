"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Brain,
  Smartphone,
  Trophy,
  Zap,
  BarChart,
  Dumbbell,
  Users,
  TrendingUp,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PremiumCoachingClientPage() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      title: "Personal Training",
      description:
        "Wekelijkse 1-op-1 trainingssessies met je persoonlijke coach voor directe feedback en optimale techniek.",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Online Coaching",
      description:
        "Volledige toegang tot de Evotion App met gepersonaliseerde trainingsschema's en voedingsplannen voor je zelfstandige trainingen.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "24/7 Coach Support",
      description:
        "Onbeperkte toegang tot je coach via de app voor vragen, feedback en motivatie wanneer je het nodig hebt.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Uitgebreid Voedingsplan",
      description: "Gedetailleerd, op maat gemaakt voedingsplan dat wordt aangepast aan je voortgang en levensstijl.",
    },
    {
      icon: <BarChart className="w-8 h-8 text-primary" />,
      title: "Geavanceerde Voortgangsmonitoring",
      description: "Wekelijkse check-ins en gedetailleerde analyses van je voortgang om je programma te optimaliseren.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Prioriteit Ondersteuning",
      description: "Als Premium klant krijg je voorrang bij het plannen van sessies en snellere reacties op je vragen.",
    },
  ]

  const roadmapSteps = [
    {
      step: "1",
      title: "Uitgebreide Intake",
      description:
        "We beginnen met een diepgaande intake om je huidige situatie, doelen, voorkeuren en eventuele beperkingen in kaart te brengen.",
      duration: "Week 1",
      icon: <Target className="w-6 h-6 text-white" />,
    },
    {
      step: "2",
      title: "Persoonlijk Plan",
      description:
        "Op basis van je intake stellen we een volledig gepersonaliseerd trainings- en voedingsplan op dat perfect aansluit bij jouw doelen.",
      duration: "Week 1",
      icon: <Brain className="w-6 h-6 text-white" />,
    },
    {
      step: "3-4",
      title: "Fundament Leggen",
      description:
        "Je start met wekelijkse personal training sessies en krijgt toegang tot de Evotion App voor je zelfstandige trainingen.",
      duration: "Week 2-4",
      icon: <Dumbbell className="w-6 h-6 text-white" />,
    },
    {
      step: "5-8",
      title: "Intensivering & Aanpassing",
      description:
        "We verhogen de intensiteit van je trainingen en verfijnen je voedingsplan op basis van je voortgang en feedback.",
      duration: "Week 5-8",
      icon: <Zap className="w-6 h-6 text-white" />,
    },
    {
      step: "9-12",
      title: "Versnelde Resultaten",
      description:
        "Je begint nu significante resultaten te zien. We optimaliseren je programma verder om je voortgang te maximaliseren.",
      duration: "Week 9-12",
      icon: <BarChart className="w-6 h-6 text-white" />,
    },
    {
      step: "12+",
      title: "Transformatie & Onderhoud",
      description:
        "Je hebt je initiële doelen bereikt en we werken nu aan het behouden van je resultaten en het stellen van nieuwe uitdagingen.",
      duration: "Week 12+",
      icon: <Trophy className="w-6 h-6 text-white" />,
    },
  ]

  const packages = [
    {
      name: "Premium 3 Maanden",
      price: "Op aanvraag",
      duration: "12 weken intensieve begeleiding",
      commitment: "3 maanden",
      popular: false,
      features: [
        "2 Personal Training sessies per maand",
        "Volledige Online Coaching",
        "Gepersonaliseerd voedingsplan",
        "24/7 coach support",
        "Toegang tot Evotion App",
        "Wekelijkse check-ins",
      ],
    },
    {
      name: "Premium 6 Maanden",
      price: "Op aanvraag",
      duration: "24 weken complete transformatie",
      commitment: "6 maanden",
      popular: true,
      features: [
        "4 Personal Training sessies per maand",
        "Volledige Online Coaching",
        "Uitgebreid voedingsplan",
        "24/7 prioriteit support",
        "Toegang tot Evotion App",
        "Wekelijkse video check-ins",
        "Supplementadvies",
      ],
    },
    {
      name: "Premium 12 Maanden",
      price: "Op aanvraag",
      duration: "52 weken elite begeleiding",
      commitment: "12 maanden",
      popular: false,
      features: [
        "8 Personal Training sessies per maand",
        "Volledige Online Coaching",
        "Op maat gemaakt voedingsplan",
        "24/7 VIP support",
        "Toegang tot Evotion App",
        "2x wekelijkse video check-ins",
        "Supplementadvies",
        "Lifestyle coaching",
      ],
    },
  ]

  const faqs = [
    {
      question: "Wat maakt Premium Coaching anders dan Personal Training of Online Coaching?",
      answer:
        "Premium Coaching combineert het beste van beide werelden: de directe, hands-on begeleiding van Personal Training met de flexibiliteit en continue ondersteuning van Online Coaching. Je krijgt wekelijkse 1-op-1 sessies met je coach én volledige toegang tot onze app met gepersonaliseerde trainingsschema's en voedingsplannen voor je zelfstandige trainingen. Dit zorgt voor optimale resultaten omdat je zowel directe feedback krijgt tijdens je PT-sessies als continue begeleiding voor al je andere trainingen en voeding.",
    },
    {
      question: "Hoe vaak moet ik trainen voor optimale resultaten met Premium Coaching?",
      answer:
        "Voor optimale resultaten raden we aan om 3-5 keer per week te trainen, waarvan 1-2 keer met je personal trainer (afhankelijk van je gekozen pakket) en de overige sessies zelfstandig met begeleiding via de app. Dit geeft je lichaam voldoende stimulans om te verbeteren, maar ook genoeg rust om te herstellen. Je exacte trainingsfrequentie wordt bepaald tijdens je intake en aangepast aan je specifieke doelen, fitnessgeschiedenis en levensstijl.",
    },
    {
      question: "Kan ik mijn Premium Coaching pakket aanpassen aan mijn behoeften?",
      answer:
        "Absoluut! Onze Premium Coaching pakketten zijn flexibel en kunnen worden aangepast aan jouw specifieke behoeften. Als je bijvoorbeeld meer of minder personal training sessies wilt, of specifieke aandacht nodig hebt voor bepaalde aspecten van je training of voeding, kunnen we je pakket daarop afstemmen. Tijdens je intake bespreken we je wensen en stellen we een programma samen dat perfect bij jou past. We evalueren regelmatig of je pakket nog steeds optimaal is voor je doelen en passen het indien nodig aan.",
    },
    {
      question: "Waar vinden de personal training sessies plaats?",
      answer:
        "Onze personal training sessies vinden plaats in onze volledig uitgeruste trainingsruimte in Amsterdam. We hebben alle benodigde apparatuur voor een effectieve en gevarieerde training. Als je liever op een andere locatie traint, zoals bij jou thuis of in een park, kunnen we dit ook bespreken. Voor sommige Premium klanten bieden we ook de mogelijkheid om sessies op locatie te doen, afhankelijk van beschikbaarheid en afstand.",
    },
    {
      question: "Hoe snel kan ik resultaten verwachten met Premium Coaching?",
      answer:
        "Met Premium Coaching zie je doorgaans sneller resultaten dan met alleen Personal Training of Online Coaching, omdat je het beste van beide werelden krijgt. De meeste klanten beginnen binnen 2-3 weken de eerste veranderingen te merken, zoals verbeterde energie en kracht. Zichtbare lichamelijke veranderingen worden meestal na 4-6 weken consistent trainen waargenomen. Na 12 weken hebben de meeste klanten een significante transformatie doorgemaakt. Natuurlijk verschillen resultaten per persoon en zijn ze afhankelijk van factoren zoals genetica, voeding, slaap, stressniveau en hoe consistent je bent met je programma.",
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
              <Award className="w-4 h-4 mr-2" />
              Onze Meest Exclusieve Coaching Ervaring
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Premium Coaching
              <span className="block text-secondary">Het Beste Van Beide Werelden</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Combineer het beste van Personal Training en Online Coaching voor maximale resultaten. Persoonlijke
              begeleiding, continue ondersteuning en een volledig op maat gemaakt programma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Je Transformatie
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
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">2-in-1</div>
                <div className="text-xs md:text-sm text-white/80">PT + Online Coaching</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs md:text-sm text-white/80">Coach Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs md:text-sm text-white/80">Resultaatgericht</div>
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
              Waarom Kiezen Voor <span className="text-primary">Premium Coaching?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Premium Coaching combineert het beste van Personal Training en Online Coaching voor een complete,
              allesomvattende fitness ervaring.
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
                          expandedFeature === index ? "line-clamp-2" : ""
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

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Vergelijking</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Hoe <span className="text-primary">Premium Coaching</span> Zich Onderscheidt
            </h2>
            <p className="text-lg text-gray-600">
              Zie hoe Premium Coaching zich verhoudt tot onze andere diensten en ontdek waarom het onze meest complete
              oplossing is.
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <div className="min-w-[768px]">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-tl-lg border-b-2 border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Kenmerken</h3>
                </div>
                <div className="bg-white p-6 border-b-2 border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Personal Training</h3>
                </div>
                <div className="bg-white p-6 border-b-2 border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Online Coaching</h3>
                </div>
                <div className="bg-primary p-6 rounded-tr-lg border-b-2 border-primary">
                  <h3 className="font-bold text-xl text-white mb-4">Premium Coaching</h3>
                </div>

                {/* 1-op-1 Begeleiding */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">1-op-1 Begeleiding</p>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>

                {/* App Toegang */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">App Toegang</p>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>

                {/* 24/7 Coach Support */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">24/7 Coach Support</p>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>

                {/* Voedingsplan */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">Uitgebreid Voedingsplan</p>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>

                {/* Prioriteit Support */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">Prioriteit Support</p>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                </div>
                <div className="bg-white p-6 border-b border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                </div>

                {/* Snelheid Resultaten */}
                <div className="bg-white p-6 rounded-bl-lg">
                  <p className="font-medium text-gray-900">Snelheid Resultaten</p>
                </div>
                <div className="bg-white p-6 text-center">
                  <Badge className="bg-primary/10 text-primary">Goed</Badge>
                </div>
                <div className="bg-white p-6 text-center">
                  <Badge className="bg-primary/10 text-primary">Goed</Badge>
                </div>
                <div className="bg-white p-6 rounded-br-lg text-center">
                  <Badge className="bg-secondary text-primary">Uitstekend</Badge>
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
              De <span className="text-primary">Roadmap</span> Naar Jouw Droomlichaam
            </h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe jouw Premium Coaching traject eruit ziet en welke mijlpalen je kunt verwachten tijdens je reis
              naar een fitter en gezonder leven.
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
                  <h3 className="text-2xl font-bold text-gray-900">Het Beste Van Beide Werelden</h3>
                </div>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Premium Coaching combineert de directe begeleiding van Personal Training met de flexibiliteit van
                  Online Coaching voor optimale resultaten.
                </p>
                <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                  Start Je Transformatie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
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
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                      <div className="text-sm text-gray-500">{pkg.duration}</div>
                      <div className="text-lg font-medium text-gray-700">{pkg.commitment}</div>
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
              Heb je vragen over Premium Coaching? Hieronder vind je antwoorden op de meest gestelde vragen.
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
              Begin vandaag nog met Premium Coaching en ervaar het beste van beide werelden: Personal Training én Online
              Coaching gecombineerd voor maximale resultaten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Je Transformatie
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
