"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, AlertCircle } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { logContactSubmission } from "@/utils/cookie-utils"

export default function ContactClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Bedankt voor je bericht! We nemen binnen 24 uur contact met je op.",
        })

        // Log contact form submission
        logContactSubmission("contact", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Er ging iets mis. Probeer het opnieuw.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Er ging iets mis bij het verzenden. Probeer het opnieuw of bel ons direct.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Neem Contact Op</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Klaar om jouw transformatie te starten? Kies hieronder hoe je contact met ons wilt opnemen.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone Contact */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-800 transition-colors">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Bellen</h3>
              <p className="text-gray-600 mb-4">Voor urgente vragen of een persoonlijk gesprek</p>
              <Button asChild className="w-full bg-black hover:bg-gray-800">
                <a href="tel:0610935077">
                  <Phone className="w-4 h-4 mr-2" />
                  06 10 93 50 77
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Contact */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Chat</h3>
              <p className="text-gray-600 mb-4">Snel en gemakkelijk chatten via WhatsApp</p>
              <Button asChild className="w-full bg-green-500 hover:bg-green-600">
                <a href="https://wa.me/31610935077" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Sturen</h3>
              <p className="text-gray-600 mb-4">Stuur direct een email naar ons team</p>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                <a href="mailto:info@evotion-coaching.nl">
                  <Mail className="w-4 h-4 mr-2" />
                  info@evotion-coaching.nl
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Of vul het contactformulier in</h2>
            <p className="text-gray-600">
              Liever uitgebreid je verhaal vertellen? Vul onderstaand formulier in en we nemen binnen 24 uur contact met
              je op.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contactformulier</CardTitle>
              <CardDescription>Vertel ons over jouw doelen en hoe we je kunnen helpen.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <p>{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Jouw volledige naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="jouw@email.nl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Telefoonnummer</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Onderwerp *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kies een onderwerp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online-coaching">Online Coaching</SelectItem>
                        <SelectItem value="premium-coaching">Premium Coaching</SelectItem>
                        <SelectItem value="personal-training">Personal Training</SelectItem>
                        <SelectItem value="12-weken-programma">12 Weken Vetverlies Programma</SelectItem>
                        <SelectItem value="voeding">Voeding & Dieet</SelectItem>
                        <SelectItem value="training">Training & Workout</SelectItem>
                        <SelectItem value="algemeen">Algemene Vraag</SelectItem>
                        <SelectItem value="anders">Anders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Bericht *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="mt-1 min-h-[150px]"
                    placeholder="Vertel ons over jouw doelen, ervaring en hoe we je kunnen helpen. Hoe meer details, hoe beter we je kunnen adviseren!"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Verstuur Bericht
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-black" />
                Locatie & Bereikbaarheid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">📍 Friesland, Nederland</p>
              <p className="text-sm text-gray-500 mb-4">Online coaching beschikbaar in heel Nederland</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Personal Training:</strong> Op locatie in Friesland
                </p>
                <p>
                  <strong>Online Coaching:</strong> Overal in Nederland
                </p>
                <p>
                  <strong>Premium Coaching:</strong> Hybride mogelijk
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-black" />
                Reactietijd & Beschikbaarheid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">⚡ Binnen 24 uur reactie</p>
              <p className="text-sm text-gray-500 mb-4">Voor urgente vragen, bel direct!</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Telefoon:</strong> Ma-Vr 9:00-18:00
                </p>
                <p>
                  <strong>WhatsApp:</strong> Ma-Zo 8:00-22:00
                </p>
                <p>
                  <strong>Email:</strong> Binnen 24 uur
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
