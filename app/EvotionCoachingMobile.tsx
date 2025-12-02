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
  Smartphone,
  BarChart3,
  UserPlus,
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
      icon: Dumbbell,
      title: "Personal Training",
      subtitle: "Persoonlijke 1-op-1 begeleiding",
      description: "Directe begeleiding van gecertificeerde trainers voor snelle en veilige resultaten.",
      features: ["Volledige aandacht", "Aangepaste oefeningen", "Directe feedback", "Motivatie & support"],
      popular: true,
      href: "/personal-training",
    },
    {
      icon: UserPlus,
      title: "Duo Training",
      subtitle: "Train samen, bereik meer",
      description: "Train samen met een partner, vriend of familielid en motiveer elkaar.",
      features: ["Train met partner/vriend", "Gedeelde motivatie", "Voordeliger per persoon", "Professioneel begeleid"],
      popular: false,
      href: "/duo-training",
    },
    {
      icon: TrendingUp,
      title: "Online Coaching",
      subtitle: "Flexibele coaching via app",
      description: "Modulair 5-fasen programma met persoonlijke begeleiding via onze app.",
      features: ["Trainingsschema op maat", "Voedingsschema", "Wekelijkse check-ins", "24/7 app toegang"],
      popular: true,
      href: "/online-coaching",
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
      description: "Chat direct met je coach via de app",
    },
    {
      icon: BarChart3,
      title: "Voortgang Tracking",
      description: "Volg je resultaten en vier je successen",
    },
  ]

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-900 pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <iframe
              src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
              className="absolute inset-0 w-full h-full object-cover scale-150"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ pointerEvents: "none" }}
              title="Evotion Coaching Video"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/85 via-[#1e1839]/75 to-[#1e1839]/85"></div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-12">
          <div className="max-w-lg mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-white leading-tight">Jouw droomlichaam binnen handbereik</h1>
              <p className="text-base text-gray-300 leading-relaxed">
                Zonder je favoriete eten, sociale leven of vrijheid op te geven
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 py-4 text-base font-semibold shadow-xl w-full"
              >
                <span className="flex items-center gap-2">
                  Start Jouw Transformatie
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 py-4 text-base font-semibold bg-transparent w-full"
                asChild
              >
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2">
                    Gratis Consult
                    <Calendar className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{s.number}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                  {s.label === "Google Rating" && (
                    <div className="flex justify-center mt-1 gap-0.5">
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

      {/* SERVICES */}
      <section className="py-16 bg-gray-50 relative">
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

      {/* PERSONAL TRAINING HIGHLIGHT */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-0">
              <Dumbbell className="w-4 h-4 mr-2" />
              Personal Training
            </Badge>
            <h2 className="text-2xl font-black text-white leading-tight">
              Persoonlijke Begeleiding voor Maximale Resultaten
            </h2>
            <p className="text-white/90 leading-relaxed">
              Ervaar de kracht van persoonlijke begeleiding met onze gecertificeerde trainers.
            </p>

            <div className="space-y-3">
              {[
                { icon: Dumbbell, title: "1-op-1 Training Sessies" },
                { icon: Target, title: "Aangepaste Oefeningen" },
                { icon: Calendar, title: "Flexibele Planning" },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-white font-medium">{f.title}</span>
                </div>
              ))}
            </div>

            <Link href="/personal-training">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 font-semibold">
                Meer over Personal Training
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* APP */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-primary/10 text-primary mb-4">
              <Smartphone className="w-4 h-4 mr-2" />
              Evotion App
            </Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Jouw Coach <span className="text-primary">in je Zak</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Alles wat je nodig hebt voor jouw transformatie, in één app.
            </p>
          </div>

          {/* App Mockup */}
          <div className="relative mx-auto w-48 h-96 mb-8">
            <div className="absolute inset-0 bg-gray-900 rounded-[2rem] shadow-xl border-4 border-gray-800"></div>
            <div className="absolute inset-2 bg-white rounded-[1.5rem] overflow-hidden flex items-center justify-center">
              <Image
                src="/images/evotion-logo-mockup-desktop.png"
                alt="Evotion App"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {appFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button className="ev-shine w-full bg-primary hover:bg-primary/90 text-white" size="lg" asChild>
              <Link href="/over-ons/evotion-app">
                Download de App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TRANSFORMATIES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-primary/10 text-primary mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Echte Resultaten
            </Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Ongelooflijke <span className="text-primary">Transformaties</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">Zie hoe onze klanten hun droomlichaam hebben bereikt.</p>
          </div>

          <div className="space-y-6">
            {transformations.map((t) => (
              <Card key={t.name} className="overflow-hidden ev-gradient-border border-transparent">
                <div className="relative aspect-square">
                  <Image
                    src={t.image || "/placeholder.svg"}
                    alt={`${t.name}'s transformatie`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.name}'s Transformatie</h3>
                  <p className="text-primary font-semibold mb-3">{t.result}</p>
                  <p className="text-gray-600 text-sm italic">"{t.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10">
            <Button className="ev-shine w-full bg-primary hover:bg-primary/90 text-white" size="lg" asChild>
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Jouw Transformatie
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-primary to-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Star className="w-4 h-4 mr-2" />
              Google Reviews
            </Badge>
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Wat Klanten <span className="text-evotion-secondary">Zeggen</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-xl font-bold text-white">5.0</span>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {testimonials[activeTestimonial].initial}
                </div>
                <div>
                  <h3 className="font-bold text-white">{testimonials[activeTestimonial].name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-white/90 italic leading-relaxed">"{testimonials[activeTestimonial].text}"</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-600">G</span>
                </div>
                <span className="text-xs text-gray-300">Geverifieerde Google review</span>
              </div>
            </CardContent>
          </Card>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeTestimonial ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-primary/10 text-primary mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Klaar om te <span className="text-primary">Beginnen</span>?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Neem contact met ons op voor een gratis kennismakingsgesprek.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="space-y-4 mb-10">
            {[
              {
                icon: Phone,
                title: "Bel Ons",
                value: "+31 6 10935077",
                href: "tel:+31610935077",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                value: "Start een Chat",
                href: "https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s.",
              },
              {
                icon: Mail,
                title: "Email",
                value: "info@evotion-coaching.nl",
                href: "mailto:info@evotion-coaching.nl",
              },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.title === "WhatsApp" ? "_blank" : undefined}
                rel={c.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{c.title}</h4>
                  <p className="text-sm text-gray-600">{c.value}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="ev-gradient-border border-transparent">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Stuur ons een Bericht</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
                    <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam *</label>
                    <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wat is je doel?</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    placeholder="Vertel ons meer over je doelen..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ev-shine w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Versturen...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
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
