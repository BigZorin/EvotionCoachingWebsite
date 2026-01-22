"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Users, Target, ArrowRight, Star, Dumbbell } from "lucide-react"

export default function CoachesClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCoach, setActiveCoach] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-rotate coaches on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCoach((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(interval)
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

  const coaches = [
    {
      name: "Martin Langenberg",
      role: "Personal Trainer & Coach",
      image: "/images/martin-foto.avif",
      badges: ["25+ Jaar Ervaring", "Gecertificeerd", "Ondernemer & Vader"],
      description: "Met meer dan 25 jaar ervaring in krachttraining en coaching helpt Martin drukke ondernemers en ouders met duurzame transformaties door maatwerk, flexibiliteit en evidence-based methoden.",
      highlights: [
        { title: "Evidence-based coaching", subtitle: "Wetenschappelijk onderbouwde methoden" },
        { title: "Persoonlijke aanpak", subtitle: "Op maat gemaakt voor jouw situatie" },
        { title: "Duurzame resultaten", subtitle: "Focus op lange termijn succes" },
      ],
      link: "/over-ons/coaches/martin",
      buttonText: "Lees Martin's Verhaal",
    },
    {
      name: "Zorin Wijnands",
      role: "6x Nederlands Kampioen",
      image: "/images/zorin-foto.png",
      badges: ["6x Kampioen", "Gecertificeerd", "790kg Total"],
      description: "Als 6-voudig Nederlands kampioen powerlifting combineert Zorin topsport expertise met mentale coaching voor diepgaande transformaties op fysiek én mentaal gebied.",
      highlights: [
        { title: "Powerlifting expertise", subtitle: "Topsport ervaring op nationaal niveau" },
        { title: "Mentale coaching", subtitle: "Doorbreken van mentale barrières" },
        { title: "Bewustwording & groei", subtitle: "Holistische benadering van transformatie" },
      ],
      link: "/over-ons/coaches/zorin",
      buttonText: "Lees Zorin's Verhaal",
    },
  ]

  const stats = [
    { value: "25+", label: "Jaar Ervaring" },
    { value: "6x", label: "NL Kampioen" },
    { value: "500+", label: "Tevreden Klanten" },
    { value: "100%", label: "Gecertificeerd" },
  ]

  const reasons = [
    {
      icon: Award,
      title: "Bewezen Expertise",
      description: "Gecertificeerd door toonaangevende instituten en jarenlange praktijkervaring op het hoogste niveau.",
    },
    {
      icon: Users,
      title: "Persoonlijke Aanpak",
      description: "Geen standaardoplossingen. Elke coaching is op maat gemaakt voor jouw unieke situatie en doelen.",
    },
    {
      icon: Target,
      title: "Duurzame Resultaten",
      description: "Focus op lange termijn transformatie. We maken je sterker én onafhankelijker.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center bg-[#1e1839] overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                <Users className="w-3 h-3 mr-2" />
                ONZE COACHES
              </Badge>
            </div>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Ontmoet de Experts
              <span className="block text-white/80 mt-2">Achter Jouw Succes</span>
            </h1>
            
            <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Twee ervaren coaches met unieke specialisaties, één gemeenschappelijk doel: jou helpen de beste versie van jezelf te worden.
            </p>
          </div>
        </div>
      </section>

      {/* STATS - Wit */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COACHES - Paars */}
      <section className="py-20 lg:py-32 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Jouw Coaches
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Kies de coach die het beste bij jouw doelen past
            </p>
          </div>

          {/* Mobile - Single card with fade */}
          <div className="lg:hidden">
            <div className="relative h-[500px] mb-4 overflow-hidden rounded-2xl">
              {coaches.map((coach, index) => (
                <div
                  key={coach.name}
                  onClick={() => setActiveCoach((index + 1) % coaches.length)}
                  className={`absolute inset-0 cursor-pointer transition-opacity duration-700 ease-in-out ${
                    index === activeCoach ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={coach.image || "/placeholder.svg"}
                    alt={coach.name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{coach.name}</h3>
                    <p className="text-white/80 mb-4">{coach.role}</p>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{coach.description}</p>
                    <Link href={coach.link}>
                      <Button className="w-full bg-white text-[#1e1839] hover:bg-white/90">
                        {coach.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="flex gap-2">
              {coaches.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveCoach(i)}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    i === activeCoach ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop - Two columns */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {coaches.map((coach, index) => (
              <div 
                key={coach.name}
                className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-[500px] overflow-hidden">
                  <Image
                    src={coach.image || "/placeholder.svg"}
                    alt={coach.name}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                      index === 0 ? 'object-[center_20%]' : 'object-top'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1839]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{coach.name}</h3>
                    <p className="text-white/90">{coach.role}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {coach.badges.map((badge) => (
                      <Badge key={badge} className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {coach.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {coach.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-6 h-6 bg-[#1e1839] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{highlight.title}</div>
                          <div className="text-sm text-gray-600">{highlight.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={coach.link}>
                    <Button className="w-full bg-[#1e1839] hover:bg-[#2a1f4d] text-white group/btn">
                      {coach.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY EVOTION - Wit */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20">
              <Star className="w-3 h-3 mr-2" />
              WAAROM EVOTION
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Waarom Kiezen voor Evotion?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Twee verschillende specialisaties, één gemeenschappelijke missie: jouw succes.
            </p>
          </div>

          {/* Mobile - Horizontal scroll */}
          <div className="lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
              {reasons.map((reason, index) => (
                <div 
                  key={reason.title}
                  className="flex-shrink-0 w-[85%] snap-center bg-gray-50 rounded-2xl p-6"
                >
                  <div className="w-14 h-14 bg-[#1e1839] rounded-2xl flex items-center justify-center mb-4">
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop - Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div 
                key={reason.title}
                className="group bg-gray-50 rounded-2xl p-8 hover:bg-[#1e1839] transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[#1e1839] group-hover:bg-white rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500">
                  <reason.icon className="w-8 h-8 text-white group-hover:text-[#1e1839] transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">
                  {reason.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/80 leading-relaxed transition-colors duration-500">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Paars */}
      <section className="py-20 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Klaar om te Beginnen?
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Plan een gratis kennismakingsgesprek en ontdek welke coach en aanpak het beste bij jou past.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-8">
                  Plan Gratis Gesprek
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/#diensten">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 bg-transparent px-8"
                >
                  Bekijk Diensten
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
