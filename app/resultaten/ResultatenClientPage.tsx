"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Phone,
  MessageCircle,
  Mail,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Award,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import { sendContactEmail } from "@/app/actions/contact"

interface Transformation {
  name: string
  image: string
  testimonial: string
  fullStory: string
  achievements: string[]
  quote: string
  focusAreas: string[]
  timeframe: string
  startWeight?: string
  endWeight?: string
}

export function ResultatenClientPage() {
  const transformations: Transformation[] = [
    // 1. Salim first
    {
      name: "Salim",
      image: "/images/salim-transformation-professional.png",
      testimonial:
        "Dankzij Evotion Coaching heb ik mijn levensstijl volledig omgegooid. De coaches zijn ontzettend motiverend en deskundig.",
      fullStory:
        "Salim wilde zijn levensstijl drastisch omgooien en had behoefte aan deskundige begeleiding. In 26 weken heeft hij met Evotion Coaching een gestructureerd plan gevolgd dat perfect aansloot bij zijn drukke schema.",
      achievements: [
        "8.1 kg gewichtsverlies",
        "Verhoogde energieniveaus",
        "Verbeterde slaapkwaliteit",
        "Consistente gezonde gewoontes",
      ],
      quote: "In 26 weken heb ik niet alleen gewicht verloren, maar ook een compleet nieuwe levensstijl opgebouwd!",
      focusAreas: ["Gewichtsverlies", "Gezonde gewoontes", "Energieverbetering"],
      timeframe: "26 weken",
      startWeight: "91.2 kg",
      endWeight: "83.1 kg",
    },
    // 2. Martin second
    {
      name: "Martin",
      image: "/images/martin-transformation-professional.png",
      testimonial:
        "Ik ben super blij met de resultaten die ik heb behaald met Evotion Coaching. De persoonlijke begeleiding en het op maat gemaakte plan hebben echt het verschil gemaakt.",
      fullStory:
        "Martin begon zijn reis met het doel om fitter te worden en meer energie te krijgen. In slechts 11 weken heeft hij met een gepersonaliseerd trainings- en voedingsplan niet alleen zijn fysieke doelen overtroffen, maar ook een duurzame levensstijl ontwikkeld.",
      achievements: [
        "10.7 kg gewichtsverlies",
        "Verdubbeling van kracht",
        "Verbeterde conditie",
        "Meer zelfvertrouwen",
      ],
      quote: "In 11 weken heeft Evotion Coaching mijn leven veranderd. Ik voel me sterker en energieker dan ooit!",
      focusAreas: ["Gewichtsverlies", "Krachttraining", "Duurzame levensstijl"],
      timeframe: "11 weken",
      startWeight: "107.2 kg",
      endWeight: "96.5 kg",
    },
    // 3. Wouter third
    {
      name: "Wouter",
      image: "/images/wouter-transformation-professional.png",
      testimonial:
        "De aanpak van Evotion Coaching is uniek. Ze kijken verder dan alleen training en voeding, en helpen je ook mentaal sterker te worden.",
      fullStory:
        "Wouter zocht naar een aanpak die verder ging dan alleen sporten; hij wilde een complete body recomposition. In 8 weken heeft hij met Evotion Coaching geleerd hoe voeding, training en mindset samenkomen voor optimale lichaamssamenstelling.",
      achievements: [
        "Body recomposition",
        "Vetmassa naar spiermassa",
        "Verbeterde lichaamssamenstelling",
        "Sterkere mentale focus",
      ],
      quote: "In 8 weken heb ik mijn lichaam compleet getransformeerd - van vet naar spieren!",
      focusAreas: ["Body Recomposition", "Lichaamssamenstelling", "Mentale veerkracht"],
      timeframe: "8 weken",
      startWeight: "69.6 kg",
      endWeight: "67.5 kg",
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
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-sm px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Bewezen Resultaten
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Echte <span className="text-evotion-primary">Transformaties</span>
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                Ontdek hoe onze cliënten hun doelen hebben bereikt en hun leven hebben getransformeerd met persoonlijke
                begeleiding en bewezen methodes.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-evotion-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-evotion-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Tevreden Cliënten</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-evotion-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-evotion-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Succesvol</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-evotion-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-evotion-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">21kg</div>
                <div className="text-sm text-gray-600">Totaal Verlies</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-evotion-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-evotion-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Gemiddelde Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Transformations */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="space-y-20 md:space-y-32">
              {transformations.map((transformation, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                >
                  {/* Image - All use portrait format now */}
                  <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <div className="relative">
                      <div className="aspect-[9/16] relative rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                        <Image
                          src={transformation.image || "/placeholder.svg"}
                          alt={`${transformation.name} transformatie`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>

                      {/* Stats overlay - Special handling for Wouter's body recomposition */}
                      {transformation.startWeight && transformation.endWeight && (
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                          <div className="text-center">
                            {transformation.name === "Wouter" ? (
                              <>
                                <div className="text-2xl font-bold text-evotion-primary mb-1">Body Recomp</div>
                                <div className="text-sm text-gray-600 font-medium">{transformation.timeframe}</div>
                              </>
                            ) : (
                              <>
                                <div className="text-3xl font-bold text-evotion-primary mb-1">
                                  {transformation.startWeight} → {transformation.endWeight}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{transformation.timeframe}</div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content - Compact for all */}
                  <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    {/* Header */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                          {transformation.name}'s
                          <br />
                          <span className="text-evotion-primary">Transformatie</span>
                        </h2>

                        {/* Focus Areas */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {transformation.focusAreas.map((area, areaIndex) => (
                            <Badge
                              key={areaIndex}
                              className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 px-3 py-1 text-sm font-medium"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>

                        {/* Timeframe */}
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Clock className="w-4 h-4 text-evotion-primary" />
                          <span className="font-medium text-sm">Transformatie in {transformation.timeframe}</span>
                        </div>
                      </div>

                      {/* Story - Compact */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <p className="text-base text-gray-700 leading-relaxed">{transformation.fullStory}</p>
                      </div>
                    </div>

                    {/* Achievements - Compact */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-evotion-primary/10 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-evotion-primary" />
                        </div>
                        Behaalde Resultaten
                      </h3>

                      <div className="grid gap-3">
                        {transformation.achievements.map((achievement, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:border-evotion-primary/20 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-evotion-primary to-evotion-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-semibold text-gray-800">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quote - Compact */}
                    <div className="relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-evotion-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-evotion-primary">"</span>
                      </div>
                      <div className="bg-gradient-to-br from-evotion-primary/5 to-evotion-primary/10 border-l-4 border-evotion-primary rounded-xl p-6 ml-2">
                        <blockquote className="text-lg font-medium text-gray-800 italic leading-relaxed mb-3">
                          {transformation.quote}
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-evotion-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{transformation.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-bold text-evotion-primary">— {transformation.name}</p>
                            <p className="text-xs text-gray-600">Evotion Coaching Cliënt</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-evotion-primary to-evotion-primary/90">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Jouw Transformatie Begint Nu
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Sluit je aan bij onze succesvolle cliënten en start jouw eigen transformatiereis. Persoonlijke
                begeleiding, bewezen resultaten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-evotion-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link href="#contact">Start Gratis Gesprek</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-evotion-primary px-8 py-4 text-lg font-semibold bg-transparent"
                >
                  <Link href="/over-ons/coaches">Ontmoet Onze Coaches</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center space-y-6 mb-12">
              <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 text-sm px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Klaar om te <span className="text-evotion-primary">Beginnen</span>?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Neem contact met ons op voor een gratis kennismakingsgesprek. We bespreken jouw doelen en maken een plan
                op maat.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Options */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Neem Direct Contact Op</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We staan klaar om al je vragen te beantwoorden en je te helpen bij het kiezen van het juiste
                    programma.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-evotion-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Bel Ons Direct</h4>
                      <p className="text-gray-600">+31 6 10935077</p>
                      <p className="text-sm text-gray-500">Ma-Vr: 9:00-18:00</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-evotion-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h4>
                      <a
                        href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s.%20Kunnen%20we%20een%20kennismakingsgesprek%20inplannen%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-evotion-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-evotion-primary/90 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Begin Chat
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-evotion-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@evotion-coaching.nl</p>
                      <p className="text-sm text-gray-500">Reactie binnen 24 uur</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">Stuur ons een Bericht</h3>
                      <p className="text-gray-600">Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            Voornaam *
                          </label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Achternaam *
                          </label>
                          <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefoonnummer
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-evotion-primary focus:border-transparent"
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
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full resize-none"
                          placeholder="Vertel ons meer over je doelen en verwachtingen..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-evotion-primary hover:bg-evotion-primary/90 text-white py-3 text-lg font-semibold disabled:opacity-50"
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
      </main>
      <Footer />
    </>
  )
}
