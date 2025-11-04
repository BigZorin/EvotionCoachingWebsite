"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dumbbell,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Heart,
  Smartphone,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { sendContactEmail } from "@/app/actions/contact"
import Link from "next/link"

export default function EvotionCoachingMobile() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
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

  const testimonials = [
    {
      name: "Wouter Baerveldt",
      text: "Martin heeft veel kennis en weet dit op een toegankelijke manier over te brengen. Al mooie resultaten behaald!",
      initial: "W",
      rating: 5,
    },
    {
      name: "Ingrid Eekhof",
      text: "Martin bewaart perfect de balans tussen professioneel en persoonlijk. De Evotion App is gebruiksvriendelijk!",
      initial: "I",
      rating: 5,
    },
    {
      name: "Kim Altena",
      text: "Een mooi kado aan jezelf! Al na 3 weken geweldige resultaten. Veel energie en goed slapen!",
      initial: "K",
      rating: 5,
    },
    {
      name: "Salim Bouali",
      text: "Ongelooflijke resultaten in 12 weken! Martin's begeleiding heeft mijn leven echt veranderd.",
      initial: "S",
      rating: 5,
    },
  ]

  const services = [
    {
      icon: Heart,
      title: "Premium Coaching",
      subtitle: "Het beste van beide werelden",
      description: "Combinatie van Personal Training en Online Coaching voor maximale resultaten.",
      features: ["1-op-1 begeleiding", "24/7 coach support", "Evotion App toegang", "Wekelijkse check-ins"],
      popular: true,
      href: "/premium-coaching",
    },
    {
      icon: Users,
      title: "Online Coaching",
      subtitle: "Flexibele coaching via app",
      description: "Professionele begeleiding waar en wanneer het jou uitkomt via onze geavanceerde app.",
      features: ["Gepersonaliseerde schema's", "Coach communicatie", "Voortgang tracking", "Flexibele planning"],
      popular: false,
      href: "/online-coaching",
    },
    {
      icon: Dumbbell,
      title: "Personal Training",
      subtitle: "Persoonlijke 1-op-1 begeleiding",
      description: "Directe begeleiding van gecertificeerde trainers voor snelle en veilige resultaten.",
      features: ["Volledige aandacht", "Aangepaste oefeningen", "Directe feedback", "Motivatie & support"],
      popular: false,
      href: "/personal-training",
    },
    {
      icon: TrendingUp,
      title: "12-Weken Vetverlies",
      subtitle: "Intensief transformatie programma",
      description: "Gestructureerd 12-weken programma met gegarandeerde resultaten of geld terug.",
      features: ["Gegarandeerde resultaten", "Wekelijkse metingen", "Complete begeleiding", "Geld-terug-garantie"],
      popular: false,
      href: "/12-weken-vetverlies",
    },
  ]

  const transformations = [
    {
      name: "Martin",
      result: "-10.7kg in 11 weken",
      image: "/images/martin-transformation-new.png",
      quote: "Als eigenaar laat ik zien dat onze methodes écht werken.",
    },
    {
      name: "Salim",
      result: "-8.1kg transformatie",
      image: "/images/salim-transformation-new.png",
      quote: "Ongelooflijke resultaten en geleerd over duurzame veranderingen.",
    },
    {
      name: "Wouter",
      result: "Body recomposition in 8 weken",
      image: "/images/wouter-transformation-new.png",
      quote: "Minder vet, meer definitie - precies wat ik wilde bereiken.",
    },
  ]

  const stats = [
    { number: "100+", label: "Tevreden Klanten" },
    { number: "5.0", label: "Google Rating" },
    { number: "95%", label: "Succesvol" },
    { number: "10+", label: "Jaar Ervaring" },
  ]

  const appFeatures = [
    {
      icon: Target,
      title: "Gepersonaliseerde Trainingen",
      description: "Trainingsschema's aangepast aan jouw niveau en doelen",
    },
    {
      icon: Sparkles,
      title: "Voedingsadvies op Maat",
      description: "Maaltijdplannen die passen bij jouw smaak en levensstijl",
    },
    {
      icon: MessageCircle,
      title: "Directe Coach Communicatie",
      description: "Chat rechtstreeks met je coach voor vragen en motivatie",
    },
    { icon: BarChart3, title: "Voortgang Tracking", description: "Volg je progressie met gedetailleerde statistieken" },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
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
      // Check if API key is available
      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set")
        setSubmitMessage({
          type: "error",
          text: "Email service is niet beschikbaar. Bel ons direct op 06 10 93 50 77.",
        })
        return
      }

      // Initialize Resend with API key
      const result = await sendContactEmail({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        subject: formData.goal || "algemeen",
        message: formData.message,
      })

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message || "Bericht verzonden!" })
        setFormData({ firstName: "", lastName: "", email: "", phone: "", goal: "", message: "" })
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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
            className="absolute inset-0 w-full h-full object-cover scale-150"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ pointerEvents: "none" }}
            title="Evotion Coaching introductievideo"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/80 via-[#1e1839]/70 to-[#1e1839]/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="text-center space-y-8">
            {/* Main heading - larger, bolder */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
                <span className="block">Jouw droomlichaam</span>
                <span className="block text-white/90">binnen handbereik</span>
              </h1>

              {/* Subheading - cleaner */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-sm mx-auto font-light">
                Zonder je favoriete eten, sociale leven of vrijheid op te geven
              </p>
            </div>

            {/* CTAs - more modern */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base font-semibold shadow-xl rounded-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Jouw Transformatie
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-base font-semibold bg-transparent backdrop-blur-sm rounded-xl"
                asChild
              >
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center justify-center gap-2">
                    Gratis Consult
                    <Calendar className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Stats - cleaner, more compact */}
            <div className="grid grid-cols-2 gap-6 pt-8 max-w-xs mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{s.number}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                  {s.label === "Google Rating" && (
                    <div className="flex justify-center mt-1.5 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIENSTEN */}
      <section id="diensten" className="py-16 bg-white relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #1e1839 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">
              <Target className="w-4 h-4 mr-2" />
              Onze Diensten
            </Badge>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Kies Jouw <span className="text-primary">Transformatie</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Elke reis is uniek. Daarom bieden we programma's die perfect aansluiten bij jouw doelen.
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className={`relative overflow-hidden ev-gradient-border border-transparent transition-all duration-300 ${
                  service.popular ? "shadow-xl" : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-primary text-white text-[10px] px-2 py-1">
                      <Award className="w-3 h-3 mr-1" />
                      POPULAIR
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{service.subtitle}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={service.href}>
                    <Button className="ev-shine w-full bg-primary hover:bg-primary/90 text-white">
                      Meer Informatie
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="ev-gradient-border border-transparent">
              <CardContent className="p-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">Niet zeker welk programma bij jou past?</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Boek een gratis kennismakingsgesprek en ontdek samen met ons wat bij jou past.
                </p>
                <Button size="lg" className="ev-shine w-full bg-primary hover:bg-primary/90 text-white" asChild>
                  <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-5 h-5 mr-2" />
                    Gratis Kennismakingsgesprek
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* APP */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">
              <Smartphone className="w-4 h-4 mr-2" />
              Evotion App
            </Badge>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Jouw Coach <span className="text-primary">In Je Zak</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Onze geavanceerde app biedt alles wat je nodig hebt voor jouw transformatie.
            </p>
          </div>

          <div className="relative mb-12">
            <div className="relative mx-auto w-64 h-[480px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-800">
              <Image
                src="/images/evotion-app-login.jpg"
                alt="Evotion App Interface"
                fill
                sizes="(max-width: 768px) 80vw, 320px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            {appFeatures.map((feature) => (
              <Card key={feature.title} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="ev-shine w-full bg-primary hover:bg-primary/90 text-white">
              <Smartphone className="w-5 h-5 mr-2" />
              Download de App
            </Button>
          </div>
        </div>
      </section>

      {/* PERSONAL TRAINING */}
      <section className="py-16 bg-evotion-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-white/20 text-white border-0 mb-4">
              <Dumbbell className="w-4 h-4 mr-2" />
              Personal Training
            </Badge>
            <h2 className="text-3xl font-extrabold mb-3">Persoonlijke Training met Professionele Begeleiding</h2>
            <p className="text-white/90 leading-relaxed">
              Ervaar de kracht van persoonlijke begeleiding met onze gecertificeerde personal trainers.
            </p>
          </div>

          <div className="relative mb-10 rounded-2xl overflow-hidden">
            <div className="relative mx-auto w-full h-64">
              <Image
                src="/images/personal-training-session.jpeg"
                alt="Personal Training Begeleiding"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { icon: Dumbbell, t: "Persoonlijke Training Sessies", d: "Volledige aandacht van je trainer" },
              { icon: Target, t: "Aangepaste Oefeningen", d: "Afgestemd op jouw niveau en doelen" },
              { icon: Calendar, t: "Flexibele Planning", d: "Plan sessies op tijden die bij jou passen" },
            ].map((f) => (
              <Card key={f.t} className="bg-white/10 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-evotion-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{f.t}</h3>
                      <p className="text-sm text-white/80">{f.d}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/personal-training">
              <Button size="lg" className="w-full bg-white text-evotion-primary hover:bg-gray-100 rounded-xl">
                <span className="flex items-center justify-center gap-2">
                  Meer over Personal Training
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSFORMATIES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Echte Resultaten
            </Badge>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Ongelooflijke <span className="text-primary">Transformaties</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Zie hoe onze klanten hun droomlichaam hebben bereikt met onze bewezen methodes.
            </p>
          </div>

          <div className="space-y-8">
            {transformations.map((t) => (
              <Card key={t.name} className="overflow-hidden ev-gradient-border border-transparent transition-colors">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={t.image || "/placeholder.svg"}
                      alt={`${t.name}'s transformatie`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">{t.result}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t.name}'s Transformatie</h3>
                    <p className="text-gray-600 italic">"{t.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="ev-gradient-border border-transparent">
              <CardContent className="p-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                  Klaar om jouw eigen <span className="text-primary">succesverhaal</span> te schrijven?
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Sluit je aan bij honderden tevreden klanten die hun droomlichaam hebben bereikt.
                </p>
                <Button size="lg" className="ev-shine w-full bg-primary hover:bg-primary/90 text-white">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Jouw Transformatie
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-white/20 text-white mb-4">
              <Star className="w-4 h-4 mr-2" />
              Google Reviews
            </Badge>
          </div>

          <div className="relative overflow-hidden testimonials-container">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={t.name} className="w-full flex-shrink-0 px-2">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold">
                          {t.initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{t.name}</h3>
                          <div className="flex">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 italic">"{t.text}"</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">G</span>
                        </div>
                        <span className="text-xs text-white/70">Geverifieerde Google review</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === activeTestimonial ? "bg-white" : "bg-white/30"}`}
                aria-label={`Ga naar review ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="ev-shine border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Bekijk Alle Reviews
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Badge>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Klaar om te <span className="text-primary">Beginnen</span>?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Neem contact met ons op voor een gratis kennismakingsgesprek.
            </p>
          </div>

          {/* Quick options */}
          <div className="space-y-4 mb-12">
            <a href="tel:0610935077" className="block">
              <Card className="ev-gradient-border border-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Bel Direct</h3>
                      <p className="text-primary font-medium">06 10 93 50 77</p>
                      <p className="text-sm text-gray-500">Ma-Vr: 9:00-18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="https://wa.me/31610935077" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="ev-gradient-border border-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">WhatsApp</h3>
                      <p className="text-primary font-medium">Start Chat</p>
                      <p className="text-sm text-gray-500">Snelle reactie gegarandeerd</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>

            <Card className="ev-gradient-border border-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="text-primary font-medium">info@evotion-coaching.nl</p>
                    <p className="text-sm text-gray-500">Reactie binnen 24 uur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="ev-gradient-border border-transparent shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Stuur ons een Bericht</h3>
                <p className="text-gray-600 text-sm">
                  Vul het formulier in en we nemen binnen 24 uur contact met je op.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam *</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wat is je doel?</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="resize-none text-sm"
                    placeholder="Vertel ons meer over je doelen..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ev-shine w-full bg-primary hover:bg-primary/90 text-white py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    className={`p-3 rounded-lg text-center text-sm ${
                      submitMessage.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
