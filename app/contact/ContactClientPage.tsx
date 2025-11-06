"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  User,
  AtSign,
} from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#bad4e1]/10">
      <Header />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="relative mb-16 md:mb-20">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#bad4e1]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1e1839]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1e1839] to-[#2d1b69] text-white mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">CONTACT</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#1e1839] via-[#2d1b69] to-[#1e1839] bg-clip-text text-transparent">
                Laten We Kennismaken
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Klaar om jouw transformatie te starten? Kies hieronder hoe je{" "}
              <span className="font-semibold text-[#1e1839]">contact</span> met ons wilt opnemen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
          {/* Phone Contact */}
          <div className="ev-gradient-border bg-white/80 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1839] to-[#2d1b69] rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Phone className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1e1839]">Direct Bellen</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Voor urgente vragen of een persoonlijk gesprek</p>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#1e1839] to-[#2d1b69] hover:opacity-90 text-white shadow-lg"
              >
                <a href="tel:0610935077">
                  <Phone className="w-4 h-4 mr-2" />
                  06 10 93 50 77
                </a>
              </Button>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="ev-gradient-border bg-white/80 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1e1839]">WhatsApp Chat</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Snel en gemakkelijk chatten via WhatsApp</p>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white shadow-lg"
              >
                <a href="https://wa.me/31610935077" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </a>
              </Button>
            </div>
          </div>

          {/* Email Contact */}
          <div className="ev-gradient-border bg-white/80 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#bad4e1] to-[#8ab4c9] rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1e1839]">Email Sturen</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Stuur direct een email naar ons team</p>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#bad4e1] to-[#8ab4c9] hover:opacity-90 text-white shadow-lg"
              >
                <a href="mailto:info@evotion-coaching.nl">
                  <Mail className="w-4 h-4 mr-2" />
                  info@evotion-coaching.nl
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">Of vul het contactformulier in</h2>
            <p className="text-gray-600 text-lg">
              Liever uitgebreid je verhaal vertellen? Vul onderstaand formulier in en we nemen binnen{" "}
              <span className="font-semibold text-[#1e1839]">24 uur</span> contact met je op.
            </p>
          </div>

          <div className="ev-gradient-border bg-white/90 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#1e1839] mb-2">Contactformulier</h3>
                <p className="text-gray-600">Vertel ons over jouw doelen en hoe we je kunnen helpen.</p>
              </div>

              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border-2 border-green-200"
                      : "bg-red-50 text-red-800 border-2 border-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p>{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-[#1e1839] font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Naam *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1 border-2 focus:border-[#1e1839] rounded-xl"
                      placeholder="Jouw volledige naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#1e1839] font-semibold mb-2 flex items-center gap-2">
                      <AtSign className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1 border-2 focus:border-[#1e1839] rounded-xl"
                      placeholder="jouw@email.nl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-[#1e1839] font-semibold mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefoonnummer
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1 border-2 focus:border-[#1e1839] rounded-xl"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-[#1e1839] font-semibold mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Onderwerp *
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="mt-1 border-2 focus:border-[#1e1839] rounded-xl">
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
                  <Label htmlFor="message" className="text-[#1e1839] font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Bericht *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="mt-1 min-h-[150px] border-2 focus:border-[#1e1839] rounded-xl"
                    placeholder="Vertel ons over jouw doelen, ervaring en hoe we je kunnen helpen. Hoe meer details, hoe beter we je kunnen adviseren!"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1e1839] to-[#2d1b69] hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Verstuur Bericht
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="ev-gradient-border bg-white/80 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e1839] to-[#2d1b69] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1839]">Locatie & Bereikbaarheid</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">📍 Friesland, Nederland</p>
                <p className="text-sm text-gray-600">Online coaching beschikbaar in heel Nederland</p>
                <div className="mt-4 space-y-2 text-sm bg-gray-50 rounded-xl p-4">
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[140px]">Personal Training:</span>
                    <span className="text-gray-600">Op locatie in Friesland</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[140px]">Online Coaching:</span>
                    <span className="text-gray-600">Overal in Nederland</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[140px]">Premium Coaching:</span>
                    <span className="text-gray-600">Hybride mogelijk</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="ev-gradient-border bg-white/80 backdrop-blur-sm border-transparent rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bad4e1] to-[#8ab4c9] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1839]">Reactietijd & Beschikbaarheid</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">⚡ Binnen 24 uur reactie</p>
                <p className="text-sm text-gray-600">Voor urgente vragen, bel direct!</p>
                <div className="mt-4 space-y-2 text-sm bg-gray-50 rounded-xl p-4">
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[100px]">Telefoon:</span>
                    <span className="text-gray-600">Ma-Vr 9:00-18:00</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[100px]">WhatsApp:</span>
                    <span className="text-gray-600">Ma-Zo 8:00-22:00</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-[#1e1839] min-w-[100px]">Email:</span>
                    <span className="text-gray-600">Binnen 24 uur</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
