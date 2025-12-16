"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  MessageCircle,
  Smartphone,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Video,
  User,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function Bedankt6MaandenClientPage() {
  const whatsappMessage = encodeURIComponent(
    "Hoi! Ik heb zojuist het 6 maanden Online Coaching traject aangeschaft! Ik ben klaar om te beginnen met mijn transformatie! 💪",
  )
  const whatsappLink = `https://wa.me/31610935077?text=${whatsappMessage}`

  const nextSteps = [
    {
      step: "1",
      title: "Stuur ons een WhatsApp",
      description: "Laat ons weten dat je hebt aangemeld zodat we direct kunnen starten met jouw onboarding.",
      icon: <MessageCircle className="w-6 h-6" />,
      highlight: true,
    },
    {
      step: "2",
      title: "Download de Evotion App",
      description: "Je ontvangt binnen 24 uur toegang tot de Evotion Coaching App met al je trainingen en voeding.",
      icon: <Smartphone className="w-6 h-6" />,
      highlight: false,
    },
    {
      step: "3",
      title: "Plan je Intake",
      description: "We plannen samen een uitgebreide intake om je doelen en situatie in kaart te brengen.",
      icon: <Calendar className="w-6 h-6" />,
      highlight: false,
    },
    {
      step: "4",
      title: "Start je Transformatie",
      description: "Je persoonlijke coach stelt je programma samen en je kunt direct aan de slag!",
      icon: <ArrowRight className="w-6 h-6" />,
      highlight: false,
    },
  ]

  const includedFeatures = [
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Evotion Coaching App",
      description: "Gepersonaliseerde trainingsschema's en voedingsplannen",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "E-Learning Portal",
      description: "Toegang tot 12weken.evotion-coaching.nl",
    },
    {
      icon: <Video className="w-5 h-5" />,
      title: "Support Portal",
      description: "Video-antwoorden op al je vragen",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Wekelijkse Check-ins",
      description: "Persoonlijke begeleiding door je coach",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#bad4e1]/10">
      <Header />

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="relative mb-12 md:mb-16">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#bad4e1]/30 rounded-full blur-3xl"></div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>

            {/* Badge */}
            

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#1e1839] via-[#2d1b69] to-[#1e1839] bg-clip-text text-transparent">
                Gefeliciteerd met je beslissing!
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
              Je hebt zojuist het{" "}
              <span className="font-semibold text-[#1e1839]">6 Maanden Online Coaching Traject</span> aangeschaft.
            </p>
            <p className="text-base md:text-lg text-gray-500">
              Dit is de eerste stap naar jouw transformatie. We zijn ontzettend trots op je!
            </p>
          </div>
        </div>

        {/* WhatsApp CTA - Prominent */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 p-6 md:p-8 text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 md:p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stuur ons direct een bericht!</h2>
              <p className="text-white/90 mb-6 text-base md:text-lg">
                Laat ons weten dat je hebt aangemeld zodat we direct kunnen starten met jouw onboarding.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-lg"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Open WhatsApp
                </a>
              </Button>
              <p className="text-white/70 text-sm mt-4">Het bericht is al voor je ingevuld!</p>
            </div>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-3">Wat zijn de volgende stappen?</h2>
            <p className="text-gray-600">Zo gaat jouw onboarding eruitzien</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {nextSteps.map((item, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  item.highlight ? "ring-2 ring-green-500" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.highlight
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                          : "bg-gradient-to-br from-[#1e1839] to-[#2d1b69] text-white"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.highlight ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          Stap {item.step}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1e1839] mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Included Reminder */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-2">Dit zit allemaal in jouw traject</h2>
                <p className="text-gray-600 text-sm">Een overzicht van wat je krijgt de komende 6 maanden</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#1e1839] to-[#2d1b69] rounded-lg flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e1839] text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#1e1839]/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-[#1e1839]">5-Fasen Programma</span>
                </div>
                <p className="text-sm text-gray-600 pl-7">
                  Onboarding → Herstel → Voorbereiding → Doelfase → Optimalisatie
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Options */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1e1839] mb-2">Nog vragen?</h3>
            <p className="text-gray-600 text-sm">We staan voor je klaar!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full py-5 border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839] hover:text-white bg-transparent"
            >
              <a href="mailto:info@evotion-coaching.nl">
                <Mail className="w-4 h-4 mr-2" />
                info@evotion-coaching.nl
              </a>
            </Button>
            <Button
              asChild
              className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp: 06 10 93 50 77
              </a>
            </Button>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-[#1e1839] hover:underline text-sm font-medium">
              ← Terug naar de homepage
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
