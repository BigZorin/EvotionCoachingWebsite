"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Users, Target, ArrowRight, Star, Dumbbell } from "lucide-react"

export default function CoachesClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Evotion Coaching Coaches",
      description: "Ontmoet de ervaren coaches van Evotion Coaching",
      itemListElement: [
        {
          "@type": "Person",
          name: "Martin Langenberg",
          jobTitle: "Personal Trainer & Coach",
          description: "25+ jaar ervaring in krachttraining en coaching",
          url: "https://evotioncoaching.nl/over-ons/coaches/martin",
          image: "https://evotioncoaching.nl/images/martin-foto.avif",
          worksFor: {
            "@type": "Organization",
            name: "Evotion Coaching",
          },
        },
        {
          "@type": "Person",
          name: "Zorin Wijnands",
          jobTitle: "Powerlifting Coach & Mental Coach",
          description: "6-voudig Nederlands kampioen powerlifting",
          url: "https://evotioncoaching.nl/over-ons/coaches/zorin",
          image: "https://evotioncoaching.nl/images/zorin-foto.png",
          award: "6x Nederlands Kampioen Powerlifting",
          worksFor: {
            "@type": "Organization",
            name: "Evotion Coaching",
          },
        },
      ],
    }

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20">
              <Users className="w-3 h-3 mr-2" />
              ONZE COACHES
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ontmoet de Experts
              <span className="block text-white/80 mt-2">Achter Jouw Succes</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Twee ervaren coaches met unieke specialisaties, één gemeenschappelijk doel: jou helpen de beste versie van
              jezelf te worden.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1e1839] mb-2">25+</div>
              <div className="text-sm text-gray-600">Jaar Ervaring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1e1839] mb-2">6x</div>
              <div className="text-sm text-gray-600">NL Kampioen</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1e1839] mb-2">500+</div>
              <div className="text-sm text-gray-600">Tevreden Klanten</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1e1839] mb-2">100%</div>
              <div className="text-sm text-gray-600">Gecertificeerd</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Martin Card */}
            <article className="group">
              <Card className="ev-gradient-border bg-white/80 backdrop-blur border-transparent overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src="/images/martin-foto.avif"
                      alt="Martin Langenberg - Gecertificeerde Personal Trainer en Coach met 25+ jaar ervaring in Sneek, Friesland"
                      fill
                      className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1839]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">Martin Langenberg</h2>
                      <p className="text-white/90">Personal Trainer & Coach</p>
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        <Trophy className="w-3 h-3 mr-1" />
                        25+ Jaar Ervaring
                      </Badge>
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        <Award className="w-3 h-3 mr-1" />
                        Gecertificeerd
                      </Badge>
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        <Users className="w-3 h-3 mr-1" />
                        Ondernemer & Vader
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-6 leading-loose text-lg">
                      Met meer dan 25 jaar ervaring in krachttraining en coaching helpt Martin drukke ondernemers en
                      ouders met duurzame transformaties door maatwerk, flexibiliteit en evidence-based methoden.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Evidence-based coaching</div>
                          <div className="text-sm text-gray-600">Wetenschappelijk onderbouwde methoden</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Persoonlijke aanpak</div>
                          <div className="text-sm text-gray-600">Op maat gemaakt voor jouw situatie</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Dumbbell className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Duurzame resultaten</div>
                          <div className="text-sm text-gray-600">Focus op lange termijn succes</div>
                        </div>
                      </div>
                    </div>

                    <Link href="/over-ons/coaches/martin" aria-label="Lees het volledige verhaal van Martin Langenberg">
                      <Button className="w-full bg-gradient-to-r from-[#1e1839] to-[#2a1f4d] hover:opacity-90 text-white group/btn">
                        Lees Martin's Verhaal
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Zorin Card */}
            <article className="group">
              <Card className="ev-gradient-border bg-white/80 backdrop-blur border-transparent overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src="/images/zorin-foto.png"
                      alt="Zorin Wijnands - 6x Nederlands Kampioen Powerlifting en Mental Coach"
                      fill
                      className="object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1839]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">Zorin Wijnands</h2>
                      <p className="text-white/90">6x Nederlands Kampioen</p>
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        <Trophy className="w-3 h-3 mr-1" />
                        6x Kampioen
                      </Badge>
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        <Award className="w-3 h-3 mr-1" />
                        Gecertificeerd
                      </Badge>
                      <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 hover:bg-[#1e1839]/20">
                        790kg Total
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-6 leading-loose text-lg">
                      Als 6-voudig Nederlands kampioen powerlifting combineert Zorin topsport expertise met mentale
                      coaching voor diepgaande transformaties op fysiek én mentaal gebied.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Powerlifting expertise</div>
                          <div className="text-sm text-gray-600">Topsport ervaring op nationaal niveau</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Mentale coaching</div>
                          <div className="text-sm text-gray-600">Doorbreken van mentale barrières</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Bewustwording & groei</div>
                          <div className="text-sm text-gray-600">Holistische benadering van transformatie</div>
                        </div>
                      </div>
                    </div>

                    <Link href="/over-ons/coaches/zorin" aria-label="Lees het volledige verhaal van Zorin Wijnands">
                      <Button className="w-full bg-gradient-to-r from-[#1e1839] to-[#2a1f4d] hover:opacity-90 text-white group/btn">
                        Lees Zorin's Verhaal
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #1e1839 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20">
              <Star className="w-3 h-3 mr-2" />
              WAAROM EVOTION
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Waarom Kiezen voor Evotion Coaches?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Twee verschillende specialisaties, één gemeenschappelijke missie: jouw succes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <Card className="ev-gradient-border bg-white/80 backdrop-blur border-transparent h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors">
                    Bewezen Expertise
                  </h3>
                  <p className="text-gray-600 leading-loose text-lg">
                    Gecertificeerd door toonaangevende instituten en jarenlange praktijkervaring op het hoogste niveau.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="ev-gradient-border bg-white/80 backdrop-blur border-transparent h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors">
                    Persoonlijke Aanpak
                  </h3>
                  <p className="text-gray-600 leading-loose text-lg">
                    Geen standaardoplossingen. Elke coaching is op maat gemaakt voor jouw unieke situatie en doelen.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="ev-gradient-border bg-white/80 backdrop-blur border-transparent h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors">
                    Duurzame Resultaten
                  </h3>
                  <p className="text-gray-600 leading-loose text-lg">
                    Focus op lange termijn transformatie. We maken je sterker én onafhankelijker, niet afhankelijk van
                    coaching.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[rgba(30,24,57,1)]">
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
