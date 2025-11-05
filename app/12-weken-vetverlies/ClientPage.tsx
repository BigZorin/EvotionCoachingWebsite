"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  CheckCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Clock,
  Smartphone,
  User,
  Trophy,
  Euro,
  BarChart,
  Flame,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TwaalfWekenVetverliesClientPage() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Gestructureerd 12-Weken Programma",
      description:
        "Een volledig uitgestippeld 12-weken programma dat je stap voor stap begeleidt naar je vetverliesdoelen.",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Toegang tot de Evotion App",
      description:
        "Volg je voortgang, krijg toegang tot je trainingsschema's en voedingsplannen, en communiceer met je coach via onze geavanceerde app.",
    },
    {
      icon: <User className="w-8 h-8 text-primary" />,
      title: "Persoonlijke Coach",
      description:
        "Een toegewijde coach die je programma aanpast aan jouw behoeften en je motiveert om je doelen te bereiken.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Op Maat Gemaakt Voedingsplan",
      description: "Een gepersonaliseerd voedingsplan dat is afgestemd op jouw doelen, voorkeuren en levensstijl.",
    },
    {
      icon: <BarChart className="w-8 h-8 text-primary" />,
      title: "Wekelijkse Check-ins",
      description:
        "Regelmatige check-ins met je coach om je voortgang te bespreken en je programma aan te passen waar nodig.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Gegarandeerde Resultaten",
      description:
        "Ons programma is ontworpen om resultaten te leveren. Als je het programma volgt, zul je significante veranderingen zien in je lichaam en gezondheid.",
    },
  ]

  const roadmapSteps = [
    {
      step: "1",
      title: "Intake & Doelstellingen",
      description: "Uitgebreide intake om je huidige situatie en doelen in kaart te brengen.",
      duration: "Week 1",
    },
    {
      step: "2",
      title: "Fundament Leggen",
      description: "Start met je gepersonaliseerde programma en leer de basisprincipes.",
      duration: "Week 2-4",
    },
    {
      step: "3",
      title: "Versnelling",
      description: "Verhoog de intensiteit en zie significante veranderingen in je lichaam.",
      duration: "Week 5-8",
    },
    {
      step: "4",
      title: "Maximalisatie",
      description: "Maximaliseer je resultaten en verfijn je lichaam in de laatste fase.",
      duration: "Week 9-12",
    },
    {
      step: "5",
      title: "Uitbreiden naar Spieropbouw",
      description: "Breid uit naar kracht en spieropbouw met onze 6-maanden Premium Coaching.",
      duration: "Maand 4-6",
    },
    {
      step: "6",
      title: "Levenslange Resultaten",
      description: "Ontwikkel blijvende gewoonten en voorkom het jojo-effect definitief.",
      duration: "Maand 4-12+",
    },
  ]

  const transformations = [
    {
      name: "Martin",
      duration: "12 weken",
      weightLoss: "15kg",
      fatLoss: "12%",
      quote:
        "Het 12-weken programma heeft mijn leven veranderd. Ik heb niet alleen gewicht verloren, maar ook geleerd hoe ik gezond kan leven zonder op te offeren wat ik lekker vind.",
      image: "/images/martin-transformation-new.png",
    },
    {
      name: "Wouter",
      duration: "12 weken",
      weightLoss: "12kg",
      fatLoss: "10%",
      quote:
        "Ik had al van alles geprobeerd, maar niets werkte zo goed als dit programma. De combinatie van persoonlijke begeleiding en de app maakte het verschil.",
      image: "/images/wouter-transformation-new.png",
    },
    {
      name: "Salim",
      duration: "12 weken",
      weightLoss: "18kg",
      fatLoss: "14%",
      quote:
        "De structuur en ondersteuning van het 12-weken programma waren precies wat ik nodig had. Ik heb niet alleen mijn doel bereikt, maar het ook overtroffen!",
      image: "/images/salim-transformation-new.png",
    },
  ]

  const faqs = [
    {
      question: "Is het 12-weken vetverlies programma geschikt voor beginners?",
      answer:
        "Ja, het programma is geschikt voor alle niveaus, inclusief beginners. We passen het programma aan op basis van je huidige fitnessniveau, ervaring en eventuele beperkingen. Beginners krijgen extra aandacht voor het leren van de juiste techniek en het opbouwen van een solide basis. Het programma is progressief opgebouwd, wat betekent dat de intensiteit geleidelijk toeneemt naarmate je sterker en fitter wordt. Onze coaches hebben ruime ervaring met het begeleiden van mensen van alle niveaus.",
    },
    {
      question: "Moet ik specifieke apparatuur hebben voor het programma?",
      answer:
        "Nee, je hebt geen specifieke apparatuur nodig. Het programma kan worden aangepast aan de apparatuur die je tot je beschikking hebt. Of je nu thuis traint met minimale uitrusting, toegang hebt tot een volledig uitgeruste sportschool, of ergens daartussenin zit, we kunnen een effectief programma voor je samenstellen. Tijdens de intake bespreken we welke apparatuur je hebt en hoe we dit optimaal kunnen benutten voor je doelen. We kunnen ook alternatieven suggereren als je bepaalde apparatuur niet hebt.",
    },
    {
      question: "Hoeveel tijd moet ik per week investeren in het programma?",
      answer:
        "Voor optimale resultaten raden we aan om 3-5 keer per week te trainen, met elke sessie die ongeveer 45-60 minuten duurt. Daarnaast is er tijd nodig voor maaltijdplanning en -bereiding, wat ongeveer 2-3 uur per week in beslag neemt. In totaal komt dit neer op ongeveer 5-8 uur per week. Het programma is echter flexibel en kan worden aangepast aan je schema. Als je minder tijd hebt, kunnen we het programma optimaliseren om maximale resultaten te behalen binnen de tijd die je beschikbaar hebt.",
    },
    {
      question: "Wat gebeurt er na de 12 weken?",
      answer:
        "Na afloop van het 12-weken programma heb je verschillende opties. Veel deelnemers kiezen ervoor om door te gaan met een van onze andere coaching diensten, zoals Online Coaching of Premium Coaching, om hun resultaten te behouden en nieuwe doelen te stellen. Anderen hebben voldoende kennis en vaardigheden opgedaan om zelfstandig verder te gaan. In de laatste week van het programma heb je een evaluatiegesprek met je coach waarin je je voortgang bespreekt en samen een plan maakt voor de toekomst. Ongeacht welke optie je kiest, we zorgen ervoor dat je de tools en kennis hebt om je resultaten op lange termijn te behouden.",
    },
    {
      question: "Is er een geld-terug-garantie als ik geen resultaten zie?",
      answer:
        "Ja, we bieden een 100% tevredenheidsgarantie. Als je het programma volledig volgt (inclusief trainingen, voedingsplan en check-ins) en na 12 weken geen significante resultaten hebt behaald, krijg je je geld terug. We zijn zo overtuigd van de effectiviteit van ons programma dat we dit risico graag op ons nemen. Let wel: om in aanmerking te komen voor deze garantie, moet je aantoonbaar het programma hebben gevolgd zoals voorgeschreven door je coach. Dit betekent dat je minimaal 90% van de trainingen hebt voltooid, je aan het voedingsplan hebt gehouden en hebt deelgenomen aan alle geplande check-ins.",
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
              <Flame className="w-4 h-4 mr-2" />
              Transformeer Je Lichaam in 12 Weken
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              12-Weken Vetverlies
              <span className="block text-secondary">Programma</span>
            </h1>

            <p className="text-base md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Een compleet programma ontworpen om je te helpen vet te verliezen, spiermassa op te bouwen en je
              gezondheid te verbeteren in slechts 12 weken.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Nu Voor €497
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Meer Informatie
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-white mb-1">12</div>
                <div className="text-xs md:text-sm text-white/80">Weken</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs md:text-sm text-white/80">Online</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-white mb-1">95%</div>
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
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
              Wat Je Krijgt Met Het <span className="text-primary">12-Weken Programma</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Ons programma biedt alles wat je nodig hebt om je vetverliesdoelen te bereiken en je gezondheid te
              verbeteren.
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
                Alles Wat Je Nodig Hebt <span className="text-primary">In Één App</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Onze geavanceerde app is het centrale punt van je 12-weken programma. Krijg toegang tot je
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
            <Badge className="bg-primary/10 text-primary mb-4">Jouw Reis</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              De <span className="text-primary">Roadmap</span> Van Je 12-Weken Programma
            </h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe jouw 12-weken vetverlies traject eruit ziet en welke mijlpalen je kunt verwachten tijdens je
              reis naar een fitter en gezonder leven.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roadmapSteps.map((step, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-4 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-center mb-4">{step.description}</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {step.duration}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="font-bold text-2xl text-gray-900 mb-4">
                    Klaar voor je <span className="text-primary">12-weken transformatie</span>?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Met onze bewezen aanpak en persoonlijke begeleiding help je je lichaam en gezondheid naar een hoger
                    niveau te tillen.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">Start Nu Je Programma</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Resultaten</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Echte <span className="text-primary">Transformaties</span>
            </h2>
            <p className="text-lg text-gray-600">
              Zie de indrukwekkende resultaten die onze klanten hebben behaald met het 12-weken vetverlies programma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {transformations.map((transformation, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative h-80">
                    <Image
                      src={transformation.image || "/placeholder.svg"}
                      alt={`${transformation.name}'s Transformatie`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="font-bold text-xl mb-1">{transformation.name}</h3>
                      <p className="text-sm text-white/80">{transformation.duration}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{transformation.weightLoss}</div>
                        <div className="text-xs text-gray-500">Gewichtsverlies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{transformation.fatLoss}</div>
                        <div className="text-xs text-gray-500">Vetpercentage</div>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 italic text-sm">"{transformation.quote}"</blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Investering</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Investeer In <span className="text-primary">Jezelf</span>
            </h2>
            <p className="text-lg text-gray-600">
              Begin vandaag nog met het 12-weken vetverlies programma en transformeer je lichaam en gezondheid.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-primary">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 md:p-12 bg-primary text-white">
                    <Badge className="bg-white/20 text-white mb-6">Meest Populair</Badge>
                    <h3 className="text-3xl font-bold mb-2">12-Weken Vetverlies Programma</h3>
                    <div className="flex items-center gap-2 mb-6">
                      <Euro className="w-6 h-6" />
                      <span className="text-4xl font-bold">497</span>
                      <span className="text-white/80">eenmalig</span>
                    </div>
                    <p className="text-white/90 mb-8">
                      Alles wat je nodig hebt om je lichaam te transformeren in 12 weken.
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Volledig gepersonaliseerd programma</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Toegang tot de Evotion App</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Wekelijkse check-ins met je coach</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Op maat gemaakt voedingsplan</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Video-instructies voor alle oefeningen</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-white text-primary hover:bg-gray-100">Start Nu</Button>
                  </div>
                  <div className="p-8 md:p-12">
                    <h4 className="font-bold text-xl text-gray-900 mb-6">Wat je nog meer krijgt:</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Receptenboek</span>
                          <p className="text-sm text-gray-600">
                            50+ heerlijke, gezonde recepten die passen bij je voedingsplan.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Voortgangsmonitoring</span>
                          <p className="text-sm text-gray-600">
                            Houd je voortgang bij met foto's, metingen en grafieken.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Educatieve Content</span>
                          <p className="text-sm text-gray-600">
                            Leer over voeding, training en levensstijl voor blijvende resultaten.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">Community Toegang</span>
                          <p className="text-sm text-gray-600">
                            Word lid van onze community voor extra motivatie en ondersteuning.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">100% Tevredenheidsgarantie</span>
                          <p className="text-sm text-gray-600">
                            Als je het programma volgt en geen resultaten ziet, krijg je je geld terug.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">
              Heb je vragen over het programma? Neem contact met ons op voor meer informatie.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              Neem Contact Op
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Veelgestelde <span className="text-primary">Vragen</span>
            </h2>
            <p className="text-lg text-gray-600">
              Heb je vragen over het 12-weken vetverlies programma? Hieronder vind je antwoorden op de meest gestelde
              vragen.
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
              Begin vandaag nog met het 12-weken vetverlies programma en transformeer je lichaam en gezondheid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl w-full sm:w-auto"
              >
                Start Nu Voor €497
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Neem Contact Op
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
