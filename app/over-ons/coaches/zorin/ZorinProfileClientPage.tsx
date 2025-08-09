"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Brain, Quote, Calendar, MessageCircle, Eye, Heart, Target, CheckCircle } from "lucide-react"

export default function ZorinProfileClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Navigation */}
      <section className="pt-20 md:pt-24 pb-4 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/over-ons/coaches"
            className="inline-flex items-center text-[#1e1839] hover:text-[#bad4e1] transition-colors group text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Terug naar Coaches
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-12 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                  <Badge className="bg-[#1e1839] text-white text-xs md:text-sm">6x NL Kampioen</Badge>
                  <Badge className="bg-[#1e1839] text-white text-xs md:text-sm">BigZorin Coaching</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-3 md:mb-4 leading-tight">
                  Zorin Wijnands
                </h1>
                <div className="text-xl md:text-2xl font-bold text-[#bad4e1] mb-4 md:mb-6 leading-tight">
                  Echte Transformatie Begint Van Binnenuit
                </div>
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                  6x Nederlands kampioen powerlifting die mensen helpt om niet alleen fysiek sterker te worden, maar ook
                  mentaal — door radicale eerlijkheid en bewustwording.
                </p>

                <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">6x Nederlands Kampioen Powerlifting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">Specialist in innerlijke transformatie</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">Focus op bewustwording en patronen</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/#contact" className="w-full">
                    <Button size="lg" className="bg-[#1e1839] text-white hover:bg-[#1e1839]/90 w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Start je Transformatie
                    </Button>
                  </Link>
                  <Link href="/#contact" className="w-full">
                    <Button size="lg" variant="outline" className="border-[#1e1839] text-[#1e1839] w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Gratis Gesprek
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/zorin-foto.png"
                    alt="Zorin Wijnands - BigZorin Coaching"
                    fill
                    className="object-cover object-[center_10%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-12 md:py-16 px-4 bg-[#1e1839]">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 md:w-12 md:h-12 text-[#bad4e1] mx-auto mb-4 md:mb-6 opacity-50" />
          <blockquote className="text-lg md:text-2xl font-medium text-white mb-4 md:mb-6 italic leading-relaxed">
            "De reis naar zelfontdekking is de reis naar kracht. Het vraagt moed om door je angsten heen te gaan en te
            leren vertrouwen op je innerlijke kompas."
          </blockquote>
          <cite className="text-[#bad4e1] text-base md:text-lg font-semibold">— Zorin Wijnands</cite>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-6 md:mb-8">Waarom Zorin?</h2>

          <div className="text-base md:text-lg text-gray-700 space-y-4 md:space-y-6 mb-8 md:mb-12">
            <p>
              Als 6x Nederlands kampioen powerlifting met 790kg total weet Zorin wat topprestaties vereisen. Maar zijn
              echte kracht ligt in het helpen van mensen om hun innerlijke blokkades te doorbreken.
            </p>
            <p>
              Bij BigZorin Coaching draait het om radicale eerlijkheid naar jezelf. Geen quick fixes, maar duurzame
              transformatie die begint met bewustwording.
            </p>
          </div>

          <Card className="border-l-4 border-[#bad4e1]">
            <CardContent className="p-6 md:p-8 text-left">
              <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-3 md:mb-4">Bewustwording vs. Toepassing</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
                Er is een cruciaal verschil tussen iets weten en het daadwerkelijk kunnen toepassen. Wanneer je in een
                gespannen situatie terugvalt in oude patronen, helpt enkel bewustzijn je niet verder.
              </p>
              <blockquote className="text-base md:text-lg italic text-[#1e1839] font-medium">
                "Nieuwe grond vereist nieuwe actie. Niet je oude patronen volgen, maar vertrouwen op de nieuwe
                techniek."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-8 md:mb-12 text-center">
            BigZorin Coaching Aanpak
          </h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-8 md:mb-12">
            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Eye className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Radicale Eerlijkheid</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Geen mooie praatjes. Echte groei begint met het onder ogen zien van de waarheid
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Intentioneel Handelen</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Bewuste keuzes die aansluiten bij je waarden, niet vanuit angst of gewoonte
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Duurzame Transformatie</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Fundamentele veranderingen die je een leven lang meeneemt
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-4 md:mb-6 text-center">
                Wat je kunt verwachten
              </h3>
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">
                    Diepgaande gesprekken over je patronen en blokkades
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Evidence-based krachttraining op topniveau</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Tools voor bewustwording en zelfontdekking</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Begeleiding van angst naar vertrouwen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-[#1e1839]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Klaar voor Echte Transformatie?</h2>
          <p className="text-lg md:text-xl text-[#bad4e1] mb-6 md:mb-8 leading-relaxed">
            Begin je reis naar zelfontdekking en innerlijke kracht. Ontdek hoe BigZorin Coaching jou kan helpen om van
            angst naar vertrouwen te gaan.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
            <Link href="/#contact" className="w-full md:w-auto">
              <Button
                size="lg"
                className="bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 font-semibold px-6 md:px-8 w-full md:w-auto"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start je Transformatie
              </Button>
            </Link>
            <Link href="/#contact" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-[#bad4e1] text-[#bad4e1] hover:bg-[#bad4e1] hover:text-[#1e1839] px-6 md:px-8 w-full md:w-auto"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Gratis Kennismakingsgesprek
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
