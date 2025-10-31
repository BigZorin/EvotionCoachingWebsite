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
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative py-32 min-h-screen flex items-center overflow-hidden">
        {/* Video + overlays */}
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

            {/* Animated gradient veil */}
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
            />
          </div>
        </div>

        {/* Content */}
        <div
          ref={heroParallax.ref}
          className="container mx-auto px-6 relative z-10"
          style={{ transform: `translateY(${heroParallax.offset}px)` }}
        >
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <div className="space-y-8">
              {/* Social proof */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <Badge className="bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm text-base px-6 py-3 transform hover:scale-105 transition-all duration-300 animate-fade-in-up ev-glow">
                  <Award className="w-4 h-4 mr-2 text-white" />
                  Gecertificeerde Personal Trainers
                </Badge>
                <Badge
                  className="bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm text-base px-6 py-3 transform hover:scale-105 transition-all duration-300 animate-fade-in-up ev-glow"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Shield className="w-4 h-4 mr-2 text-white" />
                  100% Geld Terug Garantie
                </Badge>
              </div>

              {/* Heading */}
              <h1 className="text-7xl xl:text-8xl font-extrabold text-white leading-tight tracking-tight animate-fade-in-up">
                <span className="inline-block drop-shadow-[0_4px_24px_rgba(186,212,225,0.35)]">
                  {isLoaded ? typewriterText : "EVOTION COACHING"}
                  {!isComplete && <span className="animate-pulse">|</span>}
                </span>
              </h1>

              {/* Subheading */}
              <h2
                className="text-4xl xl:text-5xl font-semibold text-white leading-tight mb-4 animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-pulse">
                  Jouw droomlichaam binnen handbereik.
                </span>
              </h2>

              {/* Description */}
              <div
                className="text-2xl xl:text-3xl text-gray-200 leading-relaxed max-w-4xl mx-auto animate-fade-in-up space-y-6"
                style={{ animationDelay: "1s" }}
              >
                <p className="mb-6">Zonder je favoriete eten, sociale leven of vrijheid op te geven!</p>
                <p className="font-medium bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                  We helpen jou je droomlichaam te bereiken én te behouden – snel, effectief, en zonder opofferingen.
                </p>
              </div>

              {/* Value props */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-6">
                <div
                  className="flex items-center gap-3 text-white font-semibold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-left border border-white/20 hover:border-white/40 ev-glow"
                  style={{ animationDelay: "1.2s" }}
                >
                  <Clock className="w-6 h-6 text-white" />
                  <span>Zie resultaten binnen 4 weken</span>
                </div>
                <div
                  className="flex items-center gap-3 text-white font-semibold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-right border border-white/20 hover:border-white/40 ev-glow"
                  style={{ animationDelay: "1.4s" }}
                >
                  <Flame className="w-6 h-6 text-white" />
                  <span>Bewezen methode voor blijvend resultaat</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
              <Button
                size="lg"
                className="ev-shine bg-white text-evotion-primary hover:bg-gray-100 px-12 py-7 text-2xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Jouw Transformatie
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="ev-shine border-2 border-white/70 text-white hover:bg-white hover:text-evotion-primary px-12 py-7 text-2xl font-semibold bg-transparent transform hover:scale-105 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Gratis Consult
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 md:pt-20 max-w-5xl mx-auto"
            >
              {[
                { k: "100+", v: "Tevreden Klanten" },
                { k: "5.0", v: "Google Rating" },
                { k: "95%", v: "Succesvol" },
                { k: "10+", v: "Jaar Ervaring" },
              ].map((s, i) => (
                <div
                  key={s.v}
                  className={`text-center transform hover:scale-110 transition-all duration-700 ${
                    statsVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${2 + i * 0.2}s` }}
                >
                  <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
                    {s.k}
                  </div>
                  <div className="text-lg md:text-xl text-gray-200">{s.v}</div>
                  {s.v === "Google Rating" && (
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="group cursor-pointer">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center group-hover:border-white transition-colors duration-300">
              <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse group-hover:bg-white transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="diensten"
        className="py-28 relative bg-gradient-to-br from-white via-gray-50/30 to-white border-t-8 border-evotion-primary/10"
      >
        {/* soft grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(30,24,57,0.6) 1px, transparent 0), radial-gradient(circle at 3px 3px, rgba(186,212,225,0.6) 1px, transparent 0)",
            backgroundSize: "28px 28px, 28px 28px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
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

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Premium */}
            <Card className="group relative overflow-hidden ev-gradient-border bg-white/80 backdrop-blur border-transparent transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
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
                <ul className="space-y-3">
                  {[
                    "Wekelijkse 1-op-1 sessies",
                    "Persoonlijk trainingsschema",
                    "24/7 WhatsApp support",
                    "Voedingsschema op maat",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link href="/premium-coaching">
                    <Button className="ev-shine w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold transition-all duration-300 transform group-hover:scale-[1.02]">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Online */}
            <Card className="group relative overflow-hidden ev-gradient-border bg-white/80 backdrop-blur border-transparent transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
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
                <ul className="space-y-3">
                  {[
                    "Maandelijkse check-ins",
                    "Toegang tot Evotion App",
                    "Trainingsschema's",
                    "Voedingsrichtlijnen",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link href="/online-coaching">
                    <Button className="ev-shine w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold transition-all duration-300 transform group-hover:scale-[1.02]">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 12 Weken */}
            <Card className="group relative overflow-hidden ev-gradient-border bg-white/80 backdrop-blur border-transparent transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
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
                <ul className="space-y-3">
                  {[
                    "12 weken intensieve begeleiding",
                    "Geld-terug-garantie",
                    "Wekelijkse metingen",
                    "Complete lifestyle coaching",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link href="/12-weken-vetverlies">
                    <Button className="ev-shine w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:from-evotion-primary hover:to-evotion-primary text-white py-3 text-base font-semibold transition-all duration-300 transform group-hover:scale-[1.02]">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-20 space-y-8">
            <div className="ev-gradient-border bg-white/80 backdrop-blur rounded-3xl p-12 max-w-4xl mx-auto border-transparent shadow-xl">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Niet zeker welk programma bij jou past?</h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Boek een gratis kennismakingsgesprek en ontdek samen met ons welke aanpak het beste bij jouw doelen en
                levensstijl past.
              </p>
              <Button
                size="lg"
                className="ev-shine bg-gradient-to-r from-evotion-primary to-evotion-primary hover:opacity-95 text-white px-12 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group"
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

      {/* PERSONAL TRAINING */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-evotion-primary to-evotion-primary relative overflow-hidden">
        {/* subtle rays */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, white 2px, transparent 0), radial-gradient(circle at 80% 60%, white 2px, transparent 0)",
            backgroundSize: "60px 60px, 60px 60px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
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

              <div className="grid gap-6">
                {[
                  { icon: Dumbbell, title: "Persoonlijke Training Sessies", desc: "Volledige aandacht van je trainer" },
                  { icon: Target, title: "Aangepaste Oefeningen", desc: "Perfect afgestemd op jouw doelen" },
                  { icon: Calendar, title: "Flexibele Planning", desc: "Plan sessies wanneer het jou past" },
                ].map((f, idx) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <f.icon className="w-8 h-8 text-evotion-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{f.title}</h3>
                      <p className="text-lg text-gray-300">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/personal-training">
                  <Button
                    size="lg"
                    className="ev-shine bg-white text-evotion-primary hover:bg-gray-100 px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      Meer over Personal Training
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative mx-auto w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl ev-photo-frame">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Begeleiding"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover will-change-transform transition-transform duration-700 hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating icons */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <Award className="w-10 h-10 text-evotion-primary" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
                <Star className="w-10 h-10 text-evotion-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APP */}
      <section className="py-28 bg-gradient-to-br from-white via-gray-50/30 to-white relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #bad4e1 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            {/* Content */}
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

              <div className="grid gap-6">
                {[
                  { icon: Target, t: "Gepersonaliseerde Trainingen", d: "Schema's voor jouw niveau en doelen" },
                  { icon: Sparkles, t: "Voedingsadvies op Maat", d: "Plannen passend bij jouw smaak" },
                  { icon: MessageCircle, t: "Directe Coach Communicatie", d: "Chat direct met je coach" },
                ].map((f) => (
                  <div
                    key={f.t}
                    className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <f.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{f.t}</h3>
                      <p className="text-lg text-gray-600">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  size="lg"
                  className="ev-shine bg-gradient-to-r from-evotion-primary to-evotion-primary hover:opacity-95 text-white px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    Download de App
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-96 h-[720px] transform hover:scale-105 transition-all duration-500 group">
                <div className="absolute -inset-[2px] rounded-[3.1rem] bg-gradient-to-br from-[#1e1839] via-[#bad4e1] to-[#1e1839] blur-[10px] opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-[3rem] shadow-2xl border-8 border-gray-700 group-hover:shadow-3xl transition-shadow duration-500"></div>
                <div className="absolute inset-4 bg-white rounded-[2.5rem] overflow-hidden ev-photo-frame flex items-center justify-center">
                  <Image
                    src="/images/evotion-logo-mockup-desktop.png"
                    alt="Evotion Logo Mockup"
                    fill
                    sizes="(min-width: 1024px) 24rem, 90vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-700 p-8"
                  />
                </div>
              </div>

              <div className="absolute -top-8 -left-8 w-20 h-20 bg-evotion-primary rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-evotion-primary rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMATIES */}
      <section className="py-28 bg-gradient-to-br from-white via-gray-50/50 to-white relative">
        <div className="container mx-auto px-6">
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

          <div className="space-y-12 max-w-7xl mx-auto">
            {/* Martin */}
            <Card className="group overflow-hidden ev-gradient-border border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/images/martin-transformation-new.png"
                      alt="Martin's transformatie - 10.7kg gewichtsverlies"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
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
                      {[
                        { k: "-10.7kg", v: "gewichtsverlies" },
                        { k: "11", v: "weken" },
                        { k: "100%", v: "leiderschap" },
                      ].map((x) => (
                        <div key={x.v} className="text-center">
                          <div className="text-3xl font-bold text-evotion-primary">{x.k}</div>
                          <div className="text-sm text-gray-500">{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salim */}
            <Card className="group overflow-hidden ev-gradient-border border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
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
                      {[
                        { k: "-8.1kg", v: "gewichtsverlies" },
                        { k: "100%", v: "duurzaam resultaat" },
                        { k: "10/10", v: "zelfvertrouwen" },
                      ].map((x) => (
                        <div key={x.v} className="text-center">
                          <div className="text-3xl font-bold text-evotion-primary">{x.k}</div>
                          <div className="text-sm text-gray-500">{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden lg:order-2">
                    <Image
                      src="/images/salim-transformation-new.png"
                      alt="Salim's transformatie - 8.1kg gewichtsverlies"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wouter */}
            <Card className="group overflow-hidden ev-gradient-border border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/images/wouter-transformation-new.png"
                      alt="Wouter's body recomposition transformatie"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
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
                      {[
                        { k: "8", v: "weken programma" },
                        { k: "Recomp", v: "body transformation" },
                        { k: "100%", v: "definitie" },
                      ].map((x) => (
                        <div key={x.v} className="text-center">
                          <div className="text-3xl font-bold text-evotion-primary">{x.k}</div>
                          <div className="text-sm text-gray-500">{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="ev-gradient-border bg-white/80 backdrop-blur rounded-3xl p-12 max-w-4xl mx-auto border-transparent shadow-xl">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Klaar om jouw eigen <span className="text-evotion-primary">succesverhaal</span> te schrijven?
              </h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sluit je aan bij honderden tevreden klanten die hun droomlichaam hebben bereikt met onze bewezen
                methodes.
              </p>
              <Button
                size="lg"
                className="ev-shine bg-gradient-to-r from-evotion-primary to-evotion-primary hover:opacity-95 text-white px-12 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group"
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

      {/* REVIEWS */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-evotion-primary to-evotion-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 3px 3px, white 2px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8 mb-20">
            <Badge className="bg-white/20 text-white border border-white/30 text-lg px-6 py-3 backdrop-blur-sm shadow-lg">
              <Star className="w-5 h-5 mr-2 text-white" />
              Google Reviews
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Wat Onze Klanten <span className="text-evotion-secondary">Zeggen</span>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-3xl font-bold text-white">5.0</span>
              <span className="text-xl text-gray-300">op Google</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${t.color} rounded-full flex items-center justify-center ${
                        t.color === "bg-white" ? "text-evotion-primary" : "text-white"
                      } font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t.name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-200 leading-relaxed italic">"{t.text}"</p>
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

          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="ev-shine border-2 border-white text-white hover:bg-white hover:text-evotion-primary px-12 py-6 text-xl font-semibold bg-transparent transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                Bekijk Alle Reviews
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-6">
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
            <div className="space-y-10">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold text-gray-900">Neem Direct Contact Op</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We staan klaar om al je vragen te beantwoorden en je te helpen bij het kiezen van het juiste
                  programma.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: "Bel Ons Direct",
                    desc: "+31 6 10935077",
                    hint: "Ma-Vr: 9:00-18:00",
                  },
                  {
                    icon: MessageCircle,
                    title: "WhatsApp",
                    desc: "Begin Chat",
                    hint: "Snelle reactie gegarandeerd",
                    href: "https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s.%20Kunnen%20we%20een%20kennismakingsgesprek%20inplannen%3F",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    desc: "info@evotion-coaching.nl",
                    hint: "Reactie binnen 24 uur",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-evotion-primary to-evotion-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <c.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-1">{c.title}</h4>
                      <p className="text-lg text-gray-700">{c.desc}</p>
                      <p className="text-sm text-gray-500">{c.hint}</p>
                      {c.href && (
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-evotion-primary hover:underline"
                        >
                          Open WhatsApp <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <Card className="ev-gradient-border border-transparent shadow-xl">
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
                        id="email"
                        type="email"
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
                        id="phone"
                        type="tel"
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
                      className="ev-shine w-full bg-gradient-to-r from-evotion-primary to-evotion-primary hover:opacity-95 text-white py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
