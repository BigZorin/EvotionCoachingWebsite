"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Trophy,
  Brain,
  Quote,
  Calendar,
  MessageCircle,
  Eye,
  Heart,
  Target,
  CheckCircle,
  Award,
  Users,
  Zap,
} from "lucide-react"

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
        <div className="max-w-6xl mx-auto">
          <Link
            href="/over-ons/coaches"
            className="inline-flex items-center text-gray-600 hover:text-[#1e1839] transition-colors group text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Terug naar Coaches
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-12 md:pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  <Badge className="bg-gray-100 text-gray-800 text-sm font-medium border-0">6x NL Kampioen</Badge>
                  <Badge className="bg-gray-100 text-gray-800 text-sm font-medium border-0">790kg Total</Badge>
                  <Badge className="bg-gray-100 text-gray-800 text-sm font-medium border-0">Gecertificeerd</Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-[#1e1839] mb-4 md:mb-6 leading-tight">
                  Zorin Wijnands
                </h1>
                <div className="text-xl md:text-3xl font-semibold text-gray-600 mb-6 md:mb-8 leading-tight">
                  Powerlifting Champion & Mental Coach
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-10 leading-relaxed max-w-2xl">
                  Van 6x Nederlands kampioen powerlifting naar het begeleiden van mensen in hun mentale en fysieke
                  transformatie. Echte kracht komt van binnenuit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-[#1e1839] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1e1839]">6x Nederlands Kampioen</div>
                      <div className="text-sm text-gray-600">Powerlifting Excellence</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Brain className="w-6 h-6 text-[#1e1839] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1e1839]">Mental Coaching</div>
                      <div className="text-sm text-gray-600">Innerlijke Transformatie</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 text-[#1e1839] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1e1839]">790kg Total</div>
                      <div className="text-sm text-gray-600">Elite Performance</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-[#1e1839] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1e1839]">BigZorin Coaching</div>
                      <div className="text-sm text-gray-600">Persoonlijke Begeleiding</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/#contact" className="flex-1">
                    <Button size="lg" className="bg-[#1e1839] text-white hover:bg-[#1e1839]/90 w-full">
                      <Calendar className="w-5 h-5 mr-2" />
                      Start je Transformatie
                    </Button>
                  </Link>
                  <Link href="/#contact" className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full bg-transparent"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Gratis Gesprek
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-6 md:mb-8" />
          <blockquote className="text-2xl md:text-3xl font-medium text-[#1e1839] mb-6 md:mb-8 italic leading-relaxed">
            "De reis naar zelfontdekking is de reis naar kracht. Het vraagt moed om door je angsten heen te gaan en te
            leren vertrouwen op je innerlijke kompas."
          </blockquote>
          <cite className="text-lg md:text-xl text-gray-600 font-semibold">— Zorin Wijnands</cite>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4 md:mb-6">BigZorin Coaching Aanpak</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Een unieke combinatie van topsport ervaring en diepgaande mentale begeleiding voor echte transformatie.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12 md:mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-[#1e1839]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-4">Radicale Eerlijkheid</h3>
                <p className="text-gray-600 leading-relaxed">
                  Geen mooie praatjes. Echte groei begint met het onder ogen zien van de waarheid over jezelf en je
                  patronen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-[#1e1839]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-4">Intentioneel Handelen</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bewuste keuzes die aansluiten bij je waarden, niet vanuit angst of automatische gewoontes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-[#1e1839]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-4">Duurzame Transformatie</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fundamentele veranderingen die je een leven lang meeneemt, niet tijdelijke oplossingen.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What to Expect */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-8 text-center">Wat je kunt verwachten</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Diepgaande Gesprekken</h4>
                      <p className="text-gray-600">Over je patronen, blokkades en innerlijke overtuigingen</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Evidence-Based Training</h4>
                      <p className="text-gray-600">Krachttraining op topniveau met bewezen methodes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Bewustwording Tools</h4>
                      <p className="text-gray-600">Praktische technieken voor zelfontdekking en groei</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Angst naar Vertrouwen</h4>
                      <p className="text-gray-600">Begeleiding om je innerlijke kracht te ontdekken</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Persoonlijke Begeleiding</h4>
                      <p className="text-gray-600">1-op-1 coaching aangepast aan jouw unieke situatie</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e1839] mb-1">Nieuwe Gewoontes</h4>
                      <p className="text-gray-600">Praktische implementatie van nieuwe patronen</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4 md:mb-6">Waarom Zorin?</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <Card className="border-l-4 border-[#1e1839] border-t-0 border-r-0 border-b-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-4">Bewustwording vs. Toepassing</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Er is een cruciaal verschil tussen iets weten en het daadwerkelijk kunnen toepassen. Wanneer je in
                    een gespannen situatie terugvalt in oude patronen, helpt enkel bewustzijn je niet verder.
                  </p>
                  <blockquote className="text-lg italic text-[#1e1839] font-medium">
                    "Nieuwe grond vereist nieuwe actie. Niet je oude patronen volgen, maar vertrouwen op de nieuwe
                    techniek."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                <Zap className="w-8 h-8 text-[#1e1839] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1e1839] mb-1">Topsport Ervaring</h4>
                  <p className="text-gray-600">6x Nederlands kampioen weet wat topprestaties vereisen</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                <Brain className="w-8 h-8 text-[#1e1839] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1e1839] mb-1">Mentale Expertise</h4>
                  <p className="text-gray-600">Diepgaande kennis van innerlijke blokkades doorbreken</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                <Heart className="w-8 h-8 text-[#1e1839] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1e1839] mb-1">Holistische Benadering</h4>
                  <p className="text-gray-600">Fysieke en mentale transformatie gaan hand in hand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-[#1e1839]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">Klaar voor Echte Transformatie?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
            Begin je reis naar zelfontdekking en innerlijke kracht. Ontdek hoe BigZorin Coaching jou kan helpen om van
            angst naar vertrouwen te gaan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/#contact" className="flex-1">
              <Button size="lg" className="bg-white text-[#1e1839] hover:bg-gray-100 font-semibold px-8 w-full">
                <Calendar className="w-5 h-5 mr-2" />
                Start je Transformatie
              </Button>
            </Link>
            <Link href="/#contact" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1e1839] px-8 w-full bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Gratis Gesprek
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
