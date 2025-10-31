"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Users, Target, ArrowRight } from "lucide-react"

export default function CoachesClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Badge className="mb-6 bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">ONZE COACHES</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ontmoet de Experts
              <span className="block text-gray-600">Achter Jouw Succes</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Twee ervaren coaches met unieke specialisaties, één gemeenschappelijk doel: jou helpen de beste versie van
              jezelf te worden.
            </p>
          </div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Martin Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/martin-foto.avif"
                    alt="Martin Langenberg - Personal Trainer & Coach"
                    fill
                    className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">Martin Langenberg</h3>
                    <p className="text-white/90 text-sm">Personal Trainer & Coach</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      25+ Jaar Ervaring
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Gecertificeerd
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Ondernemer & Vader
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    25+ jaar ervaring in krachttraining en coaching. Helpt drukke ondernemers en ouders met duurzame
                    transformaties door maatwerk en flexibiliteit.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Evidence-based coaching
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Persoonlijke aanpak
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Duurzame resultaten
                    </div>
                  </div>

                  <Link href="/over-ons/coaches/martin">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group">
                      Lees Martin's Verhaal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Zorin Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/zorin-foto.png"
                    alt="Zorin Wijnands - 6x Nederlands Kampioen Powerlifting"
                    fill
                    className="object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">Zorin Wijnands</h3>
                    <p className="text-white/90 text-sm">6x Nederlands Kampioen</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      6x Kampioen
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Gecertificeerd
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      790kg Total
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    6-voudig Nederlands kampioen powerlifting. Combineert topsport expertise met mentale coaching voor
                    diepgaande transformaties.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Powerlifting expertise
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Mentale coaching
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                      Bewustwording & groei
                    </div>
                  </div>

                  <Link href="/over-ons/coaches/zorin">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group">
                      Lees Zorin's Verhaal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom Kiezen voor Evotion Coaches?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Twee verschillende specialisaties, één gemeenschappelijke missie: jouw succes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Award className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bewezen Expertise</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gecertificeerd door toonaangevende instituten en jarenlange praktijkervaring op het hoogste niveau.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Persoonlijke Aanpak</h3>
                <p className="text-gray-600 leading-relaxed">
                  Geen standaardoplossingen. Elke coaching is op maat gemaakt voor jouw unieke situatie en doelen.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Target className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Duurzame Resultaten</h3>
                <p className="text-gray-600 leading-relaxed">
                  Focus op lange termijn transformatie. We maken je sterker én onafhankelijker, niet afhankelijk van
                  coaching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Klaar om te Beginnen?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Plan een gratis kennismakingsgesprek en ontdek welke coach en aanpak het beste bij jou past.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                Plan Gratis Gesprek
              </Button>
            </Link>
            <Link href="/#diensten">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
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
