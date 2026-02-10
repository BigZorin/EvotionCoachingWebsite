"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  ArrowRight,
} from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { logContactSubmission } from "@/utils/cookie-utils"
import Link from "next/link"

export default function ContactClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

        logContactSubmission("contact", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        })

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

  const contactMethods = [
    {
      icon: Phone,
      title: "Bellen",
      desc: "Direct persoonlijk contact",
      action: "06 10 93 50 77",
      href: "tel:0610935077",
      color: "bg-[#1e1839]",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      desc: "Snel en gemakkelijk chatten",
      action: "Start Chat",
      href: "https://wa.me/31610935077",
      color: "bg-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      desc: "info@evotion-coaching.nl",
      action: "Stuur Email",
      href: "mailto:info@evotion-coaching.nl",
      color: "bg-[#1e1839]",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative bg-[#1e1839] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Neem Contact Op
            </h1>
            <p className={`text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Klaar om te starten of heb je een vraag? We helpen je graag verder.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT METHODS - Wit */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 lg:mb-20">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group bg-gray-50 rounded-2xl p-6 lg:p-8 text-center hover:bg-[#1e1839] transition-all duration-300 hover:shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1e1839] group-hover:text-white mb-1 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/60 mb-4 transition-colors">
                    {method.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e1839] group-hover:text-white transition-colors">
                    {method.action}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              )
            })}
          </div>

          {/* FORM */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-[#1e1839] mb-3">
                Stuur ons een bericht
              </h2>
              <p className="text-gray-600">
                We reageren binnen 24 uur op je bericht.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 md:p-10">
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="text-[#1e1839] font-medium text-sm mb-1.5 block">
                      Naam *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="border-gray-200 focus:border-[#1e1839] rounded-xl bg-white"
                      placeholder="Jouw naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#1e1839] font-medium text-sm mb-1.5 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="border-gray-200 focus:border-[#1e1839] rounded-xl bg-white"
                      placeholder="jouw@email.nl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone" className="text-[#1e1839] font-medium text-sm mb-1.5 block">
                      Telefoonnummer
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-200 focus:border-[#1e1839] rounded-xl bg-white"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-[#1e1839] font-medium text-sm mb-1.5 block">
                      Onderwerp *
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-[#1e1839] rounded-xl bg-white">
                        <SelectValue placeholder="Kies een onderwerp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online-coaching">Online Coaching</SelectItem>
                        <SelectItem value="personal-training">Personal Training</SelectItem>
                        <SelectItem value="voeding">Voeding</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="algemeen">Algemene Vraag</SelectItem>
                        <SelectItem value="anders">Anders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#1e1839] font-medium text-sm mb-1.5 block">
                    Bericht *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="min-h-[130px] border-gray-200 focus:border-[#1e1839] rounded-xl bg-white"
                    placeholder="Vertel ons over jouw doelen en hoe we je kunnen helpen..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1e1839] hover:bg-[#1e1839]/90 text-white py-6 text-base font-semibold rounded-xl"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
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
      </section>

      {/* INFO - Paars */}
      <section className="py-16 lg:py-24 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Locatie */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Locatie</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-white/50 min-w-[120px]">Personal Training</span>
                  <span className="text-white/80">Op locatie in Friesland</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/50 min-w-[120px]">Online Coaching</span>
                  <span className="text-white/80">Heel Nederland</span>
                </div>
              </div>
            </div>

            {/* Bereikbaarheid */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Bereikbaarheid</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-white/50 min-w-[120px]">Telefoon</span>
                  <span className="text-white/80">Ma - Vr, 9:00 - 18:00</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/50 min-w-[120px]">WhatsApp</span>
                  <span className="text-white/80">Ma - Zo, 8:00 - 22:00</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/50 min-w-[120px]">Email</span>
                  <span className="text-white/80">Binnen 24 uur reactie</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm mb-4">Wil je eerst meer weten?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent" asChild>
                <Link href="/online-coaching">Online Coaching</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent" asChild>
                <Link href="/personal-training">Personal Training</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent" asChild>
                <Link href="/resultaten">Resultaten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
