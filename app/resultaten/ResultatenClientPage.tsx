"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Quote,
} from "lucide-react"
import { useState, useEffect } from "react"

export function ResultatenClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTransformation, setActiveTransformation] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const transformations = [
    {
      name: "Salim",
      image: "/images/salim-20transformatie.png",
      quote: "In 26 weken heb ik niet alleen gewicht verloren, maar ook een compleet nieuwe levensstijl opgebouwd!",
      results: ["8.1 kg gewichtsverlies", "Verhoogde energie", "Betere slaapkwaliteit", "Gezonde gewoontes"],
      timeframe: "26 weken",
      focus: "Gewichtsverlies",
    },
    {
      name: "Martin",
      image: "/images/martin-20transformatie.png",
      quote: "In 11 weken heeft Evotion Coaching mijn leven veranderd. Ik voel me sterker en energieker dan ooit!",
      results: ["10.7 kg gewichtsverlies", "Verdubbeling van kracht", "Betere conditie", "Meer zelfvertrouwen"],
      timeframe: "11 weken",
      focus: "Krachttraining",
    },
    {
      name: "Kim",
      image: "/images/vrouw-20transformatie.png",
      quote: "Een prachtig cadeau aan jezelf! Na 3 weken al geweldige resultaten. Veel energie en gezond eten.",
      results: ["Body recomposition", "Meer energie", "Gezonde levensstijl", "Mentaal sterker"],
      timeframe: "12 weken",
      focus: "Levensstijl",
    },
  ]

  const testimonials = [
    {
      name: "Kim Altena",
      text: "Een prachtig cadeau aan jezelf! Na 3 weken al geweldige resultaten. Veel energie, goed slapen en lekker gezond eten. Martin is zeer professioneel en heeft uitgebreide kennis.",
      initial: "K",
    },
    {
      name: "Ingrid Eekhof",
      text: "Martin weet heel goed de balans te bewaren tussen nuchtere professionele benadering en persoonlijke betrokkenheid. De wekelijkse feedback motiveert mij iedere keer weer.",
      initial: "I",
    },
    {
      name: "Wouter Baerveldt",
      text: "Martin heeft veel kennis op gebied van sport, voeding en mindset en weet dit op een toegankelijke maar no-nonsense manier over te brengen. Al mooie resultaten behaald!",
      initial: "W",
    },
    {
      name: "Marcel MPW",
      text: "Martin is een prima coach. Doet en zegt wat hij belooft. Geeft ook ongezouten commentaar. Zegt dingen als: je betaalt me niet om je vriend te zijn, ik ben je coach.",
      initial: "M",
    },
    {
      name: "Casper Lenten",
      text: "Professioneel advies en goede resultaten. Aanrader als je een verschil wil maken in je levensstijl en gezondheid.",
      initial: "C",
    },
    {
      name: "Hessel Van Der Molen",
      text: "Heel erg tevreden over Martin als persoonlijke coach. Hij is streng en zegt waar het op staat. Precies wat ik nodig had!",
      initial: "H",
    },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-rotate transformations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransformation((prev) => (prev + 1) % transformations.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [transformations.length])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* HERO - Paars */}
        <section className="relative bg-[#1e1839] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 mb-6">
                  <Award className="w-4 h-4 mr-2" />
                  Bewezen Resultaten
                </Badge>
              </div>

              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Echte Transformaties
              </h1>

              <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Ontdek hoe onze cliënten hun doelen hebben bereikt met persoonlijke begeleiding en bewezen methodes.
              </p>

              {/* Stats */}
              
            </div>
          </div>
        </section>

        {/* TRANSFORMATIES - Wit */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-xs font-semibold text-[#1e1839]/50 tracking-widest uppercase mb-3">Voor & Na</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
                Transformaties van onze cliënten
              </h2>
            </div>

            {/* Mobile: Carousel */}
            <div className="lg:hidden">
              <div className="relative h-[440px] mb-6 overflow-hidden rounded-2xl shadow-lg">
                {transformations.map((t, index) => (
                  <div
                    key={t.name}
                    onClick={() => setActiveTransformation((index + 1) % transformations.length)}
                    className={`absolute inset-0 cursor-pointer transition-opacity duration-700 ease-in-out ${
                      index === activeTransformation ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={t.image || "/placeholder.svg"}
                      alt={`${t.name}'s transformatie`}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex gap-2 mb-6">
                {transformations.map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setActiveTransformation(i)}
                    className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                      i === activeTransformation ? 'bg-[#1e1839]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Active transformation info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e1839]">{transformations[activeTransformation].name}</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1e1839]/60" />
                    <span className="text-sm text-[#1e1839]/60">{transformations[activeTransformation].timeframe}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic mb-4">"{transformations[activeTransformation].quote}"</p>
                <div className="grid grid-cols-2 gap-2">
                  {transformations[activeTransformation].results.map((result) => (
                    <div key={result} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1e1839] flex-shrink-0" />
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Full cards */}
            <div className="hidden lg:grid grid-cols-3 gap-8">
              {transformations.map((t) => (
                <div key={t.name} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={t.image || "/placeholder.svg"}
                        alt={`${t.name}'s transformatie`}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-[#1e1839] border-0 backdrop-blur-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {t.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-[#1e1839]">{t.name}</h3>
                        <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-0 text-xs">{t.focus}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 italic mb-4">"{t.quote}"</p>
                      <div className="grid grid-cols-2 gap-2">
                        {t.results.map((result) => (
                          <div key={result} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-3.5 h-3.5 text-[#1e1839] flex-shrink-0" />
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS - Paars */}
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-xs font-semibold text-white/50 tracking-widest uppercase mb-3">Google Reviews</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Wat onze cliënten zeggen
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-white/70 text-sm">5.0 op Google</span>
              </div>
            </div>

            {/* Mobile: Scrollable list */}
            <div className="lg:hidden space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1e1839] font-semibold text-sm flex-shrink-0">
                      {testimonial.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e1839] font-semibold">
                      {testimonial.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10">
                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-blue-600">G</span>
                    </div>
                    <span className="text-xs text-white/50">Geverifieerde Google review</span>
                  </div>
                </div>
              ))}
            </div>

            {/* View all button */}
            <div className="text-center mt-12">
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-[#1e1839] rounded-full px-8 bg-transparent"
              >
                <Link
                  href="https://www.google.com/maps/place/Evotion+Coaching/@52.0711063,4.2838,17z/data=!4m8!3m7!1s0x1c82c13b3859e3f7:0xfacee9e3e6614d8b!8m2!3d52.0711063!4d4.2838!9m1!1b1!16s%2Fg%2F11wh6mbrgw?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bekijk alle reviews op Google
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* RESULTATEN DETAIL - Wit */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-xs font-semibold text-[#1e1839]/50 tracking-widest uppercase mb-3">Resultaten in detail</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
                Wat onze cliënten bereiken
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: TrendingUp, title: "Gewichtsverlies", desc: "Gemiddeld 8-10kg in de eerste 12 weken met duurzame aanpak." },
                { icon: Award, title: "Krachtstoename", desc: "Tot verdubbeling van kracht op compound oefeningen." },
                { icon: CheckCircle, title: "Gezonde Gewoontes", desc: "Structurele verandering in voeding, slaap en beweging." },
                { icon: Star, title: "Mentale Groei", desc: "Meer zelfvertrouwen, discipline en focus in het dagelijks leven." },
                { icon: Clock, title: "Duurzame Resultaten", desc: "Geen crash diëten maar resultaten die blijven." },
                { icon: TrendingUp, title: "Lichaamscompositie", desc: "Vetmassa omzetten naar spiermassa voor een gezonder lichaam." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-[#1e1839] group transition-all duration-300 cursor-default"
                  >
                    <div className="w-12 h-12 bg-[#1e1839] group-hover:bg-white rounded-xl flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-6 h-6 text-white group-hover:text-[#1e1839] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e1839] group-hover:text-white mb-2 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-white/70 leading-relaxed transition-colors">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA - Paurs */}
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Jouw transformatie begint hier
              </h2>
              <p className="text-lg text-white/80 mb-10 leading-relaxed">
                Sluit je aan bij onze succesvolle cliënten en start jouw eigen reis. Persoonlijke begeleiding, bewezen resultaten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-full px-8 h-14 text-base font-semibold"
                >
                  <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                    Gratis Kennismaking
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-[#1e1839] rounded-full px-8 h-14 text-base font-semibold bg-transparent"
                >
                  <Link href="/online-coaching">
                    Bekijk programma's
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
