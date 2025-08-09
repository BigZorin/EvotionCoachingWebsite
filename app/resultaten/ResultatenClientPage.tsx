"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, MessageCircle, Mail, ArrowRight } from "lucide-react"
import { TransformationDetailSection } from "@/components/transformation-detail-section"
import { useState } from "react"
import { sendContactEmail } from "@/app/actions/contact"

interface Transformation {
  name: string
  image: string
  testimonial: string // Still useful for a potential overview or meta description
  fullStory: string
  achievements: string[]
  quote: string
  focusAreas: string[]
}

export function ResultatenClientPage() {
  const transformations: Transformation[] = [
    {
      name: "Martin",
      image: "/images/martin-transformation-new.png",
      testimonial:
        "“Ik ben super blij met de resultaten die ik heb behaald met Evotion Coaching. De persoonlijke begeleiding en het op maat gemaakte plan hebben echt het verschil gemaakt. Ik voel me sterker, fitter en energieker dan ooit tevoren!”",
      fullStory:
        "Martin begon zijn reis met het doel om fitter te worden en meer energie te krijgen. Door een gepersonaliseerd trainings- en voedingsplan, gecombineerd met wekelijkse check-ins en mentale coaching, heeft hij niet alleen zijn fysieke doelen overtroffen, maar ook een duurzame levensstijl ontwikkeld. Zijn toewijding en de constante ondersteuning van Evotion Coaching hebben geleid tot een indrukwekkende transformatie, zowel fysiek als mentaal.",
      achievements: [
        "20 kg vetverlies",
        "Verdubbeling van kracht in basisoefeningen",
        "Verbeterde conditie en uithoudingsvermogen",
        "Meer zelfvertrouwen en energie",
      ],
      quote: "Evotion Coaching heeft mijn leven veranderd. Ik voel me sterker en energieker dan ooit!",
      focusAreas: ["Vetverlies", "Krachttraining", "Duurzame levensstijl"],
    },
    {
      name: "Wouter",
      image: "/images/wouter-transformation-new.png",
      testimonial:
        "“De aanpak van Evotion Coaching is uniek. Ze kijken verder dan alleen training en voeding, en helpen je ook mentaal sterker te worden. Ik heb niet alleen mijn fysieke doelen bereikt, maar ook veel geleerd over mezelf.”",
      fullStory:
        "Wouter zocht naar een aanpak die verder ging dan alleen sporten; hij wilde een complete transformatie. Met Evotion Coaching heeft hij geleerd hoe voeding, training en mindset samenkomen voor optimale resultaten. Zijn traject omvatte intensieve krachttraining, een flexibel voedingsplan en diepgaande gesprekken over mentale veerkracht. Het resultaat is een indrukwekkende fysieke verandering en een veel positievere kijk op zijn gezondheid.",
      achievements: [
        "15 kg spieropbouw",
        "Verbeterde lichaamssamenstelling",
        "Sterkere mentale focus",
        "Nieuwe persoonlijke records in de sportschool",
      ],
      quote: "De complete aanpak van Evotion Coaching heeft me niet alleen fysiek, maar ook mentaal sterker gemaakt.",
      focusAreas: ["Spieropbouw", "Lichaamssamenstelling", "Mentale veerkracht"],
    },
    {
      name: "Salim",
      image: "/images/salim-transformation-new.png",
      testimonial:
        "“Dankzij Evotion Coaching heb ik mijn levensstijl volledig omgegooid. De coaches zijn ontzettend motiverend en deskundig. Ik had nooit gedacht dat ik zulke resultaten kon behalen, maar ze hebben me bewezen dat het kan!”",
      fullStory:
        "Salim wilde zijn levensstijl drastisch omgooien en had behoefte aan deskundige begeleiding. Evotion Coaching bood hem een gestructureerd plan dat perfect aansloot bij zijn drukke schema. Door consistente begeleiding op het gebied van voeding, effectieve trainingen en het aanleren van gezonde gewoontes, heeft Salim niet alleen zijn gewenste fysieke resultaten behaald, maar ook een blijvende verandering in zijn dagelijkse routine teweeggebracht.",
      achievements: [
        "25 kg gewichtsverlies",
        "Verhoogde energieniveaus",
        "Verbeterde slaapkwaliteit",
        "Consistente gezonde gewoontes",
      ],
      quote: "Ik had nooit gedacht dat ik dit kon bereiken, maar Evotion Coaching heeft me bewezen dat het kan!",
      focusAreas: ["Gewichtsverlies", "Gezonde gewoontes", "Energieverbetering"],
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
        <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-evotion-primary leading-tight mb-6 animate-fade-in-up">
              Jouw Succesverhaal Begint Hier
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-700 md:text-2xl mb-10 animate-fade-in-up delay-100">
              Laat je inspireren door de indrukwekkende transformaties van onze cliënten. Bij Evotion Coaching geloven
              we in duurzame resultaten en persoonlijke groei. Dit zijn hun verhalen.
            </p>
            <Button
              asChild
              className="bg-evotion-primary hover:bg-[#2a2050] text-white px-10 py-4 text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200"
            >
              <Link href="/contact">Start Jouw Transformatie</Link>
            </Button>
          </div>
          {/* Subtle background shapes/particles for visual interest */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-evotion-secondary opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-float" />
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-evotion-primary opacity-5 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed" />
          </div>
        </section>

        {/* Detailed Transformation Sections */}
        {transformations.map((t, index) => (
          <TransformationDetailSection
            key={index}
            name={t.name}
            image={t.image}
            fullStory={t.fullStory}
            achievements={t.achievements}
            quote={t.quote}
            focusAreas={t.focusAreas}
            isReversed={index % 2 !== 0} // Alternate layout for every other section
          />
        ))}

        {/* Contact Section (formerly CTA) */}
        <section id="contact" className="py-16 md:py-28 lg:py-36 bg-gradient-to-br from-white via-gray-50/50 to-white">
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
                          <Input
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
                          <Input
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
                        <Input
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
                        <Input
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
                        <Textarea
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
      </main>
      <Footer />
    </>
  )
}
