"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Target,
  ChevronDown,
  Dumbbell,
  Zap,
  Award,
  Mail,
  MessageCircle,
  Heart,
  Calendar,
  Star,
  ArrowRight,
  User,
  Shield,
  Clock,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function PersonalTrainingClientPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTransformation, setActiveTransformation] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

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

  // Auto-scroll features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const transformations = [
    { image: "/images/vrouw-20transformatie.png", name: "Kim" },
    { image: "/images/salim-20transformatie.png", name: "Salim" },
    { image: "/images/martin-20transformatie.png", name: "Martin" },
  ]

  const benefits = [
    {
      icon: User,
      title: "100% Persoonlijke Aandacht",
      desc: "Volledige focus tijdens elke sessie",
    },
    {
      icon: Target,
      title: "Doelgerichte Training",
      desc: "Afgestemd op jouw specifieke doelen",
    },
    {
      icon: Shield,
      title: "Veilige Uitvoering",
      desc: "Correcte techniek, geen blessures",
    },
    {
      icon: Zap,
      title: "Snellere Resultaten",
      desc: "Efficiëntere trainingen",
    },
    {
      icon: Heart,
      title: "Motivatie & Support",
      desc: "Constante ondersteuning",
    },
    {
      icon: Clock,
      title: "Flexibele Planning",
      desc: "Past bij jouw schema",
    },
  ]

  const steps = [
    {
      step: 1,
      title: "Intake",
      description: "Gratis kennismakingsgesprek om je doelen te bespreken",
    },
    {
      step: 2,
      title: "Plan op Maat",
      description: "Persoonlijk trainingsplan afgestemd op jouw doelen",
    },
    {
      step: 3,
      title: "Training",
      description: "1-op-1 sessies met directe feedback",
    },
    {
      step: 4,
      title: "Resultaat",
      description: "Regelmatige metingen en aanpassingen",
    },
  ]

  const packages = [
    {
      title: "10 Sessies",
      subtitle: "Kennismaking",
      duration: "Flexibel in te plannen",
      features: [
        "10 personal training sessies",
        "Intake en doelstelling",
        "Basis trainingsschema",
        "Voedingsadvies",
        "Flexibele planning",
      ],
      popular: false,
    },
    {
      title: "20 Sessies",
      subtitle: "Meest Gekozen",
      duration: "Flexibel in te plannen",
      features: [
        "20 personal training sessies",
        "Uitgebreide intake",
        "Gepersonaliseerd trainingsschema",
        "Voedingsplan op maat",
        "Tussentijdse evaluaties",
        "WhatsApp support",
      ],
      popular: true,
    },
    {
      title: "40 Sessies",
      subtitle: "Maximaal Resultaat",
      duration: "Flexibel in te plannen",
      features: [
        "40 personal training sessies",
        "Complete lifestyle analyse",
        "Volledig trainings- en voedingsplan",
        "Wekelijkse voortgangsmetingen",
        "24/7 WhatsApp support",
        "Prioriteit bij planning",
      ],
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "Hoe lang duurt een personal training sessie?",
      answer:
        "Een standaard sessie duurt 60 minuten. Dit omvat een korte warming-up, de hoofdtraining en een cooling-down. De tijd wordt volledig benut voor jouw training.",
    },
    {
      question: "Waar vinden de trainingen plaats?",
      answer:
        "De trainingen vinden plaats in onze eigen studio in Utrecht of op een locatie die voor jou het beste uitkomt. We hebben alle benodigde apparatuur beschikbaar.",
    },
    {
      question: "Wat is het verschil tussen de pakketten?",
      answer:
        "Het verschil zit in het aantal sessies en de mate van begeleiding. Bij grotere pakketten krijg je meer ondersteuning buiten de sessies om, inclusief voedingsbegeleiding en WhatsApp support.",
    },
    {
      question: "Kan ik ook combineren met online coaching?",
      answer:
        "Ja, dat kan! Veel klanten combineren personal training met online coaching voor optimale resultaten. Neem contact op voor de mogelijkheden.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleEmail = () => {
    window.location.href = "mailto:info@evotion-coaching.nl?subject=Interesse%20in%20Personal%20Training"
  }

  const handleWhatsApp = (pakket: string) => {
    const message = encodeURIComponent(
      `Hoi! Ik heb interesse in het ${pakket} pakket voor Personal Training. Kunnen we een kennismakingsgesprek plannen?`,
    )
    window.open(`https://wa.me/31638521671?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Premium Design */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-[#1e1839]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/personal-training-session.jpeg"
            alt="Personal Training"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/95 via-[#1e1839]/85 to-[#1e1839]/98" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20 lg:pt-0">
          <div className="max-w-4xl mx-auto text-center my-6">
            {/* Badge */}
            <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                <Dumbbell className="w-4 h-4 mr-2" />
                1-op-1 Begeleiding
              </Badge>
            </div>

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Personal Training
              <span className="block text-[#bad4e1] mt-2">Maximale Resultaten</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Ervaar de kracht van 1-op-1 begeleiding. Volledige aandacht, directe feedback en op maat gemaakte trainingen voor jouw doelen.
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
                onClick={() => handleWhatsApp("Personal Training")}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] px-8 py-6 text-lg font-semibold rounded-2xl bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { value: "100%", label: "Persoonlijk" },
                { value: "1-op-1", label: "Begeleiding" },
                { value: "5.0", label: "Google Score" },
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

      {/* WHAT YOU GET - Benefits */}
      <section className="py-16 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Voordelen
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4">
              Waarom <span className="text-[#bad4e1]">Personal Training</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
              Ontdek wat 1-op-1 begeleiding zo effectief maakt.
            </p>
          </div>

          {/* Mobile: Compact sliding ticker */}
          <div className="lg:hidden overflow-hidden">
            <div className="relative h-20 mb-4">
              {benefits.map((item, index) => (
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
            {benefits.map((item, index) => (
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

      {/* HOW IT WORKS - Timeline */}
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
              <Target className="w-4 h-4 mr-2" />
              Hoe Het Werkt
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Jouw Traject in 4 Stappen
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Een helder proces van start tot resultaat.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20" />
              
              <div className="grid grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step number */}
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10 relative">
                      {step.step}
                    </div>
                    
                    {/* Content */}
                    <div className="mt-6 text-center">
                      <h3 className="font-bold text-white text-lg mb-2">
                        {step.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile - Simple stacked cards */}
          <div className="lg:hidden space-y-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="p-5 rounded-2xl bg-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </span>
                    <h3 className="font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-11">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS - Auto Carousel Mobile */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-8">
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
            <div className="relative h-[440px] mb-4 overflow-hidden rounded-2xl shadow-lg">
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

          {/* Desktop 3D Carousel */}
          <div className="hidden lg:flex items-center justify-center gap-4 relative h-[700px]">
            {transformations.map((t, index) => {
              const isActive = index === activeTransformation;
              const isPrev = index === (activeTransformation - 1 + transformations.length) % transformations.length;
              const isNext = index === (activeTransformation + 1) % transformations.length;
              
              return (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setActiveTransformation(index)}
                  className={`absolute transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${
                    isActive 
                      ? 'z-30 scale-100 opacity-100' 
                      : isPrev 
                        ? 'z-20 scale-[0.65] opacity-50 -translate-x-[500px]' 
                        : isNext 
                          ? 'z-20 scale-[0.65] opacity-50 translate-x-[500px]' 
                          : 'z-10 scale-50 opacity-0'
                  }`}
                  style={{
                    width: isActive ? '520px' : '400px',
                    height: isActive ? '680px' : '520px',
                  }}
                >
                  <Image
                    src={t.image || "/placeholder.svg"}
                    alt={`${t.name}'s transformatie`}
                    fill
                    className="object-cover object-top"
                  />
                </button>
              );
            })}
          </div>
          
          {/* Desktop Navigation Dots */}
          <div className="hidden lg:flex justify-center gap-3 mt-8">
            {transformations.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveTransformation(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === activeTransformation ? 'bg-[#1e1839] scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
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
              Pakketten
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Kies Jouw Pakket
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Flexibele opties voor elk niveau en elke doelstelling.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 bg-white ${
                  pkg.popular 
                    ? 'border-2 border-white shadow-xl lg:scale-[1.02]' 
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
                      Vraag Informatie
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
              Start vandaag met 1-op-1 begeleiding en bereik je doelen sneller dan ooit.
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
                onClick={() => handleWhatsApp("Personal Training")}
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
