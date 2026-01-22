"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Target, ArrowRight, Globe, Users, Sparkles, CheckCircle, Eye, Compass } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function VisieEnMissieClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const visionPoints = [
    {
      icon: Globe,
      title: "Gedeelde Menselijkheid",
      description: "We erkennen dat we allemaal mens zijn met dezelfde fundamentele behoeften, uitdagingen en mogelijkheden."
    },
    {
      icon: Users,
      title: "Bewuste Keuzevrijheid",
      description: "Elk individu heeft de kracht om invloed uit te oefenen binnen de kaders van verantwoordelijkheid."
    },
    {
      icon: Eye,
      title: "Limiterende Overtuigingen Doorbreken",
      description: "We helpen je mentale barrières te herkennen en te weerleggen voor echte transformatie."
    },
    {
      icon: Compass,
      title: "Duurzame Groei",
      description: "Geen quick fix, maar een proces van stap voor stap meer rust, balans en vervulling vinden."
    }
  ]

  const missionGoals = [
    {
      number: "1",
      title: "Fysieke Transformatie",
      description: "Meetbare fysieke doelen: vetverlies, spieropbouw, kracht en uithoudingsvermogen met gepersonaliseerde plannen."
    },
    {
      number: "2",
      title: "Mentale Veerkracht",
      description: "Limiterende gedachten herkennen en doorbreken. Omgaan met tegenslagen en een groeimindset ontwikkelen."
    },
    {
      number: "3",
      title: "Duurzame Gewoonten",
      description: "Geen crash diëten, maar een haalbare levensstijl die past bij jouw situatie voor de lange termijn."
    },
    {
      number: "4",
      title: "Zelfstandigheid",
      description: "Kennis, tools en vaardigheden om na het traject zelf je gezondheid en groei te blijven managen."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative bg-[#1e1839] py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="bg-white/10 text-white border-white/20 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Onze Filosofie
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Visie & Missie
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Waar we voor staan en hoe we jou helpen je doelen te bereiken
            </p>

            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 mt-4">
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold text-white italic">
                "It is time to bring your evolution in motion"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* VISIE - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Waar We Voor Staan
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Onze Visie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Een verlengstuk van universele waarheid
            </p>
          </div>

          {/* Intro tekst */}
          <div className="max-w-3xl mx-auto mb-12 lg:mb-16">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Bij Evotion draait alles om het doorbreken van limiterende overtuigingen die je tegenhouden. Veel
              mensen leven met onbewuste gedachtepatronen en geloven die hun potentieel beperken.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Wij helpen je deze mentale barrières te herkennen en te weerleggen, zodat je kunt zien wat werkelijk 
              mogelijk is in plaats van wat je altijd hebt gedacht dat mogelijk was.
            </p>
          </div>

          {/* Vision Points Grid - Mobile horizontal scroll */}
          <div className="lg:hidden overflow-x-auto -mx-6 px-6 pb-4">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {visionPoints.map((point, index) => (
                <div
                  key={index}
                  className="w-72 flex-shrink-0 bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center mb-4">
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1e1839] mb-2">{point.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {visionPoints.map((point, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#1e1839] rounded-xl flex items-center justify-center mb-5">
                  <point.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1839] mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISIE UITLEG - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-8">
              Onze visie gaat verder dan alleen individuele doelen
            </h3>
            
            <div className="space-y-6 text-left">
              <p className="text-lg text-white/90 leading-relaxed">
                We kijken naar de bredere context van je leven en hoe verschillende aspecten met elkaar 
                samenhangen. Wat wij bieden is begeleiding die rekening houdt met het grotere plaatje 
                van wie je bent en waar je naartoe wilt.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed">
                Evotion biedt coaching die gebaseerd is op bewezen principes en praktische ervaring. 
                Deze aanpak is eerlijk, open en transparant. We streven ernaar dat iedereen die met 
                ons werkt, deze waarden begrijpt en de kracht ervan in hun eigen leven ervaart.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed">
                Evotion is geen quick fix, maar een proces van duurzame groei. In elke stap werken 
                we aan een realistisch beeld van waar je staat en wat mogelijk is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIE - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Wat We Doen
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Onze Missie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Concrete doelen en praktische resultaten
            </p>
          </div>

          {/* Intro tekst */}
          <div className="max-w-3xl mx-auto mb-12 lg:mb-16">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              De missie van Evotion is helder: we begeleiden mensen naar meetbare resultaten op het gebied van
              fysieke gezondheid, mentale veerkracht en persoonlijke groei.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ons proces is gebaseerd op bewezen methoden uit sportwetenschap, gedragspsychologie en coaching. 
              We combineren fysieke training met mentale begeleiding om duurzame verandering te realiseren.
            </p>
          </div>

          {/* Mission Goals - Mobile */}
          <div className="lg:hidden space-y-4 max-w-lg mx-auto">
            {missionGoals.map((goal, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1e1839] rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {goal.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1e1839] mb-2">{goal.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {missionGoals.map((goal, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {goal.number}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1e1839] mb-3">{goal.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCES - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                <CheckCircle className="w-4 h-4 mr-2" />
                Ons Proces
              </Badge>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Ons Proces in de Praktijk
              </h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-white/90 leading-relaxed">
                Elk traject begint met een grondige intake waarin we je huidige situatie, doelen en 
                uitdagingen in kaart brengen. Van daaruit stellen we een persoonlijk plan op met 
                concrete mijlpalen en meetbare voortgang.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed">
                Tijdens het traject combineren we fysieke training met mentale coaching, voedingsbegeleiding 
                en regelmatige evaluaties. We passen de aanpak aan waar nodig en vieren samen de successen.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
                <p className="text-white font-semibold text-lg text-center">
                  Het resultaat: een sterkere, gezondere en zelfverzekerder versie van jezelf.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-4xl font-bold text-[#1e1839] mb-6">
              Klaar om jouw evolutie in beweging te brengen?
            </h3>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Ontdek hoe onze coaching jou kan helpen om in harmonie te leven met je hoogste potentieel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                asChild
              >
                <Link href="/contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#1e1839]/20 text-[#1e1839] hover:bg-[#1e1839]/5 font-semibold px-8 py-6 text-base rounded-xl bg-transparent"
                asChild
              >
                <Link href="/over-ons/coaches">Ontmoet Onze Coaches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
