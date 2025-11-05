"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Trophy,
  Quote,
  MessageSquare,
  Award,
  TrendingUp,
  Target,
  Dumbbell,
  Calendar,
  Medal,
  Zap,
} from "lucide-react"

export default function ZorinProfileClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  // Animation refs
  const heroAnimation = useScrollAnimation()
  const transformationAnimation = useScrollAnimation()
  const journeyAnimation = useScrollAnimation()
  const timelineAnimation = useScrollAnimation()
  const recordsAnimation = useScrollAnimation()
  const ctaAnimation = useScrollAnimation()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // WhatsApp link with pre-filled message
  const whatsappLink = `https://wa.me/31610935077?text=${encodeURIComponent("Hoi Zorin, ik ben klaar om te starten met begeleiding! Ik kom via jouw coaching pagina.")}`

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pb-3 px-4 bg-gradient-to-b from-gray-50/50 to-transparent md:pt-3 pt-3">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center">
            <Link
              href="/over-ons/coaches"
              className="inline-flex items-center text-gray-600 hover:text-[#1e1839] transition-all group text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:border-[#1e1839] hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Terug naar Coaches
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div
            ref={heroAnimation.ref}
            className={`animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  6x Nederlands Kampioen Powerlifting
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Zorin Wijnands</h1>
                <div className="text-lg md:text-2xl font-semibold mb-6 text-white/90">BigZorin Coaching</div>
                <p className="text-base md:text-xl mb-8 leading-relaxed text-white/90">
                  Van 6x Nederlands Kampioen tot jouw persoonlijke coach. Met jarenlange ervaring op het hoogste niveau
                  help ik jou je doelen te bereiken, of je nu wilt afvallen, sterker worden, of powerlifting wilt leren.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold mb-1">260kg</div>
                    <div className="text-sm text-white/80">Squat PR</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold mb-1">193kg</div>
                    <div className="text-sm text-white/80">Bench PR</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold mb-1">340kg</div>
                    <div className="text-sm text-white/80">Deadlift PR</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="lg" className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold w-full">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Start Je Coaching
                    </Button>
                  </Link>
                  <Link
                    href="https://calendly.com/evotion/evotion-coaching"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] w-full bg-transparent"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Bekijk Diensten
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="/images/design-mode/Zorin%20Wijnands%20%2819%20of%2035%29.jpg"
                    alt="Zorin Wijnands - 6x Nederlands Kampioen Powerlifting tijdens competitie"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-[#1e1839] px-6 py-3 rounded-xl shadow-2xl">
                  <div className="text-sm font-semibold">Team Nederland 2019</div>
                  <div className="text-xs text-gray-600">EK Powerlifting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            ref={transformationAnimation.ref}
            className={`animate-on-scroll ${transformationAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="text-center mb-12">
              <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                Mijn Transformatie
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Van 64kg naar 134kg</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Een verhaal van passie, discipline en het najagen van dromen.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-[650px]">
                  <Image
                    src="/images/design-mode/BigZ%2070kg.jpg"
                    alt="Zorin Wijnands op 70kg - begin van de transformatie"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-2">70kg</div>
                  <p className="text-gray-600">Begin van de reis</p>
                </div>
              </div>

              <div className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-[650px]">
                  <Image
                    src="/images/design-mode/118kg%20bigz.jpg"
                    alt="Zorin Wijnands op 118kg - na transformatie"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-2">118kg</div>
                  <p className="text-gray-600">Na 1.5 jaar intensieve groei</p>
                </div>
              </div>
            </div>

            <div className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-6">Het Verhaal</h3>
              <div className="space-y-6 text-base md:text-lg text-gray-700 leading-loose">
                <p>
                  Mijn transformatie begon op 64kg - extreem mager en zonder enige spiermassa. Wat volgde was een
                  periode van intense focus en wat ik alleen kan omschrijven als een obsessie om te groeien en sterker
                  te worden.
                </p>
                <p>
                  In slechts 1.5 jaar groeide ik 45kg - van 64kg naar 109kg. Op mijn zwaarst woog ik 134kg. Deze periode
                  leerde me alles over voeding, training, herstel en de mentale aspecten van lichaamsverandering.
                </p>
              </div>

              <div className="mt-8 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 text-white">
                <Quote className="w-10 h-10 text-white/30 mb-4" />
                <blockquote className="text-lg md:text-xl italic leading-relaxed font-medium">
                  "Deze transformatie was meer dan alleen fysiek - het vormde mijn begrip van wat het menselijk lichaam
                  kan bereiken met de juiste aanpak, discipline en mindset."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div
            ref={journeyAnimation.ref}
            className={`animate-on-scroll ${journeyAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">De Beginjaren</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Van hobby naar passie, gecoacht door de besten
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-[#1e1839] mb-4">Van Hobby naar Passie</h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Wat begon als een hobby groeide al snel uit tot een passie. Powerlifting gaat niet alleen over kracht,
                  maar over techniek, strategie en mentale voorbereiding. Deze holistische benadering werd de basis van
                  mijn succes.
                </p>
              </div>

              <div className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-[#1e1839] mb-4">Gecoacht door de Besten</h3>
                <ul className="space-y-2">
                  {["Elbert Vastenburg", "Jordi Snijders", "Pjotr Van Der Hoek", "Richard Bell", "Nicky Gorissen"].map(
                    (coach) => (
                      <li key={coach} className="flex items-center text-gray-700">
                        <Award className="w-5 h-5 text-[#1e1839] mr-3 flex-shrink-0" />
                        {coach}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-8 ev-gradient-border bg-white backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] p-8 md:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold text-white mb-2">306kg Wereld Record Attempt</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Badge className="bg-white/20 text-white border-white/30">EK 2019</Badge>
                      <span className="text-sm font-medium">Litouwen, Kaunas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-white">
                <p className="text-base md:text-xl text-gray-700 leading-relaxed mb-6">
                  Op het EK 2019 deed ik een <span className="font-bold text-[#1e1839]">306kg deadlift poging</span>{" "}
                  voor de 1e plaats en een wereld record. Door een technische fout werd de lift afgekeurd - een harde
                  les in powerlifting.
                </p>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-[#1e1839]">
                  <Quote className="w-8 h-8 text-[#1e1839]/20 mb-3" />
                  <blockquote className="text-lg md:text-2xl font-bold text-[#1e1839] mb-2 italic">
                    "Nooit te vroeg juichen"
                  </blockquote>
                  <p className="text-gray-600 font-medium">Dit werd mijn motto na deze ervaring.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            ref={timelineAnimation.ref}
            className={`animate-on-scroll ${timelineAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="text-center mb-16">
              <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
                <Trophy className="w-4 h-4 mr-2" />
                Prestaties
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Mijn Reis: 2017 - 2024</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                Een tijdlijn van mijlpalen en prestaties
              </p>
              <a
                href="https://www.openpowerlifting.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#1e1839] hover:underline font-semibold"
              >
                Bekijk volledige progressie: OpenPowerlifting.org
                <Zap className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[31px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1e1839] via-[#2a1f4d] to-[#1e1839]" />

              <div className="space-y-8">
                {[
                  {
                    year: "2017",
                    title: "Fries Kampioenschap Bankdrukken",
                    description: "Mijn introductie tot powerlifting wedstrijden",
                  },
                  {
                    year: "2018",
                    title: "1e Nederlands Kampioen",
                    description: "Eerste Nederlandse titel - het begin van een dominante periode",
                    highlight: true,
                  },
                  {
                    year: "2019",
                    title: "NK 1e Plek + EK 2e Plek",
                    description: "Nederlands Kampioen + 2e plaats EK met gouden medaille deadlift",
                    highlight: true,
                    special: true,
                  },
                  {
                    year: "2020",
                    title: "NK 1e Plek",
                    description: "Wederom Nederlands Kampioen",
                    highlight: true,
                  },
                  {
                    year: "2021",
                    title: "NK 1e Plek",
                    description: "Opnieuw Nederlands Kampioen",
                    highlight: true,
                  },
                  {
                    year: "2022",
                    title: "Herstel & Focus",
                    description: "Focus op herstel en coaching - soms is een stap terug nodig",
                  },
                  {
                    year: "2023",
                    title: "NK 1e Plek - Comeback",
                    description: "Sterke comeback na blessure",
                    highlight: true,
                  },
                  {
                    year: "2024",
                    title: "NK 1e Plek + Coaching Focus",
                    description: "Opnieuw Nederlands Kampioen",
                    highlight: true,
                  },
                ].map((item, index) => (
                  <div key={item.year} className="relative flex gap-6 group">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        item.special
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500 ring-4 ring-yellow-500/30"
                          : "bg-gradient-to-br from-[#1e1839] to-[#2a1f4d]"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.year}
                    </div>

                    {/* Content card */}
                    <div
                      className={`flex-1 ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                        item.special ? "ring-2 ring-[#1e1839]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-[#1e1839]">{item.title}</h3>
                        {item.highlight && (
                          <Badge className="bg-[#1e1839] text-white flex-shrink-0">
                            <Trophy className="w-3 h-3 mr-1" />
                            1e PLAATS
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Records Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div
            ref={recordsAnimation.ref}
            className={`animate-on-scroll ${recordsAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="text-center mb-12">
              <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
                <Dumbbell className="w-4 h-4 mr-2" />
                Personal Records
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Mijn Beste Lifts</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  lift: "Squat",
                  weight: "260kg",
                  level: "Nationaal Niveau",
                  icon: Dumbbell,
                },
                {
                  lift: "Bench Press",
                  weight: "193kg",
                  level: "Nationaal Niveau",
                  icon: Target,
                },
                {
                  lift: "Deadlift",
                  weight: "340kg",
                  level: "Internationaal Niveau",
                  icon: Trophy,
                },
              ].map((record) => (
                <div
                  key={record.lift}
                  className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <record.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-[#1e1839] mb-3">{record.weight}</div>
                  <div className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">{record.lift}</div>
                  <Badge className="bg-[#1e1839]/10 text-[#1e1839]">{record.level}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl text-center relative z-10">
          <div
            ref={ctaAnimation.ref}
            className={`animate-on-scroll ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
              <h2 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">Klaar om te Beginnen?</h2>
              <p className="text-base md:text-2xl mb-10 leading-relaxed text-white/90 max-w-3xl mx-auto">
                Laat mijn ervaring en expertise jou helpen je doelen te bereiken. Of je nu wilt afvallen, sterker
                worden, of powerlifting wilt leren - ik sta klaar om je te begeleiden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-10 py-6 text-lg w-full sm:w-auto"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Je Coaching
                  </Button>
                </Link>
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] font-semibold px-10 py-6 text-lg w-full sm:w-auto bg-transparent"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Bekijk Diensten
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Zorin Wijnands",
            jobTitle: "Powerlifting Coach",
            description:
              "6x Nederlands Kampioen Powerlifting. Personal coach gespecialiseerd in powerlifting, krachtsport en transformatie coaching.",
            url: "https://evotioncoaching.nl/over-ons/coaches/zorin",
            image: "https://evotioncoaching.nl/images/zorin-foto.png",
            sameAs: ["https://www.openpowerlifting.org"],
            worksFor: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotioncoaching.nl",
            },
            award: [
              "6x Nederlands Kampioen Powerlifting",
              "2e plaats EK Powerlifting 2019",
              "Gouden medaille Deadlift EK 2019",
            ],
            knowsAbout: ["Powerlifting", "Krachtsport", "Personal Training", "Transformatie Coaching"],
          }),
        }}
      />
    </div>
  )
}

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}
