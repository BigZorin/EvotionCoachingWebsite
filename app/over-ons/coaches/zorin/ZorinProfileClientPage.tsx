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
  ChevronRight,
} from "lucide-react"

export default function ZorinProfileClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTimeline, setActiveTimeline] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    // Auto-rotate timeline on mobile
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % 8)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const whatsappLink = `https://wa.me/31610935077?text=${encodeURIComponent("Hoi Zorin, ik ben klaar om te starten met begeleiding! Ik kom via jouw coaching pagina.")}`

  const timelineItems = [
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
      description: "Focus op herstel en coaching",
    },
    {
      year: "2023",
      title: "NK 1e Plek - Comeback",
      description: "Sterke comeback na blessure",
      highlight: true,
    },
    {
      year: "2024",
      title: "NK 1e Plek",
      description: "Opnieuw Nederlands Kampioen",
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Floating Back Button */}
      <Link
        href="/over-ons/coaches"
        className="fixed top-24 left-4 lg:left-8 z-50 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#1e1839] px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 group text-sm font-medium border border-gray-100"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Terug naar Coaches</span>
        <span className="sm:hidden">Terug</span>
      </Link>

      {/* HERO - Paars */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-[#1e1839] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                6x Nederlands Kampioen Powerlifting
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Zorin Wijnands
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-6 font-medium">
                BigZorin Coaching
              </p>
              
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                Van 6x Nederlands Kampioen tot jouw persoonlijke coach. Met jarenlange ervaring op het hoogste niveau help ik jou je doelen te bereiken.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">260kg</div>
                  <div className="text-sm text-white/70">Squat PR</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">193kg</div>
                  <div className="text-sm text-white/70">Bench PR</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">340kg</div>
                  <div className="text-sm text-white/70">Deadlift PR</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold w-full h-14">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Je Coaching
                  </Button>
                </Link>
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] w-full h-14 bg-transparent">
                    <Calendar className="w-5 h-5 mr-2" />
                    Bekijk Diensten
                  </Button>
                </Link>
              </div>
            </div>

            <div className={`relative order-1 lg:order-2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative w-full h-[400px] md:h-[550px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/images/design-mode/Zorin%20Wijnands%20%2819%20of%2035%29.jpg"
                  alt="Zorin Wijnands - 6x Nederlands Kampioen Powerlifting"
                  fill
                  className="object-cover object-[center_25%]"
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
      </section>

      {/* TRANSFORMATIE - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Mijn Transformatie
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Van 64kg naar 134kg</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Een verhaal van passie, discipline en het najagen van dromen.
            </p>
          </div>

          {/* Mobile: Carousel */}
          <div className="lg:hidden">
            <div className="relative h-[500px] mb-4 overflow-hidden rounded-2xl shadow-lg">
              <div className={`absolute inset-0 transition-opacity duration-700 ${activeTimeline % 2 === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Image
                  src="/images/design-mode/BigZ%2070kg.jpg"
                  alt="Zorin Wijnands op 70kg"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-3xl font-bold text-white">70kg</div>
                  <p className="text-white/80">Begin van de reis</p>
                </div>
              </div>
              <div className={`absolute inset-0 transition-opacity duration-700 ${activeTimeline % 2 === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Image
                  src="/images/design-mode/118kg%20bigz.jpg"
                  alt="Zorin Wijnands op 118kg"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-3xl font-bold text-white">118kg</div>
                  <p className="text-white/80">Na 1.5 jaar intensieve groei</p>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mb-8">
              <button type="button" onClick={() => setActiveTimeline(0)} className={`h-1 rounded-full flex-1 transition-all ${activeTimeline % 2 === 0 ? 'bg-[#1e1839]' : 'bg-gray-200'}`} />
              <button type="button" onClick={() => setActiveTimeline(1)} className={`h-1 rounded-full flex-1 transition-all ${activeTimeline % 2 === 1 ? 'bg-[#1e1839]' : 'bg-gray-200'}`} />
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/design-mode/BigZ%2070kg.jpg"
                  alt="Zorin Wijnands op 70kg"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-[#1e1839] mb-2">70kg</div>
                <p className="text-gray-600">Begin van de reis</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/design-mode/118kg%20bigz.jpg"
                  alt="Zorin Wijnands op 118kg"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-[#1e1839] mb-2">118kg</div>
                <p className="text-gray-600">Na 1.5 jaar intensieve groei</p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-[#1e1839] mb-6">Het Verhaal</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Mijn transformatie begon op 64kg - extreem mager en zonder enige spiermassa. Wat volgde was een periode van intense focus en wat ik alleen kan omschrijven als een obsessie om te groeien en sterker te worden.
              </p>
              <p>
                In slechts 1.5 jaar groeide ik 45kg - van 64kg naar 109kg. Op mijn zwaarst woog ik 134kg. Deze periode leerde me alles over voeding, training, herstel en de mentale aspecten van lichaamsverandering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Trophy className="w-4 h-4 mr-2" />
              Prestaties
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Mijn Reis: 2017 - 2024</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
              Een tijdlijn van mijlpalen en prestaties
            </p>
            <a
              href="https://www.openpowerlifting.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              Bekijk volledige progressie op OpenPowerlifting.org
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Mobile: Single card carousel */}
          <div className="lg:hidden">
            <div className="relative h-36 mb-4">
              {timelineItems.map((item, index) => (
                <div
                  key={item.year}
                  onClick={() => setActiveTimeline(index)}
                  className={`absolute inset-0 bg-white rounded-2xl p-6 cursor-pointer transition-all duration-500 ${
                    index === activeTimeline ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      item.special ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-[#1e1839]'
                    }`}>
                      {item.year}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-[#1e1839]">{item.title}</h3>
                        {item.highlight && <Trophy className="w-4 h-4 text-[#1e1839]" />}
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {timelineItems.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveTimeline(i)}
                  className={`h-1 rounded-full flex-1 transition-all ${i === activeTimeline ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Timeline */}
          <div className="hidden lg:block max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/30" />
              <div className="space-y-6">
                {timelineItems.map((item) => (
                  <div key={item.year} className="relative flex gap-6 group">
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0 ${
                      item.special ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-white/20'
                    } group-hover:scale-110 transition-transform`}>
                      {item.year}
                    </div>
                    <div className={`flex-1 bg-white rounded-2xl p-6 hover:shadow-xl transition-all ${item.special ? 'ring-2 ring-yellow-500' : ''}`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-[#1e1839]">{item.title}</h3>
                        {item.highlight && (
                          <Badge className="bg-[#1e1839] text-white flex-shrink-0">
                            <Trophy className="w-3 h-3 mr-1" />
                            1e PLAATS
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL RECORDS - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
              <Dumbbell className="w-4 h-4 mr-2" />
              Personal Records
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Mijn Beste Lifts</h2>
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
              {[
                { lift: "Squat", weight: "260kg", level: "Nationaal Niveau", icon: Dumbbell },
                { lift: "Bench Press", weight: "193kg", level: "Nationaal Niveau", icon: Target },
                { lift: "Deadlift", weight: "340kg", level: "Internationaal Niveau", icon: Trophy },
              ].map((record) => (
                <div key={record.lift} className="flex-shrink-0 w-[280px] snap-center bg-gray-50 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#1e1839] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <record.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-[#1e1839] mb-2">{record.weight}</div>
                  <div className="text-xl font-semibold text-gray-700 mb-2">{record.lift}</div>
                  <Badge className="bg-[#1e1839]/10 text-[#1e1839]">{record.level}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {[
              { lift: "Squat", weight: "260kg", level: "Nationaal Niveau", icon: Dumbbell },
              { lift: "Bench Press", weight: "193kg", level: "Nationaal Niveau", icon: Target },
              { lift: "Deadlift", weight: "340kg", level: "Internationaal Niveau", icon: Trophy },
            ].map((record) => (
              <div key={record.lift} className="bg-gray-50 rounded-2xl p-10 text-center hover:shadow-xl transition-all hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <record.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-[#1e1839] mb-3">{record.weight}</div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">{record.lift}</div>
                <Badge className="bg-[#1e1839]/10 text-[#1e1839]">{record.level}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEGINJAREN - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">De Beginjaren</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Van hobby naar passie, gecoacht door de besten
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Van Hobby naar Passie</h3>
              <p className="text-gray-700 leading-relaxed">
                Wat begon als een hobby groeide al snel uit tot een passie. Powerlifting gaat niet alleen over kracht, maar over techniek, strategie en mentale voorbereiding.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Gecoacht door de Besten</h3>
              <ul className="space-y-2">
                {["Elbert Vastenburg", "Jordi Snijders", "Pjotr Van Der Hoek", "Richard Bell", "Nicky Gorissen"].map((coach) => (
                  <li key={coach} className="flex items-center text-gray-700">
                    <Award className="w-5 h-5 text-[#1e1839] mr-3 flex-shrink-0" />
                    {coach}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* World Record Attempt */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">306kg Wereld Record Attempt</h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge className="bg-white/20 text-white border-white/30">EK 2019</Badge>
                    <span className="text-sm">Litouwen, Kaunas</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Op het EK 2019 deed ik een <span className="font-bold text-[#1e1839]">306kg deadlift poging</span> voor de 1e plaats en een wereld record. Door een technische fout werd de lift afgekeurd - een harde les in powerlifting.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#1e1839]">
                <Quote className="w-8 h-8 text-[#1e1839]/20 mb-3" />
                <blockquote className="text-xl font-bold text-[#1e1839] mb-2 italic">
                  "Nooit te vroeg juichen"
                </blockquote>
                <p className="text-gray-600">Dit werd mijn motto na deze ervaring.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-[#1e1839] rounded-3xl p-10 lg:p-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Klaar om te Beginnen?</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Laat mijn ervaring en expertise jou helpen je doelen te bereiken. Of je nu wilt afvallen, sterker worden, of powerlifting wilt leren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-10 h-14 w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Je Coaching
                </Button>
              </Link>
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] font-semibold px-10 h-14 w-full sm:w-auto bg-transparent">
                  <Calendar className="w-5 h-5 mr-2" />
                  Bekijk Diensten
                </Button>
              </Link>
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
            description: "6x Nederlands Kampioen Powerlifting. Personal coach gespecialiseerd in powerlifting, krachtsport en transformatie coaching.",
            url: "https://evotioncoaching.nl/over-ons/coaches/zorin",
            image: "https://evotioncoaching.nl/images/zorin-foto.png",
            sameAs: ["https://www.openpowerlifting.org"],
            worksFor: {
              "@type": "Organization",
              name: "Evotion Coaching",
              url: "https://evotioncoaching.nl",
            },
            award: ["6x Nederlands Kampioen Powerlifting", "2e plaats EK Powerlifting 2019", "Gouden medaille Deadlift EK 2019"],
            knowsAbout: ["Powerlifting", "Krachtsport", "Personal Training", "Transformatie Coaching"],
          }),
        }}
      />
    </div>
  )
}
