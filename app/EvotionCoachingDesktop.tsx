"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dumbbell,
  Users,
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
  Shield,
  Clock,
  Flame,
  User,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useOptimizedTypewriter } from "@/hooks/use-optimized-text-animation"
import { useOptimizedParallax } from "@/hooks/use-optimized-scroll"
import { useState, useEffect, useRef } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import Link from "next/link"

export default function EvotionCoachingDesktop() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroParallax = useOptimizedParallax({ speed: 0.3 })
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      name: "Wouter Baerveldt",
      text: "Martin heeft veel kennis en weet dit op een toegankelijke manier over te brengen. Al mooie resultaten behaald!",
      initial: "W",
      color: "bg-white",
    },
    {
      name: "Ingrid Eekhof",
      text: "Martin bewaart perfect de balans tussen professioneel en persoonlijk. De Evotion App is gebruiksvriendelijk!",
      initial: "I",
      color: "bg-evotion-primary",
    },
    {
      name: "Kim Altena",
      text: "Een mooi kado aan jezelf! Al na 3 weken geweldige resultaten. Veel energie en goed slapen!",
      initial: "K",
      color: "bg-white",
    },
    {
      name: "Salim Bouali",
      text: "Ongelooflijke resultaten in 12 weken! Martin's begeleiding heeft mijn leven echt veranderd.",
      initial: "S",
      color: "bg-evotion-primary",
    },
    {
      name: "Petra de Vries",
      text: "Na jaren van diëten eindelijk een aanpak die werkt. De app maakt het zo makkelijk om vol te houden!",
      initial: "P",
      color: "bg-white",
    },
    {
      name: "Rick van der Berg",
      text: "Fantastische begeleiding en resultaten die ik nooit voor mogelijk had gehouden. Echt een aanrader!",
      initial: "R",
      color: "bg-evotion-primary",
    },
  ]

  // Replace typewriter hook
  const { displayText: typewriterText, isComplete } = useOptimizedTypewriter("EVOTION COACHING", 100)

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

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

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
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Er ging iets mis bij het verzenden." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative py-32 min-h-screen flex items-center overflow-hidden">
        {/* Video Background with Enhanced Overlay */}
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
            <div className="absolute inset-0 bg-black/70"></div>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(45deg, 
                rgba(30, 24, 57, 0.95) 0%, 
                rgba(30, 24, 57, 0.8) 25%,
                rgba(0, 0, 0, 0.7) 50%,
                rgba(30, 24, 57, 0.8) 75%,
                rgba(30, 24, 57, 0.95) 100%)`,
                backgroundSize: "400% 400%",
                animation: "gradientShift 15s ease infinite",
              }}
            ></div>
          </div>
        </div>

        {/* Desktop Content with Enhanced Animations */}
        <div
          ref={heroParallax.ref}
          className="container mx-auto px-6 relative z-10"
          style={{ transform: `translateY(${heroParallax.offset}px)` }}
        >
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <div className="space-y-8">
              {/* Enhanced Social Proof Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-base px-6 py-3 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
                  <Award className="w-4 h-4 mr-2 animate-pulse text-white" />
                  Gecertificeerde Personal Trainers
                </Badge>
                <Badge
                  className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-base px-6 py-3 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Shield className="w-4 h-4 mr-2 animate-pulse text-white" />
                  100% Geld Terug Garantie
                </Badge>
              </div>

              {/* Animated main heading with enhanced typography */}
              <h1 className="text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight animate-fade-in-up">
                <span className="inline-block">
                  {isLoaded ? typewriterText : "EVOTION COACHING"}
                  {!isComplete && <span className="animate-pulse">|</span>}
                </span>
              </h1>

              {/* Animated subtitle with enhanced gradient */}
              <h2
                className="text-4xl xl:text-5xl font-semibold text-white leading-tight mb-4 animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-pulse">
                  Jouw droomlichaam binnen handbereik.
                </span>
              </h2>

              {/* Enhanced description with better spacing */}
              <div
                className="text-2xl xl:text-3xl text-gray-200 leading-relaxed max-w-4xl mx-auto animate-fade-in-up space-y-6"
                style={{ animationDelay: "1s" }}
              >
                <p className="mb-6">Zonder je favoriete eten, sociale leven of vrijheid op te geven!</p>
                <p className="font-medium bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                  We helpen jou je droomlichaam te bereiken én te behouden – snel, effectief, en zonder opofferingen.
                </p>
              </div>

              {/* Enhanced Value Props with Better Styling */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-6">
                <div
                  className="flex items-center gap-3 text-white font-bold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-left border border-white/20 hover:border-white/40"
                  style={{ animationDelay: "1.2s" }}
                >
                  <Clock className="w-6 h-6 text-white" />
                  <span>Zie resultaten binnen 4 weken</span>
                </div>
                <div
                  className="flex items-center gap-3 text-white font-bold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-right border border-white/20 hover:border-white/40"
                  style={{ animationDelay: "1.4s" }}
                >
                  <Flame className="w-6 h-6 text-white" />
                  <span>Bewezen methode voor blijvend resultaat</span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons with Better Hover Effects */}
            <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
              <Button
                size="lg"
                className="bg-white text-evotion-primary hover:bg-gray-100 px-12 py-7 text-2xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Jouw Transformatie
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-evotion-primary/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-evotion-primary px-12 py-7 text-2xl font-semibold bg-transparent transform hover:scale-105 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Gratis Consult
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Enhanced Animated Statistics with Better Animations */}
            <div ref={statsRef} className="grid grid-cols-4 gap-12 pt-20 max-w-5xl mx-auto">
              <div
                className={`text-center transform hover:scale-110 transition-all duration-700 ${
                  statsVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "2s" }}
              >
                <div className="text-6xl font-bold text-white mb-3">100+</div>
                <div className="text-xl text-gray-200">Tevreden Klanten</div>
              </div>
              <div
                className={`text-center transform hover:scale-110 transition-all duration-700 ${
                  statsVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "2.2s" }}
              >
                <div className="text-6xl font-bold text-white mb-3">5.0</div>
                <div className="text-xl text-gray-200">Google Rating</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      style={{ animation: `pulse 2s infinite ${i * 0.3}s` }}
                    />
                  ))}
                </div>
              </div>
              <div
                className={`text-center transform hover:scale-110 transition-all duration-700 ${
                  statsVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "2.4s" }}
              >
                <div className="text-6xl font-bold text-white mb-3">95%</div>
                <div className="text-xl text-gray-200">Succesvol</div>
              </div>
              <div
                className={`text-center transform hover:scale-110 transition-all duration-700 ${
                  statsVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "2.6s" }}
              >
                <div className="text-6xl font-bold text-white mb-3">10+</div>
                <div className="text-xl text-gray-200">Jaar Ervaring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll indicator with Better Animation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="group cursor-pointer">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center group-hover:border-white transition-colors duration-300">
              <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse group-hover:bg-white transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Diensten Section with Better Cards */}
      <section
        id="diensten"
        className="py-28 relative bg-gradient-to-br from-white via-gray-50/30 to-white border-t-8 border-evotion-primary/20"
      >
        <div className="container mx-auto px-6 relative z-10">
          {/* Enhanced Header with Better Typography */}
          <div className="text-center space-y-8 mb-20">
            <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-lg px-6 py-3 shadow-lg">
              <Target className="w-5 h-5 mr-2 text-evotion-primary" />
              Onze Diensten
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Kies Jouw <span className="text-evotion-primary">Transformatie</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Elke reis is uniek. Daarom bieden we verschillende programma's aan die perfect aansluiten bij jouw doelen,
              levensstijl en budget.
            </p>
          </div>

          {/* Enhanced Service Cards with Better Hover Effects - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Premium Coaching Card - Enhanced */}
            <Card className="group relative overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3 bg-gradient-to-br from-white to-gray-50/50">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-evotion-primary text-white font-bold px-3 py-1 shadow-lg animate-pulse text-xs">
                  <Award className="w-3 h-3 mr-1 text-white" />
                  POPULAIR
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-evotion-primary transition-colors duration-300">
                      Premium Coaching
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Persoonlijke begeleiding met wekelijkse check-ins, aangepaste trainingsschema's en voedingsadvies.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Wekelijkse 1-op-1 sessies</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Persoonlijk trainingsschema</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">24/7 WhatsApp support</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Voedingsschema op maat</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/premium-coaching">
                    <Button className="w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Online Coaching Card - Enhanced */}
            <Card className="group relative overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-evotion-primary transition-colors duration-300">
                      Online Coaching
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Flexibele online begeleiding met toegang tot onze app en maandelijkse check-ins.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Maandelijkse check-ins</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Toegang tot Evotion App</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Trainingsschema's</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Voedingsrichtlijnen</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/online-coaching">
                    <Button className="w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 12 Weken Vetverlies Card - Enhanced */}
            <Card className="group relative overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3 bg-gradient-to-br from-white to-gray-50/50">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-evotion-primary text-white font-bold px-3 py-1 shadow-lg text-xs">
                  <Shield className="w-3 h-3 mr-1 text-white" />
                  GARANTIE
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-evotion-primary transition-colors duration-300">
                      12 Weken Vetverlies
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Intensief 12-weken programma met gegarandeerde resultaten of geld terug.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">12 weken intensieve begeleiding</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Geld-terug-garantie</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Wekelijkse metingen</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Complete lifestyle coaching</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/12-weken-vetverlies">
                    <Button className="w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center mt-20 space-y-8">
            <div className="bg-gradient-to-r from-evotion-primary/10 to-evotion-primary/10 rounded-3xl p-12 max-w-4xl mx-auto border border-evotion-primary/20 shadow-xl">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Niet zeker welk programma bij jou past?</h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Boek een gratis kennismakingsgesprek en ontdek samen met ons welke aanpak het beste bij jouw doelen en
                levensstijl past.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white px-12 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  Gratis Kennismakingsgesprek
                  <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 text-white" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Personal Training Section */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-evotion-primary to-evotion-primary relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            {/* Enhanced Content Side */}
            <div className="space-y-10">
              <div className="space-y-8">
                <Badge className="bg-white/20 text-white border border-white/30 text-lg px-6 py-3 backdrop-blur-sm shadow-lg">
                  <User className="w-5 h-5 mr-2 text-white" />
                  Personal Training
                </Badge>
                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                  Persoonlijke Training met Professionele Begeleiding
                </h2>
                <p className="text-2xl text-gray-200 leading-relaxed">
                  Ervaar de kracht van persoonlijke begeleiding met onze gecertificeerde personal trainers. Met
                  volledige aandacht en op maat gemaakte trainingen bereik je sneller en veiliger je doelen.
                </p>
              </div>

              {/* Enhanced Feature List */}
              <div className="grid gap-6">
                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Dumbbell className="w-8 h-8 text-evotion-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Persoonlijke Training Sessies</h3>
                    <p className="text-lg text-gray-300">
                      Volledige aandacht van je gecertificeerde trainer tijdens elke sessie
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-8 h-8 text-evotion-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Aangepaste Oefeningen</h3>
                    <p className="text-lg text-gray-300">
                      Trainingen perfect afgestemd op jouw niveau, doelen en fysieke mogelijkheden
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Calendar className="w-8 h-8 text-evotion-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Flexibele Planning</h3>
                    <p className="text-lg text-gray-300">Plan je sessies op tijden en locaties die bij jou passen</p>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className="pt-8">
                <Link href="/personal-training">
                  <Button
                    size="lg"
                    className="bg-white text-evotion-primary hover:bg-gray-100 px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      Meer over Personal Training
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Studio Image */}
            <div className="relative">
              <div className="relative mx-auto w-full h-[500px] transform hover:scale-105 transition-all duration-500 group rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Begeleiding"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-white to-white rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <Award className="w-10 h-10 text-evotion-primary" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-white to-white rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
                <Star className="w-10 h-10 text-evotion-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced App Section with Better Visual Hierarchy */}
      <section className="py-28 bg-gradient-to-br from-white via-gray-50/30 to-white">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-evotion-primary/5 to-transparent"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #bad4e1 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            {/* Enhanced Content Side */}
            <div className="space-y-10">
              <div className="space-y-8">
                <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-lg px-6 py-3 shadow-lg">
                  <Zap className="w-5 h-5 mr-2 text-evotion-primary" />
                  Evotion App
                </Badge>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  Jouw Persoonlijke <span className="text-evotion-primary">Fitness Coach</span> in je Zak
                </h2>
                <p className="text-2xl text-gray-600 leading-relaxed">
                  Onze geavanceerde app biedt alles wat je nodig hebt voor jouw transformatie. Van gepersonaliseerde
                  trainingen tot voedingsadvies en directe communicatie met je coach.
                </p>
              </div>

              {/* Enhanced Feature List */}
              <div className="grid gap-6">
                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gepersonaliseerde Trainingen</h3>
                    <p className="text-lg text-gray-600">Trainingsschema's aangepast aan jouw niveau en doelen</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Voedingsadvies op Maat</h3>
                    <p className="text-lg text-gray-600">Maaltijdplannen die passen bij jouw smaak en levensstijl</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Directe Coach Communicatie</h3>
                    <p className="text-lg text-gray-600">Chat rechtstreeks met je coach voor vragen en motivatie</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Download CTA */}
              <div className="pt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    Download de App
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Enhanced App Mockup - Larger */}
            <div className="relative">
              <div className="relative mx-auto w-96 h-[720px] transform hover:scale-105 transition-all duration-500 group">
                {/* Enhanced Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-[3rem] shadow-2xl border-8 border-gray-700 group-hover:shadow-3xl transition-shadow duration-500"></div>
                <div className="absolute inset-4 bg-black rounded-[2.5rem] overflow-hidden">
                  <Image
                    src="/images/evotion-app-login.jpg"
                    alt="Evotion App Interface"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-evotion-primary/20 via-transparent to-evotion-primary/20 rounded-[4rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Transformaties Section - Card Layout */}
      <section className="py-28 bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-8 mb-20">
            <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-lg px-6 py-3 shadow-lg">
              <TrendingUp className="w-5 h-5 mr-2 text-evotion-primary" />
              Echte Resultaten
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Ongelooflijke <span className="text-evotion-primary">Transformaties</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Zie hoe onze klanten hun droomlichaam hebben bereikt en hun leven hebben getransformeerd met onze bewezen
              methodes.
            </p>
          </div>

          {/* Enhanced Transformation Cards - Combined Layout */}
          <div className="space-y-12 max-w-7xl mx-auto">
            {/* Martin's Transformation Card */}
            <Card className="group overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/images/martin-transformation-new.png"
                      alt="Martin's transformatie - 10.7kg gewichtsverlies"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-evotion-primary text-white font-bold px-4 py-2 shadow-lg">
                        <Award className="w-4 h-4 mr-1 text-white" />
                        Eigenaar
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                    <h3 className="text-4xl font-bold text-gray-900 group-hover:text-evotion-primary transition-colors duration-300">
                      Martin's Transformatie
                    </h3>
                    <div className="space-y-4 text-xl text-gray-600 leading-relaxed">
                      <p className="italic">
                        "Als eigenaar van Evotion Coaching is het belangrijk om het goede voorbeeld te geven – en dat
                        heb ik meer dan bewezen."
                      </p>
                      <p>
                        In slechts 11 weken is Martin 10,7 kg kwijtgeraakt. Door leiderschap door voorbeeld te tonen,
                        laat hij zien dat zijn methodes écht werken. Met consistente discipline en bewuste keuzes heeft
                        hij een duurzaam resultaat bereikt dat hij nu uitdraagt én zijn klanten leert implementeren.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">-10.7kg</div>
                        <div className="text-sm text-gray-500">gewichtsverlies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">11</div>
                        <div className="text-sm text-gray-500">weken</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">100%</div>
                        <div className="text-sm text-gray-500">leiderschap</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salim's Transformation Card */}
            <Card className="group overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6 lg:order-1">
                    <h3 className="text-4xl font-bold text-gray-900 group-hover:text-evotion-primary transition-colors duration-300">
                      Salim's Transformatie
                    </h3>
                    <div className="space-y-4 text-xl text-gray-600 leading-relaxed">
                      <p className="italic">
                        "Een indrukwekkende transformatie waarbij ik maar liefst 8,1 kg ben afgevallen en veel heb
                        geleerd over duurzame leefstijlveranderingen."
                      </p>
                      <p>
                        Salim bereikte dit resultaat door een combinatie van online coaching en personal training. Door
                        consistente wekelijkse check-ins en actief gebruik van dagelijkse gewoontetrackers, bouwde hij
                        stap voor stap nieuwe, gezonde routines op. Hij heeft nu de tools en kennis om deze resultaten
                        op lange termijn vast te houden.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">-8.1kg</div>
                        <div className="text-sm text-gray-500">gewichtsverlies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">100%</div>
                        <div className="text-sm text-gray-500">duurzaam resultaat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">10/10</div>
                        <div className="text-sm text-gray-500">zelfvertrouwen</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden lg:order-2">
                    <Image
                      src="/images/salim-transformation-new.png"
                      alt="Salim's transformatie - 8.1kg gewichtsverlies"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wouter's Transformation Card */}
            <Card className="group overflow-hidden border-2 border-gray-200 hover:border-evotion-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/images/wouter-transformation-new.png"
                      alt="Wouter's body recomposition transformatie"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-evotion-primary text-white font-bold px-4 py-2 shadow-lg">
                        <TrendingUp className="w-4 h-4 mr-1 text-white" />
                        Recomp
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                    <h3 className="text-4xl font-bold text-gray-900 group-hover:text-evotion-primary transition-colors duration-300">
                      Wouter's Transformatie
                    </h3>
                    <div className="space-y-4 text-xl text-gray-600 leading-relaxed">
                      <p className="italic">
                        "In 8 weken ging ik van 69,6 kg naar 67,5 kg, waarbij ik een indrukwekkende body recomposition
                        doormaakte. Minder vet, meer definitie en een sterker, fitter lichaam!"
                      </p>
                      <p>
                        Door persoonlijk contact en begeleiding, waarbij we oefeningselectie bespraken en zijn training
                        aanpasten, bleef het uitdagend en motiverend. Wouter hield zijn voortgang nauwkeurig bij, wat
                        ons in staat stelde gericht aanpassingen te maken en het maximale uit zijn traject te halen.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">8</div>
                        <div className="text-sm text-gray-500">weken programma</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">Recomp</div>
                        <div className="text-sm text-gray-500">body transformation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-evotion-primary">100%</div>
                        <div className="text-sm text-gray-500">definitie</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Results CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-evotion-primary/10 to-evotion-primary/10 rounded-3xl p-12 max-w-4xl mx-auto border border-evotion-primary/20 shadow-xl">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Klaar om jouw eigen <span className="text-evotion-primary">succesverhaal</span> te schrijven?
              </h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sluit je aan bij honderden tevreden klanten die hun droomlichaam hebben bereikt met onze bewezen
                methodes.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white px-12 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  Start Jouw Transformatie
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 text-white" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Google Reviews Section */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-evotion-primary to-evotion-primary relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 3px 3px, white 2px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center space-y-8 mb-20">
            <Badge className="bg-white/20 text-white border border-white/30 text-lg px-6 py-3 backdrop-blur-sm shadow-lg">
              <Star className="w-5 h-5 mr-2 text-white" />
              Google Reviews
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Wat Onze Klanten <span style={{ color: "#bad4e1" }}>Zeggen</span>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-8 h-8 text-yellow-400 fill-current"
                    style={{ animation: `pulse 2s infinite ${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-3xl font-bold text-white">5.0</span>
              <span className="text-xl text-gray-300">op Google</span>
            </div>
          </div>

          {/* Enhanced Reviews Grid - Desktop 3 columns, 2 rows */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${testimonial.color} rounded-full flex items-center justify-center ${
                        testimonial.color === "bg-white" ? "text-evotion-primary" : "text-white"
                      } font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {testimonial.initial}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-200 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                    <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">G</span>
                    </div>
                    <span className="text-sm text-gray-300">Geverifieerde Google review</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced More Reviews CTA */}
          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-evotion-primary px-12 py-6 text-xl font-semibold bg-transparent transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                Bekijk Alle Reviews
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-28 bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-8 mb-20">
            <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-lg px-6 py-3 shadow-lg">
              <MessageCircle className="w-5 h-5 mr-2 text-evotion-primary" />
              Contact
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Klaar om te <span className="text-evotion-primary">Beginnen</span>?
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Neem contact met ons op voor een gratis kennismakingsgesprek. We bespreken jouw doelen en maken een plan
              op maat.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
            {/* Enhanced Contact Options */}
            <div className="space-y-10">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold text-gray-900">Neem Direct Contact Op</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We staan klaar om al je vragen te beantwoorden en je te helpen bij het kiezen van het juiste
                  programma.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Bel Ons Direct</h4>
                    <p className="text-lg text-gray-600">+31 6 10935077</p>
                    <p className="text-sm text-gray-500">Ma-Vr: 9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp</h4>
                    <p className="text-sm text-gray-500 mb-4">Snelle reactie gegarandeerd</p>
                    <a
                      href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s.%20Kunnen%20we%20een%20kennismakingsgesprek%20inplannen%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Begin Chat
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Email</h4>
                    <p className="text-lg text-gray-600">info@evotion-coaching.nl</p>
                    <p className="text-sm text-gray-500">Reactie binnen 24 uur</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900">Stuur ons een Bericht</h3>
                    <p className="text-lg text-gray-600">
                      Vul het formulier in en we nemen binnen 24 uur contact met je op.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Voornaam *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Achternaam *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-evotion-primary focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Vertel ons meer over je doelen en verwachtingen..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Versturen...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          Verstuur Bericht
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      )}
                    </Button>

                    {submitMessage && (
                      <div
                        className={`p-4 rounded-lg text-center font-medium ${
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
