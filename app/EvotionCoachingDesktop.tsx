"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dumbbell,
  TrendingUp,
  Star,
  CheckCircle,
  Zap,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Play,
  Users,
  Clock,
  Smartphone,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect, useRef } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import Link from "next/link"

export default function EvotionCoachingDesktop() {
  const [isLoaded, setIsLoaded] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    goal: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Intersection Observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [statsVisible])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await sendContactEmail({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        subject: formData.goal || "algemeen",
        message: formData.message,
      })

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message || "Bericht verzonden!" })
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          goal: "",
          message: "",
        })
      } else {
        setSubmitMessage({ type: "error", text: result.error || "Er ging iets mis." })
      }
    } catch {
      setSubmitMessage({ type: "error", text: "Er ging iets mis bij het verzenden." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* HERO - Premium Minimalist */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1e1839]">
        {/* Video Background with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <iframe
              src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
              className="absolute inset-0 w-full h-full object-cover scale-150"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ pointerEvents: "none" }}
              title="Evotion Coaching introductievideo"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/95 via-[#1e1839]/80 to-[#1e1839]/98" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e1839]/60 via-transparent to-[#1e1839]/60" />
          </div>
        </div>

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-10">
                {/* Badge */}
                <div 
                  className={`inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Nu beschikbaar voor nieuwe klanten
                </div>

                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 
                    className={`text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  >
                    <span className="block">Bereik jouw</span>
                    <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                      droomlichaam
                    </span>
                  </h1>
                  
                  <p 
                    className={`text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  >
                    Persoonlijke coaching die past bij jouw leven. Zonder extreme dieten, zonder je sociale leven op te geven.
                  </p>
                </div>

                {/* CTAs */}
                <div 
                  className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base font-medium rounded-full shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all duration-300 group"
                    asChild
                  >
                    <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-3">
                        Start Jouw Transformatie
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-medium bg-transparent backdrop-blur-sm rounded-full transition-all duration-300 group"
                    asChild
                  >
                    <Link href="#diensten">
                      <span className="flex items-center gap-3">
                        Bekijk Diensten
                        <Play className="w-4 h-4" />
                      </span>
                    </Link>
                  </Button>
                </div>

                {/* Social Proof */}
                <div 
                  className={`flex items-center gap-8 pt-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {['K', 'I', 'W', 'M'].map((initial, i) => (
                        <div 
                          key={initial}
                          className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#1e1839] flex items-center justify-center text-white text-sm font-medium"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">5.0 op Google Reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stats Card */}
              <div 
                ref={statsRef}
                className={`hidden lg:block transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-3xl blur-xl" />
                  
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
                    <div className="grid grid-cols-2 gap-8">
                      {[
                        { value: "5.0", label: "Google Rating", icon: Star },
                        { value: "10+", label: "Jaar Ervaring", icon: Clock },
                        { value: "95%", label: "Behaalt Doel", icon: Target },
                        { value: "24/7", label: "App Toegang", icon: Smartphone },
                      ].map((stat, i) => (
                        <div 
                          key={stat.label} 
                          className={`text-center space-y-3 transition-all duration-500 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          style={{ transitionDelay: `${i * 100}ms` }}
                        >
                          <div className="w-12 h-12 mx-auto bg-white/5 rounded-xl flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-white/60" />
                          </div>
                          <div className="text-4xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* SERVICES - Clean Grid */}
      <section id="diensten" className="py-32 relative bg-white">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <p className="text-sm font-medium text-evotion-primary tracking-widest uppercase">Onze Diensten</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-balance">
              Kies het programma dat bij jou past
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Elke transformatie is uniek. Daarom bieden we programma's die perfect aansluiten bij jouw doelen en levensstijl.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Personal Training */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-b from-evotion-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                <CardContent className="p-8 lg:p-10 space-y-8">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-evotion-primary/5 transition-colors duration-300">
                      <Dumbbell className="w-8 h-8 text-evotion-primary" />
                    </div>
                    <Badge className="bg-evotion-primary/10 text-evotion-primary border-0 text-xs font-medium px-3 py-1">
                      1-OP-1
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-evotion-primary transition-colors duration-300">
                      Personal Training
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Persoonlijke 1-op-1 begeleiding door gecertificeerde trainers voor snelle en veilige resultaten.
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4">
                    {[
                      "Volledige persoonlijke aandacht",
                      "Oefeningen op maat",
                      "Directe feedback en correctie",
                      "Flexibele planning",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/personal-training" className="block">
                    <Button className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white rounded-xl py-6 font-medium group/btn transition-all duration-300">
                      <span className="flex items-center justify-center gap-2">
                        Meer Informatie
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Online Coaching */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-b from-evotion-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                <CardContent className="p-8 lg:p-10 space-y-8">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-evotion-primary/5 transition-colors duration-300">
                      <TrendingUp className="w-8 h-8 text-evotion-primary" />
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-0 text-xs font-medium px-3 py-1">
                      POPULAIR
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-evotion-primary transition-colors duration-300">
                      Online Coaching
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Persoonlijke begeleiding op basis van 6 pijlers via onze app, waar en wanneer jij wilt.
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4">
                    {[
                      "Persoonlijk trainingsschema",
                      "Voedingsschema op maat",
                      "Wekelijkse check-ins",
                      "24/7 app toegang",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/online-coaching" className="block">
                    <Button className="w-full bg-evotion-primary hover:bg-evotion-primary/90 text-white rounded-xl py-6 font-medium group/btn transition-all duration-300">
                      <span className="flex items-center justify-center gap-2">
                        Meer Informatie
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1839] via-[#1e1839]/90 to-[#1e1839] p-10 lg:p-14">
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }}
              />
              
              <div className="relative z-10 text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Niet zeker welk programma bij jou past?
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Boek een gratis en vrijblijvend kennismakingsgesprek. We bespreken jouw doelen en vinden samen het perfecte programma.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 rounded-full font-medium group transition-all duration-300"
                  asChild
                >
                  <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Plan Gratis Gesprek
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL TRAINING HIGHLIGHT */}
      <section className="py-32 bg-evotion-primary relative overflow-hidden">
        {/* Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <p className="text-sm font-medium text-white/60 tracking-widest uppercase">Personal Training</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Persoonlijke begeleiding voor maximale resultaten
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Ervaar de kracht van 1-op-1 begeleiding met onze gecertificeerde trainers. Met volledige aandacht en op maat gemaakte trainingen bereik je sneller en veiliger je doelen.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Dumbbell, title: "Persoonlijke Sessies", desc: "Volledige aandacht van je trainer" },
                  { icon: Target, title: "Op Maat Gemaakt", desc: "Afgestemd op jouw niveau en doelen" },
                  { icon: Calendar, title: "Flexibele Planning", desc: "Plan sessies wanneer het jou past" },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-evotion-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      <p className="text-white/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/personal-training">
                <Button
                  size="lg"
                  className="bg-white text-evotion-primary hover:bg-gray-100 px-8 py-6 rounded-full font-medium group transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Meer over Personal Training
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Begeleiding"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evotion-primary/40 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1e1839]/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#1e1839]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1e1839]">5.0</p>
                    <p className="text-sm text-gray-500">Google Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className="space-y-10 lg:order-1">
              <div className="space-y-6">
                <p className="text-sm font-medium text-evotion-primary tracking-widest uppercase">Evotion App</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Jouw coach, altijd bij de hand
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Onze app biedt alles wat je nodig hebt: gepersonaliseerde trainingen, voedingsadvies en directe communicatie met je coach.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: Target, title: "Gepersonaliseerde Trainingen", desc: "Schema's aangepast aan jouw niveau" },
                  { icon: Sparkles, title: "Voedingsadvies op Maat", desc: "Plannen die passen bij jouw leven" },
                  { icon: MessageCircle, title: "Direct Contact", desc: "Chat met je coach via de app" },
                ].map((feature) => (
                  <div 
                    key={feature.title} 
                    className="flex items-center gap-5 bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors duration-300 border border-gray-100"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                      <feature.icon className="w-7 h-7 text-evotion-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/over-ons/evotion-app">
                <Button
                  size="lg"
                  className="bg-evotion-primary hover:bg-evotion-primary/90 text-white px-8 py-6 rounded-full font-medium group transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Ontdek de App
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Phone Mockup */}
            <div className="relative lg:order-0">
              <div className="relative mx-auto w-72 lg:w-80">
                {/* Glow */}
                <div className="absolute -inset-8 bg-gradient-to-b from-evotion-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
                
                {/* Phone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    <Image
                      src="/images/evotion-logo-mockup-desktop.png"
                      alt="Evotion App"
                      fill
                      className="object-contain p-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-[#1e1839] relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold text-white">5.0</span>
              <span className="text-white/60">op Google</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Wat onze klanten zeggen
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, i) => (
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

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border border-white/20 text-white hover:bg-white hover:text-[#1e1839] px-8 py-6 rounded-full font-medium bg-transparent transition-all duration-300 group"
              asChild
            >
              <a href="https://g.page/r/CXnvQA8AAABEEAg/review" target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-3">
                  Bekijk Alle Reviews
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <p className="text-sm font-medium text-evotion-primary tracking-widest uppercase">Echte Resultaten</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-balance">
              Transformaties die spreken
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Zie hoe onze klanten hun droomlichaam hebben bereikt met onze bewezen methodes.
            </p>
          </div>

          {/* Transformation Cards */}
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Martin */}
            <div className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[500px]">
                  <Image
                    src="/images/martin-transformation-new.png"
                    alt="Martin's transformatie - 10.7kg gewichtsverlies"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur-sm text-evotion-primary border-0 font-medium">
                      <Award className="w-4 h-4 mr-1" />
                      Eigenaar
                    </Badge>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Martin's Transformatie
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    "Als eigenaar van Evotion Coaching is het belangrijk om het goede voorbeeld te geven. In slechts 11 weken ben ik 10,7 kg kwijtgeraakt met dezelfde methodes die ik mijn klanten leer."
                  </p>
                  <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                    {[
                      { value: "-10.7kg", label: "Gewichtsverlies" },
                      { value: "11", label: "Weken" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-bold text-evotion-primary">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Salim */}
            <div className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center lg:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Salim's Transformatie
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    "Een indrukwekkende transformatie waarbij ik 8,1 kg ben afgevallen en veel heb geleerd over duurzame leefstijlveranderingen. De combinatie van online coaching en personal training werkte perfect."
                  </p>
                  <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                    {[
                      { value: "-8.1kg", label: "Gewichtsverlies" },
                      { value: "100%", label: "Duurzaam" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-bold text-evotion-primary">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[500px] lg:order-2">
                  <Image
                    src="/images/salim-transformation-new.png"
                    alt="Salim's transformatie - 8.1kg gewichtsverlies"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Wouter */}
            <div className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[500px]">
                  <Image
                    src="/images/wouter-transformation-new.png"
                    alt="Wouter's body recomposition transformatie"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur-sm text-evotion-primary border-0 font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Recomp
                    </Badge>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Wouter's Transformatie
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    "In 8 weken een indrukwekkende body recomposition. Minder vet, meer definitie en een sterker, fitter lichaam. Door persoonlijk contact bleef het uitdagend en motiverend."
                  </p>
                  <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                    {[
                      { value: "8", label: "Weken" },
                      { value: "Recomp", label: "Resultaat" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-bold text-evotion-primary">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-evotion-primary hover:bg-evotion-primary/90 text-white px-8 py-6 rounded-full font-medium group disabled:opacity-50 transition-all duration-300"
              asChild
            >
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start Jouw Transformatie
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 bg-[#1e1839] relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <p className="text-sm font-medium text-white/60 tracking-widest uppercase">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Klaar om te beginnen?
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Neem contact met ons op voor een gratis kennismakingsgesprek. We bespreken jouw doelen en maken een plan op maat.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Options */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Neem direct contact op</h3>
                <p className="text-white/70">
                  We staan klaar om al je vragen te beantwoorden en je te helpen bij het kiezen van het juiste programma.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    icon: Phone, 
                    title: "Bel Ons", 
                    desc: "+31 6 10 45 85 98", 
                    hint: "Ma-Vr: 9:00-18:00",
                    href: "tel:+31610458598"
                  },
                  { 
                    icon: MessageCircle, 
                    title: "WhatsApp", 
                    desc: "Chat direct met ons",
                    hint: "Snelle reactie gegarandeerd",
                    href: "https://wa.me/31610458598?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s."
                  },
                  { 
                    icon: Mail, 
                    title: "Email", 
                    desc: "info@evotion-coaching.nl",
                    hint: "Reactie binnen 24 uur",
                    href: "mailto:info@evotion-coaching.nl"
                  },
                ].map((contact) => (
                  <a
                    key={contact.title}
                    href={contact.href}
                    target={contact.title === "WhatsApp" ? "_blank" : undefined}
                    rel={contact.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-5 bg-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group border border-white/10"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <contact.icon className="w-7 h-7 text-[#1e1839]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{contact.title}</h4>
                      <p className="text-white/80">{contact.desc}</p>
                      <p className="text-sm text-white/50">{contact.hint}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 lg:p-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Stuur een bericht</h3>
                  <p className="text-gray-600">We nemen binnen 24 uur contact met je op.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Voornaam *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Achternaam *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefoonnummer
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                      Wat is je doel?
                    </label>
                    <select
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200"
                    >
                      <option value="">Selecteer je doel</option>
                      <option value="gewichtsverlies">Gewichtsverlies</option>
                      <option value="spieropbouw">Spieropbouw</option>
                      <option value="fitter-worden">Fitter worden</option>
                      <option value="lifestyle-coaching">Lifestyle coaching</option>
                      <option value="anders">Anders</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Bericht
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition-all duration-200 resize-none"
                      placeholder="Vertel ons meer over je doelen..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-evotion-primary hover:bg-evotion-primary/90 text-white py-4 rounded-xl font-medium group disabled:opacity-50 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Versturen...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Verstuur Bericht
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-xl text-center font-medium ${
                        submitMessage.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {submitMessage.text}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
