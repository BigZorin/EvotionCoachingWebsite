"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, GraduationCap, Heart, Quote, Calendar, MessageCircle, CheckCircle } from "lucide-react"

export default function MartinProfileClientPage() {
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
                  <Badge className="bg-[#1e1839] text-white text-xs md:text-sm">25+ Jaar Ervaring</Badge>
                  <Badge className="bg-[#1e1839] text-white text-xs md:text-sm">Ondernemer & Vader</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-3 md:mb-4 leading-tight">
                  Martin Langenberg
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                  Personal trainer en coach die drukke professionals helpt om fit en gezond te blijven — met een aanpak
                  die écht past bij jouw leven.
                </p>

                <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">25+ jaar ervaring in krachttraining</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">Gecertificeerd via Menno Henselmans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#bad4e1] flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700">
                      Specialist voor drukke ouders en ondernemers
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/#contact" className="w-full">
                    <Button size="lg" className="bg-[#1e1839] text-white hover:bg-[#1e1839]/90 w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Start met Martin
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
                    src="/images/martin-foto.avif"
                    alt="Martin Langenberg - Personal Trainer"
                    fill
                    className="object-cover object-[center_20%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-6 md:mb-8">Waarom Martin?</h2>

          <div className="text-base md:text-lg text-gray-700 space-y-4 md:space-y-6 mb-8 md:mb-12">
            <p>
              Als ondernemer en vader van drie weet Martin hoe uitdagend het is om fit te blijven. Zijn 25+ jaar
              ervaring heeft hem geleerd wat écht werkt voor drukke mensen.
            </p>
            <p>
              Geen standaardoplossingen, maar maatwerk dat past bij jouw leven. Met kennis van Menno Henselmans en N1
              Education zorgt hij voor duurzame resultaten.
            </p>
          </div>

          <Card className="bg-[#1e1839] text-white">
            <CardContent className="p-6 md:p-8">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#bad4e1] mx-auto mb-3 md:mb-4 opacity-50" />
              <blockquote className="text-lg md:text-xl italic mb-3 md:mb-4 leading-relaxed">
                "Ik train je voor het leven, niet alleen voor de gym. Echte transformatie gebeurt wanneer gezonde
                gewoontes zo natuurlijk worden als ademhalen."
              </blockquote>
              <cite className="text-[#bad4e1] font-semibold text-sm md:text-base">— Martin Langenberg</cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-8 md:mb-12 text-center">Martin's Aanpak</h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-8 md:mb-12">
            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-base">1</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Maatwerk</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Geen standaard programma's, maar oplossingen die passen bij jouw leven en schema
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-base">2</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Flexibiliteit</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Aanpasbaar aan jouw drukte, zodat je altijd kunt blijven volhouden
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-base">3</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1e1839] mb-2 md:mb-3">Educatie</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Je leert waarom je doet wat je doet, zodat je onafhankelijk wordt
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
                    Persoonlijk trainingsplan dat past bij jouw schema
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Voedingsadvies zonder extreme diëten</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Regelmatige check-ins en bijsturing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1e1839] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-gray-700">Kennis en tools om zelf verder te gaan</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-[#1e1839]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Klaar om te Beginnen?</h2>
          <p className="text-lg md:text-xl text-[#bad4e1] mb-6 md:mb-8 leading-relaxed">
            Ontdek hoe Martin's persoonlijke aanpak jou kan helpen om duurzame resultaten te boeken, zelfs met een druk
            schema.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
            <Link href="/#contact" className="w-full md:w-auto">
              <Button
                size="lg"
                className="bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 font-semibold px-6 md:px-8 w-full md:w-auto"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start met Martin
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
