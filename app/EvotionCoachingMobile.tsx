"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dumbbell,
  TrendingUp,
  Star,
  Target,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { sendContactEmail } from "@/app/actions/contact"
import Link from "next/link"

export default function EvotionCoachingMobile() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeTransformation, setActiveTransformation] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
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
  const transformationRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: "Kim Altena",
      text: "Een prachtig cadeau aan jezelf! Na 3 weken al geweldige resultaten. Veel energie, goed slapen en lekker gezond eten.",
      initial: "K",
    },
    {
      name: "Ingrid Eekhof",
      text: "Martin weet de balans te bewaren tussen professioneel en persoonlijk. De wekelijkse feedback motiveert mij enorm.",
      initial: "I",
    },
    {
      name: "Wouter Baerveldt",
      text: "Martin heeft veel kennis en weet dit op een no-nonsense manier over te brengen. Al mooie resultaten behaald!",
      initial: "W",
    },
    {
      name: "Marcel MPW",
      text: "Martin is een prima coach. Doet en zegt wat hij belooft. Geeft ook ongezouten commentaar. Precies wat je nodig hebt.",
      initial: "M",
    },
  ]

  const services = [
    {
      icon: Dumbbell,
      title: "Personal Training",
      subtitle: "1-op-1 in de gym",
      description: "Directe feedback en maximale resultaten.",
      href: "/personal-training",
    },
    {
      icon: TrendingUp,
      title: "Online Coaching",
      subtitle: "Flexibel & effectief",
      description: "Train waar en wanneer jij wilt.",
      href: "/online-coaching",
      popular: true,
    },
  ]

  const transformations = [
    {
      name: "Martin",
      image: "/images/martin-transformation-new.png",
    },
    {
      name: "Salim",
      image: "/images/salim-transformation-new.png",
    },
    {
      name: "Wouter",
      image: "/images/wouter-transformation-new.png",
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Auto-rotate transformations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransformation((prev) => {
        const next = (prev + 1) % transformations.length
        // Scroll to the next transformation
        if (transformationRef.current) {
          const scrollWidth = transformationRef.current.scrollWidth / transformations.length
          transformationRef.current.scrollTo({
            left: scrollWidth * next,
            behavior: 'smooth'
          })
        }
        return next
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [transformations.length])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

      {/* HERO - With YouTube Video Background */}
      <section className="relative min-h-[100svh] flex items-center bg-[#1e1839] pt-20 pb-8 overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400%] h-[400%] min-w-full min-h-full"
            allow="autoplay; encrypted-media; accelerometer; gyroscope"
            allowFullScreen
            style={{ pointerEvents: "none" }}
            title="Evotion Coaching Video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/95 via-[#1e1839]/85 to-[#1e1839]/98" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-sm mx-auto">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/60 font-medium tracking-wide">Nu beschikbaar voor coaching</span>
            </div>

            {/* Heading */}
            <div className="space-y-5 mb-10">
              <h1 
                className={`text-[2.5rem] leading-[1.1] font-bold text-white transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Bereik jouw{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                  droomlichaam
                </span>
              </h1>
              <p 
                className={`text-base text-white/60 leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Persoonlijke coaching die past bij jouw leven. Zonder extreme dieten, met blijvend resultaat.
              </p>
            </div>

            {/* Primary CTA */}
            <div 
              className={`space-y-3 mb-10 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Button
                size="lg"
                className="w-full bg-white text-[#1e1839] hover:bg-white/95 h-14 text-base font-semibold rounded-2xl shadow-xl shadow-black/20"
                asChild
              >
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  Gratis Kennismaking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 h-14 text-base font-medium bg-transparent rounded-2xl"
                asChild
              >
                <Link href="#diensten">
                  Bekijk Programma's
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div 
              className={`flex items-center justify-between py-6 border-t border-white/10 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold text-white">5.0</span>
                </div>
                <span className="text-[11px] text-white/50">Google</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="text-xl font-bold text-white">10+</span>
                </div>
                <span className="text-[11px] text-white/50">Jaar ervaring</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-4 h-4 text-white/60" />
                  <span className="text-xl font-bold text-white">95%</span>
                </div>
                <span className="text-[11px] text-white/50">Behaalt doel</span>
              </div>
            </div>

            {/* Social Proof */}
            <div 
              className={`flex items-center justify-center gap-3 pt-4 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="flex -space-x-2">
                {['K', 'I', 'W', 'M'].map((initial) => (
                  <div 
                    key={initial}
                    className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#1e1839] flex items-center justify-center text-white text-xs font-medium"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/50">Sluit je aan bij tevreden klanten</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES - With more spacing */}
      <section id="diensten" className="py-20 bg-white relative">
        {/* Top decorative line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold text-[#1e1839]/60 tracking-widest uppercase mb-3">Programma's</p>
            <h2 className="text-2xl font-bold text-[#1e1839]">
              Kies jouw aanpak
            </h2>
          </div>

          {/* Service Cards - More spacing */}
          <div className="space-y-5">
            {services.map((service) => (
              <Link key={service.title} href={service.href}>
                <div className={`relative p-6 rounded-2xl border transition-all duration-300 active:scale-[0.98] my-6 ${
                  service.popular 
                    ? 'bg-[#1e1839] border-[#1e1839]' 
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}>
                  {service.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-semibold text-white/60 tracking-wider">POPULAIR</span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      service.popular ? 'bg-white/10' : 'bg-gray-50'
                    }`}>
                      <service.icon className={`w-7 h-7 ${service.popular ? 'text-white' : 'text-[#1e1839]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-1 ${service.popular ? 'text-white' : 'text-[#1e1839]'}`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm font-medium mb-2 ${service.popular ? 'text-white/60' : 'text-[#1e1839]/60'}`}>
                        {service.subtitle}
                      </p>
                      <p className={`text-sm ${service.popular ? 'text-white/70' : 'text-gray-600'}`}>
                        {service.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 mt-1 ${service.popular ? 'text-white/40' : 'text-gray-300'}`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Action */}
          <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1e1839] text-sm">Niet zeker welke?</p>
                <p className="text-xs text-gray-500">Gratis adviesgesprek van 15 min</p>
              </div>
              <Button
                size="sm"
                className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white rounded-xl h-10 px-4"
                asChild
              >
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  Plan in
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* APP HIGHLIGHT - Compact */}
      <section className="py-20 bg-[#f8f8f8] relative">
        {/* Visual divider */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1e1839]/5 via-[#1e1839]/10 to-[#1e1839]/5" />
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-5">
            {/* Phone Mockup */}
            <div className="relative w-28 flex-shrink-0">
              <div className="bg-[#1e1839] rounded-[1.5rem] p-1.5 shadow-2xl">
                <div className="bg-white rounded-[1.25rem] overflow-hidden aspect-[9/19] relative">
                  <Image
                    src="/images/evotion-logo-mockup-desktop.png"
                    alt="Evotion App"
                    fill
                    className="object-contain p-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#1e1839]/60 tracking-widest uppercase mb-2">Evotion App</p>
              <h3 className="text-xl font-bold text-[#1e1839] mb-2">
                Jouw coach in je broekzak
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Training, voeding en chat met je coach - alles in een app.
              </p>
              <Link href="/over-ons/evotion-app">
                <span className="inline-flex items-center text-sm font-semibold text-[#1e1839]">
                  Ontdek meer
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS - Auto-scrolling Carousel */}
      <section className="py-20 bg-white relative">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1e1839]/20 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#1e1839]/60 tracking-widest uppercase mb-3">Resultaten</p>
            <h2 className="text-2xl font-bold text-[#1e1839]">
              Echte transformaties
            </h2>
          </div>

          {/* Auto-scrolling Carousel - Full width images */}
          <div 
            ref={transformationRef}
            className="flex gap-0 overflow-x-auto pb-4 -mx-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {transformations.map((t, index) => (
              <div 
                key={t.name} 
                className={`flex-shrink-0 w-screen snap-center transition-all duration-500 ${
                  index === activeTransformation ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="relative aspect-[1/1]">
                  <Image
                    src={t.image || "/placeholder.svg"}
                    alt={`${t.name}'s transformatie`}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {transformations.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setActiveTransformation(i)
                  if (transformationRef.current) {
                    const scrollWidth = transformationRef.current.scrollWidth / transformations.length
                    transformationRef.current.scrollTo({
                      left: scrollWidth * i,
                      behavior: 'smooth'
                    })
                  }
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeTransformation ? "bg-[#1e1839] w-6" : "bg-gray-300 w-1.5"
                }`}
              />
            ))}
          </div>

          <div className="mt-8">
            <Button
              className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white rounded-2xl h-14 font-semibold"
              asChild
            >
              <Link href="/resultaten">
                Bekijk Alle Resultaten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Auto-sliding */}
      <section className="py-20 bg-[#1e1839] overflow-hidden relative">
        {/* Top glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white font-bold">5.0</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Wat klanten zeggen
            </h2>
          </div>

          {/* Sliding Testimonials */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className="w-full flex-shrink-0 px-1"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.initial}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{testimonial.name}</h3>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm">"{testimonial.text}"</p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-blue-600">G</span>
                      </div>
                      <span className="text-[11px] text-white/50">Geverifieerde Google review</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeTestimonial ? "bg-white w-6" : "bg-white/30 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT - Streamlined */}
      <section className="py-20 bg-white relative">
        {/* Top decorative line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold text-[#1e1839]/60 tracking-widest uppercase mb-3">Contact</p>
            <h2 className="text-2xl font-bold text-[#1e1839] mb-2">
              Klaar om te beginnen?
            </h2>
            <p className="text-gray-600 text-sm">
              Neem contact op voor een gratis kennismaking.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <a
              href="tel:+31610458598"
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5 text-[#1e1839]" />
              </div>
              <span className="text-xs font-medium text-[#1e1839]">Bellen</span>
            </a>
            <a
              href="https://wa.me/31610458598"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-700">WhatsApp</span>
            </a>
            <a
              href="mailto:info@evotioncoaching.nl"
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-[#1e1839]" />
              </div>
              <span className="text-xs font-medium text-[#1e1839]">Email</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-base font-bold text-[#1e1839] mb-1">Stuur een bericht</h3>
            <p className="text-gray-500 text-xs mb-5">We reageren binnen 24 uur.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input 
                    name="firstName" 
                    placeholder="Voornaam *"
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-white border-0 rounded-xl h-12 text-sm"
                  />
                </div>
                <div>
                  <Input 
                    name="lastName" 
                    placeholder="Achternaam *"
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-white border-0 rounded-xl h-12 text-sm"
                  />
                </div>
              </div>

              <Input 
                type="email" 
                name="email" 
                placeholder="Email *"
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="bg-white border-0 rounded-xl h-12 text-sm"
              />

              <Input 
                type="tel" 
                name="phone" 
                placeholder="Telefoonnummer"
                value={formData.phone} 
                onChange={handleInputChange} 
                className="bg-white border-0 rounded-xl h-12 text-sm"
              />

              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="w-full px-4 h-12 bg-white border-0 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-[#1e1839]/20"
              >
                <option value="">Wat is je doel?</option>
                <option value="gewichtsverlies">Gewichtsverlies</option>
                <option value="spieropbouw">Spieropbouw</option>
                <option value="fitter-worden">Fitter worden</option>
                <option value="lifestyle-coaching">Lifestyle coaching</option>
                <option value="anders">Anders</option>
              </select>

              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Je bericht..."
                className="bg-white border-0 rounded-xl text-sm resize-none"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white rounded-xl h-14 font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Versturen...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verstuur Bericht
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {submitMessage && (
                <div
                  className={`p-4 rounded-xl text-center text-sm font-medium ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
