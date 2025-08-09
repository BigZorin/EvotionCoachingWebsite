"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Users, Target } from "lucide-react"

export default function CoachesClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Badge className="mb-6 bg-[#1e1839] text-white hover:bg-[#1e1839]/90">ONZE COACHES</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e1839] mb-6">
              Ontmoet de Kracht
              <span className="block text-[#bad4e1]">Achter Jouw Transformatie</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Twee unieke coaches, één gemeenschappelijk doel: jou helpen de beste versie van jezelf te worden. Ontdek
              hun verhalen, expertise en hoe zij jouw reis naar succes kunnen begeleiden.
            </p>
          </div>
        </div>
      </section>

      {/* Coaches Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Martin Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/martin-foto.avif"
                    alt="Martin Langenberg - Personal Trainer & Coach"
                    fill
                    className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Martin Langenberg</h3>
                    <p className="text-white/90">Personal Trainer & Coach</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Trophy className="w-3 h-3 mr-1" />
                      25+ Jaar Ervaring
                    </Badge>
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Award className="w-3 h-3 mr-1" />
                      Gecertificeerd
                    </Badge>
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Users className="w-3 h-3 mr-1" />
                      Ondernemer & Vader
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    25+ jaar ervaring in krachttraining en coaching. Helpt drukke ondernemers en ouders met duurzame
                    transformaties door maatwerk, flexibiliteit en evidence-based methodes.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Evidence-based coaching
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Persoonlijke aanpak
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Duurzame resultaten
                    </div>
                  </div>

                  <Link href="/over-ons/coaches/martin">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white">
                      Lees Martin's Verhaal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Zorin Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/zorin-foto.png"
                    alt="Zorin Wijnands - 6x Nederlands Kampioen Powerlifting"
                    fill
                    className="object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Zorin Wijnands</h3>
                    <p className="text-white/90">6x Nederlands Kampioen</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Trophy className="w-3 h-3 mr-1" />
                      6x Kampioen
                    </Badge>
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Award className="w-3 h-3 mr-1" />
                      790kg Total
                    </Badge>
                    <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#1e1839]">
                      <Users className="w-3 h-3 mr-1" />6 Jaar Coach
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    6-voudig Nederlands kampioen powerlifting (790kg total). Combineert topsport expertise met mentale
                    coaching voor diepgaande fysieke én persoonlijke transformaties.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Powerlifting expertise
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Mentale coaching
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-[#bad4e1]" />
                      Bewustwording & groei
                    </div>
                  </div>

                  <Link href="/over-ons/coaches/zorin">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white">
                      Lees Zorin's Verhaal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">Waarom Kiezen voor Evotion Coaches?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Twee verschillende specialisaties, één gemeenschappelijke missie: jouw succes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-[#bad4e1]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-[#1e1839]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Bewezen Expertise</h3>
              <p className="text-gray-600">
                Gecertificeerd door toonaangevende instituten en jarenlange praktijkervaring op het hoogste niveau.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-[#bad4e1]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#1e1839]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Persoonlijke Aanpak</h3>
              <p className="text-gray-600">
                Geen standaardoplossingen. Elke coaching is op maat gemaakt voor jouw unieke situatie en doelen.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-[#bad4e1]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#1e1839]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Duurzame Resultaten</h3>
              <p className="text-gray-600">
                Focus op lange termijn transformatie. We maken je sterker én onafhankelijker, niet afhankelijk van
                coaching.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#1e1839]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Welke Coach Past Bij Jou?</h2>
          <p className="text-xl text-[#bad4e1] mb-8 leading-relaxed">
            Martin voor flexibele, praktische coaching of Zorin voor intensieve, mentale transformatie. Beide wegen
            leiden naar jouw beste versie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg" className="bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 font-semibold">
                Plan een Gesprek
              </Button>
            </Link>
            <Link href="/#diensten">
              <Button
                size="lg"
                variant="outline"
                className="border-[#bad4e1] text-[#bad4e1] hover:bg-[#bad4e1] hover:text-[#1e1839]"
              >
                Bekijk Onze Diensten
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
