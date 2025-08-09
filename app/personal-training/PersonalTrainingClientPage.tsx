"use client"

import type React from "react"

import { useState } from "react"
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
  Award,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Heart,
  Trophy,
  User,
  Zap,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { sendContactEmail } from "@/app/actions/contact"

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
      title: "Persoonlijke Aandacht",
      description: "100% focus van je gecertificeerde trainer tijdens elke sessie",
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
      title: "Snellere Resultaten",
      description: "Efficiëntere trainingen leiden tot snellere en betere resultaten",
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Personal Training
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Persoonlijke Training met <span className="text-secondary">Maximale Resultaten</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Ervaar de kracht van 1-op-1 begeleiding met onze gecertificeerde personal trainers. Bereik je doelen
                  sneller, veiliger en effectiever dan ooit tevoren.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Boek een Proefles
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Bel Direct
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-sm text-white/80">Persoonlijke Aandacht</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">€80</div>
                  <div className="text-sm text-white/80">Per Sessie</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10+</div>
                  <div className="text-sm text-white/80">Jaar Ervaring</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Sessie"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
                <Star className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-6">
              <Target className="w-4 h-4 mr-2" />
              Voordelen
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Waarom Kiezen voor <span className="text-primary">Personal Training</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Personal training biedt unieke voordelen die je niet krijgt bij groepslessen of zelfstandig trainen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-primary" />
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
            <Badge className="bg-primary/10 text-primary mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Proces
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hoe werkt <span className="text-primary">Personal Training</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van eerste kennismaking tot het bereiken van je doelen - zo ziet jouw reis eruit.
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
                className="text-center border-2 border-gray-200 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Pakketten
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kies het <span className="text-primary">Pakket</span> dat bij je Past
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van een kennismaking tot een complete transformatie - we hebben voor iedereen het juiste pakket.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular ? "border-primary shadow-xl scale-105" : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-2">
                      <Award className="w-4 h-4 mr-1" />
                      MEEST POPULAIR
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                      <div className="text-sm text-gray-500">{pkg.pricePerSession}</div>
                      <div className="text-lg font-medium text-gray-700">{pkg.sessions}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full py-3 text-lg font-semibold ${
                      pkg.popular
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Kies dit Pakket
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Niet zeker welk pakket het beste bij je past? We helpen je graag bij het maken van de juiste keuze.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Gratis Adviesgesprek
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900">
                  Klaar om te <span className="text-primary">Starten</span>?
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Neem contact met ons op voor een gratis kennismakingsgesprek en ontdek hoe personal training jouw
                  leven kan veranderen.
                </p>
              </div>

              <div className="space-y-4">
                <a href="tel:0610935077" className="block">
                  <Card className="border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
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
                  <Card className="border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
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
              </div>
            </div>

            <Card className="border-2 border-gray-200 shadow-xl">
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
                        <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                        <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer</label>
                      <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Wat is je doel?</label>
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="resize-none"
                        placeholder="Vertel ons meer over je doelen en ervaring..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
