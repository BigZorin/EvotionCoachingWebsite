"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Heart,
  Quote,
  MessageCircle,
  Award,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  CheckCircle,
  BookOpen,
  Dumbbell,
  Brain,
  Utensils,
} from "lucide-react"

export default function MartinProfileClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCert, setActiveCert] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    // Auto-rotate certifications on mobile
    const interval = setInterval(() => {
      setActiveCert((prev) => (prev + 1) % 7)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const whatsappLink = `https://wa.me/31610935077?text=${encodeURIComponent("Hoi Martin, ik wil graag meer weten over coaching!")}`

  const certifications = [
    {
      title: "Metabolism School",
      org: "Sam Miller",
      year: "2025",
      desc: "Metabolisme, hormonen en energiebalans.",
      highlight: true,
      icon: Brain,
    },
    {
      title: "J3 University Level 1",
      org: "John Jewett",
      year: "2025",
      desc: "Bodybuilding coaching en wedstrijdvoorbereiding.",
      highlight: true,
      icon: Dumbbell,
    },
    {
      title: "Personal Trainer",
      org: "Menno Henselmans",
      year: "2024",
      desc: "Wetenschappelijk onderbouwde krachttraining.",
      icon: Dumbbell,
    },
    {
      title: "Nutrition & Program Design",
      org: "N1 Education",
      year: "2024",
      desc: "Voeding en trainingsschema ontwerp.",
      highlight: true,
      icon: Utensils,
    },
    {
      title: "Practical Nutrition 1 & 2",
      org: "Frank den Blanken",
      year: "2024",
      desc: "Praktische voedingscoaching.",
      icon: Utensils,
    },
    {
      title: "Personal Trainer Academie",
      org: "Frank den Blanken",
      year: "2024",
      desc: "Klantbegeleiding en resultaatgericht werken.",
      icon: Award,
    },
    {
      title: "Biomechanics Course",
      org: "N1 Education",
      year: "2024",
      desc: "Bewegingsleer en optimale uitvoering.",
      icon: Target,
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
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  25+ Jaar Ervaring
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Award className="w-3 h-3 mr-1" />
                  N1 Certified
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Martin Langenberg
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-4 font-medium">
                Head Coach Evotion
              </p>
              
              <p className="text-base md:text-lg text-white/70 mb-6 leading-relaxed max-w-xl">
                Personal trainer die drukke professionals helpt fit en gezond te blijven. Met 25+ jaar ervaring en de nieuwste wetenschappelijke inzichten.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">25+</div>
                  <div className="text-xs text-white/70">Jaar Ervaring</div>
                </div>
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">7</div>
                  <div className="text-xs text-white/70">Certificeringen</div>
                </div>
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">100+</div>
                  <div className="text-xs text-white/70">Klanten</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold w-full sm:w-auto">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    WhatsApp Martin
                  </Button>
                </Link>
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] w-full sm:w-auto bg-transparent">
                    <Calendar className="w-5 h-5 mr-2" />
                    Gratis Gesprek
                  </Button>
                </Link>
              </div>
            </div>

            <div className={`relative order-1 lg:order-2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative w-full h-[350px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
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
      </section>

      {/* ABOUT - Wit */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Over Martin
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Waarom Martin?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {[
              { icon: Clock, title: "25+ Jaar Ervaring", desc: "Praktijkervaring gecombineerd met de nieuwste wetenschappelijke inzichten." },
              { icon: Heart, title: "Begrip voor Jouw Leven", desc: "Als ondernemer en vader begrijpt hij de uitdagingen van een druk leven." },
              { icon: GraduationCap, title: "Altijd Leren", desc: "Continu bijscholen bij de beste in het vakgebied wereldwijd." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#1e1839] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-[#1e1839] mb-2">{item.title}</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-[#1e1839] rounded-2xl p-6 lg:p-10 max-w-3xl mx-auto">
            <Quote className="w-8 h-8 text-white/40 mb-4" />
            <blockquote className="text-lg lg:text-xl text-white italic mb-4 leading-relaxed">
              "Ik train je voor het leven, niet alleen voor de gym. Het gaat om duurzame verandering die past bij wie je bent."
            </blockquote>
            <cite className="text-white/80 font-semibold not-italic">— Martin Langenberg</cite>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS - Paars */}
      <section className="py-16 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <GraduationCap className="w-4 h-4 mr-2" />
              Opleidingen
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Expertise & Certificeringen
            </h2>
            <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto">
              Continu investeren in kennis bij de beste coaches en instituten ter wereld.
            </p>
          </div>

          {/* Mobile: Carousel */}
          <div className="lg:hidden">
            <div className="relative h-48 mb-4">
              {certifications.map((cert, index) => (
                <button
                  type="button"
                  key={cert.title}
                  onClick={() => setActiveCert(index)}
                  className={`absolute inset-0 bg-white rounded-2xl p-5 text-left transition-all duration-500 ${
                    index === activeCert ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      cert.highlight ? 'bg-gradient-to-br from-[#1e1839] to-purple-600' : 'bg-[#1e1839]'
                    }`}>
                      <cert.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-[#1e1839] truncate">{cert.title}</h3>
                        {cert.highlight && <Award className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{cert.org} ({cert.year})</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{cert.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {certifications.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveCert(i)}
                  className={`h-1 rounded-full flex-1 transition-all ${i === activeCert ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div 
                key={cert.title} 
                className={`bg-white rounded-2xl p-6 hover:shadow-xl transition-all group ${
                  cert.highlight ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                    cert.highlight ? 'bg-gradient-to-br from-[#1e1839] to-purple-600' : 'bg-[#1e1839]'
                  }`}>
                    <cert.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1e1839]">{cert.title}</h3>
                    <p className="text-sm text-gray-500">{cert.org} ({cert.year})</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{cert.desc}</p>
                {cert.highlight && (
                  <Badge className="mt-4 bg-purple-100 text-purple-700">Highlight</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH - Wit */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] mb-4">
              <Target className="w-4 h-4 mr-2" />
              Werkwijze
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Mijn Aanpak
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { 
                step: "01", 
                title: "Maatwerk", 
                desc: "Geen standaard schema's maar oplossingen die passen bij jouw leven, werk en gezin.",
                icon: Target,
              },
              { 
                step: "02", 
                title: "Flexibiliteit", 
                desc: "Aanpasbaar aan jouw drukte zodat je kunt volhouden, ook in drukke periodes.",
                icon: TrendingUp,
              },
              { 
                step: "03", 
                title: "Educatie", 
                desc: "Je leert waarom je doet wat je doet, zodat je uiteindelijk zelfstandig verder kunt.",
                icon: BookOpen,
              },
            ].map((step, i) => (
              <div key={i} className="relative bg-gray-50 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all group">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#1e1839] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-[#1e1839]/10 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:bg-[#1e1839] transition-colors">
                  <step.icon className="w-6 h-6 text-[#1e1839] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-[#1e1839] mb-2">{step.title}</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Paars */}
      <section className="py-16 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Klaar om te starten?
            </h2>
            <p className="text-base lg:text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Plan een gratis kennismakingsgesprek en ontdek hoe Martin jou kan helpen je doelen te bereiken.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  WhatsApp Martin
                </Button>
              </Link>
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] w-full sm:w-auto bg-transparent">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Gratis Gesprek
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
