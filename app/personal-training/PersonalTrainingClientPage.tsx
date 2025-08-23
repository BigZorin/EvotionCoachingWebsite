"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { sendContactEmail } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dumbbell,
  Star,
  CheckCircle,
  Target,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Heart,
  User,
  Zap,
  TrendingUp,
  Trophy,
} from "lucide-react"

function useAnimatedCounter(target: number, duration = 1400, startWhenVisible = true) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startWhenVisible) {
      let start: number | null = null
      let raf: number
      const step = (ts: number) => {
        if (start === null) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.floor(target * eased))
        if (progress < 1) {
          raf = requestAnimationFrame(step)
        }
      }
      raf = requestAnimationFrame(step)
      return () => cancelAnimationFrame(raf)
    }

    const node = ref.current
    if (!node) return
    if (startedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          let start: number | null = null
          let raf: number
          const step = (ts: number) => {
            if (start === null) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(target * eased))
            if (progress < 1) {
              raf = requestAnimationFrame(step)
            }
          }
          raf = requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [duration, startWhenVisible, target])

  return { ref, value }
}

export default function PersonalTrainingClientPage() {
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
        subject: "Personal Training interesse",
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

  const benefits = [
    {
      icon: User,
      title: "Persoonlijke Trainer Sneek",
      description: "100% focus van je gecertificeerde persoonlijke trainer in Sneek tijdens elke sessie",
    },
    {
      icon: Target,
      title: "Doelgerichte Training",
      description: "Trainingen perfect afgestemd op jouw specifieke doelen en niveau",
    },
    {
      icon: Shield,
      title: "Veilige Uitvoering",
      description: "Correcte techniek en voorkoming van blessures door professionele begeleiding",
    },
    {
      icon: Zap,
      title: "Sneller Vetverlies & Resultaten",
      description:
        "Efficiëntere trainingen voor vetverlies en spieropbouw leiden tot snellere en betere resultaten in Sneek",
    },
    {
      icon: Heart,
      title: "Motivatie & Support",
      description: "Constante motivatie en ondersteuning om je doelen te bereiken",
    },
    {
      icon: Calendar,
      title: "Flexibele Planning",
      description: "Plan je sessies op tijden die perfect bij jouw schema passen",
    },
  ]

  const packages = [
    {
      title: "Starter Pakket",
      sessions: "5 sessies",
      price: "€400",
      pricePerSession: "€80 per sessie",
      features: ["5 personal training sessies", "Intake en doelstelling", "Basis trainingsschema", "Voedingsadvies"],
      popular: false,
    },
    {
      title: "Intensief Pakket",
      sessions: "10 sessies",
      price: "€700",
      pricePerSession: "€70 per sessie",
      features: [
        "10 personal training sessies",
        "Uitgebreide intake",
        "Gepersonaliseerd trainingsschema",
        "Voedingsplan op maat",
        "Tussentijdse evaluaties",
      ],
      popular: true,
    },
    {
      title: "Transformatie Pakket",
      sessions: "20 sessies",
      price: "€1200",
      pricePerSession: "€60 per sessie",
      features: [
        "20 personal training sessies",
        "Complete lifestyle analyse",
        "Volledig trainings- en voedingsplan",
        "Wekelijkse voortgangsmetingen",
        "24/7 WhatsApp support",
        "Gratis herhalingsschema",
      ],
      popular: false,
    },
  ]

  const stat1 = useAnimatedCounter(100)
  const stat2 = useAnimatedCounter(70)
  const stat3 = useAnimatedCounter(10)
  const stat4 = useAnimatedCounter(95)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Personal Training
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Personal Training Sneek - <span className="text-gray-700">Jouw Persoonlijke Trainer</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Op zoek naar een persoonlijke trainer in Sneek of omgeving? Ervaar de kracht van 1-op-1 begeleiding
                  met onze gecertificeerde personal trainers. Bereik je doelen voor vetverlies, spieropbouw en fitness
                  sneller, veiliger en effectiever dan ooit tevoren.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Boek een Proefles
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Bel Direct
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                <div className="text-center">
                  <div ref={stat1.ref} className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 tabular-nums">
                    {stat1.value}
                    <span className="align-top text-lg">%</span>
                  </div>
                  <div className="text-sm text-gray-600">Persoonlijke Aandacht</div>
                </div>
                <div className="text-center">
                  <div ref={stat2.ref} className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900">
                    €{stat2.value}
                  </div>
                  <div className="text-sm text-gray-600">Vanaf per Sessie</div>
                </div>
                <div className="text-center">
                  <div ref={stat3.ref} className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900">
                    {stat3.value}
                    <span className="align-top text-lg">+</span>
                  </div>
                  <div className="text-sm text-gray-600">Jaar Ervaring</div>
                </div>
                <div className="text-center">
                  <div ref={stat4.ref} className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900">
                    {stat4.value}
                    <span className="align-top text-lg">%</span>
                  </div>
                  <div className="text-sm text-gray-600">Tevredenheid</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-gray-200">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Sessie bij Evotion Coaching"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">Top Beoordelingen</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="rounded-xl bg-white/90 backdrop-blur px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Trophy className="w-4 h-4 text-gray-700" />
                      <span className="font-medium">1-op-1 Focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-6">
              <Target className="w-4 h-4 mr-2" />
              Voordelen
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Waarom Kiezen voor een <span className="text-gray-700">Persoonlijke Trainer in Sneek</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Personal training in Sneek biedt unieke voordelen die je niet krijgt bij groepslessen of zelfstandig
              trainen. Onze persoonlijke trainers in Friesland zorgen voor maximale resultaten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Proces
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hoe werkt <span className="text-gray-700">Personal Training in Sneek</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van eerste kennismaking tot het bereiken van je doelen voor vetverlies of spieropbouw - zo ziet jouw reis
              met een persoonlijke trainer in Friesland eruit.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Intake & Doelen",
                description:
                  "We bespreken jouw doelen, ervaring en eventuele beperkingen tijdens een uitgebreide intake.",
              },
              {
                step: "02",
                title: "Plan op Maat",
                description:
                  "Op basis van de intake maken we een volledig gepersonaliseerd trainings- en voedingsplan.",
              },
              {
                step: "03",
                title: "Training Sessies",
                description: "Tijdens elke sessie krijg je 100% aandacht en begeleiding van je personal trainer.",
              },
              {
                step: "04",
                title: "Resultaten & Groei",
                description: "We monitoren je voortgang en passen het plan aan voor continue groei en resultaten.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative text-center border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-white">
                    <span className="text-xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
                {index < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-[2px] bg-gray-200" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
              <Target className="w-4 h-4 mr-2" />
              Personal Training Sneek
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Jouw <span className="text-gray-700">Persoonlijke Trainer</span> in Sneek
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Vetverlies Sneek</h3>
                <p className="text-gray-600 leading-relaxed">
                  Wil je afvallen in Sneek? Onze persoonlijke trainers zijn gespecialiseerd in vetverlies en helpen je
                  op een gezonde manier je ideale gewicht te bereiken. Met een op maat gemaakt voedings- en
                  trainingsplan zie je snel resultaat.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Spieropbouw Friesland</h3>
                <p className="text-gray-600 leading-relaxed">
                  Spieren opbouwen in Friesland? Onze ervaren personal trainers in Sneek helpen je met krachttraining en
                  spieropbouw. Van beginner tot gevorderd - we passen de training aan jouw niveau aan.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Fitness Coaching Sneek</h3>
                <p className="text-gray-600 leading-relaxed">
                  Zoek je een fitness coach in Sneek? Onze gecertificeerde trainers bieden complete begeleiding voor al
                  je fitnessdoelen. Van conditie verbeteren tot kracht opbouwen - wij helpen je verder.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Personal Trainer Friesland</h3>
                <p className="text-gray-600 leading-relaxed">
                  Als ervaren personal trainers in Friesland kennen we de lokale gemeenschap. We bieden flexibele
                  trainingstijden en locaties die perfect aansluiten bij jouw agenda en voorkeuren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-6">
              <Dumbbell className="w-4 h-4 mr-2" />
              Pakketten
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kies het <span className="text-gray-700">Pakket</span> dat bij je Past
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van een kennismaking tot een complete transformatie - we hebben voor iedereen het juiste pakket.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className="relative">
                <Card
                  className={`relative border transition-all duration-300 hover:shadow-xl ${
                    pkg.popular ? "border-gray-900 shadow-lg scale-[1.02]" : "border-gray-200 hover:-translate-y-1"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gray-900 text-white px-4 py-2 shadow-md">
                        <Star className="w-4 h-4 mr-1" />
                        MEEST POPULAIR
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-gray-900">{pkg.price}</div>
                        <div className="text-sm text-gray-500">{pkg.pricePerSession}</div>
                        <div className="text-lg font-medium text-gray-700">{pkg.sessions}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full py-3 text-lg font-semibold ${
                        pkg.popular
                          ? "bg-gray-900 hover:bg-gray-800 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      Kies dit Pakket
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Niet zeker welk pakket het beste bij je past? We helpen je graag bij het maken van de juiste keuze.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Gratis Adviesgesprek
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900">
                  Klaar om te <span className="text-gray-700">Starten met Personal Training</span>?
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Neem contact met ons op voor een gratis kennismakingsgesprek met een persoonlijke trainer in Sneek en
                  ontdek hoe personal training jouw leven kan veranderen.
                </p>
              </div>

              <div className="space-y-4">
                <a href="tel:0610935077" className="block">
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Bel Direct</h3>
                          <p className="text-gray-700 font-medium">06 10 93 50 77</p>
                          <p className="text-sm text-gray-500">Ma-Vr: 9:00-18:00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a href="https://wa.me/31610935077" target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">WhatsApp</h3>
                          <p className="text-gray-700 font-medium">Start Chat</p>
                          <p className="text-sm text-gray-500">Snelle reactie gegarandeerd</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl">
              <Card className="border-0 rounded-2xl shadow-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Stuur ons een Bericht</h3>
                      <p className="text-gray-600">Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Wat is je doel?</label>
                        <select
                          name="goal"
                          value={formData.goal}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        >
                          <option value="">Selecteer je doel</option>
                          <option value="gewichtsverlies">Gewichtsverlies</option>
                          <option value="spieropbouw">Spieropbouw</option>
                          <option value="fitter-worden">Fitter worden</option>
                          <option value="kracht-opbouwen">Kracht opbouwen</option>
                          <option value="revalidatie">Revalidatie</option>
                          <option value="anders">Anders</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bericht</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="resize-none border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          placeholder="Vertel ons meer over je doelen en ervaring..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-semibold"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Versturen...
                          </span>
                        ) : (
                          <span className="flex items-center gap-3">
                            Verstuur Bericht
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>

                      {submitMessage && (
                        <div
                          className={`p-4 rounded-lg text-center ${
                            submitMessage.type === "success"
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                          role="status"
                          aria-live="polite"
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
