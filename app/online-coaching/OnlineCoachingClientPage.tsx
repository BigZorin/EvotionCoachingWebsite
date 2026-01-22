"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Zap,
  TrendingUp,
  Award,
  Mail,
  MessageCircle,
  Play,
  Heart,
  Puzzle,
  Layers,
  Calendar,
  Dumbbell,
  Apple,
  LineChart,
  RotateCcw,
  Clock,
  Star,
  ArrowRight,
  Video,
  GraduationCap,
  User,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function OnlineCoachingClientPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTransformation, setActiveTransformation] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const transformationRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-scroll transformations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransformation((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll features (slower, 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (featuresRef.current) {
      const cardWidth = 280 + 16 // card width + gap
      const scrollAmount = activeFeature * cardWidth
      featuresRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [activeFeature])

  useEffect(() => {
    if (transformationRef.current) {
      const scrollAmount = activeTransformation * transformationRef.current.offsetWidth
      transformationRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [activeTransformation])

  const transformations = [
    { image: "/images/vrouw-20transformatie.png", name: "Kim", result: "-9.5kg" },
    { image: "/images/salim-20transformatie.png", name: "Salim", result: "-8.1kg" },
    { image: "/images/martin-20transformatie.png", name: "Martin", result: "-10.7kg" },
  ]

  const phases = [
    {
      step: 1,
      title: "Onboarding",
      duration: "±1 week",
      icon: Play,
      description: "Intake, kennismaking en opzetten van je volledige programma",
      color: "from-blue-500 to-blue-600",
    },
    {
      step: 2,
      title: "Herstel",
      duration: "4-8 weken",
      icon: Heart,
      description: "Metabolisme herstellen en gezonde gewoontes opbouwen",
      color: "from-green-500 to-green-600",
    },
    {
      step: 3,
      title: "Voorbereiding",
      duration: "2-4 weken",
      icon: TrendingUp,
      description: "Mentaal en fysiek voorbereiden op de vetverliesfase",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      step: 4,
      title: "Doelfase",
      duration: "8-16 weken",
      icon: Target,
      description: "Actief vetverliezen met maximale resultaten",
      color: "from-orange-500 to-orange-600",
      highlight: true,
    },
    {
      step: 5,
      title: "Nazorg",
      duration: "4+ weken",
      icon: Award,
      description: "Resultaten behouden en levensstijl integreren",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const packages = [
    {
      title: "6 Maanden",
      subtitle: "Complete Transformatie",
      duration: "24 weken begeleiding",
      features: [
        "Volledige 5-fasen doorloop",
        "Evotion Coaching App",
        "E-learning portal",
        "Klanten support portal",
        "Wekelijkse check-ins",
        "Op maat gemaakt plan",
      ],
      popular: false,
    },
    {
      title: "12 Maanden",
      subtitle: "Maximaal Resultaat",
      duration: "52 weken begeleiding",
      features: [
        "Alles van 6 maanden",
        "Meerdere doelfases",
        "Extra gewoontevorming",
        "Seizoensaanpassingen",
        "Lange termijn strategie",
        "Maximale flexibiliteit",
      ],
      popular: true,
    },
  ]

  const faqs = [
    {
      question: "Wat houdt het modulaire programma precies in?",
      answer:
        "Ons modulaire coachingprogramma bestaat uit 5 flexibele fases: Onboarding, Herstel, Voorbereiding, Doelfase en Optimalisatie. Het verschil met standaard programma's is dat elke fase precies zo lang duurt als jij nodig hebt. Het programma past zich aan jou aan, niet andersom.",
    },
    {
      question: "Wat is het verschil tussen 6 en 12 maanden?",
      answer:
        "Het 6 maanden traject is perfect voor een complete doorloop van alle fases en het bereiken van één hoofddoel. Het 12 maanden traject biedt extra tijd voor meerdere doelen (bijvoorbeeld eerst vetverlies, dan spieropbouw), diepere gewoontevorming en meer flexibiliteit.",
    },
    {
      question: "Hoe werken de wekelijkse check-ins?",
      answer:
        "Elke week heb je een persoonlijk check-in moment met je coach. Je deelt je voortgang, metingen en eventuele uitdagingen via de app. Je coach bekijkt alles en geeft uitgebreide feedback, vaak in video-format.",
    },
    {
      question: "Kan ik ook thuis trainen?",
      answer:
        "Je kunt zowel thuis als in de sportschool trainen. Je coach stelt een programma samen dat past bij jouw beschikbare apparatuur en situatie.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleEmail = () => {
    window.location.href = "mailto:info@evotion-coaching.nl?subject=Interesse%20in%20Online%20Coaching"
  }

  const handleWhatsApp = (pakket: string) => {
    const message = encodeURIComponent(
      `Hoi Martin, ik heb interesse in het ${pakket} voor online coaching. Kunnen we een kennismakingsgesprek plannen?`,
    )
    window.open(`https://wa.me/31638521671?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Premium Design */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-[#1e1839]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] lg:w-[200%] lg:h-[200%]"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ pointerEvents: "none" }}
            title="Evotion Coaching Video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/95 via-[#1e1839]/85 to-[#1e1839]/98" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20 pb-16 lg:pt-0 lg:pb-0 pr-6">
          <div className="max-w-4xl mx-auto text-center my-0">
            {/* Badge */}
            <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                <Smartphone className="w-4 h-4 mr-2" />
                Modulair 5-Fasen Programma
              </Badge>
            </div>

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Online Coaching
              <span className="block text-[#bad4e1] mt-2">Op Jouw Tempo</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Een persoonlijk programma dat zich aanpast aan jouw lichaam, doelen en tempo. Geen standaard schema's, maar maatwerk.
            </p>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button
                size="lg"
                onClick={handleEmail}
                className="bg-white text-[#1e1839] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Start Gesprek
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleWhatsApp("online coaching traject")}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-8 py-6 text-lg font-semibold rounded-2xl bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { value: "5", label: "Fases" },
                { value: "100%", label: "Op Maat" },
                { value: "6-12", label: "Maanden" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* WHAT YOU GET - Horizontal scroll on mobile */}
      <section className="py-16 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Alles Inclusief
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Wat Je <span className="text-[#bad4e1]">Krijgt</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
              Alle tools en ondersteuning voor een succesvolle transformatie.
            </p>
          </div>

          {/* Mobile: Compact sliding ticker */}
          <div className="lg:hidden overflow-hidden">
            {/* Single active feature display */}
            <div className="relative h-20 mb-4">
              {[
                { icon: Smartphone, title: "Evotion App", desc: "Trainingen, voeding & chat" },
                { icon: GraduationCap, title: "E-Learning", desc: "Educatie over training & voeding" },
                { icon: Video, title: "Support Portal", desc: "Video-antwoorden op je vragen" },
                { icon: User, title: "Wekelijkse Check-ins", desc: "Persoonlijke begeleiding" },
                { icon: LineChart, title: "Voortgangsanalyses", desc: "Foto's en metingen" },
                { icon: RotateCcw, title: "Flexibel Programma", desc: "Past zich aan jou aan" },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveFeature((index + 1) % 6)}
                  className={`absolute inset-0 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer transition-all duration-500 ease-out ${
                    index === activeFeature 
                      ? 'opacity-100 translate-x-0' 
                      : index === (activeFeature - 1 + 6) % 6
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#1e1839] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-bold text-[#1e1839]">{item.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    index === activeFeature ? 'bg-[#1e1839]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Smartphone, title: "Evotion App", desc: "Trainingen, voeding & chat" },
              { icon: GraduationCap, title: "E-Learning", desc: "Educatie over training & voeding" },
              { icon: Video, title: "Support Portal", desc: "Video-antwoorden op je vragen" },
              { icon: User, title: "Wekelijkse Check-ins", desc: "Persoonlijke begeleiding" },
              { icon: LineChart, title: "Voortgangsanalyses", desc: "Foto's en metingen" },
              { icon: RotateCcw, title: "Flexibel Programma", desc: "Past zich aan jou aan" },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#1e1839]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1e1839] mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 PHASES - Timeline Design */}
      <section className="py-20 lg:py-32 bg-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Het Programma
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              De 5 Fases
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Een gestructureerd maar flexibel programma dat zich aanpast aan jouw tempo.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block max-w-5xl mx-auto">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20" />
              
              <div className="grid grid-cols-5 gap-4">
                {phases.map((phase, index) => (
                  <div key={index} className="relative">
                    {/* Step number */}
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10 relative ${phase.highlight ? 'ring-4 ring-white/30 scale-110' : ''}`}>
                      {phase.step}
                    </div>
                    
                    {/* Content */}
                    <div className={`mt-6 text-center ${phase.highlight ? 'transform -translate-y-1' : ''}`}>
                      <span className="text-xs text-white/40 uppercase tracking-wider">Stap {phase.step}</span>
                      <h3 className={`font-bold mb-1 ${phase.highlight ? 'text-white text-lg' : 'text-white/90'}`}>
                        {phase.title}
                      </h3>
                      <Badge variant="outline" className="border-white/30 text-white/70 text-xs mb-2">
                        {phase.duration}
                      </Badge>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile - Simple stacked cards */}
          <div className="lg:hidden space-y-3">
            {phases.map((phase, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-2xl transition-all ${
                  phase.highlight 
                    ? 'bg-white/15 border border-white/20' 
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                      {phase.step}
                    </span>
                    <h3 className={`font-bold ${phase.highlight ? 'text-white' : 'text-white/90'}`}>
                      {phase.title}
                    </h3>
                  </div>
                  <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                    {phase.duration}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-11">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS - Auto Carousel Mobile */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Star className="w-4 h-4 mr-2" />
              Resultaten
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Echte Transformaties
            </h2>
          </div>

          {/* Mobile - Single card with fade animation */}
          <div className="lg:hidden">
            <div className="relative h-[560px] mb-4 overflow-hidden rounded-2xl shadow-lg">
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
            <div className="flex gap-1 mb-6">
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
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {transformations.map((t, index) => (
              <div key={t.name} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group-hover:shadow-xl transition-all">
                  <Image
                    src={t.image || "/placeholder.svg"}
                    alt={`${t.name}'s transformatie`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING - Modern Cards */}
      <section className="py-20 lg:py-32 bg-[#1e1839] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Trajecten
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Kies Jouw Traject
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 bg-white ${
                  pkg.popular 
                    ? 'border-2 border-white shadow-xl scale-[1.02]' 
                    : 'border border-white/20 hover:border-white/50 hover:shadow-lg'
                }`}
              >
                <CardContent className="p-6 lg:p-8">
                  {pkg.popular && (
                    <Badge className="bg-[#1e1839] text-white mb-4">Aanbevolen</Badge>
                  )}
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#1e1839] mb-1">{pkg.title}</h3>
                  <p className="text-gray-600 mb-2">{pkg.subtitle}</p>
                  <p className="text-sm text-[#1e1839]/70 mb-6">{pkg.duration}</p>
                  
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleWhatsApp(pkg.title)}
                      className="w-full py-6 text-base font-semibold rounded-xl bg-[#1e1839] hover:bg-[#1e1839]/90 text-white"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start via WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEmail}
                      className="w-full py-6 text-base font-semibold rounded-xl border-2 border-[#1e1839]/20 text-[#1e1839] hover:bg-[#1e1839]/5 bg-transparent"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Stuur E-mail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Clean Accordion */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Veelgestelde Vragen
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-xl transition-all ${
                  expandedFaq === index ? 'border-[#1e1839] bg-[#1e1839]/5' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full text-left p-5 gap-4"
                >
                  <h3 className="font-semibold text-[#1e1839]">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-[#1e1839] flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Final Push */}
      <section className="py-20 lg:py-32 bg-[#1e1839] relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              Klaar voor Jouw Transformatie?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Start vandaag met een programma dat echt bij jou past.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleEmail}
                className="bg-white text-[#1e1839] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Stuur E-mail
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleWhatsApp("online coaching")}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-8 py-6 text-lg font-semibold rounded-2xl bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
