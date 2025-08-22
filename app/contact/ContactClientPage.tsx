"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"

export default function ContactClientPage() {
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
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-evotion-primary text-white text-sm font-medium mb-8">
              ✨ Gratis Consult Beschikbaar
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up delay-100">
              Neem <span className="text-evotion-primary">Contact</span> Op
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-200">
              Klaar om je transformatie te beginnen? We staan voor je klaar met persoonlijk advies en een plan op maat.
              Neem vandaag nog contact op voor een gratis kennismakingsgesprek.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Phone */}
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-evotion-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Telefoon</h3>
                  <p className="text-2xl font-bold text-evotion-primary mb-2">+31 6 10935077</p>
                  <p className="text-gray-600 mb-1">Ma-Vr: 9:00-18:00</p>
                  <p className="text-sm text-evotion-primary font-medium">Direct persoonlijk contact</p>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-400">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-evotion-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                  <Button
                    asChild
                    className="bg-evotion-primary hover:bg-[#2d2654] text-white px-6 py-3 text-lg font-semibold rounded-md mb-2"
                  >
                    <a
                      href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20interesse%20in%20jullie%20coaching%20programma%27s.%20Kunnen%20we%20een%20kennismakingsgesprek%20inplannen%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start Chat
                    </a>
                  </Button>
                  <p className="text-gray-600 mb-1 mt-2">24/7 beschikbaar</p>
                  <p className="text-sm text-evotion-primary font-medium">Snelste reactie</p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-500">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-evotion-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-2xl font-bold text-evotion-primary mb-2">info@evotion-coaching.nl</p>
                  <p className="text-gray-600 mb-1">Reactie binnen 24 uur</p>
                  <p className="text-sm text-evotion-primary font-medium">Uitgebreide vragen</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <Card className="animate-fade-in-up delay-600">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 mb-4">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Formulier
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Stuur ons een Bericht</h2>
                    <p className="text-gray-600">
                      Vul het formulier in en we nemen binnen 24 uur contact met je op voor een gratis
                      kennismakingsgesprek.
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evotion-primary focus:border-transparent"
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
                      className="w-full bg-evotion-primary hover:bg-[#2d2654] text-white py-3 text-lg font-semibold transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-8 animate-fade-in-up delay-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Waarom Evotion Coaching?</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-evotion-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Snelle Reactie</h4>
                        <p className="text-gray-600">
                          We reageren binnen 24 uur op je bericht en plannen snel een kennismakingsgesprek in.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-evotion-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Persoonlijke Aanpak</h4>
                        <p className="text-gray-600">
                          Elk programma wordt volledig op maat gemaakt, afgestemd op jouw doelen en levensstijl.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-evotion-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-evotion-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Flexibele Locaties</h4>
                        <p className="text-gray-600">
                          Online coaching, personal training in Almere, of een combinatie - jij kiest wat bij je past.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-evotion-primary text-white">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-3">Gratis Kennismakingsgesprek</h4>
                    <p className="mb-4">
                      Ontdek hoe wij jou kunnen helpen je doelen te bereiken. Geen verplichtingen, wel veel waardevolle
                      inzichten.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Persoonlijke doelanalyse</li>
                      <li>✓ Op maat gemaakt advies</li>
                      <li>✓ Geen verplichtingen</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
