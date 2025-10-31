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
  MapPin,
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
      title: "Persoonlijke Online Coach",
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
      title: "3 Maanden Online Coaching",
      sessions: "12 weken online begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Maandelijks betalen mogelijk",
      features: [
        "Gepersonaliseerd online trainingsschema",
        "Basis voedingsadvies via app",
        "Wekelijkse online check-ins",
        "Toegang tot Evotion App",
        "Onbeperkte coach support",
        "Online voortgangsanalyses",
      ],
      popular: false,
      note: "Ideaal voor kennismaking met online coaching",
    },
    {
      title: "6 Maanden Online Coaching",
      sessions: "24 weken online begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Beste prijs-kwaliteit verhouding",
      features: [
        "Volledig gepersonaliseerd online programma",
        "Uitgebreid online voedingsplan",
        "Onbeperkte online coach support",
        "Wekelijkse video check-ins",
        "Toegang tot Evotion App",
        "Gedetailleerde online voortgangsanalyses",
        "Seizoensgebonden aanpassingen",
        "Volledige online transformatie cyclus",
        "Online optimalisatie & verfijning fase",
        "Langetermijn online gewoontes opbouwen",
      ],
      popular: true,
      note: "Volledige online transformatie cyclus",
    },
    {
      title: "12 Maanden Online Coaching",
      sessions: "52 weken online begeleiding",
      price: "Op aanvraag",
      pricePerSession: "Maximale online transformatie",
      features: [
        "Volledig op maat gemaakt online programma",
        "Geavanceerd online voedingsplan",
        "Prioriteit online coach support",
        "Wekelijkse online video calls",
        "Toegang tot Evotion App",
        "Gedetailleerde online voortgangsanalyses",
        "Online supplementadvies",
        "Lange termijn online strategie",
      ],
      popular: false,
      note: "Voor maximale online resultaten",
    },
  ]

  const faqs = [
    {
      question: "Hoe effectief is online coaching voor vetverlies?",
      answer:
        "Online coaching is zeer effectief voor vetverlies. Onze online begeleiding heeft bewezen resultaten met gemiddeld 8-15kg vetverlies in 12 weken. Door de combinatie van gepersonaliseerde voedingsplannen, trainingsschema's en continue online support bereiken onze klanten duurzame resultaten. Online vetverlies coaching biedt de flexibiliteit om je programma te volgen wanneer het jou uitkomt, terwijl je nog steeds professionele begeleiding krijgt.",
    },
    {
      question: "Wat maakt online personal training anders dan gewone fitness apps?",
      answer:
        "Online personal training bij Evotion Coaching verschilt van gewone fitness apps doordat je een echte, gekwalificeerde personal trainer toegewezen krijgt. Je krijgt geen standaard programma's, maar volledig gepersonaliseerde trainingsschema's en voedingsplannen. Je online personal trainer past je programma continu aan op basis van je voortgang en feedback. Dit is geen geautomatiseerde app, maar echte menselijke begeleiding via digitale kanalen.",
    },
    {
      question: "Kan ik online spieropbouw bereiken zonder sportschool?",
      answer:
        "Ja, online spieropbouw is zeker mogelijk, ook zonder sportschool. Onze online coaches stellen trainingsschema's samen die aangepast zijn aan jouw beschikbare apparatuur - of dat nu thuis is met minimale uitrusting of in een volledig uitgeruste sportschool. We hebben bewezen methodes voor online spieropbouw met lichaamsgewicht oefeningen, weerstandsbanden, of basic gewichten. Je online begeleiding wordt volledig aangepast aan jouw situatie.",
    },
    {
      question: "Hoe werkt online voedingsbegeleiding precies?",
      answer:
        "Online voedingsbegeleiding bij Evotion Coaching werkt via onze app waar je dagelijks je voeding kunt bijhouden. Je krijgt een gepersonaliseerd voedingsplan dat past bij je doelen (vetverlies, spieropbouw, of body recomposition). Je online coach bekijkt regelmatig je voedingsdagboek en geeft feedback en aanpassingen. We leren je ook de principes achter gezonde voeding, zodat je uiteindelijk zelfstandig goede keuzes kunt maken. Dit is veel persoonlijker dan standaard online dieet apps.",
    },
    {
      question: "Is online fitness coaching geschikt voor beginners?",
      answer:
        "Online fitness coaching is uitstekend geschikt voor beginners. Veel mensen voelen zich comfortabeler om thuis te beginnen met trainen onder begeleiding van een online personal trainer. We besteden extra aandacht aan het leren van de juiste techniek via video-instructies en feedback. Beginners krijgen vaak meer frequente online check-ins om ervoor te zorgen dat ze op het juiste spoor zitten. Online coaching elimineert de drempel van naar een sportschool gaan en biedt een veilige omgeving om te leren.",
    },
    {
      question: "Wat zijn de voordelen van online coaching ten opzichte van offline coaching?",
      answer:
        "Online coaching biedt unieke voordelen: flexibiliteit om te trainen wanneer het jou uitkomt, geen reistijd naar een sportschool of trainer, vaak kosteneffectiever dan persoonlijke training, toegang tot je coach via de app wanneer je vragen hebt, en de mogelijkheid om je programma overal ter wereld te volgen. Je krijgt nog steeds persoonlijke begeleiding, maar met de vrijheid en flexibiliteit die past bij jouw levensstijl. Voor veel mensen is online coaching zelfs effectiever omdat het beter past in hun dagelijkse routine.",
    },
  ]

  const seoServices = [
    {
      title: "Online Vetverlies Coaching",
      description:
        "Bereik je ideale gewicht met onze bewezen online vetverlies methode. Gepersonaliseerde voedingsplannen en trainingsschema's voor duurzaam gewichtsverlies.",
      icon: <Flame className="w-8 h-8 text-primary" />,
      keywords: "online vetverlies, online afvallen, gewichtsverlies coaching",
    },
    {
      title: "Online Spieropbouw Begeleiding",
      description:
        "Bouw spiermassa op met professionele online begeleiding. Trainingsschema's en voedingsadvies voor optimale spieropbouw, thuis of in de sportschool.",
      icon: <Trophy className="w-8 h-8 text-primary" />,
      keywords: "online spieropbouw, muscle building, online fitness",
    },
    {
      title: "Online Personal Training Nederland",
      description:
        "Krijg persoonlijke aandacht van een gekwalificeerde online personal trainer. Volledig op maat gemaakte programma's voor jouw specifieke doelen.",
      icon: <User className="w-8 h-8 text-primary" />,
      keywords: "online personal trainer, online fitness coaching, personal training",
    },
    {
      title: "Online Voedingsbegeleiding",
      description:
        "Leer gezond eten met onze online voedingscoaches. Gepersonaliseerde voedingsplannen en continue begeleiding voor blijvende resultaten.",
      icon: <Brain className="w-8 h-8 text-primary" />,
      keywords: "online voedingsadvies, voedingsbegeleiding, online diëtist",
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
              <MapPin className="w-4 h-4 mr-2" />
              #1 Online Coaching Nederland
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Online Coaching Nederland
              <span className="block text-secondary">Voor Maximale Flexibiliteit</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              De beste online personal training en coaching van Nederland. Professionele online begeleiding voor
              vetverlies, spieropbouw en een gezondere levensstijl. Waar en wanneer het jou uitkomt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Online Coaching
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Bekijk Online Pakketten
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs md:text-sm text-white/80">Online toegang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-xs md:text-sm text-white/80">Online klanten</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-xs md:text-sm text-white/80">Online succesratio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Online Diensten</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Online Coaching <span className="text-primary">Voor Elke Doelstelling</span>
            </h2>
            <p className="text-lg text-gray-600">
              Of je nu online wilt afvallen, spieren wilt opbouwen, of gewoon fitter wilt worden - onze online coaches
              begeleiden je naar succes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {seoServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      <div className="text-sm text-primary font-medium">{service.keywords}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Online Success Stats */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Waarom Kiezen Voor Online Coaching?</h3>
              <p className="text-gray-600">Bewezen resultaten met online begeleiding door heel Nederland</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">8-15kg</div>
                <div className="text-sm text-gray-600">Gemiddeld online vetverlies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">3-8kg</div>
                <div className="text-sm text-gray-600">Online spieropbouw</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12 weken</div>
                <div className="text-sm text-gray-600">Zichtbare online resultaten</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-gray-600">Tevreden online klanten</div>
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
              Waarom Evotion <span className="text-primary">Online Coaching?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Online coaching biedt flexibiliteit en persoonlijke begeleiding, perfect voor mensen die professionele
              ondersteuning willen zonder locatie- of tijdsbeperkingen.
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
                Jouw Online Coach <span className="text-primary">Altijd Bij De Hand</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Onze geavanceerde app is het centrale punt van je online coaching ervaring. Krijg toegang tot je online
                trainingsschema's, voedingsplannen en directe communicatie met je online personal trainer.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Online Trainingsschema's & Video's</h3>
                    <p className="text-gray-600">
                      Toegang tot je gepersonaliseerde online trainingsschema's met video-instructies voor elke
                      oefening.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Online Voortgangsmonitoring</h3>
                    <p className="text-gray-600">
                      Houd je online voortgang bij met foto's, metingen en grafieken om je ontwikkeling te visualiseren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">24/7 Online Coach Communicatie</h3>
                    <p className="text-gray-600">
                      Stel vragen, deel updates en ontvang feedback van je online coach via de ingebouwde chat functie.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button className="bg-primary hover:bg-primary/90">Download De Online Coaching App</Button>
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
                      alt="Evotion Online Coaching App"
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

      {/* Online Coaching Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Online Coaching Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Hoe werkt <span className="text-primary">Online Coaching?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Van online intake tot langetermijn online succes - zo begeleiden we je stap voor stap naar je doelen via
              onze online platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {roadmapSteps.map((step, index) => (
                <div key={index} className="flex gap-6 md:gap-8 group">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl md:text-2xl">{step.step}</span>
                    </div>
                  </div>

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
          </div>
        </div>
      </section>

      {/* Online Coaching Packages */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Online Coaching Pakketten
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kies het <span className="text-primary">Online Pakket</span> dat bij je Past
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van een online kennismaking tot een complete online transformatie - we hebben voor iedereen het juiste
              online coaching pakket.
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
                    Start Online Coaching
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Veelgestelde Vragen Over <span className="text-primary">Online Coaching</span>
            </h2>
            <p className="text-lg text-gray-600">
              Heb je vragen over online coaching, online vetverlies, of online personal training? Hieronder vind je
              antwoorden op de meest gestelde vragen.
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
            <p className="text-gray-500 mb-6">
              Heb je een andere vraag over online coaching die hier niet beantwoord wordt?
            </p>
            <Button className="bg-primary hover:bg-primary/90">Stel Je Online Coaching Vraag</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klaar Om Je <span className="text-secondary">Online Transformatie</span> Te Starten?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Begin vandaag nog met online coaching en ervaar hoe professionele online begeleiding je kan helpen je
              doelen te bereiken. Sluit je aan bij 500+ tevreden online coaching klanten door heel Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Online Coaching Nu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Bekijk Alle Online Diensten
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
